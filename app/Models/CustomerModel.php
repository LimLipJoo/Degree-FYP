<?php namespace App\Models;

use CodeIgniter\Model;

class CustomerModel extends Model{
    protected $table="customer";
    protected $primaryKey="id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'f_name',
        'l_name',
        'email',
        'phone',
        'password'
    ];
    protected $useTimeStamps=true;
    protected $createField="created_at";
    protected $updatedField="updated_at";

}