<?php namespace App\Models;

use CodeIgniter\Model;

class OrderItemsModel extends Model{
    protected $table="order_items";
    protected $primaryKey="order_item_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'order_id',
        'product_id',
        'product_name',
        'product_price',
        'colour_name',
        'colour_id',
        'specification',
        'quantity'
    ];
}