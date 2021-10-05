import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import StoreNav from './Nav';
import StoreFooter from './StoreFooter';
import { Image } from 'react-bootstrap';
import Style from './Styles/Store.css';

export default class Category extends Component{
    constructor(){
        super();
        this.state={
            products:[],
        }
    }
    componentDidMount(){
        if(this.props.match.params.id=="new"){
            this.getNewProducts()
        }
        else if(this.props.match.params.id=="popular"){
            this.getPopularProducts()
        }
        else{
            this.getProductsByCategory()
        }
    }
    render(){
        return(
            <Container fluid  style={{height:"100%"}} >
                <StoreNav></StoreNav>
                <Row className="mt-5 mb-5" style={{margin:"6%"}}>
                    <Col className="mt-5">
                        <h5 className="mb-5 ">Search Results</h5>
                        <Row style={{minHeight:"70vh"}}>
                            {this.state.products.map((data,i)=>{
                                return(
                                <Col md={3} className="mb-3">
                                    <Card>
                                        <Card.Img style={{minHeight:"40vh",maxHeight:"40vh"}} variant="top" src={data.product_image}></Card.Img>
                                        <Card.Body>
                                            <Card.Title>{data.product_name}</Card.Title>
                                            <Card.Text>RM {data.product_price}+</Card.Text>
                                            <Button variant='primary' style={{width:"100%"}} href={"/NLP_Store/public/customer/product/"+data.product_id}>Purchase</Button>
                                        </Card.Body>
                                    </Card>
                                </Col>   
                                )
                                

                            })}
                            <Col style={this.state.products.length==0?{}:{display:"none"}}>
                                <Row>
                                    <Col className="d-flex justify-content-center">
                                        <Image style={{width:"20%",height:"auto"}}  src="/NLP_Store/public/Image/no_search_results.png"></Image>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-center">
                                        <span className="text-center mt-3">No products in this category.</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                   <StoreFooter></StoreFooter> 
                </Row>
                
            </Container>
        )
    }
    getProductsByCategory(){
        axios.get("/NLP_Store/public/api/customer/getProductsByCategory/"+this.props.match.params.id).then(response=>{
            var temp=response.data.products;
            for(var i=0;i<temp.length;i++){
                temp[i].product_image=temp[i].product_image.replace("..","/NLP_Store")
            }
            this.setState({products:temp},()=>console.log(this.state.products))
        }).catch(error=>{
            console.log(error)
        })
    }
    getNewProducts(){
        axios.get("/NLP_Store/public/api/customer/getNewProducts").then(response=>{
            var temp=response.data.newProducts
            for(var i=0;i<temp.length;i++){
                temp[i].product_image=temp[i].product_image.replace("..","/NLP_Store")
            }
            this.setState({products:temp},()=>console.log(this.state.products))
        }).catch(error=>{
            console.log(error)
        })
    }
    getPopularProducts(){
        axios.get("/NLP_Store/public/api/customer/getPopularProducts").then(response=>{
            var temp=response.data.newProducts
            for(var i=0;i<temp.length;i++){
                temp[i].product_image=temp[i].product_image.replace("..","/NLP_Store")
            }
            this.setState({products:temp},()=>console.log(this.state.products))
        }).catch(error=>{
            console.log(error)
        })
    }
}