<?php

namespace App\Http\Controllers;

use App\Models\PriceList;
use Illuminate\Http\Request;

class PriceListController extends Controller
{
    public function index()
    {
        $items = PriceList::all();

        // Calculate sales and purchases from transactions
        $transactions = \App\Models\Transaction::all();

        $items->transform(function ($item) use ($transactions) {
            $item->qty_sales = $transactions->where('type', 'penjualan')
                ->where('product', $item->product_name)
                ->sum('quantity');

            $item->qty_purchases = $transactions->where('type', 'pengeluaran')
                ->where('product', $item->product_name)
                ->sum('quantity');

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
        return response()->json($item->refresh());
    }

    public function restock(Request $request, $id)
    {
        $item = PriceList::findOrFail($id);
        $quantity = $request->input('quantity', 1);

        $item->increment('stock', $quantity);
        return response()->json($item->refresh());
    }
}
