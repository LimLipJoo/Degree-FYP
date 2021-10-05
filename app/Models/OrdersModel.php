<?php namespace App\Models;

use CodeIgniter\Model;

class OrdersModel extends Model{
    protected $table="orders";
    protected $primaryKey="order_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'customer_id',
        'total_price',
        'address',
        'f_name',
        'l_name',
        'status',
        'phone'
    ];
}