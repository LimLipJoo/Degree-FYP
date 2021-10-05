<?php namespace App\validation;

use App\Models\CustomerModel;
use Exception;

class CustomerRules{
    public function validateLogin(String $str,String $fields,array $data):bool{
        try{
            $customer=new CustomerModel();
            $query=$customer->where('email',$data['email'])->first();
            return password_verify($data['password'],$query['password']);
        }
        catch(\Exception $e){
            return false;
        }
    }
}