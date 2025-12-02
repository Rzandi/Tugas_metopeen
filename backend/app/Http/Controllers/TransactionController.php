<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::with('user')
            ->when($request->from && $request->to, function ($query) use ($request) {
                return $query->whereBetween('date', [$request->from, $request->to]);
            })
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:penjualan,pengeluaran',
            'date' => 'required|date',
            'product' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:500'
        ]);

        // Check stock availability for sales
        if ($request->type === 'penjualan') {
            $item = \App\Models\PriceList::where('product_name', $request->product)->first();
            if ($item && $item->stock < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $item->stock
                ], 400);
            }
        }

        // Generate unique transaction ID
        $transactionId = 'T' . time() . rand(1000, 9999);
        while (Transaction::where('id', $transactionId)->exists()) {
            $transactionId = 'T' . time() . rand(1000, 9999);
        }

        $transaction = Transaction::create([
            'id' => $transactionId,
            'type' => $request->type,
            'date' => $request->date,
            'product' => $request->product,
            'quantity' => $request->quantity,
            'price' => $request->price,
            'total' => $request->quantity * $request->price,
            'note' => $request->note,
            'user_id' => $request->user()->id
        ]);

        // Sync stock
        $item = \App\Models\PriceList::where('product_name', $request->product)->first();
        if ($item) {
            if ($request->type === 'penjualan') {
                $item->decrement('stock', $request->quantity);
            } else {
                $item->increment('stock', $request->quantity);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil disimpan',
            'data' => $transaction
        ], 201);
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);

        // Revert stock
        $item = \App\Models\PriceList::where('product_name', $transaction->product)->first();
        if ($item) {
            if ($transaction->type === 'penjualan') {
                $item->increment('stock', $transaction->quantity);
            } else {
                $item->decrement('stock', $transaction->quantity);
            }
        }

        $transaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus'
        ]);
    }

    public function update(Request $request, $id)
    {
        $transaction = Transaction::findOrFail($id);
        $oldQty = $transaction->quantity;

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check stock availability for sales if increasing quantity
        $diff = $request->quantity - $oldQty;
        if ($transaction->type === 'penjualan' && $diff > 0) {
            $item = \App\Models\PriceList::where('product_name', $transaction->product)->first();
            if ($item && $item->stock < $diff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stok tidak mencukupi untuk update. Stok tersedia: ' . $item->stock
                ], 400);
            }
        }

        $transaction->quantity = $request->quantity;
        $transaction->total = $transaction->quantity * $transaction->price;
        $transaction->save();

        // Sync stock difference
        if ($diff != 0) {
            $item = \App\Models\PriceList::where('product_name', $transaction->product)->first();
            if ($item) {
                if ($transaction->type === 'penjualan') {
                    $item->decrement('stock', $diff);
                } else {
                    $item->increment('stock', $diff);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui',
            'data' => $transaction
        ]);
    }
}