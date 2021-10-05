import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Style from './Styles/Sidebar.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom'

export default class SideBar extends Component{

render(){
    const location=this.props.location;
    return(
            <Row className="sidebarRow" style={{height:"100%",paddingLeft:"0.9%"}}>
                <Col>
                    <Nav activeKey={location}>
                        <nav id="sidebar">
                            <div class="sidebar-head">
                                <h3>NLP Admin</h3>
                            </div>
                            
                            <ul class="list-unstyled components">
                                
                                <li>
                                    <Nav.Link href="/NLP_Store/public/admin/dashboard" eventKey="/NLP_Store/public/admin/dashboard">Dashboard</Nav.Link>
                                </li>
                                <li>
                                <Nav.Link href="/NLP_Store/public/admin/products" eventKey="/NLP_Store/public/admin/products">Products</Nav.Link>
                                </li>
                                <li>
                                <Nav.Link href="/NLP_Store/public/admin/banners" eventKey="/NLP_Store/public/admin/banners">Banners</Nav.Link>
                                </li>
                                <li>
                                <Nav.Link href="/NLP_Store/public/admin/orders" eventKey="/NLP_Store/public/admin/orders">Orders</Nav.Link>
                                </li>

                            </ul>
                            <ul class="list-unstyled">
                                <li>
                                    <Nav.Link href="/NLP_Store/public/admin/login">Logout</Nav.Link>
                                </li>
                            </ul>
                            
                        </nav>
                        <button type="button" id="sidebarCollapse" class="btn btn-info" onClick={()=>this.collapse()} style={{borderTopLeftRadius:0,borderBottomLeftRadius:0,backgroundColor:"#296be3",float:"right",margin:0}}>
                        <FontAwesomeIcon icon={Icons.faBars}></FontAwesomeIcon>
                        </button>
                    </Nav>
                    
                </Col>
                
                
                
                </Row>
            
                
            
        
    )
    
}
collapse(){
           document.getElementById("sidebar").classList.toggle("active");
           document.getElementById('content').classList.toggle("active");
}

}