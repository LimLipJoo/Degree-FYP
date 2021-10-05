import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

import Customer from './customer/Customer';
import Admin from './admin/Admin';

export default class Main extends Component{
    render(){let path="/NLP_Store/public";
        return(
            
            <Router>
                    <Switch>
                        <Route path={path+"/customer"} component={Customer}/>
                        <Route path={path+"/admin"} component={Admin}/>
                        

                    </Switch>
            </Router>
        
        )
    }
}
ReactDOM.render(<Main/>,document.getElementById('main'));