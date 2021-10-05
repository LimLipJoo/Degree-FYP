import React, { Component, useState } from 'react';
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
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { withRouter } from "react-router";
import StoreNav from './Nav';
import Carousel from 'react-bootstrap/Carousel';
import StoreFooter from './StoreFooter';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom'
import { Tabs,Tab,FormControl, Modal, Table, NavItem, Image } from 'react-bootstrap';
import Style from './Styles/Store.css';

export default class Product extends Component{
    constructor(){
        super();
        this.state={
            productInfo:[],
            specs:[],
            colours:[],
            totalPrice:0,
            selectedColour:"",
            buttonDisabled:true,
            selectedSpecs:[],
            isCustomerLoggedIn:false,
            showAlertSuccess:false,
            showAlertFail:false,
            message:"",
            wishlisted:false,
        }
        this.loginHandler=""
    }
    
    componentDidMount(){
        axios.get("/NLP_Store/public/api/customer/getProduct/"+this.props.match.params.id).then(response=>{
            var temp=response.data.product
            temp.product_image=temp.product_image.replace("..","/NLP_Store")
            this.setState({productInfo:temp},()=>this.setState({totalPrice:this.state.productInfo.product_price}))
            this.setState({specs:response.data.spec_type},()=>this.trimSpecs())
            this.setState({colours:response.data.colour},()=>console.log(this.state.specs))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/customer/isCustomerLoggedIn").then(response=>{
            if(response.data.isCustomerLoggedIn){
              this.setState({isCustomerLoggedIn:true},()=>this.isWishlisted())
            }
          }).catch(error=>{
            console.log(error)
        })
        
    }

