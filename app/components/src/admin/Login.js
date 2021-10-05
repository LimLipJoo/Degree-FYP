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


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom'

export default class Admin extends Component{
    
    constructor(){
        super();
        this.state={
            username:"",
            password:"",
            isLogged:false,
            usernameValid:true,
            passwordValid:true,
            usernameMessage:"",
            passwordMessage:""
        }
    }
    render(){
        return(
            <Container  fluid>
                <Row className="justify-content-sm-center">
                
                    <Col sm="auto" style={{marginTop:"10%"}} >
                        <Card className="shadow-lg" >
                            <Row>
                                <Col>
                                    <Jumbotron style={{height:"100%",backgroundImage:"url(/NLP_Store/public/Image/login_background_left.jpg)",color:"white",paddingLeft:"10%",borderTopRightRadius:0,borderBottomRightRadius:0,marginBottom:"30%"}}>
                                        <Container style={{marginTop:"8%"}}>
                                            <h4>Welcome to NLP Admin</h4>
                                            <div style={{borderBottom:"solid 4px",paddingBottom:"2%",width:"25%"}}></div>
                                            <p style={{paddingTop:"10%",color:"white"}}>The admin page for configuring the NLP store, viewing the dashboard and more!</p>
                                        </Container>
                                        
                                    </Jumbotron>
                                </Col>
                                
                                <Col>
                                
                                    <Container style={{marginTop:"10%"}}>
                                        
                                        <Card.Body >
                                            
                                            <h4>Sign in</h4>
                                            <Form>
                                                <Form.Group controlId="username">
                                                    <Form.Label>Username</Form.Label>
                                                    <Form.Control type='text' onChange={(value)=>this.setState({username:value.target.value})} placeholder="Username" isInvalid={!this.state.usernameValid}/>
                                                    <Form.Control.Feedback type="invalid">{this.state.usernameMessage}</Form.Control.Feedback>
                                                </Form.Group>
                                                <Form.Group controlId="password">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control type='password' onChange={(value)=>this.setState({password:value.target.value})} placeholder="Password" isInvalid={!this.state.passwordValid}/>
                                                    <Form.Control.Feedback type="invalid">{this.state.passwordMessage}</Form.Control.Feedback>
                                                </Form.Group>
                                                
                                            </Form>
                                            <Button variant='primary' type='button' onClick={()=>this.Login()} style={{float:"right"}}>Sign in</Button>
                                        
                                        </Card.Body>
                                        
                                        
                                    </Container>
                                   
                                </Col>
                            </Row>
                            
                        </Card>
                    </Col>
                </Row>
                {this.isLogged()}
            </Container>
            
        )
    }

    Login(){
        

        const baseUrl="/NLP_Store/public/api/admin/login"
        const datapost={
            username:this.state.username,
            password:this.state.password
        }
        axios.post(baseUrl,datapost).then(response=>{
            console.log(response)
            if(response.data.success){
                    this.setState({isLogged:true})
            }
            else{
                if(response.data.message.username!=undefined){
                    this.setState({usernameValid:false,usernameMessage:response.data.message.username})
                }
                else{
                    this.setState({usernameValid:true})
                }
                if(response.data.message.password!=undefined)
                    this.setState({passwordValid:false,passwordMessage:response.data.message.password})
                else
                    this.setState({passwordValid:true})
            }
        }).catch(error=>{
                console.log(error)
        })
    }
    isLogged(){
        if(this.state.isLogged)
            return <Redirect to='/NLP_Store/public/admin/dashboard'/>
    }
}