import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import StoreNav from './Nav';
import StoreFooter from './StoreFooter';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom'
import { Tabs,Tab,FormControl, Modal, Table, NavItem, Image, InputGroup } from 'react-bootstrap';
import Style from './Styles/Store.css';

export default class Cart extends Component{
    constructor(){
        super();
        this.state={
            isCustomerLoggedIn:true,
            cart:[],
            fail:false,
            message:"",
            totalPrice:0,
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/customer/isCustomerLoggedIn").then(response=>{
            if(response.data.isCustomerLoggedIn){
              this.setState({isCustomerLoggedIn:true},()=>this.getCart())
            }
          }).catch(error=>{
            console.log(error)
        })
    }
    render(){
        return(
            <Container fluid  style={{height:"100%"}} >
                <StoreNav isLogged={islogged =>this.setState({isCustomerLoggedIn:islogged})}></StoreNav>
                <Row className="mt-5 " style={{margin:"8%"}}>
                    <Col className="mt-5 mb-3">
                        <Card>
                            <Card.Body>
                                <Alert className="mb-3" variant="danger" show={this.state.fail} onClose={()=>this.setState({fail:false})} dismissible>{this.state.message}</Alert>
                                <Row style={{margin:"10px"}}>
                                    <Col>
                                        <h5 className="mb-3 ">Cart</h5>
                                    </Col>
                                </Row>
                                
                                
                                {this.state.cart.map((data,i)=>{
                                    return(
                                    <Row className="mb-3 border-bottom" style={{margin:"10px"}}>
                                        <Col xs={3}>
                                            <Image src={data.product_info.product_image} fluid></Image>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col>
                                                    <h6>{data.product_info.product_name}</h6>
                                                </Col>
                                                <Col style={{paddingRight:0}}>
                                                    <InputGroup className=" d-flex justify-content-end">
                                                        <Button size="sm" style={{marginRight:0,borderTopRightRadius:0,borderBottomRightRadius:0}} variant="outline-secondary" onClick={()=>this.decreaseQuantity(i,data.cart_item_id)}>-</Button>
                                                        <FormControl style={{backgroundColor:"white"}} min="1" readOnly id={"quantity-"+i} max={data.product_info.product_quantity<5?data.product_info.product_quantity:5} className="cartQuantity col-sm-2" type="number" size="sm" defaultValue={data.quantity}></FormControl>
                                                        <Button size="sm" style={{marginRight:0,borderTopLeftRadius:0,borderBottomLeftRadius:0}} variant="outline-secondary" onClick={()=>this.increaseQuantity(i,data.cart_item_id)}>+</Button>
                                                    </InputGroup>
                                                </Col>
                                                
                                            </Row>
                                            
                                            <small className="mb-2">Colour: {data.colour.colour_name}</small>
                                            <br></br>
                                            {data.specification.map((data,i)=>{
                                                return(
                                                    <>
                                                    <small className="mb-2">{data.spec_type}: {data.spec_name}</small>
                                                    <br></br>
                                                    </>
                                                )
                                            })}
                                            <Row style={{fontSize:"14px"}} className="mt-3 mb-3">
                                                <Col>
                                                    <Link style={{color:"#7d7d7d"}} onClick={()=>this.removeFromCart(data.cart_item_id,i)}><FontAwesomeIcon icon={Icons.faTrash} style={{marginRight:"5px"}}></FontAwesomeIcon>Remove Item</Link>
                                                </Col> 
                                                <span className="mr-auto">RM {parseFloat(parseFloat(data.price)*parseInt(data.quantity)).toFixed(2)}</span>
                                            </Row>


                                        </Col>  
                                    </Row>
                                    )
                                })}
                                {this.state.cart.length==0?<div className="d-flex justify-content-center mb-3"><figure><Image  src="/NLP_Store/public/Image/empty_cart.png" fluid></Image><figcaption className="text-center mt-3">No Items in Cart</figcaption></figure></div>:""}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="mt-5 mb-3" md={3}>
                        <Card>
                            <Card.Body>
                                <h5 className="mb-3">Total</h5>
                                <Row>
                                    <Col>
                                        <small className="mb-3">Subtotal</small> 
                                    </Col>
                                   <Col>
                                        <small className="d-flex justify-content-end mb-3">RM {parseFloat(this.state.totalPrice).toFixed(2)}</small>
                                   </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <small className="mb-3">Shipping</small>
                                    </Col>
                                    <Col>
                                        <small className="d-flex justify-content-end mb-3">FREE</small>
                                   </Col>
                                </Row>
                                <hr></hr>
                                <Row className="mb-3 text-dark" >
                                    <Col>
                                        <small className="mb-3"><b>Total Price (Incl. tax)</b></small>
                                    </Col>
                                    <Col>
                                        <small className="d-flex justify-content-end mb-3"><b>RM {parseFloat(this.state.totalPrice*1.1).toFixed(2)}</b></small>
                                    </Col>
                                </Row>
                                <Button disabled={this.state.cart.length==0?"true":""} href="/NLP_Store/public/customer/checkout" variant="primary" style={{width:"100%"}}>Go to Checkout</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                </Row>
                <Row>
                    <StoreFooter></StoreFooter>
                </Row>
                {this.redirect()}
            </Container>
        )
    }
    redirect(){
        if(!this.state.isCustomerLoggedIn){
            return <Redirect to='/NLP_Store/public/customer/index'/>
        }
    }
    getCart(){
        axios.get("/NLP_Store/public/api/customer/getCart").then(response=>{
            var temp=response.data.cart;
            for(var i=0;i<response.data.cart.length;i++){
                temp[i].specification=JSON.parse(response.data.cart[i].specification)
                temp[i].product_info.product_image=response.data.cart[i].product_info.product_image.replace("..","/NLP_Store")
            }
            this.setState({cart:temp},()=>this.totalPrice())
            if(!response.data.success){
                this.setState({fail:true,message:response.data.message})
                console.log(response)
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    increaseQuantity(i,id){
        var element=document.getElementById("quantity-"+i);
        axios.get("/NLP_Store/public/api/customer/getItemQuantity/"+id).then(response=>{
            var temp=this.state.cart
            temp[i].product_info.product_quantity=parseInt(response.data.product_quantity)
            this.setState({cart:temp},()=>{
                if(this.state.cart[i].quantity+1<=element.max){
                    var temp=this.state.cart;
                    temp[i].quantity=parseInt(temp[i].quantity)+1
                    var formdata=new FormData;
                    formdata.append("quantity",temp[i].quantity)
                    formdata.append("id",id)
                    axios.post("/NLP_Store/public/api/customer/updateCart",formdata).then(response=>{
                        console.log(response)
                        this.setState({cart:temp},()=>this.totalPrice())
                        element.value=temp[i].quantity
                    }).catch(error=>{
                        console.log(error)
                    })
                    
                }
            })
        }).catch(error=>{
            console.log(error)
        })
        
    }
    decreaseQuantity(i,id){
        var element=document.getElementById("quantity-"+i);
        axios.get("/NLP_Store/public/api/customer/getItemQuantity/"+id).then(response=>{
            var temp=this.state.cart
            temp[i].product_info.product_quantity=parseInt(response.data.product_quantity)
            this.setState({cart:temp},()=>{
                    if(this.state.cart[i].quantity-1>=element.min){
                    var temp=this.state.cart;
                    temp[i].quantity=parseInt(temp[i].quantity)-1
                    var formdata=new FormData;
                    formdata.append("quantity",temp[i].quantity)
                    formdata.append("id",id)
                    axios.post("/NLP_Store/public/api/customer/updateCart",formdata).then(response=>{
                        console.log(response)
                        this.setState({cart:temp},()=>this.totalPrice())
                        element.value=temp[i].quantity
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            })
        }).catch(error=>{
            console.log(error)
        })
        
    }
    totalPrice(){
        var temp=0;
        for(var i=0;i<this.state.cart.length;i++){
            temp+=(parseFloat(this.state.cart[i].price)*parseInt(this.state.cart[i].quantity))
        }
        this.setState({totalPrice:temp})
    }
    removeFromCart(id,i){
        var formdata=new FormData;
        formdata.append("id",id)
        axios.post("/NLP_Store/public/api/customer/removeFromCart",formdata).then(response=>{
            if(response.data.success){
                var temp=this.state.cart
                temp.splice(i,1)
                this.setState({cart:temp},()=>this.totalPrice())
            }
        }).catch(error=>{
            console.log(error)
        })
    }
}