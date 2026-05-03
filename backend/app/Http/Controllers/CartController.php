<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getCart(Request $request): Cart
    {
        return Cart::firstOrCreate([
            'session_id' => $request->session()->getId(),
        ]);
    }

    // GET /api/cart
    public function viewCart(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->load('items.product');

        return new CartResource($cart);
    }

    // POST /api/cart/add
    public function addToCart(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $product= Product::findOrFail($data['product_id']);
        $cart= $this->getCart($request);
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        $newQuantity = ($cartItem?->quantity ?? 0) + $data['quantity'];

        if ($product->stock < $newQuantity) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }

        if ($cartItem) {
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity'=> $data['quantity'],
            ]);
        }

        return response()->json(['message' => 'Added to cart']);
    }

    // PATCH /api/cart/{productId}
    public function updateQuantity(Request $request, $productId)
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $cart = $this->getCart($request);
        $cartItem = $cart->items()->where('product_id', $productId)->firstOrFail();
        $product= Product::findOrFail($productId);

        if ($product->stock->$data['quantity']) {
            return response()->json(['message' => 'Insufficient stock'], 422);
        }

        $cartItem->update(['quantity' => $data['quantity']]);

        return response()->json(['message' => 'Quantity updated']);
    }

    // DELETE /api/cart/{productId}
    public function removeFromCart(Request $request, $productId)
    {
        $cart = $this->getCart($request);
        $cartItem = $cart->items()->where('product_id', $productId)->firstOrFail();

        $cartItem->delete();

        return response()->json(['message' => 'Item removed']);
    }
}