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
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

export default class Orders extends Component{
    constructor(){
        super();
        this.state={
            changeSize:false,
            orders:[],
            tableSize:5,
            activePage:1,
            numItemInTable:0,
            totalPaginationButton:0,
        }
    }
    componentDidMount(){
        window.addEventListener("resize",this.resize.bind(this))
        this.resize()
        this.getOrders()
    }
    render(){
        return(
            <Container fluid  style={{margin:0,padding:0,height:"100%"}}>
            <Row style={{height:"100%"}}>
                <IsLogged/>
                <SideBar location={location.pathname} ></SideBar>
                <Col id="content" className="content">
                    <Card>
                        <Card.Body>
                            <h5>Orders</h5>
                            <small classname="mb-3">Orders made through NLP Store</small>
                            <Table className="mt-3" responsive striped bordered hover id='orderTable'>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Shipping Address</th>
                                        <th>Total Price (RM) </th>
                                        <th>Status</th>
                                        <th>Order Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.limitTableContent(this.state.orders,this.state.activePage,this.state.tableSize).map((data)=>{
                                        return(
                                            <tr>
                                                <td>{data.order_id}</td>
                                                <td>{data.f_name+" "+data.l_name}</td>
                                                <td>{data.phone}</td>
                                                <td>{data.address}</td>
                                                <td>{data.total_price}</td>
                                                <td>{data.status}</td>
                                                <td>{this.formatDate(data.order_date)}</td>
                                                <td><Button variant="primary" style={{margin:"2%",minWidth:"3vw",maxWidth:"3vw"}} href={"/NLP_Store/public/admin/orderItems/"+data.order_id} ><FontAwesomeIcon icon={Icons.faInfo}></FontAwesomeIcon></Button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <Pagination>{this.setTablePagination()}</Pagination>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
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
    getOrders(){
        axios.get("/NLP_Store/public/api/admin/getAllOrders").then(response=>{
            this.setState({orders:response.data.orders},()=>this.setState({numItemInTable:this.state.orders.length}))
        }).catch(error=>{
            console.log(error)
        })
    }
    formatDate(date){
        var formattedDate=new Date(date);
        return formattedDate.toDateString()
    }
    range(start, end){
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    }
    countPageRange(total,currentPage){
        const siblingCount=1
        const totalPageCount=Math.ceil(total/this.state.tableSize)
        const totalPageButton=siblingCount+5;
        if(totalPageButton>=totalPageCount){
            return this.range(1,totalPageCount)
            
        }
        const leftSiblingIndex=Math.max(currentPage-siblingCount,1);
        const rightSiblingIndex=Math.min(currentPage+siblingCount,totalPageCount)

        const shouldShowLeftDots=leftSiblingIndex>2;
        const shouldShowRightDots=rightSiblingIndex<totalPageCount-2;

        const firstPageIndex=1;
        const lastPageIndex=totalPageCount

        if(!shouldShowLeftDots && shouldShowRightDots){
            let leftItemCount=3+2*siblingCount
            let leftRange=this.range(1,leftItemCount)
            return  [...leftRange,"dots",totalPageCount]
        }
        
        if(shouldShowLeftDots && ! shouldShowRightDots){
            let rightItemCount=3+2*siblingCount
            let rightRange=this.range(totalPageCount-rightItemCount+1,totalPageCount)
            return [firstPageIndex,"dots",...rightRange]
        }

        if(shouldShowLeftDots && shouldShowRightDots){
            let middleRange=this.range(leftSiblingIndex,rightSiblingIndex)
            return [firstPageIndex,"dots",...middleRange,"dots",lastPageIndex]
        }
    }
    limitTableContent(data,currentPage,pageSize){
        const firstPageIndex=(currentPage -1)*pageSize
        const lastPageIndex=firstPageIndex+pageSize
        return data.slice(firstPageIndex,lastPageIndex)
    }
    changeNumPagination(){
        var temp=this.state.totalPaginationButton
        temp=Math.ceil(this.state.numItemInTable/this.state.productTableSize)
        this.setState({totalPaginationButton:temp},()=>{if(this.state.totalPaginationButton<this.state.activePage&&this.state.totalPaginationButton!=0){this.setState({activePage:temp})}})
            
    }
    setTablePagination(){
        var pages=this.countPageRange(this.state.numItemInTable,this.state.activePage)
      return  pages.map((data)=>{
          if(data=="dots"){
            return(
                <Pagination.Ellipsis></Pagination.Ellipsis>
            )
          }
          else{

          
            return(<Pagination.Item key={data} active={data===this.state.activePage} 
            onClick={()=>this.setState({activePage:data})}>
                {data}
            </Pagination.Item>
            )
           }
        })
    }
}