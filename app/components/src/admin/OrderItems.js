import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Pagination from 'react-bootstrap/Pagination';
import Style from './Styles/Products.css';
import IsLogged from './IsLogged';
import SideBar from './SideBar';
import { Table,Badge,Modal,Form, Alert,Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

export default class OrderItems extends Component{
    constructor(){
        super();
        this.state={
            changeSize:false,
            orderItems:[],
            order:[],
            totalPrice:0,
            showEditStatus:false,
            success:false,
            message:"",
            showLoading:false,
        }
    }
    componentDidMount(){
        window.addEventListener("resize",this.resize.bind(this))
        this.resize()
        this.getOrder()
        this.getOrderItems()
    }
    render(){
        return(
            <Container fluid  style={{margin:0,padding:0,height:"100%"}}>
                <Row style={{height:"100%"}}>
                    <IsLogged/>
                    <SideBar location={location.pathname} ></SideBar>
                    <Col id="content" className="content">
                    <Alert variant="success" show={this.state.success} onClose={()=>this.setState({success:false})} dismissible>{this.state.message}</Alert>
                        <Row>
                        
                            <Col>
                                
                                <Card className="mb-3">
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
                            <Col md={4}>
                                <Card className="mb-3">
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
                                            <Col className="my-auto">
                                                Status <Button style={{color:"#007bff"}} variant="muted" onClick={()=>this.openEditStatus()}><FontAwesomeIcon icon={Icons.faPencilAlt}></FontAwesomeIcon></Button>
                                            </Col>
                                            <Col className="my-auto">
                                                <span ><b>{this.state.order.status}</b></span>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Modal
                show={this.state.showEditStatus}
                onHide={()=>this.closeEditStatus()}
                backdrop="static"
                keyboard={false}>
                    <Modal.Header className="modalHead">
                        <Modal.Title>Edit Status</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.editOrderStatus.bind(this)}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="editStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control onChange={this.handleStatus.bind(this)} as="select" defaultValue={this.state.order.status} required>
                                    <option value="PLACED">PLACED</option>
                                    <option value="IN TRANSIT">IN TRANSIT</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELED">CANCELED</option>
                                </Form.Control>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>this.closeEditStatus()}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal
                show={this.state.showLoading}
                onHide={()=>this.closeLoading()}
                backdrop="static"
                keyboard={false}
                centered
                >
                    <Modal.Body style={{textAlign:"center",paddingLeft:"5vw",paddingRight:"5vw",paddingTop:"5vh",paddingBottom:"5vh"}}>
                        <Spinner  variant="primary" animation="border"></Spinner>
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }
    resize(){
        if(window.innerWidth<994){
            document.getElementById("content").classList.toggle("col");
            document.getElementById("content").classList.toggle("col-11");
            this.setState({changeSize:true})
        }
        else{
            if(this.state.changeSize && window.innerWidth>994){
                document.getElementById("content").classList.toggle("col");
                document.getElementById("content").classList.toggle("col-11");
                this.setState({changeSize:false})
            }
            
        }
    }
    getOrderItems(){
        axios.get("/NLP_Store/public/api/admin/getOrderItems/"+this.props.match.params.id).then(response=>{
            var temp=response.data.orderItems
            var total=0;
            for(var i=0;i<temp.length;i++){
                temp[i].specification=JSON.parse(temp[i].specification)
                total+=parseFloat(parseFloat(temp[i].product_price).toFixed(2)*temp[i].quantity).toFixed(2)
            }
            this.setState({orderItems:temp,totalPrice:total})
        }).catch(error=>{
            console.log(error)
        })
    }
    getOrder(){
        axios.get("/NLP_Store/public/api/admin/getOrder/"+this.props.match.params.id).then(response=>{
            this.setState({order:response.data.order})
        }).catch(error=>{
            console.log(error)
        })
    }
    formatDate(date){
        var formattedDate=new Date(date);
        return formattedDate.toDateString()
    }
    closeEditStatus(){
        this.setState({showEditStatus:false})
    }
    openEditStatus(){
        this.setState({showEditStatus:true})
    }
    editOrderStatus(event){
        event.preventDefault();
        var formdata=new FormData()
        formdata.append('id',this.state.order.order_id)
        formdata.append('status',this.state.order.status)
        axios.post("/NLP_Store/public/api/admin/updateOrderStatus",formdata).then(response=>{
            if(response.data.success){
                this.setState({success:true,message:response.data.message})
            }
            this.closeLoading()
        }).catch(error=>{
            console.log(error)
        })
        this.closeEditStatus()
        this.openLoading()
    }
    handleStatus(event){
        var temp=this.state.order
        temp.status=event.target.value
        this.setState({order:temp})
    }
    openLoading(){
        this.setState({showLoading:true})
    }
    closeLoading(){
        this.setState({showLoading:false})
    }
}