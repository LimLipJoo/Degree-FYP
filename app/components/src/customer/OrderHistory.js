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

export default class OrderHistory extends Component{
    constructor(){
        super();
        this.state={
            orders:[],
            isCustomerLoggedIn:true,
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/customer/getCustomerOrders").then(response=>{
            this.setState({orders:response.data.orders},console.log(this.state.orders))
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
                        <Card style={this.state.orders.length==0?{display:"none"}:{}}>
                            <Card.Body>
                                <h5 className="mb-3">Orders</h5>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Shipping Address</th>
                                            <th>Total Price (RM) </th>
                                            <th>Status</th>
                                            <th>Order Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.orders.map((data)=>{
                                            return(
                                                <tr>
                                                    <td><Button variant="muted" href={"/NLP_Store/public/customer/orderItem/"+data.order_id} style={{color:"#007bff"}}>{data.order_id}</Button></td>
                                                    <td>{data.address}</td>
                                                    <td>{data.total_price}</td>
                                                    <td>{data.status}</td>
                                                    <td>{this.formatDate(data.order_date)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                    
                                </Table>
                            </Card.Body>
                        </Card>
                        <Card style={this.state.orders.length==0?{}:{display:"none"}}>
                            <Card.Body>
                                <h5 className="mb-3">Orders</h5>
                                <Row>
                                    <Col className="d-flex justify-content-center">
                                        <Image style={{width:"20%",height:"auto"}}  src="/NLP_Store/public/Image/no_orders.png"></Image>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-center">
                                        <span className="text-center mt-3">No items in order history.</span>
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