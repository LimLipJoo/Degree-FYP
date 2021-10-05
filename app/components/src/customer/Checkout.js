import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Brand from '@fortawesome/free-brands-svg-icons';
import StoreNav from './Nav';
import StoreFooter from './StoreFooter';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom'
import {  Image, Badge } from 'react-bootstrap';
import Style from './Styles/Store.css';

export default class Checkout extends Component{
    
    constructor(){
        super();
        this.state={
            isCustomerLoggedIn:true,
            cart:[],
            fail:false,
            message:"",
            totalPrice:0,
            customer:[],
            taxAmount:0,
            showShippingForm:true,
            showOrderSuccess:false,
            showPaymentConfirmation:false,
            shippingForm:{fname:"",lname:"",address:"",postcode:"",city:"",state:"",country:"Malaysia",phone:""},
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/customer/isCustomerLoggedIn").then(response=>{
            if(response.data.isCustomerLoggedIn){
              this.setState({isCustomerLoggedIn:true},()=>this.getCart())
              axios.get("/NLP_Store/public/api/customer/getCustomerData").then(response=>{
                this.setState({customer:response.data.customer})
                this.state.shippingForm.phone=response.data.customer.phone
              }).catch(error=>{
                  console.log(error)
              })
            }
          }).catch(error=>{
            console.log(error)
        })
    }
    render(){
        return(
            
            <Container fluid  style={{height:"100%"}} >
                <StoreNav isLogged={islogged =>this.setState({isCustomerLoggedIn:islogged})}></StoreNav>
                <Row className="mt-5 mb-5" style={{margin:"8%",minHeight:"80vh"}}>
                    <Col className="mt-5 mb-3">
                        <Card style={this.state.showShippingForm?{}:{display:"none"}}>
                            <Card.Body>
                                <Alert variant='danger' show={this.state.fail} onClose={()=>this.setState({fail:false})}>{this.state.message}</Alert>
                                <h5 className="mb-3">Shipping Address</h5>
                                <Form onSubmit={this.submitShipping.bind(this)}>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="fname">
                                                <Form.Label>First Name</Form.Label> 
                                                <Form.Control onChange={this.updatefname.bind(this)} type="input" placeholder="First Name" required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="lname">
                                                <Form.Label>Last Name</Form.Label> 
                                                <Form.Control onChange={this.updatelname.bind(this)} type="input" placeholder="Last Name" required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="address">
                                                <Form.Label>Address</Form.Label> 
                                                <Form.Control onChange={this.updateAddress.bind(this)} type="input" placeholder="Address" required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="postcode">
                                                <Form.Label>Postcode</Form.Label> 
                                                <Form.Control onChange={this.updatePostcode.bind(this)} type="input" placeholder="Postcode" required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="city">
                                                <Form.Label>City</Form.Label> 
                                                <Form.Control onChange={this.updateCity.bind(this)} type="input" placeholder="City" required></Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="state">
                                                <Form.Label>City</Form.Label> 
                                                <Form.Control onChange={this.updateState.bind(this)} as="select" defaultValue="" required>
                                                    <option disabled value="">State/Territory</option>
                                                    <option value="Johor">Johor</option>
                                                    <option value="Kedah">Kedah</option>
                                                    <option value="Kelantan">Kelantan</option>
                                                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                                                    <option value="Labuan">Labuan</option>
                                                    <option value="Malacca">Malacca</option>
                                                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                                                    <option value="Pahang">Pahang</option>
                                                    <option value="Penang">Penang</option>
                                                    <option value="Perak">Perak</option>
                                                    <option value="Perlis">Perlis</option>
                                                    <option value="Putrajaya">Putrajaya</option>
                                                    <option value="Sabah">Sabah</option>
                                                    <option value="Sarawak">Sarawak</option>
                                                    <option value="Selangor">Selangor</option>
                                                    <option value="Terengganu">Terengganu</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId="country">
                                                <Form.Label>Country</Form.Label> 
                                                <Form.Control onChange={this.updateCountry.bind(this)} as="select" defaultValue="Malaysia" required>
                                                    <option value="Malaysia">Malaysia</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col>
                                            <Form.Group className="mb-3" controlId="phone">
                                                <Form.Label>Phone</Form.Label> 
                                                <Form.Control onChange={this.updatePhone.bind(this)} type="tel" minLength="10" maxLength="10" defaultValue={this.state.customer.phone} required>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="my-auto">
                                            <Link className="checkoutLinks" to="/NLP_Store/public/customer/cart">{"< Return to cart"}</Link>
                                        </Col>
                                        <Col className=" d-flex justify-content-end">
                                            <Button type="submit" >Proceed to payment</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                        <Card style={this.state.showPaymentConfirmation?{}:{display:"none"}}>
                            <Card.Body>
                                <h5 className="mb-3">Details</h5>
                                <Row >
                                    <Col xs={3}>
                                        <small>Contact</small>
                                    </Col>
                                    <Col>
                                        <small>{this.state.shippingForm.phone}</small>
                                    </Col>
                                    <Col xs={2} className=" d-flex justify-content-end">
                                        <Link className="checkoutLinks" onClick={()=>this.showShipping()}><small>Change</small></Link>
                                    </Col>
                                </Row>
                                <Row className="mb-5">
                                    <Col xs={3}>
                                        <small>Ship To</small>
                                    </Col>
                                    <Col>
                                        <small>{this.state.shippingForm.address+", "+this.state.shippingForm.postcode+" "+this.state.shippingForm.city+", "+this.state.shippingForm.state+", "+this.state.shippingForm.country}</small>
                                    </Col>
                                    <Col xs={2} className=" d-flex justify-content-end">
                                        <Link className="checkoutLinks" onClick={()=>this.showShipping()}><small>Change</small></Link>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col><h5>Payment</h5></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <PayPalScriptProvider options={{'locale':"en_MY",'currency':"MYR","client-id":"AUTHKHhq4hEszGzAtMTXaA44q3byjL1y3NG_JSRJn4nRoycmBUO1W8H19Ke5vVBpphmqco9I7OS0I2GH"}}>
                                            <PayPalButtons style={{layout:"vertical"}} createOrder={(data,actions)=>{
                                                return actions.order.create({
                                                    purchase_units:[
                                                        {
                                                            amount:{
                                                                value:parseFloat(this.state.totalPrice+this.state.taxAmount).toFixed(2),
                                                            },
                                                        },
                                                    ],
                                                    application_context:{
                                                        shipping_preference:'NO_SHIPPING'
                                                    }
                                                });
                                            }} onApprove={(data,actions)=>{
                                                this.submitOrder()
                                            }}></PayPalButtons>
                                        </PayPalScriptProvider>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col><hr></hr></Col>
                                </Row>
                                <Row>
                                    <Col><div className='d-flex justify-content-center'><small>We accept</small></div></Col>
                                </Row>
                                <Row ><Col><div className="d-flex justify-content-center "><FontAwesomeIcon className="creditCardIcons fa-2x" icon={Brand.faCcVisa}></FontAwesomeIcon><FontAwesomeIcon className="creditCardIcons fa-2x" icon={Brand.faCcMastercard}></FontAwesomeIcon><FontAwesomeIcon className="creditCardIcons fa-2x" icon={Brand.faCcPaypal}></FontAwesomeIcon>
                                    <FontAwesomeIcon className="creditCardIcons fa-2x" icon={Brand.faCcDinersClub}></FontAwesomeIcon><FontAwesomeIcon className="creditCardIcons fa-2x" icon={Brand.faCcDiscover}></FontAwesomeIcon><FontAwesomeIcon className="creditCardIcons fa-2x" icon={Brand.faCcJcb}></FontAwesomeIcon></div></Col></Row>
                                
                            </Card.Body>
                        </Card>
                        <Card style={this.state.showOrderSuccess?{}:{display:"none"}}>
                            <Card.Body>
                                <Row><Col className="mt-3 d-flex justify-content-center"><Image  style={{maxWidth:"50%"}} src="/NLP_Store/public/Image/order_success.gif"></Image></Col></Row>
                                <Row><Col className="d-flex justify-content-center mb-5"><figcaption className="text-center font-weight-bold">Order placed successfully!</figcaption></Col></Row>
                                <Row><Col><div className="d-flex justify-content-center mb-3"><Button href="/NLP_Store/public/customer/index">Return to Home Page</Button></div></Col></Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="mt-5 mb-3" md={4}>
                        <Card>
                            <Card.Body>
                                {this.state.cart.map((data,i)=>{
                                    return(
                                        <>
                                        <Row>
                                            <Col xs={3}>
                                                <Image style={{border:"1px solid grey",borderRadius:"5px",position:"relative"}} src={data.product_info.product_image} fluid></Image>
                                                <Badge className="bg-secondary" style={{borderRadius:"10px",position:"absolute",color:"white",right:"6px",top:"-8px",textAlign:"center"}}><small style={{padding:"3px"}}>{data.quantity}</small></Badge>
                                            </Col>
                                            <Col className="my-auto">
                                                <Row>
                                                    <Col>
                                                        <small>{data.product_info.product_name}</small>
                                                    </Col>
                                                    <Col className="my-auto">
                                                        <small className=" d-flex justify-content-end">RM {parseFloat(parseFloat(data.price)*parseInt(data.quantity)).toFixed(2)}</small>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            
                                        </Row>
                                        <Row><Col><hr></hr></Col></Row>
                                        </>
                                    )
                                })}
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <small>Subtotal</small>
                                            </Col>
                                            <Col className="my-auto">
                                                <small className=" d-flex justify-content-end">RM {parseFloat(this.state.totalPrice).toFixed(2)}</small>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <small>Shipping</small>
                                            </Col>
                                            <Col className="my-auto">
                                                <small className=" d-flex justify-content-end">FREE</small>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <small>Tax (10%)</small>
                                            </Col>
                                            <Col className="my-auto">
                                                <small className=" d-flex justify-content-end">RM {parseFloat(this.state.taxAmount).toFixed(2)}</small>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col><hr></hr></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <small>Total</small>
                                    </Col>  
                                    <Col className="my-auto">
                                        <b className=" d-flex justify-content-end">RM {parseFloat(this.state.totalPrice+this.state.taxAmount).toFixed(2)}</b>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        
                    </Col>

                </Row>
                {this.redirect()}
                <Row>
                   <StoreFooter></StoreFooter> 
                </Row>
                
                
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
    totalPrice(){
        var temp=0;
        for(var i=0;i<this.state.cart.length;i++){
            temp+=(parseFloat(this.state.cart[i].price)*parseInt(this.state.cart[i].quantity))
        }
        this.setState({totalPrice:temp},()=>this.setState({taxAmount:parseFloat(this.state.totalPrice)*0.1}))
    }
    submitShipping(event){
        event.preventDefault();
        this.setState({showShippingForm:false,showPaymentConfirmation:true})
    }
    updatefname(event){
        this.state.shippingForm.fname=event.target.value;
    }
    updatelname(event){
        this.state.shippingForm.lname=event.target.value;
    }
    updateAddress(event){
        this.state.shippingForm.address=event.target.value;
    }
    updateCity(event){
        this.state.shippingForm.city=event.target.value;
    }
    updatePostcode(event){
        this.state.shippingForm.postcode=event.target.value;
    }
    updateCity(event){
        this.state.shippingForm.city=event.target.value;
    }
    updateState(event){
        this.state.shippingForm.state=event.target.value;
    }
    updateCountry(event){
        this.state.shippingForm.country=event.target.value;
    }
    updatePhone(event){
        this.state.shippingForm.phone=event.target.value;
    }
    showShipping(){
        this.setState({showShippingForm:true,showPaymentConfirmation:false})
    }
    submitOrder(){
        var formdata=new FormData()
        formdata.append("address",this.state.shippingForm.address+", "+this.state.shippingForm.postcode+" "+this.state.shippingForm.city+", "+this.state.shippingForm.state+", "+this.state.shippingForm.country)
        formdata.append("phone",this.state.shippingForm.phone)
        formdata.append("f_name",this.state.shippingForm.fname)
        formdata.append("l_name",this.state.shippingForm.lname)
        formdata.append('total_price',parseFloat(this.state.totalPrice+this.state.taxAmount).toFixed(2))
        formdata.append('cart',JSON.stringify(this.state.cart))
        axios.post("/NLP_Store/public/api/customer/addToOrder",formdata).then(response=>{
            if(response.data.success){
                this.setState({showOrderSuccess:true,showPaymentConfirmation:false})
            }
            else{
                console.log(response)
            }
        }).catch(error=>{
            console.log(error)
        })
    }
}