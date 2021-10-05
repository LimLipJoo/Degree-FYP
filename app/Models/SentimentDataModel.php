<?php namespace App\Models;

use CodeIgniter\Model;

class SentimentDataModel extends Model{
    protected $table="sentiment_data";
    protected $primaryKey="sentiment_id";
    protected $useAutoIncrement=true;

    protected $useSoftDeletes=false;
    protected $returnType="array";

    protected $allowedFields=[
        'num_positive',
        'num_negative',
        'avg_compound',
        'total_tweets',
        'since_id',
        'search_term_id',
        'sentiment_date'
    ];
}