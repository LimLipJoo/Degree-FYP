<?php namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\AdminModel;
use App\Models\ProductsModel;
use App\Models\ProductSpecificationModel;
use App\Models\ProductSpecificationTypeModel;
use App\Models\ProductCategoryModel;
use App\Models\ColoursModel;
use App\Models\ProductColoursModel;
use App\Models\SentimentDataModel;
use App\Models\FrequentWordsModel;
use App\Models\BannersModel;
use App\Models\OrdersModel;
use App\Models\OrderItemsModel;
use App\Models\CustomerModel;
use CodeIgniter\Validation\Exceptions\ValidationException;
use Config\Services;

class AdminController extends Controller{
    protected $admin;
    protected $request;

    public function __construct(){
        $this->admin=new AdminModel();
        $this->products=new ProductsModel();
        $this->specs=new ProductSpecificationModel();
        $this->specType=new ProductSpecificationTypeModel();
        $this->productCategory=new ProductCategoryModel();
        $this->colours=new ColoursModel();
        $this->productColours=new ProductColoursModel();
        $this->sentiment=new SentimentDataModel();
        $this->frequentWords=new FrequentWordsModel();
        $this->banners=new BannersModel();
        $this->orders=new OrdersModel();
        $this->orderItem=new OrderItemsModel();
        $this->customers=new CustomerModel();
        $this->request=\Config\Services::request();
    }

    public function index(){
        return view('admin');
    }
    public function login(){
        $json=$this->request->getJSON();
        $input['username']=$json->username;
        $input['password']=$json->password;
        $form_validation=\Config\Services::validation();
        $messages=[
            'password'=>[
                'validateAdminPanel'=>"Incorrect username or password"
            ]
        ];
        $form_validation->setRules([
            
            'username' =>'required',
            'password' => 'required|validateAdminPanel[username,password]'  
            
            
        ],$messages);
        if($form_validation->run($input)){
                $session=session();
                $user_data=$this->admin->where('username',$input['username'])->first();
                
                $session_data=array('user_id'=>$user_data['user_id'],'username'=>$user_data['username'],'name'=>$user_data['name'],'logged_in'=>"true");
                $session->set($session_data);
                $response['success']=true;
                $response['message']="Login successful";
                return json_encode($response);
            
        }
        else{
            $response['success']=false;
            $response['message']=$form_validation->getErrors();
            return json_encode($response);
        }
    }

    public function createAdmin(){
        $json=$this->request->getJSON();
        $input['username']=$json->username;
        $input['password']=password_hash($json->password,PASSWORD_DEFAULT);
        $input['name']=$json->name;

        $this->admin->insert($input);
    }

