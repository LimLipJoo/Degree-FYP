<?php namespace App\Models;

use CodeIgniter\Model;

class ProductsModel extends Model{
    protected $table="products";
    protected $primaryKey="product_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'product_name',
        'product_price',
        'product_quantity',
        'product_status',
        'product_category',
        'product_image'
    ];
}