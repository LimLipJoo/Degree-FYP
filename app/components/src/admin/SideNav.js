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

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'


export default class SideNav extends Component{
    constructor(){
        super();
        this.state={
            name:"",
            user_id:"",
            isCollapse:false,
            smallScreen:false
        }
    }
    componentDidMount(){
        this.getUserData()
        window.addEventListener("resize",this.resize.bind(this))
        this.resize()
    }
    render(){
        const location=this.props.location;
        
        return(
            
            <Container fluid style={{height:"100%"}}>
                <Col xs={this.state.isCollapse?2:4} sm={this.state.isCollapse?2:3} md={this.state.isCollapse?1:2} style={{backgroundColor:"white",height:"100%",padding:0}}>
                
                    <Col>
                        <Row style={{backgroundImage:"url(/NLP_Store/public/Image/background-nav.png)"}}>
                            
                            <Image src='/NLP_Store/public/Image/user-image.png' roundedCircle fluid style={this.state.isCollapse?{display:"none"}:{width:"30%",height:"30%",marginBottom:"5%",marginTop:"5%",marginLeft:"9%"}}></Image>
                            <Button variant="link" style={this.state.isCollapse?{paddingLeft:"40%",height:"30%",width:"10%",paddingTop:"10%"}:{paddingLeft:"49%",height:"30%",width:"10%"}} onClick={()=>this.sideNavCollapse()}><FontAwesomeIcon icon={this.state.isCollapse?Icons.faArrowRight:Icons.faTimes} style={{color:"grey"}} /></Button>
                            <div style={{backgroundColor:"rgba(0,0,0,0.6)",width:"100%",paddingLeft:"12%",color:"white",paddingTop:"2%",paddingBottom:"2%"}}>{this.state.isCollapse?<></>:this.state.name}</div>
                        </Row>
                        <Nav className="flex-column"  style={{marginTop:"8%"}} activeKey={location}>
                            <div style={this.state.isCollapse?{width:"100%"}:{width:"100%"}}>
                                <Nav.Link  eventKey="/NLP_Store/public/admin/dashboard" style={this.state.isCollapse&&this.state.smallScreen?{paddingLeft:"5%"}:{}} ><FontAwesomeIcon icon={Icons.faTachometerAlt} style={this.state.isCollapse?{marginLeft:"20%",fontSize:"30px"}:{marginRight:"5%"}}/><span style={this.state.isCollapse?{display:"none"}:{}}>Dashboard</span></Nav.Link>
                                <Nav.Link  eventKey="/NLP_Store/public/admin/products" style={this.state.isCollapse&&this.state.smallScreen?{paddingLeft:"5%"}:{}}><FontAwesomeIcon icon={Icons.faBarcode} style={this.state.isCollapse?{marginLeft:"20%",fontSize:"30px"}:{marginRight:"5%"}}/><span style={this.state.isCollapse?{display:"none"}:{}}>Product</span></Nav.Link>
                                <Nav.Link  eventKey="/NLP_Store/public/admin/accounts" style={this.state.isCollapse&&this.state.smallScreen?{paddingLeft:"5%"}:{}}><FontAwesomeIcon icon={Icons.faUsers} style={this.state.isCollapse?{marginLeft:"20%",fontSize:"30px"}:{marginRight:"5%"}}/><span style={this.state.isCollapse?{display:"none"}:{}}>Accounts</span></Nav.Link>
                            </div>
                            
                        </Nav>
                        <Container fluid>
                           <Navbar expand='lg' fixed="bottom"style={{padding:0}}>
                                <Nav style={this.state.isCollapse?{width:"5%"}:this.state.smallScreen?{width:"16%",marginBottom:"4%"}:{width:"14%",marginBottom:"0.5%"}}>
                                
                                    <Nav.Link style={this.state.isCollapse?this.state.smallScreen?{width:"100%",marginLeft:"60%"}:{width:"100%",marginLeft:"30%"}:this.state.smallScreen?{width:"100%",marginLeft:"25%"}:{width:"100%",marginLeft:"8%"}} ><FontAwesomeIcon icon={Icons.faDoorOpen} style={this.state.isCollapse?{marginLeft:"7%",fontSize:"30px"}:{marginLeft:"1%",marginRight:"2%"}}></FontAwesomeIcon><span style={this.state.isCollapse?{display:"none"}:{}}>Logout</span></Nav.Link>
                                
                                </Nav>
                            </Navbar> 
                        </Container>
                        
                    </Col>
                    
                    
                </Col>
            </Container>
            
            
        
        )
    }
        
    getUserData(){
        const baseUrl="/NLP_Store/public/api/admin/getUser"
        axios.get(baseUrl).then(response=>{
            if(response.data.success){
                this.setState({name:response.data.name,user_id:response.data.user_id})
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    sideNavCollapse(){
        this.setState({isCollapse:!this.state.isCollapse})
    }
    resize(){
        if(window.innerWidth<=760){
            this.setState({smallScreen:true})
        }
        else{
            this.setState({smallScreen:false})
        }
    }
}