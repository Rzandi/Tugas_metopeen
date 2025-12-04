<?php

namespace App\Http\Controllers;

use App\Models\PriceList;
use Illuminate\Http\Request;

class PriceListController extends Controller
{
    public function index()
    {
        $items = PriceList::all();

        // Optimized: Aggregate at database level instead of loading all transactions
        $sales = \App\Models\Transaction::selectRaw('product, SUM(quantity) as total_qty')
            ->where('type', 'penjualan')
            ->groupBy('product')
            ->pluck('total_qty', 'product');

        $purchases = \App\Models\Transaction::selectRaw('product, SUM(quantity) as total_qty')
            ->where('type', 'pengeluaran')
            ->groupBy('product')
            ->pluck('total_qty', 'product');

        $items->transform(function ($item) use ($sales, $purchases) {
            $item->qty_sales = $sales[$item->product_name] ?? 0;
            $item->qty_purchases = $purchases[$item->product_name] ?? 0;
            return $item;
        });

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'product_name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
        ]);

        $item = PriceList::findOrFail($id);
        $item->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Item berhasil diperbarui',
            'data' => $item
        ]);
    }

    public function sale(Request $request, $id)
    {
        $item = PriceList::findOrFail($id);
        $quantity = $request->input('quantity', 1);

        if ($item->stock < $quantity) {
            return response()->json(['message' => 'Insufficient stock'], 400);
        }

        $item->decrement('stock', $quantity);

        // Create transaction (penjualan/profit)
        $total = $quantity * $item->price;
        $transactionId = 'T' . time() . rand(1000, 9999);
        while (\App\Models\Transaction::where('id', $transactionId)->exists()) {
            $transactionId = 'T' . time() . rand(1000, 9999);
        }

        \App\Models\Transaction::create([
            'id' => $transactionId,
            'type' => 'penjualan',
            'date' => now()->toDateString(),
            'product' => $item->product_name,
            'quantity' => $quantity,
            'price' => $item->price,
            'total' => $total,
            'note' => 'Auto dari daftar barang',
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Penjualan berhasil disimpan',
            'data' => $item->refresh()
        ]);
    }

    public function restock(Request $request, $id)
    {
        $item = PriceList::findOrFail($id);
        $quantity = $request->input('quantity', 1);

        $item->increment('stock', $quantity);

        // Create transaction (pengeluaran/cost)
        $total = $quantity * $item->price;
        $transactionId = 'T' . time() . rand(1000, 9999);
        while (\App\Models\Transaction::where('id', $transactionId)->exists()) {
            $transactionId = 'T' . time() . rand(1000, 9999);
        }

        \App\Models\Transaction::create([
            'id' => $transactionId,
            'type' => 'pengeluaran',
            'date' => now()->toDateString(),
            'product' => $item->product_name,
            'quantity' => $quantity,
            'price' => $item->price,
            'total' => $total,
            'note' => 'Auto restock dari daftar barang',
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Restock berhasil disimpan',
            'data' => $item->refresh()
        ]);
    }
}
