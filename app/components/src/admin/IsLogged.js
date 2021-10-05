import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom'

export default class IsLogged extends Component{

    constructor(){
        super();
        this.state={
            isLogged:true,
        }
    }
    componentDidMount(){
        this.isLogged();
    }
    render(){
        
        return(
            <div>{this.redirect()}</div>
        
        )
    }
        
    isLogged(){
        const baseUrl="/NLP_Store/public/api/admin/isLogin"
        axios.get(baseUrl).then(response=>{
            console.log(response.data.isLogged)
            if(!response.data.isLogged){
                this.setState({isLogged:false})
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    redirect(){
        if(!this.state.isLogged){
            return <Redirect to='/NLP_Store/public/admin/login'/>
        }
    }
    
}

