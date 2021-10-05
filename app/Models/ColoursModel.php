<?php namespace App\Models;

use CodeIgniter\Model;

class ColoursModel extends Model{
    protected $table="colours";
    protected $primaryKey="colour_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'colour_name',
        'colour_code'
    ];
}