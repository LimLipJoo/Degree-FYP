<?php namespace App\Models;

use CodeIgniter\Model;

class ProductColoursModel extends Model{
    protected $table="product_colours";
    protected $primaryKey="product_colour_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'product_id',
        'colour_id'
    ];
}