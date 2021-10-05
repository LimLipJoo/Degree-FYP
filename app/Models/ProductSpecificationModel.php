<?php namespace App\Models;

use CodeIgniter\Model;

class ProductSpecificationModel extends Model{
    protected $table="product_specification";
    protected $primaryKey="specification_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'product_id',
        'specification_type',
        'specification_name',
        'specification_price'
    ];
}