<?php namespace App\Models;

use CodeIgniter\Model;

class ProductCategoryModel extends Model{
    protected $table="product_category";
    protected $primaryKey="category_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'category_name'
    ];
}