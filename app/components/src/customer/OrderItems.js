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
import { Table, Badge } from 'react-bootstrap';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class OrderItems extends Component{
    constructor(){
        super();
        this.state={
            orderItems:[],
            order:[],
            totalPrice:0,
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/customer/getOrderItems/"+this.props.match.params.id).then(response=>{
            var temp=response.data.orderItems
            var total=0;
            for(var i=0;i<temp.length;i++){
                temp[i].specification=JSON.parse(temp[i].specification)
                total+=parseFloat(parseFloat(temp[i].product_price).toFixed(2)*temp[i].quantity).toFixed(2)
            }
            this.setState({orderItems:temp,totalPrice:total},()=>console.log(this.state.orderItems))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/customer/getOrder/"+this.props.match.params.id).then(response=>{
            this.setState({order:response.data.order},()=>console.log(this.state.order))
        }).catch(error=>{
            console.log(error)
        })
    }
    render(){
        return(
            <Container fluid  style={{height:"100%"}} >
                <StoreNav isLogged={islogged =>this.setState({isCustomerLoggedIn:islogged})}></StoreNav>
                <Row className="mt-5 mb-5" style={{margin:"10%"}}>
                <Col className="mt-5" style={{minHeight:"70vh"}}>
                    <Card>
                        <Card.Body>
                            <h5 className="mb-3">Items</h5>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Colour</th>
                                        <th>Specification</th>
                                        <th>Price (RM)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.orderItems.map((data,i)=>{
                                        return(
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>{data.product_name}</td>
                                                <td>{data.quantity}</td>
                                                <td>{data.colour_name}</td>
                                                <td>{data.specification.map((data)=>{
                                                    return(
                                                        <span>
                                                            {data.spec_type} : {data.spec_name} <Badge className="bg-primary" style={{color:"white"}}><small >+ RM{data.spec_price}</small></Badge><br></br>
                                                        </span>
                                                    )
                                                })}</td>
                                                <td>{data.product_price}</td>
                                            </tr>
                                        )
                                    })}
                                    <tr style={{padding:0}}>
                                        <td colSpan="5" >Subtotal</td>
                                        <td>{parseFloat(this.state.totalPrice).toFixed(2)}</td>
                                    </tr>
                                    <tr style={{padding:0}}>
                                        <td colSpan="5" style={{border:0,paddingTop:0}} >Tax (10%)</td>
                                        <td style={{border:0,paddingTop:0}}>{parseFloat(this.state.totalPrice*0.1).toFixed(2)}</td>
                                    </tr>
                                    <tr style={{padding:0}}>
                                        <td colSpan="5" style={{border:0,paddingTop:0}} ><b>Total Price (RM)</b></td>
                                        <td style={{border:0,paddingTop:0}}><b>{parseFloat(this.state.order.total_price).toFixed(2)}</b></td>
                                    </tr>
                                </tbody>
                            </Table>
                            
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mt-5" style={{minHeight:"70vh"}}>
                    <Card>
                        <Card.Body>
                            <h5 className="mb-3">Order Info</h5>
                            <Row className="mb-3">
                                <Col>
                                    Date ordered
                                </Col>
                                <Col>
                                    <span >{this.formatDate(this.state.order.order_date)}</span>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    Shipping Address
                                </Col>
                                <Col>
                                    <span >{this.state.order.address}</span>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    Status
                                </Col>
                                <Col>
                                    <span ><b>{this.state.order.status}</b></span>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                </Row>
                <Row>
                    <StoreFooter></StoreFooter>
                </Row>
            </Container>
        )
    }
    formatDate(date){
        var formattedDate=new Date(date);
        return formattedDate.toDateString()
    }
    redirect(){
        if(!this.state.isCustomerLoggedIn){
            return <Redirect to='/NLP_Store/public/customer/index'/>
        }
    }
}