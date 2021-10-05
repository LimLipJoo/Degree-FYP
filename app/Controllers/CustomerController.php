<?php namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\CustomerModel;
use App\Models\BannersModel;
use App\Models\ProductsModel;
use App\Models\ProductCategoryModel;
use App\Models\ProductSpecificationModel;
use App\Models\ProductSpecificationTypeModel;
use App\Models\ProductColoursModel;
use App\Models\ColoursModel;
use App\Models\WishListModel;
use App\Models\OrdersModel;
use App\Models\OrderItemsModel;
use App\Models\SentimentDataModel;
use CodeIgniter\Validation\Exceptions\ValidationException;
use App\Models\CartModel;
use Config\Services;

class CustomerController extends Controller
{
    protected $customer;
    protected $request;
    public function __construct(){
        $this->customer=new CustomerModel();
        $this->banners=new BannersModel();
        $this->products=new ProductsModel();
        $this->categories=new ProductCategoryModel();
        $this->product_specs=new ProductSpecificationModel();
        $this->specs=new ProductSpecificationTypeModel();
        $this->product_colours=new ProductColoursModel();
        $this->colours=new ColoursModel();
        $this->cart=new CartModel();
        $this->wishlist=new WishListModel();
        $this->orders=new OrdersModel();
        $this->orderItem=new OrderItemsModel();
        $this->sentiment=new SentimentDataModel();
        $this->request=\Config\Services::request();
    }
    public function index(){
        return view('customer');
    }
    public function test(){
        $data=$this->customer->findAll();
        return json_encode($data);
    }
    public function create(){
        try{
            $json=$this->request->getJSON();
            $insert['name']=$json->name;
            $insert['email']=$json->email;
            $insert['phone']=$json->phone;
            $insert['address']=$json->address;
            $res=$this->customer->insert($insert);
            $response['success']=true;
            $response['message']="Saved successfully";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function list(){
        try{
            $data=$this->customer->findAll();
            $response['data']=$data;
            $response['success']=true;
            $response['message']="Successful load";
            
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }

    public function get($id){
        try{
            $data=$this->customer->find($id);
            if($data){
                $response['data']=$data;
                $response['success']=true;
                $response['message']='Succesful Load'; 
            }
            else{
                $response['success']=false;
                $response['message']='Not Found';
            }
            
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }

    public function update($id){
        try{
            $json=$this->request->getJSON();
            $update['name']=$json->name;
            $update['email']=$json->email;
            $update['address']=$json->address;
            $update['phone']=$json->phone;
            $res=$this->customer->update($id,$update);
            $response['res']=$res;
            $response['success']=true;
            $response['message']="Successful update";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }

    public function delete($id){
        try{
            //$res=$this->customer->where("id",$id)->delete();
            $res=$this->customer->delete($id);
            $response['res']=$res;
            $response['success']=true;
            $response['message']="Successfully deleted";
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
            $response['banners']=$this->banners->where('status','Enabled')->findAll();
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
    public function getNewProducts(){
        try{
            $response['newProducts']=$this->products->orderBy('product_id','DESC')->getWhere(['product_status'=>1],5)->getResult();
            $response['success']=true;
            $response['message']="Successfully loaded new products";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductsByCategoryLimit($categoryId){
        try{
            $response=$this->products->getWhere(['product_category'=>$categoryId,'product_status'=>1],4)->getResult();
            return $response;
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductsByCategory($categoryId){
        try{
            $response['products']=$this->products->where('product_status',1)->where('product_category',$categoryId)->findAll();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductCategoryCount($categoryId){
        try{
            $response=$this->products->where('product_category',$categoryId)->selectCount('product_id')->findAll();
            return $response[0]['product_id'];
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductCategory(){
        try{
            $response['categories']=$this->categories->findAll();
            for($i=0;$i<sizeof($response['categories']);$i++){
                $response['categories'][$i]['products']=$this->getProductsByCategoryLimit($response['categories'][$i]['category_id']);
                $response['categories'][$i]['count']=$this->getProductCategoryCount($response['categories'][$i]['category_id']);
            }
            $response['success']=true;
            $response['message']="Successfully loaded products by category";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProduct($id){
        try{
            $response['product']=$this->products->where('product_id',$id)->first();
            $response['spec_type']=$this->specs->findAll();
            $response['colour']=$this->product_colours->where('product_id',$id)->findAll();
            for($i=0;$i<sizeof($response['colour']);$i++){
                $temp=$this->colours->where('colour_id',$response['colour'][$i]['colour_id'])->first();
                $response['colour'][$i]['name']=$temp['colour_name'];
                $response['colour'][$i]['colour_code']=$temp['colour_code'];
            }
            for($i=0;$i<sizeof($response['spec_type']);$i++){
                $response['spec_type'][$i]['spec']=$this->product_specs->where('specification_type',$response['spec_type'][$i]['product_specification_type_id'])->where('product_id',$id)->findAll();
            }
            $response['success']=true;
            $response['message']="Successfully loaded product";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function signUp(){
        try{
            $rules=[
                "fname" => "required|max_length[100]",
                "lname" => "required|max_length[100]",
                "email" => "required|valid_email|is_unique[customer.email]",
                "password" => "required|min_length[8]",
                "confirmPassword" => "required|matches[password]",
                "phone" => "required|min_length[10]|max_length[10]"
        ];
            $errors=[
                "email" =>[
                    "is_unique" => "This email has been taken"
                ],
                "confirmPassword" =>[
                    "matches" => "Confirm password must match password"
                ]
            ];
            $input['fname']=$this->request->getPost("fname");
            $input['lname']=$this->request->getPost("lname");
            $input['email']=$this->request->getPost("email");
            $input['password']=$this->request->getPost("password");
            $input['phone']=$this->request->getPost("phone");
            $input['confirmPassword']=$this->request->getPost("confirmPassword");

            if(!$this->validateInput($input,$rules,$errors)){
                $response['success']=false;
                $response['message']=$this->validator->getErrors();
                return json_encode($response);
            }
            else{
                $data['f_name']=$input['fname'];
                $data['l_name']=$input['lname'];
                $data['email']=$input['email'];
                $data['phone']=$input['phone'];
                $data['password']=password_hash($input['password'],PASSWORD_DEFAULT);
                $this->customer->insert($data);
                $response['success']=true;
                $response['message']="Sign up successful";
                return json_encode($response);
            }
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function signIn(){
        try{
            $input['email']=$this->request->getPost("email");
            $input['password']=$this->request->getPost("password");
            $form_validation=\Config\Services::validation();
            $messages=[
                'password' =>[
                    'validateLogin' => "Incorrect email or password"
                ]
            ];
            $form_validation->setRules([
                'email' => 'required',
                'password' => 'required|validateLogin[email,password]'
            ],$messages);
            if($form_validation->run($input)){
                $session=session();
                $customer_data=$this->customer->where('email',$input['email'])->first();
                $session_data=array("customer_id"=>$customer_data['id'],"f_name"=>$customer_data['f_name'],"l_name"=>$customer_data['l_name'],'customerSession'=>"true");
                $session->set($session_data);
                $response['success']=true;
                $response['message']="Login successfully";
                return json_encode($response);
            }
            else{
                $response['success']=false;
                $response['message']=$form_validation->getErrors();
                return json_encode($response);
            }
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function isCustomerLoggedIn(){
        try{
            $session=session();
            if($session->get("customerSession")){
                $response['isCustomerLoggedIn']=true;
                return json_encode($response);
            }
            else{
                $response['isCustomerLoggedIn']=false;
                return json_encode($response);
            }
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function logout(){
        try{
            $session=session();
            $session->destroy();
            $response['success']=true;
            $response['message']="Successfully logged out";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    private function validateInput($input,array $rules,array $msg=[]){
        $this->validator=Services::Validation()->setRules($rules);
        if(is_string($rules)){
            $validation=config("Validation");
            if(!isset($validation->$rules)){
                throw ValidationException::forRuleNotFound($rules);
            }
            $rules=$validation->$errorName ?? [];
        }
        return $this->validator->setRules($rules,$msg)->run($input);
    }
    public function addToCart(){
        try{
            $session=session();
            $input['customer_id']=$session->get('customer_id');
            $input['product_id']=$this->request->getPost('product_id');
            $input['price']=$this->request->getPost('price');
            $input['quantity']=$this->request->getPost('quantity');
            $input['specification']=$this->request->getPost('specification');
            $input['colour']=$this->request->getPost('colour');
            $cart_item=$this->cart->where('specification',$input['specification'])->first();
            $response['success']=true;
            $response['message']="Successfully added to Cart";
            if(empty($cart_item)){
                $this->cart->insert($input);
            }
            else{
                if($cart_item['quantity']<5){
                    $input['quantity']=$cart_item['quantity']+1;
                 $this->cart->update($cart_item['cart_item_id'],$input);   
                }
                else{
                    $response['success']=false;
                    $response['message']="Only five of each items can be purchased at a time";
                }
                
            }
            
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function addToWishlist(){
        try{
            $session=session();
            $input['customer_id']=$session->get('customer_id');
            $input['product_id']=$this->request->getPost("product_id");
            $this->wishlist->insert($input);
            $response['success']=true;
            $response['message']="Successfully Added to Wishlist";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function removeFromWishlist(){
        try{
            $session=session();
            $input['customer_id']=$session->get('customer_id');
            $input['product_id']=$this->request->getPost("product_id");
            $this->wishlist->where('customer_id',$input['customer_id'])->where('product_id',$input['product_id'])->delete();
            $response['success']=true;
            $response['message']="Successfully removed from Wishlist";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function findProductInWishlist($product_id){
        try{
            $session=session();
            $input['customer_id']=$session->get('customer_id');
            $input['product_id']=$product_id;
            $item=$this->wishlist->where('customer_id',$input['customer_id'])->where('product_id',$input['product_id'])->first();
            $response['wishlisted']=false;
            if(!empty($item)){
                $response['wishlisted']=true;
            }
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getCart(){
        try{
            $session=session();
            $response['success']=true;
            $response['message']="Successfully retrieved cart";
            $response['cart']=$this->cart->where('customer_id',$session->get('customer_id'))->findAll();
            for($i=0;$i<sizeof($response['cart']);$i++){
                $response['cart'][$i]['product_info']=$this->products->where('product_id',$response['cart'][$i]['product_id'])->first();
                $response['cart'][$i]['colour']=$this->colours->where('colour_id',$response['cart'][$i]['colour'])->first();
                if($response['cart'][$i]['quantity']>$response['cart'][$i]['product_info']['product_quantity']){
                    if($response['cart'][$i]['product_info']['product_quantity']==0){
                        $this->cart->delete($response['cart'][$i]['cart_item_id']);
                        array_splice($response['cart'],$i,1);
                        $response['success']=false;
                        $response['message']="Oops! Some of the items in your cart are not available. Items in your cart may have been removed or updated.";
                    }
                    else{
                        $temp['quantity']=$response['cart'][$i]['product_info']['product_quantity'];
                        $this->cart->update($response['cart'][$i]['cart_item_id'],$temp);
                        $response['cart'][$i]['quantity']=$temp['quantity'];
                        $response['success']=false;
                        $response['message']="Oops! Some of the items in your cart are not available. Items in your cart may have been removed or updated.";
                    }
                }
            }
            
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function updateCart(){
        try{
            $id=$this->request->getPost("id");
            $input['quantity']=$this->request->getPost("quantity");
            $this->cart->update($id,$input);
            $response['success']=true;
            $response['message']="Successfully updated cart";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getItemQuantity($id){
        try{
            $item=$this->cart->where('cart_item_id',$id)->first();
            $response=$this->products->where('product_id',$item['product_id'])->select('product_quantity')->first();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getCustomerData(){
        try{
            $session=session();
            $response['customer']=$this->customer->where('id',$session->get("customer_id"))->first();
            $response['success']=true;
            $response['message']="Successfully retrieve customer data";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function removeFromCart(){
        try{
            $id=$this->request->getPost("id");
            $response['success']=true;
            $this->cart->delete($id);
            $response['message']="Successfully removed item from cart";
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function addToOrder(){
        try{
            $input['phone']=$this->request->getPost('phone');
            $input['address']=$this->request->getPost('address');
            $input['f_name']=$this->request->getPost('f_name');
            $input['l_name']=$this->request->getPost('l_name');
            $input['total_price']=$this->request->getPost('total_price');
            $input['status']="PLACED";
            $session=session();
            $input['customer_id']=$session->get('customer_id');
            $cart=json_decode($this->request->getPost('cart'),true);
            $this->orders->insert($input);
            $order=$this->orders->where($input)->first();
            for($i=0;$i<sizeof($cart);$i++){
                $temp['order_id']=$order['order_id'];
                $temp['product_id']=$cart[$i]['product_id'];
                $temp['product_name']=$cart[$i]['product_info']['product_name'];
                $temp['product_price']=$cart[$i]['price'];
                $temp['colour_id']=$cart[$i]['colour']['colour_id'];
                $temp['colour_name']=$cart[$i]['colour']['colour_name'];
                $temp['specification']=json_encode($cart[$i]['specification']);
                $temp['quantity']=$cart[$i]['quantity'];
                $product=$this->products->where('product_id',$temp['product_id'])->first();
                $update['product_quantity']=$product['product_quantity']-$temp['quantity'];
                $this->orderItem->insert($temp);
                $this->cart->delete($cart[$i]['cart_item_id']);
                $this->products->update($cart[$i]['product_id'],$update);
            }
            
            $response['success']=true;
            $response['message']="Successfully purchased items!";
            return json_encode($response);
            
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function searchProducts($query){
        try{
            $response['products']=$this->products->where('product_status',1)->like('product_name',$query)->findAll();
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getProductsInWishlist(){
        try{
            $session=session();
            $wishlist=$this->wishlist->where('customer_id',$session->get('customer_id'))->findAll();
            for($i=0;$i<sizeof($wishlist);$i++){
                $temp[$i]=$this->products->where('product_status',1)->where('product_id',$wishlist[$i]['product_id'])->first();

            }
            $response['products']=$temp;
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
    public function getCustomerOrders(){
        try{
            $session=session();
            $response['orders']=$this->orders->where('customer_id',$session->get('customer_id'))->findAll();
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
    public function getPopularProducts(){
        try{
            $products=$this->products->where('product_status',1)->findAll();
            $avg=array();
            for($i=0;$i<sizeof($products);$i++){
                $temp=$this->sentiment->where('search_term_id',$products[$i]['product_id'])->selectAvg('avg_compound')->get()->getResult();
                $avg[$i]['avg_compound']=$temp[0]->avg_compound;
                $avg[$i]['product']=$products[$i];
            }
            rsort($avg);
            for($i=0;$i<sizeof($avg)&&$i<10;$i++){
                $response['products'][$i]=$avg[$i]['product'];
            }
            return json_encode($response);
        }
        catch(\Exception $e){
            $response['success']=false;
            $response['message']=$e->getMessage();
            return json_encode($response);
        }
    }
}