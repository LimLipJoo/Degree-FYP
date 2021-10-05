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

export default class Store extends Component{
    constructor(){
        super();
        this.state={
            //banner states
            bannersList:[],

            //Product states
            newProductsList:[],
            productsByCategory:[],

            //category states
            categoryList:[],

            popularProducts:[],
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/customer/getBanners").then(response=>{
            var temp;
            temp=response.data.banners
            for(var i=0;i<response.data.banners.length;i++){
                temp[i].banner_image=response.data.banners[i].banner_image.replace("..","/NLP_Store")
            }
            this.setState({bannersList:temp},()=>console.log(this.state.bannersList))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/customer/getNewProducts").then(response=>{
            var temp;
            temp=response.data.newProducts
            for(var i=0;i<response.data.newProducts.length;i++){
                temp[i].product_image=response.data.newProducts[i].product_image.replace("..","/NLP_Store")
            }
            this.setState({newProductsList:temp},()=>console.log(this.state.newProductsList))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/customer/getProductCategory").then(response=>{
            var temp;
            temp=response.data.categories;
            for(var i=0;i<response.data.categories.length;i++){
                for(var x=0;x<temp[i].products.length;x++){
                    temp[i].products[x].product_image=temp[i].products[x].product_image.replace("..","/NLP_Store")
                }
            }
            this.setState({categoryList:temp},()=>console.log(response.data.categories))
            
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/customer/getPopularProducts").then(response=>{
            var temp;
            temp=response.data.products;
            for(var i=0;i<response.data.products.length;i++){
                    temp[i].product_image=temp[i].product_image.replace("..","/NLP_Store")
            }
            this.setState({popularProducts:temp})
        }).catch(error=>{
            console.log(error)
        })
    }
    render(){
        return(
            <Container fluid  style={{height:"100%"}}>
                <StoreNav></StoreNav>
                <Row>
                    <Carousel variant="dark">
                                {this.state.bannersList.map((data,i)=>{
                                    return(
                                        <Carousel.Item style={{width:"100vw",height:"60vh"}}>
                                        <a href={data.banner_link}><Image  fluid  className='d-block w-100 h-100' src={data.banner_image}></Image></a>
                                        <Carousel.Caption>
                                            <h4>{data.banner_title}</h4>
                                            <p style={{color:"white"}}>{data.banner_description}</p>
                                        </Carousel.Caption>
                                        </Carousel.Item>
                                    )
                                })}
                    </Carousel>
                </Row>
                
                <Row>
                    <Col>
                        
                        <Row className="mt-5 mb-3">
                            <Col style={{marginLeft:"2vw",marginRight:"2vw"}}>
                                <Row><Col><h5>Popular Products</h5></Col><Col>{this.state.popularProducts.length>4?<Link to={"/NLP_Store/public/customer/category/popular"} className="d-flex justify-content-end">See More</Link>:""}</Col></Row>
                                <Row>
                                    {this.state.popularProducts.map((data,i)=>{
                                        if(i<4){
                                            return(
                                             <Col className="mb-5 col-sm-4" md={3}>
                                                 <Card>
                                                     <Card.Img style={{minHeight:"40vh",maxHeight:"40vh"}} fluid variant='top' src={data.product_image}></Card.Img>
                                                     <Card.Body>
                                                         <Card.Title>{data.product_name}</Card.Title>
                                                         <Card.Text>RM {data.product_price}+</Card.Text>
                                                         <Button variant='primary' style={{width:"100%"}} href={"/NLP_Store/public/customer/product/"+data.product_id}>Purchase</Button>
                                                     </Card.Body>
                                                 </Card>
                                             </Col>
                                             )    
                                         }
                                    })}
                                </Row>
                                <Row><Col><h5>New Products</h5></Col><Col>{this.state.newProductsList.length>4?<Link to={"/NLP_Store/public/customer/category/new"} className="d-flex justify-content-end">See More</Link>:""}</Col></Row>
                                <Row className="mt-3">
                                    {this.state.newProductsList.map((data,i)=>{
                                        if(i<4){
                                           return(
                                            <Col className="mb-5 col-sm-4" md={3}>
                                                <Card>
                                                    <Card.Img style={{minHeight:"40vh",maxHeight:"40vh"}} fluid variant='top' src={data.product_image}></Card.Img>
                                                    <Card.Body>
                                                        <Card.Title>{data.product_name}</Card.Title>
                                                        <Card.Text>RM {data.product_price}+</Card.Text>
                                                        <Button variant='primary' style={{width:"100%"}} href={"/NLP_Store/public/customer/product/"+data.product_id}>Purchase</Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            )    
                                        }
                                        
                                    })}
                                </Row>
                                {this.state.categoryList.map((data,i)=>{
                                    if(data.products.length!=0){
                                        return(  
                                            <div>
                                                <Row><Col className="d-flex align-item-center"><h5>{data.category_name}</h5>{data.count>4?<Link to={"/NLP_Store/public/customer/category/"+data.category_id} className="ml-auto">See More</Link>:""}</Col></Row>
                                                <Row> 
                                                {data.products.map((data,i)=>{
                                                    return(
                                                    
                                                        <Col className="mb-3 col-sm-4" md={3}>
                                                            <Card>
                                                                <Card.Img style={{minHeight:"40vh",maxHeight:"30vh"}} fluid variant='top' src={data.product_image}></Card.Img>
                                                                <Card.Body>
                                                                    <Card.Title>{data.product_name}</Card.Title>
                                                                    <Card.Text>RM {data.product_price}+</Card.Text>
                                                                    <Button variant='primary' style={{width:"100%"}} href={"/NLP_Store/public/customer/product/"+data.product_id}>Purchase</Button>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    
                                                    )
                                                })}
                                                </Row>
                                            </div>
                                        
                                        ) 
                                    }
                                    
                                        
                                    
                                })}
                            </Col>
                        </Row>
                    </Col>
                    
                    <StoreFooter></StoreFooter>
                </Row>
                
            </Container>
        )
    }
}