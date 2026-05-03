<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // GET /api/products
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(12);

        return ProductResource::collection($products);
    }

    // GET /api/products/{product}
    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }

    // POST /api/admin/products
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'=> 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'image'=> 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        unset($data['image']);

        $product = Product::create($data);

        return new ProductResource($product->load('category'));
    }

    // POST /api/admin/products/{product}  ← POST not PUT (file upload)
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'=> 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price'=> 'sometimes|numeric|min:0',
            'stock'=> 'sometimes|integer|min:0',
            'category_id' => 'sometimes|exists:categories,id',
            'image'=> 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        unset($data['image']);

        $product->update($data);

        return new ProductResource($product->fresh()->load('category'));
    }

    // DELETE /api/admin/products/{product}
    public function destroy(Product $product)
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete(); // SoftDelete — order history intact

        return response()->json(['message' => 'Product deleted successfully']);
    }
}