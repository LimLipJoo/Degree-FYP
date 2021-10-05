<?php namespace App\Models;

use CodeIgniter\Model;

class AdminModel extends Model{
    protected $table="users";
    protected $primaryKey="user_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'username',
        'password',
        'name'
    ];
    protected $useTimeStamps=true;
    protected $createField="created_at";
    protected $updatedField="updated_at";
}