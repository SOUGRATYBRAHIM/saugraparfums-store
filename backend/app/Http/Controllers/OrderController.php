<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // POST /api/orders — guest checkout
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name'=> 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address'=> 'required|string|max:500',
            'city' => 'nullable|string|max:100',
            'notes'=> 'nullable|string|max:500',
            'payment_method' => 'required|in:cod,online',
        ]);

        $cart = Cart::with('items.product')->where('session_id', $request->session()->getId())->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty'], 422);
        }

        // Stock check before touching the DB
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for: {$item->product->name}",
                ], 422);
            }
        }

        $total = $cart->items->sum(fn($item) => $item->product->price * $item->quantity);

        $order = DB::transaction(function () use ($data, $cart, $total) {
            $order = Order::create([...$data, 'total_price' => $total]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity'=> $item->quantity,
                    'price' => $item->product->price, // price snapshot
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            $cart->items()->delete();
            $cart->delete();

            return $order;
        });

        return response()->json([
            'message' => 'Order placed successfully',
            'order'=> [
                'id'=> $order->id,
                'full_name'=> $order->full_name,
                'total_price' => $order->total_price,
                'status'=> $order->status,
            ],
        ], 201);
    }

    // GET /api/admin/orders
    public function index()
    {
        $orders = Order::with('items.product')->latest()->paginate(20);

        return OrderResource::collection($orders);
    }

    // GET /api/admin/orders/{id}
    public function show($id)
    {
        $order = Order::with('items.product')->findOrFail($id);

        return new OrderResource($order);
    }

    // PATCH /api/admin/orders/{id}/status
    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,shipped,delivered,cancelled',
        ]);

        $order = Order::with('items.product')->findOrFail($id);

        if ($data['status'] === 'cancelled' && $order->status !== 'cancelled') {
            DB::transaction(function () use ($order, $data) {
                foreach ($order->items as $item) {
                    $item->product?->increment('stock', $item->quantity);
                }
                $order->update($data);
            });
        } else {
            $order->update($data);
        }

        return new OrderResource($order->fresh()->load('items.product'));
    }
}