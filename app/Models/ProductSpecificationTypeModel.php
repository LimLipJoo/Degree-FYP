<?php namespace App\Models;

use CodeIgniter\Model;

class ProductSpecificationTypeModel extends Model{
    protected $table="product_specification_type";
    protected $primaryKey="product_specification_type_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'product_specification_type'
    ];
}