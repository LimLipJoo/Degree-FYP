import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Edit from './Edit';
import List from './List';
import Form from './Form';
import Store from './Store';
import Product from './Product';
import Cart from './Cart';
import Checkout from './Checkout';
import Search from './Search';
import Category from './Category';
import Wishlist from './Wishlist';
import OrderHistory from './OrderHistory';
import OrderItems from './OrderItems';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

export default class Customer extends Component{
    render(){let path="/NLP_Store/public";
        return(
            
            <Router>
               <main>
                    <Switch>
                        <Route path={path+"/customer/index"} exact component={Store}/>
                        <Route path={path+"/customer/product/:id"} component={Product}/>
                        <Route path={path+"/customer/cart"} component={Cart}/>
                        <Route path={path+"/customer/checkout"} component={Checkout}/>
                        <Route path={path+"/customer/search/:query"} component={Search}/>
                        <Route path={path+"/customer/category/:id"} component={Category}/>
                        <Route path={path+"/customer/wishlist"} component={Wishlist}/>
                        <Route path={path+"/customer/orderHistory"} component={OrderHistory}/>
                        <Route path={path+"/customer/orderItem/:id"} component={OrderItems}/>
                    </Switch>
                </main> 
            </Router>
        
        )
    }
        
    
}

//ReactDOM.render(<Customer/>,document.getElementById('main-customer'));