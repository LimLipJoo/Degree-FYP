<?php namespace App\Models;

use CodeIgniter\Model;

class CartModel extends Model{
    protected $table="cart";
    protected $primaryKey="cart_item_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'customer_id',
        'product_id',
        'price',
        'quantity',
        'specification',
        'colour'
    ];

}