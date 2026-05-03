<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray($request): array
    {
        $items = $this->items->map(fn($item) => [
            'id'=> $item->id,
            'quantity'=> $item->quantity,
            'subtotal'=> $item->product->price * $item->quantity,
            'product'=> [
                'id'=> $item->product->id,
                'name'=> $item->product->name,
                'price'=> $item->product->price,
                'stock'=> $item->product->stock,
                'image_url'=> $item->product->image_path ? asset('storage/' . $item->product->image_path) : null,
            ],
        ]);

        return [
            'items' => $items,
            'total' => $items->sum('subtotal'),
            'count' => $items->sum('quantity'),
        ];
    }
}