<?php namespace App\Models;

use CodeIgniter\Model;

class FrequentWordsModel extends Model{
    protected $table="frequent_words";
    protected $primaryKey="frequent_words_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'frequent_words',
        'product_id'
    ];
}