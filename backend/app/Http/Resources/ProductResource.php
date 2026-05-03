<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name'=> $this->name,
            'description' => $this->description,
            'price'=> $this->price,
            'stock'=> $this->stock,
            'in_stock' => $this->stock > 0,
            'image_url'=> $this->image_path ? asset('storage/' . $this->image_path) : null,
            'category'=> [
                'id'=> $this->category?->id,
                'name'=> $this->category?->name,
            ],
            'created_at' => $this->created_at->toDateString(),
        ];
    }
}