    public function isLogin(){
        $session=session();
        if($session->get("logged_in")){
            $response['isLogged']=true;
            return json_encode($response);
        }
        else{
            $response['isLogged']=false;
            return json_encode($response);
        }
    }
    public function logout(){
        $session=session();
        $session->destroy();
        return "ok logged out";
    }
    public function getUser(){
        $session=session();
        $response['user_id']=$session->get("user_id");
        $data=$this->admin->find($response['user_id']);
        if($data){
            $response['success']=true;
            $response['name']=$data['name'];
        }
        else{
            $response['success']=false;
        }
        
        return json_encode($response);
    }
    public function addProduct(){
        
        $input['product_name']=$this->request->getPost("name");
        $input['product_price']=$this->request->getPost("price");
        $input['product_quantity']=$this->request->getPost("quantity");
        $input['product_status']=$this->request->getPost("status");
        $input['product_category']=$this->request->getPost("category");

        

        $target_dir="../public/Image/Products/";
        $file=$this->request->getFile('image');
        $name=$file->getRandomName();
        $input['product_image']="../public/Image/Products/".$name;
        
        
            $file->move($target_dir,$name);
            $this->products->insert($input);
            $product=$this->products->where($input)->first();

            if($this->request->getPost("specification")!=NULL){
                $variant['product_specification']=json_decode($this->request->getPost("specification"),true);
            
                $variant['product_id']=$product['product_id'];
                for($r=0;$r<sizeof($variant['product_specification']);$r++){
                    $input2[$r]['specification_name']=$variant['product_specification'][$r]['specificationName'];
                    $input2[$r]['specification_price']=$variant['product_specification'][$r]['specificationPrice'];
                    $input2[$r]['specification_type']=$variant['product_specification'][$r]['specificationType'];
                    $input2[$r]['product_id']=$variant['product_id'];
                }
                if(isset($input2)){
                    for($i=0;$i<sizeof($input2);$i++){
                        $this->specs->insert($input2[$i]);
                    } 
                }
                     
            }
            $colours=json_decode($this->request->getPost("colours"),true);
            for($z=0;$z<sizeof($colours);$z++){
                $input3[$z]['product_id']=$product['product_id'];
                $input3[$z]['colour_id']=$colours[$z]['colour_id'];
                $this->productColours->insert($input3[$z]);
            }
            
            
            $response['success']=true;
            $response['message']="Product has been added successfully";
            return json_encode($response);
            
    }
    public function addSpecType(){
        $input['product_specification_type']=$this->request->getPost("type");
        $this->specType->insert($input);
        $response['success']=true;
        $response['message']="Sucessfully added product specification";
        return json_encode($response);
    }
    public function getSpecType(){
        try{
            $data=$this->specType->findAll();
            $response['specType']=$data;
            $response['success']=true;
            $response['message']="Loaded Specification Type successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function removeSpecType($id){
        try{
            $results=$this->specType->delete($id);
            $this->specs->where("specification_type",$id)->delete();
            $response["results"]=$results;
            $response['success']=true;
            $response['message']="Successfully deleted specification type!";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function addProductCategory(){
        $input['category_name']=$this->request->getPost("category");
        $this->productCategory->insert($input);
        $response['success']=true;
        $response['message']="Sucessfully added product category";
        return json_encode($response);
    }
    public function getProductCategory(){
        try{
            $data=$this->productCategory->findAll();
            $response['categories']=$data;
            $response['success']=true;
            $response['message']="Loaded Categories successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function removeProductCategory($id){
        try{
            $results=$this->productCategory->delete($id);
            $products=$this->products->where("product_category",$id)->findAll();
            for($i=0;$i<sizeof($products);$i++){
                $this->removeProduct($products[$i]['product_id']);
            }
            $response["results"]=$results;
            $response['success']=true;
            $response['message']="Successfully deleted category!";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProducts(){
        try{
            $data=$this->products->findAll();
            $response['products']=$data;
            $response['success']=true;
            $response['message']="Loaded Products successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function removeProduct($id){
        try{
            $product=$this->products->where("product_id",$id)->first();
            unlink($product['product_image']);
            $results=$this->products->delete($id);
            $this->specs->where("product_id",$id)->delete();
            $this->productColours->where("product_id",$id)->delete();
            $this->sentiment->where("search_term_id",$id)->delete();
            $this->frequentWords->where('product_id',$id)->delete();
            $response["results"]=$results;
            $response['success']=true;
            $response['message']="Successfully deleted product!";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductSpec($id){
        try{
            $response['specs']=$this->specs->where("product_id",$id)->findAll();
            $response['success']=true;
            $response['message']="Loaded product specifications successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function editProduct(){
        $id=$this->request->getPost("id");
        $input['product_name']=$this->request->getPost("name");
        $input["product_price"]=$this->request->getPost("price");
        $input["product_quantity"]=$this->request->getPost("quantity");
        $input["product_status"]=$this->request->getPost("status");
        $input["product_category"]=$this->request->getPost("category");
        
        if($file=$this->request->getFile('image')){
            $product=$this->products->where("product_id",$id)->first();
            unlink($product['product_image']);
            $target_dir="../public/Image/Products/";
            $name=$file->getRandomName();
            $input['product_image']="../public/Image/Products/".$name;
            $file->move($target_dir,$name);
        }
        
        $this->products->update($id,$input);
        
        if($this->request->getPost("specification")!=NULL){
            $specification=json_decode($this->request->getPost("specification"),true);
            $this->specs->where('product_id',$id)->delete();
            for($i=0;$i<sizeof($specification);$i++){
                
                $specification[$i]["product_id"]=$id;
                $this->specs->insert($specification[$i]);
                
            }
        }
        else{
            $this->specs->where('product_id',$id)->delete();
        }

        $colours=json_decode($this->request->getPost("colours"),true);
        $this->productColours->where("product_id",$id)->delete();
        for($i=0;$i<sizeof($colours);$i++){
            $colours[$i]['product_id']=$id;
            $this->productColours->insert($colours[$i]);
        }

        $response['success']=true;
        $response['message']="Product has been edited successfully";
        return json_encode($response);

    }
    public function editSpecificationType(){
        $id=$this->request->getPost("id");
        $input['product_specification_type']=$this->request->getPost("spec_type");
        $this->specType->update($id,$input);
        $response['success']=true;
        $response['message']="Specification Type has been edited successfully";
        return json_encode($response);
    }
    public function editCategory(){
        $id=$this->request->getPost("id");
        $input['category_name']=$this->request->getPost("category_name");
        $this->productCategory->update($id,$input);
        $response['success']=true;
        $response['message']="Category has been edited successfully";
        return json_encode($response);
    }
    public function addNewColour(){
        $input["colour_name"]=$this->request->getPost("colour_name");
        $input["colour_code"]=$this->request->getPost("colour_code");
        $this->colours->insert($input);
        $response['success']=true;
        $response['message']="Colour has been added successfully";
        return json_encode($response);
    }
    public function getColours(){
        try{
            $data=$this->colours->findAll();
            $response['colours']=$data;
            $response['success']=true;
            $response['message']="Successfully loaded product colours";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function removeColour($id){
        try{
            $results=$this->colours->delete($id);
            $this->productColours->where("colour_id",$id)->delete();
            $response['results']=$results;
            $response['success']=true;
            $response['message']="Successfully removed colour";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function editColour(){
        $id=$this->request->getPost("id");
        $input['colour_name']=$this->request->getPost("colour_name");
        $input['colour_code']=$this->request->getPost("colour_code");
        $this->colours->update($id,$input);
        $response['success']=true;
        $response['message']="Successfully edited colour";
        return json_encode($response);
    }
    public function getProductColours($id){
        try{
            $response['productColours']=$this->productColours->where("product_id",$id)->findAll();
            $response['success']=true;
            $response['message']="Successfully loaded product colours";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function filterProducts(){
        try{
            if($this->request->getPost("name")!=NULL){
               //$input['product_name']=$this->request->getPost("name");
               $this->products->like("product_name",$this->request->getPost("name")); 
            }
            if($this->request->getPost("minPrice")!=NULL)
                $input['product_price >=']=$this->request->getPost("minPrice");
            if($this->request->getPost("maxPrice")!=NULL)
                $input['product_price <=']=$this->request->getPost("maxPrice");
            if($this->request->getPost("category")!=NULL)
                $input['product_category']=$this->request->getPost("category");
            if($this->request->getPost("status")!=NULL)
                $input['product_status']=$this->request->getPost("status");
            if(isset($input)){
                    $response['filter']=$this->products->where($input)->findAll();
            }
            else
                $response['filter']=$this->products->findAll();
            $response['success']=true;
            $response['message']="Filter successful";
            return json_encode($response);

        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getSentimentStorePython(){
        try{
            $id=$this->sentiment->where("search_term_id",0)->selectMax('sentiment_id')->findAll();
            $tempDate=$this->sentiment->where("search_term_id",0)->selectMax('sentiment_date')->findAll();
            if(strtotime($tempDate[0]['sentiment_date'])!=strtotime(date("Y-m-d"))){
                $response['data']=$this->sentiment->where('sentiment_id',$id[0]['sentiment_id'])->findAll();
                
                if($response['data']!=NULL){
                    $cmd=escapeshellcmd('D:/xampp/htdocs/NLP_Store/Python/venv/Scripts/python.exe D:/xampp/htdocs/NLP_Store/Python/main.py "apple" '.$response['data'][0]['since_id'].' 0');
                    $output=shell_exec($cmd);
                }
                else{
                    $cmd=escapeshellcmd('D:/xampp/htdocs/NLP_Store/Python/venv/Scripts/python.exe D:/xampp/htdocs/NLP_Store/Python/main.py "apple" 0 0');
                    $output=shell_exec($cmd);
                }
                return json_encode($output);
            }
            $message="Already up to date";
            return json_encode($message);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getSentimentProductPython($product_id){
        try{
            $id=$this->sentiment->where("search_term_id",$product_id)->selectMax('sentiment_id')->findAll();
            $tempDate=$this->sentiment->where("search_term_id",$product_id)->selectMax('sentiment_date')->findAll();
            if(strtotime($tempDate[0]['sentiment_date'])!=strtotime(date("Y-m-d"))){
                $response['data']=$this->sentiment->where('sentiment_id',$id[0]['sentiment_id'])->findAll();
                $product=$this->products->where('product_id',$product_id)->findAll();
                if($response['data']!=NULL){
                    $cmd=escapeshellcmd('D:/xampp/htdocs/NLP_Store/Python/venv/Scripts/python.exe D:/xampp/htdocs/NLP_Store/Python/main.py "'.$product[0]["product_name"].'" '.$response['data'][0]['since_id'].' '.$product_id);
                    $output=shell_exec($cmd);
                }
                else{
                    $cmd=escapeshellcmd('D:/xampp/htdocs/NLP_Store/Python/venv/Scripts/python.exe D:/xampp/htdocs/NLP_Store/Python/main.py "'.$product[0]['product_name'].'" 0 '.$product_id);  
                    $output=shell_exec($cmd);
                }
                return json_encode($output);
            }
            $message="Already up to date";
            return json_encode($message);

        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductDetails($id){
        try{
            $response['product']=$this->products->where('product_id',$id)->first();
            $response['success']=true;
            $response['message']="Loaded product details successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductSpecByType($id){
        try{
            $response['specs']=$this->specs->orderBy('specification_type')->where('product_id',$id)->findAll();
            $response['specCount']=$this->specs->groupBy('specification_type')->where('product_id',$id)->select(['COUNT(specification_id) AS count','specification_type'])->findAll();
            $response['success']=true;
            $response['message']="Loaded product specs successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getSentimentData($id){
        try{
            $response['sentiment']=$this->sentiment->where('search_term_id',$id)->selectSum('num_positive')->selectSum('num_negative')->selectAvg('avg_compound')->first();
            $response['success']=true;
            $response['message']="Loaded sentiment data successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getFrequentWords($id){
        try{
            $latest_date=$this->frequentWords->where('product_id',$id)->selectMax('date_added')->first();
            $response['words']=$this->frequentWords->where('product_id',$id)->where('date_added',$latest_date['date_added'])->first();
            return json_encode($response['words']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getRecentSentimentData($id){
        try{
            $response['sentiment']=$this->sentiment->where('search_term_id',$id)->where("sentiment_date>=DATE(NOW()) - INTERVAL 7 DAY")->findAll();
            return json_encode($response['sentiment']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getRecentProductSales($id){
        try{
            $response['sales']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('orders.order_date>=DATE(NOW()) - INTERVAL 7 DAY')->where('order_items.product_id',$id)->select('order_items.quantity')->select('orders.order_date')->findAll();
            return json_encode($response['sales']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getMonthlyProductSales($id){
        try{
            $response['sales']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('MONTH(orders.order_date)=MONTH(now()) and YEAR(orders.order_date)=YEAR(now())')->where('order_items.product_id',$id)->select('order_items.quantity')->select('orders.order_date')->findAll();
            return json_encode($response['sales']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getMonthlySentimentData($id){
        try{
            $response['sentiment']=$this->sentiment->where('search_term_id',$id)->where("MONTH(sentiment_date)=MONTH(now()) and YEAR(sentiment_date)=YEAR(now())")->findAll();
            return json_encode($response['sentiment']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function addBanner(){
        try{
            $input['banner_title']=$this->request->getPost("title");
            $input['banner_description']=$this->request->getPost("description");
            $input['banner_link']=$this->request->getPost("link");
            $input['status']=$this->request->getPost("status");

            $target_dir="../public/Image/Banners/";
            $file=$this->request->getFile('image');
            $name=$file->getRandomName();
            $input['banner_image']="../public/Image/Banners/".$name;
        
        
            $file->move($target_dir,$name);

            $this->banners->insert($input);
            $response['success']=true;
            $response['message']="Successfully added banner";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getBanners(){
        try{
            $response['banners']=$this->banners->findAll();
            $response['success']=true;
            $response['message']="Successfully loaded banners";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function removeBanner($id){
        try{
            $banner=$this->banners->where('banner_id',$id)->first();
            unlink($banner['banner_image']);
            $response['results']=$this->banners->delete($id);
            $response['success']=true;
            $response['message']="Sucessfully deleted banner";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function editBanner(){
        try{
            $id=$this->request->getPost("id");
            $input['banner_title']=$this->request->getPost("title");
            $input['banner_description']=$this->request->getPost("description");
            $input['banner_link']=$this->request->getPost("link");
            $input['status']=$this->request->getPost("status");

            if($file=$this->request->getFile('image')){
                $banner=$this->banners->where("banner_id",$id)->first();
                unlink($banner['banner_image']);
                $target_dir="../public/Image/Banners/";
                $name=$file->getRandomName();
                $input['banner_image']="../public/Image/Banners/".$name;
                $file->move($target_dir,$name);
            }
            $this->banners->update($id,$input);
            $response['success']=true;
            $response['message']="Successfully edited banner";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getAllProductSentimentPython(){
        try{
            $products=$this->products->findAll();
            for($i=0;$i<sizeof($products);$i++){
                $this->getSentimentProductPython($products[$i]['product_id']);
            }
            $response['success']=true;
            $response['message']="Successfully updated sentiment data";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getAllOrders(){
        try{
            $response['orders']=$this->orders->findAll();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getOrderItems($order_id){
        try{
            $response['orderItems']=$this->orderItem->where('order_id',$order_id)->findAll();
            return json_encode($response); 
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getOrder($order_id){
        try{
            $response['order']=$this->orders->where('order_id',$order_id)->first();
            return json_encode($response); 
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function updateOrderStatus(){
        try{
            $id=$this->request->getPost('id');
            $input['status']=$this->request->getPost('status');
            $this->orders->update($id,$input);
            $response['success']=true;
            $response['message']="Successfully updated order status";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getNumberOfCustomers(){
        try{
            $response['numCustomers']=$this->customers->selectCount('id','numCustomers')->first();
            return json_encode($response['numCustomers']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getMonthlySales(){
        try{
            $response['numSales']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('MONTH(orders.order_date)=MONTH(now()) and YEAR(orders.order_date)=YEAR(now())')->selectSum('order_items.quantity','numSales')->first();
            return json_encode($response['numSales']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getMonthlyRevenue(){
        try{
            $response['revenue']=$this->orders->where('MONTH(order_date)=MONTH(now()) and YEAR(order_date)=YEAR(now())')->selectSum('total_price','revenue')->first();
            return json_encode($response['revenue']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getTotalTweets(){
        try{
            $response['numTweets']=$this->sentiment->where('MONTH(sentiment_date)=MONTH(now()) and YEAR(sentiment_date)=YEAR(now())')->where('search_term_id',0)->selectSum('total_tweets','numTweets')->first();
            return json_encode($response['numTweets']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getWeeklyBrandSentiment(){
        try{
            $response['sentiment']=$this->sentiment->where('search_term_id',0)->where("sentiment_date>=DATE(NOW()) - INTERVAL 7 DAY")->findAll();
            return json_encode($response['sentiment']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getMonthlyBrandSentiment(){
        try{
            $response['sentiment']=$this->sentiment->where('search_term_id',0)->where("MONTH(sentiment_date)=MONTH(now()) and YEAR(sentiment_date)=YEAR(now())")->findAll();
            return json_encode($response['sentiment']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getWeeklyTotalSales(){
        try{
            $response['sales']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('orders.order_date>=DATE(NOW()) - INTERVAL 7 DAY')->groupBy('order_items.order_id')->selectSum('order_items.quantity')->select('orders.order_date')->findAll();
            return json_encode($response['sales']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getMonthlyTotalSales(){
        try{
            $response['sales']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('MONTH(orders.order_date)=MONTH(now()) and YEAR(orders.order_date)=YEAR(now())')->groupBy('order_items.order_id')->selectSum('order_items.quantity')->select('orders.order_date')->findAll();
            return json_encode($response['sales']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getWeeklyTotalRevenue(){
        try{
            $response=$this->orders->where('order_date>=DATE(NOW()) - INTERVAL 7 DAY')->groupBy('order_date')->selectSum('total_price','revenue')->select('order_date')->findAll();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getMonthlyTotalRevenue(){
        try{
            $response=$this->orders->where('MONTH(order_date)=MONTH(now()) and YEAR(order_date)=YEAR(now())')->groupBy('order_date')->selectSum('total_price','revenue')->select('order_date')->findAll();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getFrequentWordsBrand(){
        try{
            $latest_date=$this->frequentWords->where('product_id',0)->selectMax('date_added')->first();
            $response['words']=$this->frequentWords->where('product_id',0)->where('date_added',$latest_date['date_added'])->first();
            return json_encode($response['words']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getSentimentDataBrand(){
        try{
            $response['sentiment']=$this->sentiment->where('search_term_id',0)->selectSum('num_positive')->selectSum('num_negative')->selectAvg('avg_compound')->first();
            $response['success']=true;
            $response['message']="Loaded sentiment data successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function salesYear(){
        try{
            $response['sales']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('YEAR(orders.order_date)=YEAR(now())')->groupBy('MONTH(orders.order_date)')->select('MONTH(orders.order_date) as month')->selectSum('order_items.quantity','numSales')->findAll();
            $response['sales2']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('YEAR(orders.order_date)=YEAR(now())-1')->groupBy('MONTH(orders.order_date)')->select('MONTH(orders.order_date) as month')->selectSum('order_items.quantity','numSales')->findAll();
            $response['sales3']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('YEAR(orders.order_date)=YEAR(now())-2')->groupBy('MONTH(orders.order_date)')->select('MONTH(orders.order_date) as month')->selectSum('order_items.quantity','numSales')->findAll();
            $response['labels']=$this->orders->select('YEAR(now()) as year1')->select('YEAR(now())-1 as year2')->select('YEAR(now())-2 as year3')->first();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function revenueYear(){
        try{
            $response['revenue']=$this->orders->where('YEAR(order_date)=YEAR(now())')->groupBy('MONTH(orders.order_date)')->select('MONTH(orders.order_date) as month')->selectSum('total_price','revenue')->findAll();
            $response['revenue2']=$this->orders->where('YEAR(order_date)=YEAR(now())-1')->groupBy('MONTH(orders.order_date)')->select('MONTH(orders.order_date) as month')->selectSum('total_price','revenue')->findAll();
            $response['revenue3']=$this->orders->where('YEAR(order_date)=YEAR(now())-2')->groupBy('MONTH(orders.order_date)')->select('MONTH(orders.order_date) as month')->selectSum('total_price','revenue')->findAll();
            $response['labels']=$this->orders->select('YEAR(now()) as year1')->select('YEAR(now())-1 as year2')->select('YEAR(now())-2 as year3')->first();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function sentimentYear(){
        try{
            $response['sentiment']=$this->sentiment->where('search_term_id',0)->where('YEAR(sentiment_date)=YEAR(now())')->groupBy('MONTH(sentiment_date)')->select('MONTH(sentiment_date) as month')->selectAvg('avg_compound','compound')->findAll();
            $response['sentiment2']=$this->sentiment->where('search_term_id',0)->where('YEAR(sentiment_date)=YEAR(now())-1')->groupBy('MONTH(sentiment_date)')->select('MONTH(sentiment_date) as month')->selectAvg('avg_compound','compound')->findAll();
            $response['sentiment3']=$this->sentiment->where('search_term_id',0)->where('YEAR(sentiment_date)=YEAR(now())-2')->groupBy('MONTH(sentiment_date)')->select('MONTH(sentiment_date) as month')->selectAvg('avg_compound','compound')->findAll();
            $response['labels']=$this->orders->select('YEAR(now()) as year1')->select('YEAR(now())-1 as year2')->select('YEAR(now())-2 as year3')->first();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function customSales(){
        try{
            $input['start']=$this->request->getPost('start');
            $input['end']=$this->request->getPost('end');
            $response['sales']=$this->orders->join('order_items','orders.order_id=order_items.order_id')->where('orders.order_date>=',$input['start'])->where('orders.order_date<=',$input['end'])->groupBy('order_items.order_id')->selectSum('order_items.quantity')->select('orders.order_date')->findAll();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function customRevenue(){
        try{
            $input['start']=$this->request->getPost('start');
            $input['end']=$this->request->getPost('end');
            $response['revenue']=$this->orders->where('order_date>=',$input['start'])->where('order_date<=',$input['end'])->groupBy('order_date')->selectSum('total_price','revenue')->select('order_date')->findAll();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function customSentiment(){
        try{
            $input['start']=$this->request->getPost('start');
            $input['end']=$this->request->getPost('end');
            $response['sentiment']=$this->sentiment->where('search_term_id',0)->where("sentiment_date>=",$input['start'])->where("sentiment_date<=",$input['end'])->findAll();
            return json_encode($response['sentiment']);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getRecommendedAction(){
        try{
            $response=$this->sentiment->join('products','sentiment_data.search_term_id=products.product_id')->groupBy('sentiment_data.search_term_id')->selectAvg('sentiment_data.avg_compound','compound')->select('products.product_name')->having('compound >=',0.75)->orHaving('compound <',0.5)->find(); 
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
}