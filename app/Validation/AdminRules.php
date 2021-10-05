<?php namespace App\validation;

use App\Models\AdminModel;
use Exception;

class AdminRules{
    public function validateAdminPanel(String $str,String $fields,array $data):bool{
        try{
            $admin=new AdminModel();
            $query=$admin->where('username',$data['username'])->first();
            return password_verify($data['password'],$query['password']);
        }
        catch(\Exception $e){
            return false;
        }
    }
}



