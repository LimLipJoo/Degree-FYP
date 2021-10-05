<?php namespace App\Models;

use CodeIgniter\Model;

class WishListModel extends Model{
    protected $table="wishlist";
    protected $primaryKey="wishlist_item_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'customer_id',
        'product_id'
    ];

}