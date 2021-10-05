import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Login from './Login';
import Dashboard from './Dashboard';
import Products from './Products';
import Banners from './Banners';
import Orders from './Orders';
import OrderItems from './OrderItems';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'
import Product_Details from './Product_Details';

export default class Admin extends Component{
    render(){let path="/NLP_Store/public/admin";
        return(
            
            <Router>
                    <Switch>
                        <Route path={path+"/login"} component={Login}/>
                        <Route path={path+"/dashboard"} component={Dashboard}/>
                        <Route path={path+"/products"} component={Products}/>
                        <Route path={path+"/product_details/:id"} component={Product_Details}/>
                        <Route path={path+"/banners"} component={Banners}/>
                        <Route path={path+"/orders"} component={Orders}/>
                        <Route path={path+"/orderItems/:id"} component={OrderItems}/>
                    </Switch>
            </Router>
        
        )
    }
        
    
}