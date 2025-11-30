<?php

namespace App\Http\Controllers;

use App\Models\PriceList;
use Illuminate\Http\Request;

class PriceListController extends Controller
{
    public function index()
    {
        return response()->json(PriceList::all());
    }

    public function update(Request $request, $id)
    {
        $item = PriceList::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
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