    render(){
        return(
            <Container fluid  style={{height:"100%"}} style={{backgroundColor:"white"}}>
                 <StoreNav login={login => this.loginHandler=login} isLogged={islogged => this.setState({isCustomerLoggedIn:islogged},()=>this.isWishlisted())}></StoreNav>
                 <Row className="mt-5 ">
                     <Col  className="mt-4 mb-5" style={{marginLeft:"10%"}}>
                        <Image fluid src={this.state.productInfo.product_image} style={{display:"block",width:"100%",height:"auto"}} ></Image>
                     </Col>
                     <Col  className="mt-4 mb-5" style={{marginRight:"15%"}}>
                        <h1 className="mt-5 productTitleBig">{this.state.productInfo.product_name}</h1>
                        <h3 className=" productTitleSmall">{this.state.productInfo.product_name}</h3>
                        <span  >RM {this.state.totalPrice}</span><br></br>
                        <Alert variant="success" onClose={()=>this.setState({showAlertSuccess:false})} show={this.state.showAlertSuccess}  dismissible>{this.state.message}</Alert>
                        <Alert variant="danger" onClose={()=>this.setState({showAlertFail:false})} show={this.state.showAlertFail}  dismissible>{this.state.message}</Alert>
                            <Form>
                            <h6 className="mt-5 mb-3">Colours</h6>
                            <Row className="mb-3"style={this.state.specs.length==0?{}:{borderBottom:"1px solid grey"}}>
                            
                            {this.state.colours.map((data,i)=>{
                                return (
                                    <Col md={6} className="mb-3">
                                        <Card id={"colour-"+i} as="a" onClick={()=>this.changeSelectedColour(data.colour_id,"colour-"+i)} style={{ cursor: "pointer" }}>
                                            <Card.Body className=" align-text-bottom text-center">
                                                <Row className="mx-auto justify-content-center"><div class="colourDot" style={{backgroundColor:data.colour_code}}></div></Row>
                                                <Row className="justify-content-center mt-1"><small >{data.name}</small></Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )
                            })}
                            </Row>
                            {this.state.specs.map((data,i)=>{
                                if(data.spec.length!=0){
                                    return(
                                        <>
                                        <h6>{data.product_specification_type}</h6>
                                        <Row className="mb-3" style={i==(this.state.specs.length-1)?{}:{borderBottom:"1px solid gray"}}>
                                        {data.spec.map((spec,i)=>{
                                            return(
                                              <Col className="mb-3">
                                                <Card>
                                                    <Card.Body><Row><Col><Form.Check onChange={()=>this.changeSpecs(data.product_specification_type,spec.specification_name,spec.specification_price)} name={data.product_specification_type} type="radio" label={spec.specification_name} value={spec.specification_id}></Form.Check></Col><Col><small className='d-flex justify-content-end my-auto'>+ RM {spec.specification_price}</small></Col></Row></Card.Body>
                                                </Card>
                                            </Col>  
                                            )
                                            
                                        })}
                                        </Row>
                                        </>
                                    )
                                }
                            })}
                            <Row>
                            <Col><Button disabled={this.state.buttonDisabled} onClick={()=>this.addToCart()} style={{width:"90%",marginRight:"1vw"}}>Add to Cart</Button><Link onClick={()=>this.toggleWishlist()} style={this.state.isCustomerLoggedIn?this.state.wishlisted?{color:"crimson"}:{color:"grey"}:{color:"grey"}}><FontAwesomeIcon icon={Icons.faHeart}></FontAwesomeIcon></Link></Col>
                            
                            </Row>
                            </Form>
                     </Col>
                     <StoreFooter></StoreFooter>
                </Row>
                
            </Container>
            
        )
    }
    changeSelectedColour(colour,card){
        if(this.state.selectedColour!=colour){
            this.setState({selectedColour:colour},()=>this.enableButton())
            var elements=document.getElementsByClassName("activeCard")
            for(var i=0;i<elements.length;i++){
                elements[i].classList.remove('activeCard')
            }
            var card=document.getElementById(card)
            card.classList.toggle("activeCard") 
        }
        
    }
    trimSpecs(){
        for(var i=0;i<this.state.specs.length;i++){
            if(this.state.specs[i].spec.length==0){
                this.state.specs.splice(i)
            }
        }
        for(var i=0;i<this.state.specs.length;i++){
            this.state.selectedSpecs[i]={spec_type:this.state.specs[i].product_specification_type,spec_name:undefined,spec_price:0}
        }
        console.log(this.state.selectedSpecs)
    }
    changeSpecs(specType,spec,price){
        for(var i=0;i<this.state.selectedSpecs.length;i++){
            if(this.state.selectedSpecs[i].spec_type==specType){
                this.state.selectedSpecs[i].spec_name=spec
                this.state.selectedSpecs[i].spec_price=price
            }
        }
        
        console.log(this.state.selectedSpecs)
        this.changeTotalPrice()
        this.enableButton()
    }
    changeTotalPrice(){
        var temp=parseFloat(this.state.productInfo.product_price);
        for(var i=0;i<this.state.selectedSpecs.length;i++){
            temp+=parseFloat(this.state.selectedSpecs[i].spec_price)
            console.log(temp)
        }
        this.setState({totalPrice:temp},()=>console.log(this.state.totalPrice))
    }
    enableButton(){
        var disable=false;
        if(this.state.selectedColour==""){
            disable=true;
        }
        for(var i=0;i<this.state.selectedSpecs.length;i++){
            if(this.state.selectedSpecs[i].spec_name==undefined){
                disable=true;
            }
        }
        if(this.state.productInfo.product_quantity==0){
            disable=true;
        }
        this.setState({buttonDisabled:disable})
    }
    addToCart(){
        axios.get("/NLP_Store/public/api/customer/isCustomerLoggedIn").then(response=>{
            if(response.data.isCustomerLoggedIn){
              this.setState({isCustomerLoggedIn:true})
                var formdata=new FormData();
                formdata.append("price",this.state.totalPrice)
                formdata.append("product_id",this.state.productInfo.product_id)
                formdata.append("quantity",1)
                formdata.append("colour",this.state.selectedColour)
                formdata.append("specification",JSON.stringify(this.state.selectedSpecs))
               axios.post("/NLP_Store/public/api/customer/addToCart",formdata).then(response=>{
                if(response.data.success){
                    this.setState({showAlertSuccess:true,message:response.data.message})
                }
                else{
                    this.setState({showAlertFail:true,message:response.data.message})
                }
               }).catch(error=>{
                   console.log(error)
               })
            }
            else{
                this.loginHandler();
               }
          }).catch(error=>{
            console.log(error)
        })
        
        
    }
    isWishlisted(){
        if(this.state.isCustomerLoggedIn){
            axios.get("/NLP_Store/public/api/customer/findProductInWishlist/"+this.props.match.params.id).then(response=>{
                this.setState({wishlisted:response.data.wishlisted})
                console.log(response)
            }).catch(error=>{
                console.log(error)
            })
        }
        else{
            this.setState({wishlisted:false})
        }
        
    }
    toggleWishlist(){
        if(this.state.isCustomerLoggedIn){
            var formdata=new FormData()
            formdata.append("product_id",this.state.productInfo.product_id)
            if(this.state.wishlisted){
                
                axios.post("/NLP_Store/public/api/customer/removeFromWishlist",formdata).then(response=>{
                    this.setState({wishlisted:false})
                   }).catch(error=>{
                       console.log(error)
                   }) 
            }
            else{
               axios.post("/NLP_Store/public/api/customer/addToWishlist",formdata).then(response=>{
                this.setState({wishlisted:true})
               }).catch(error=>{
                   console.log(error)
               }) 
            }
            
        }
        else{
            this.loginHandler();
        }
    }
}