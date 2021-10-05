<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php'))
{
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', 'Home::index');
$routes->get('/customer', 'CustomerController::index');
$routes->get('/customer/index', 'CustomerController::index');
$routes->get('/customer/form', 'CustomerController::index');
$routes->get('/customer/edit/(:num)', 'CustomerController::index');
$routes->get('/customer/cart','CustomerController::index');
$routes->get('/customer/checkout','CustomerController::index');
$routes->get('/api/customer/test','CustomerController::test');
$routes->get('/api/customer/list','CustomerController::list');
$routes->get('api/customer/get/(:num)','CustomerController::get/$1');
$routes->get('api/customer/getBanners','CustomerController::getBanners');
$routes->get('api/customer/getNewProducts','CustomerController::getNewProducts');
$routes->get('api/customer/getProductsByCategoryLimit/(:num)','CustomerController::getProductsByCategoryLimit/$1');
$routes->get('api/customer/getProductCategory','CustomerController::getProductCategory');
$routes->get('/customer/product/(:num)','CustomerController::index');
$routes->get('api/customer/getProduct/(:num)','CustomerController::getProduct/$1');
$routes->get('api/customer/isCustomerLoggedIn','CustomerController::isCustomerLoggedIn');
$routes->get('api/customer/logout','CustomerController::logout');
$routes->get('api/customer/getCart','CustomerController::getCart');
$routes->get('api/customer/findProductInWishlist/(:num)','CustomerController::findProductInWishlist/$1');
$routes->get('api/customer/getItemQuantity/(:num)','CustomerController::getItemQuantity/$1');
$routes->get('api/customer/getCustomerData','CustomerController::getCustomerData');
$routes->get('/customer/search/(:any)','CustomerController::index');
$routes->get('api/customer/searchProducts/(:any)','CustomerController::searchProducts/$1');
$routes->get('api/customer/getProductsByCategory/(:num)','CustomerController::getProductsByCategory/$1');
$routes->get('/customer/category/(:any)','CustomerController::index');
$routes->get('api/customer/getProductsInWishlist','CustomerController::getProductsInWishlist');
$routes->get('/customer/wishlist','CustomerController::index');
$routes->get('/customer/orderHistory','CustomerController::index');
$routes->get('api/customer/getCustomerOrders','CustomerController::getCustomerOrders');
$routes->get('api/customer/getOrderItems/(:num)','CustomerController::getOrderItems/$1');
$routes->get('customer/orderItem/(:num)','CustomerController::index');
$routes->get('api/customer/getOrder/(:num)','CustomerController::getOrder/$1');
$routes->get('api/customer/getPopularProducts','CustomerController::getPopularProducts');

$routes->post('/api/customer/create','CustomerController::create');
$routes->post('/api/customer/signUp','CustomerController::signUp');
$routes->post('/api/customer/signIn','CustomerController::signIn');
$routes->post('api/customer/addToCart','CustomerController::addToCart');
$routes->post('api/customer/addToWishlist','CustomerController::addToWishlist');
$routes->post('api/customer/removeFromWishlist','CustomerController::removeFromWishlist');
$routes->post('api/customer/updateCart','CustomerController::updateCart');
$routes->post('api/customer/removeFromCart','CustomerController::removeFromCart');
$routes->post('api/customer/addToOrder','CustomerController::addToOrder');

$routes->put('api/customer/update/(:num)','CustomerController::update/$1');


$routes->delete('api/customer/delete/(:num)','CustomerController::delete/$1');


$routes->post('/api/admin/login','AdminController::login');
$routes->post('/api/admin/createAdmin','AdminController::createAdmin');
$routes->post('/api/admin/addProduct','AdminController::addProduct');
$routes->post('/api/admin/addSpecType','AdminController::addSpecType');
$routes->post('/api/admin/addProductCategory','AdminController::addProductCategory');
$routes->post('/api/admin/editProduct','AdminController::editProduct');
$routes->post('/api/admin/editSpecificationType','AdminController::editSpecificationType');
$routes->post('/api/admin/editCategory','AdminController::editCategory');
$routes->post('/api/admin/addNewColour','AdminController::addNewColour');
$routes->post('/api/admin/editColour','AdminController::editColour');
$routes->post('/api/admin/filterProducts','AdminController::filterProducts');
$routes->post('/api/admin/getSentimentStorePython','AdminController::getSentimentStorePython');
$routes->post('/api/admin/updateOrderStatus','AdminController::updateOrderStatus');
$routes->post('/api/admin/customSales','AdminController::customSales');
$routes->post('/api/admin/customRevenue','AdminController::customRevenue');
$routes->post('/api/admin/customSentiment','AdminController::customSentiment');
$routes->post('/api/admin/addBanner','AdminController::addBanner');
$routes->post('/api/admin/editBanner','AdminController::editBanner');

$routes->delete('/api/admin/removeProductCategory/(:num)','AdminController::removeProductCategory/$1');
$routes->delete('/api/admin/removeSpecType/(:num)','AdminController::removeSpecType/$1');
$routes->delete('/api/admin/removeProduct/(:num)','AdminController::removeProduct/$1');
$routes->delete('/api/admin/removeColour/(:num)','AdminController::removeColour/$1');
$routes->delete('/api/admin/removeBanner/(:num)','AdminController::removeBanner/$1');

$routes->get('/admin','AdminController::index');
$routes->get('/admin/login','AdminController::index');
$routes->get('/api/admin/isLogin','AdminController::isLogin');
$routes->get('api/admin/getSpecType','AdminController::getSpecType');
$routes->get('api/admin/getProductCategory','AdminController::getProductCategory');
$routes->get('api/admin/getProductSpec/(:num)','AdminController::getProductSpec/$1');
$routes->get('api/admin/getProductColours/(:num)','AdminController::getProductColours/$1');
$routes->get('api/admin/getColours','AdminController::getColours');
$routes->get('/admin/dashboard','AdminController::index');
$routes->get('/api/admin/logout','AdminController::logout');
$routes->get('/api/admin/getUser','AdminController::getUser');
$routes->get('api/admin/getProducts','AdminController::getProducts');
$routes->get('/admin/products','AdminController::index');
$routes->get('/admin/banners','AdminController::index');
$routes->get('/admin/product_details/(:num)','AdminController::index');
$routes->get('api/admin/getProductDetails/(:num)','AdminController::getProductDetails/$1');
$routes->get('api/admin/getProductSpecByType/(:num)','AdminController::getProductSpecByType/$1');
$routes->get('api/admin/getSentimentData/(:num)','AdminController::getSentimentData/$1');
$routes->get('api/admin/getFrequentWords/(:num)','AdminController::getFrequentWords/$1');
$routes->get('api/admin/getRecentSentimentData/(:num)','AdminController::getRecentSentimentData/$1');
$routes->get('api/admin/getMonthlySentimentData/(:num)','AdminController::getMonthlySentimentData/$1');
$routes->get('api/admin/getRecentProductSales/(:num)','AdminController::getRecentProductSales/$1');
$routes->get('api/admin/getMonthlyProductSales/(:num)','AdminController::getMonthlyProductSales/$1');
$routes->get('api/admin/getBanners','AdminController::getBanners');
$routes->get('/api/admin/getSentimentProductPython/(:num)','AdminController::getSentimentProductPython/$1');
$routes->get('/api/admin/getAllProductSentimentPython','AdminController::getAllProductSentimentPython');
$routes->get('/api/admin/getSentimentStorePython','AdminController::getSentimentStorePython');
$routes->get('/admin/orders','AdminController::index');
$routes->get('/admin/orderItems/(:num)','AdminController::index');
$routes->get('api/admin/getAllOrders','AdminController::getAllOrders');
$routes->get('api/admin/getOrderItems/(:num)','AdminController::getOrderItems/$1');
$routes->get('api/admin/getOrder/(:num)','AdminController::getOrder/$1');
$routes->get('api/admin/getNumberOfCustomers','AdminController::getNumberOfCustomers');
$routes->get('api/admin/getMonthlySales','AdminController::getMonthlySales');
$routes->get('api/admin/getMonthlyRevenue','AdminController::getMonthlyRevenue');
$routes->get('api/admin/getTotalTweets','AdminController::getTotalTweets');
$routes->get('api/admin/getWeeklyBrandSentiment','AdminController::getWeeklyBrandSentiment');
$routes->get('api/admin/getMonthlyBrandSentiment','AdminController::getMonthlyBrandSentiment');
$routes->get('api/admin/getWeeklyTotalSales','AdminController::getWeeklyTotalSales');
$routes->get('api/admin/getMonthlyTotalSales','AdminController::getMonthlyTotalSales');
$routes->get('api/admin/getFrequentWordsBrand','AdminController::getFrequentWordsBrand');
$routes->get('api/admin/getSentimentDataBrand','AdminController::getSentimentDataBrand');
$routes->get('api/admin/getWeeklyTotalRevenue','AdminController::getWeeklyTotalRevenue');
$routes->get('api/admin/getMonthlyTotalRevenue','AdminController::getMonthlyTotalRevenue');
$routes->get('/api/admin/salesYear','AdminController::salesYear');
$routes->get('/api/admin/revenueYear','AdminController::revenueYear');
$routes->get('/api/admin/sentimentYear','AdminController::sentimentYear');
$routes->get('/api/admin/getRecommendedAction','AdminController::getRecommendedAction');
/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php'))
{
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
