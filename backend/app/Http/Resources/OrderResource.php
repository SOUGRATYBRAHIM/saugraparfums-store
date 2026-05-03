<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'=> $this->id,
            'full_name'=> $this->full_name,
            'phone'=> $this->phone,
            'address'=> $this->address,
            'city'=> $this->city,
            'notes'=> $this->notes,
            'total_price'=> $this->total_price,
            'payment_method' => $this->payment_method,
            'status'=> $this->status,
            'items'=> $this->items->map(fn($item) => [
                'id'=> $item->id,
                'quantity'=> $item->quantity,
                'price' => $item->price,
                'subtotal'=> $item->price * $item->quantity,
                'product_name' => $item->product?->name ?? 'Product deleted',
                'image_url'=> $item->product?->image_path ? asset('storage/' . $item->product->image_path) : null,
            ]),
            'created_at'=> $this->created_at->toDateTimeString(),
        ];
    }
}