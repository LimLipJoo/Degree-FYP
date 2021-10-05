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
import { Table } from 'react-bootstrap';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Wishlist extends Component{
    constructor(){
        super();
        this.state={
            products:[],
            isCustomerLoggedIn:true,
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/customer/getProductsInWishlist").then(response=>{
            if(response.data.products!=undefined){
                var temp=response.data.products;
                console.log(response)
                for(var i=0;i<temp.length;i++){
                    temp[i].product_image=temp[i].product_image.replace("..","/NLP_Store")
                }
                this.setState({products:temp},()=>console.log(this.state.products))
            }
            
        }).catch(error=>{
            console.log(error)
        })
    }
    render(){
        return(
            <Container fluid  style={{height:"100%"}} >
               <StoreNav isLogged={islogged =>this.setState({isCustomerLoggedIn:islogged})}></StoreNav>
               <Row  className="mt-5 mb-5" style={{margin:"10%"}}>
                   <Col className="mt-5" style={{minHeight:"70vh"}}>
                        <Card style={this.state.products.length==0?{display:"none"}:{}}>
                            <Card.Body>
                                <h5 className="mb-3">Wishlist</h5>
                                <Table responsive>
                                        <thead style={{textAlign:"center"}}>
                                            <tr>
                                                <th></th>
                                                <th>Product Name</th>
                                                <th>Product Price (RM)</th>
                                                <th>Product Availability</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody style={{textAlign:"center"}}>
                                        {this.state.products.map((data,i)=>{
                                    
                                            return(
                                                <tr className="my-auto">
                                                    <td className="align-middle">
                                                    <Button variant='muted' onClick={()=>this.removeFromWishlist(data.product_id,i)}><FontAwesomeIcon icon={Icons.faTrash}></FontAwesomeIcon></Button>
                                                    </td>
                                                    <td>
                                                        <Image style={{width:"50px",height:"auto",marginRight:"5px"}} src={data.product_image} fluid></Image>
                                                        {data.product_name}
                                                    </td>
                                                    <td className="align-middle"><span className="my-auto">{data.product_price}++</span></td>
                                                    <td className="align-middle"><span className="my-auto">{data.product_quantity==0?"Out of Stock":"In Stock"}</span></td>
                                                    <td className="align-middle"><Button href={"/NLP_Store/public/customer/product/"+data.product_id}>Purchase</Button>
                                                    
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                </Table>
                                
                            </Card.Body>
                        </Card>
                        <Card style={this.state.products.length==0?{}:{display:"none"}}>
                            <Card.Body>
                                <h5 className="mb-3">Wishlist</h5>
                                <Row>
                                    <Col className="d-flex justify-content-center">
                                        <Image style={{width:"20%",height:"auto"}}  src="/NLP_Store/public/Image/empty_wishlist.png"></Image>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-center">
                                        <span className="text-center mt-3">No items in wishlist.</span>
                                    </Col>
                                </Row>
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
    removeFromWishlist(id,i){
        var formdata=new FormData();
        formdata.append('product_id',id)
        axios.post("/NLP_Store/public/api/customer/removeFromWishlist",formdata).then(response=>{
            var temp=this.state.products
            temp.splice(i,1)
            this.setState({products:temp})
        }).catch(error=>{
            console.log(error)
        })
    }
    redirect(){
        if(!this.state.isCustomerLoggedIn){
            return <Redirect to='/NLP_Store/public/customer/index'/>
        }
    }
}