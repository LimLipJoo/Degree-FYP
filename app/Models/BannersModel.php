<?php namespace App\Models;

use CodeIgniter\Model;

class BannersModel extends Model{
    protected $table="banners";
    protected $primaryKey="banner_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'banner_image',
        'banner_title',
        'banner_description',
        'status',
        'banner_link'
    ];
}