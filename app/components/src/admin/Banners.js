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
import { withRouter } from "react-router";
import Style from './Styles/Products.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom'
import IsLogged from './IsLogged';
import SideBar from './SideBar';
import { Tabs,Tab,FormControl, Modal, Table, NavItem } from 'react-bootstrap';

export default class Banners extends Component{
    constructor(){
        super();
        this.state={
            changeSize:false,
            showAddBannerModal:false,
            bannerList:[],
            showLoading:false,
            showConfirmDelete:false,
            showEditBannerModal:false,
            selectedDelete:[],
            tableSize:5,
            activePage:1,
            numItemInTable:0,
            totalPaginationButton:0,
            selectedEdit:[],
            message:"",
            success:false
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/admin/getBanners").then(response=>{
            this.setState({bannerList:response.data.banners},()=>this.setState({numItemInTable:this.state.bannerList.length}))
        }).catch(error=>{
            console.log(error)
        })
        window.addEventListener("resize",this.resize.bind(this))
        this.resize()
    }
    render(){
        return(
            <Container fluid  style={{margin:0,padding:0,height:"100%"}}>
                <Row style={{height:"100%"}}>
                    <IsLogged/>
                    <SideBar location={location.pathname} ></SideBar>
                    <Col id='content' className="content">
                        <Alert show={this.state.success} variant="success" dismissible onClose={()=>this.setState({success:false})}>{this.state.message}</Alert>
                        <Card>
                            <Card.Body>
                                <h5>Promotional Banners</h5>
                                <small>Banners displayed in store</small><br></br>
                                <Button className="mb-3" size="sm" variant="primary" onClick={()=>this.openAddBannerModal()} ><FontAwesomeIcon icon={Icons.faPlusCircle} style={{marginRight:"5px"}}></FontAwesomeIcon>New</Button>
                                <Table responsive striped bordered hover id='bannerTable'>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Link</th>
                                            <th>Action</th>   
                                        </tr>
                                        
                                    </thead>
                                    <tbody>
                                        {this.limitTableContent(this.state.bannerList,this.state.activePage,this.state.tableSize).map((data,i)=>{
                                            return(
                                                <tr>
                                                    <td>{data.banner_id}</td>
                                                    <td>{data.banner_title}</td>
                                                    <td>{data.banner_description}</td>
                                                    <td>{data.status}</td>
                                                    <td>{data.banner_link}</td>
                                                    <td>
                                                        <Button style={{margin:"2%",minWidth:"3vw",maxWidth:"3vw"}} variant="info" onClick={()=>this.openEditBannerModal(data.banner_id,data.banner_title,data.banner_description,data.status,data.banner_link)}><FontAwesomeIcon icon={Icons.faWrench}></FontAwesomeIcon></Button>
                                                        <Button variant="secondary" style={{margin:"2%",minWidth:"3vw",maxWidth:"3vw"}} onClick={()=>this.openConfirmDelete(((this.state.activePage-1)*this.state.tableSize)+i,data.banner_id)} ><FontAwesomeIcon icon={Icons.faTrash}></FontAwesomeIcon></Button>
                                                    </td>
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
                <Modal
                show={this.state.showAddBannerModal}
                onHide={()=>this.closeAddBannerModal()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="modalHead">
                        <Modal.Title>New Banner</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.submitAddBannerModal.bind(this)}>
                        <Modal.Body>
                            
                                <Form.Group className="mb-3" controlId="addBannerTitle">
                                    <Form.Label>Banner Title</Form.Label>
                                    <Form.Control type='input' placeholder="Enter Banner Title" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="addBannerDescription">
                                    <Form.Label>Banner Description</Form.Label>
                                    <Form.Control type='input' placeholder="Enter Banner Description" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="addBannerLink">
                                    <Form.Label>Banner Link</Form.Label>
                                    <Form.Control type='input' placeholder="Enter Banner Link" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="addBannerStatus">
                                    <Form.Label>Banner Status</Form.Label>
                                    <Form.Control as="select" defaultValue="" required>
                                        <option value="" disabled>Choose a status</option>
                                        <option value="Enabled">Enabled</option>
                                        <option value="Disabled">Disabled</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="addBannerImage">
                                    <Form.Label>Banner Image</Form.Label>
                                    <Form.Control type='file' accept="image/png, image/jpeg" required></Form.Control>
                                </Form.Group>
                            
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>this.closeAddBannerModal()}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal
                show={this.state.showEditBannerModal}
                onHide={()=>this.closeEditBannerModal()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="modalHead">
                        <Modal.Title>Edit Banner</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.submitEditBannerModal.bind(this)}>
                        <Modal.Body>
                            
                                <Form.Group className="mb-3" controlId="editBannerTitle">
                                    <Form.Label>Banner Title</Form.Label>
                                    <Form.Control onChange={this.handleEditTitle.bind(this)} defaultValue={this.state.selectedEdit.banner_title} type='input' placeholder="Enter Banner Title" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editBannerDescription">
                                    <Form.Label>Banner Description</Form.Label>
                                    <Form.Control onChange={this.handleEditDescription.bind(this)} defaultValue={this.state.selectedEdit.banner_description} type='input' placeholder="Enter Banner Description" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editBannerLink">
                                    <Form.Label>Banner Link</Form.Label>
                                    <Form.Control onChange={this.handleEditLink.bind(this)} defaultValue={this.state.selectedEdit.banner_link} type='input' placeholder="Enter Banner Link" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editBannerStatus">
                                    <Form.Label>Banner Status</Form.Label>
                                    <Form.Control onChange={this.handleEditStatus.bind(this)} as="select" defaultValue={this.state.selectedEdit.banner_status} required>
                                        <option value="" disabled>Choose a status</option>
                                        <option value="Enabled">Enabled</option>
                                        <option value="Disabled">Disabled</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editBannerImage">
                                    <Form.Label>Banner Image</Form.Label>
                                    <Form.Control type='file' accept="image/png, image/jpeg"></Form.Control>
                                </Form.Group>
                            
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>this.closeEditBannerModal()}>Close</Button>
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
                <Modal
                show={this.state.showConfirmDelete}
                onHide={()=>this.closeConfirmDelete()}
                backdrop="static"
                keyboard={false}>
                    <Modal.Header className="modalHead">
                        <Modal.Title>Are you Sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this banner?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.closeConfirmDelete()}>No</Button>
                        <Button variant="primary" onClick={()=>this.confirmDeleteBanner()} >Yes</Button>
                    </Modal.Footer>
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
    openAddBannerModal(){
        this.setState({showAddBannerModal:true})
    }
    closeAddBannerModal(){
        this.setState({showAddBannerModal:false})
    }
    openLoading(){
        this.setState({showLoading:true})
    }
    closeLoading(){
        this.setState({showLoading:false})
    }
    openEditBannerModal(id,title,description,status,link){
        this.setState({showEditBannerModal:true})
        this.setState({selectedEdit:{banner_id:id,banner_title:title,banner_description:description,banner_status:status,banner_link:link}})
    }
    closeEditBannerModal(){
        this.setState({showEditBannerModal:false})
        this.setState({selectedEdit:[]})
    }
    openConfirmDelete(i,id){
        this.setState({showConfirmDelete:true})
        this.setState({selectedDelete:{index:i,banner_id:id}})
    }
    closeConfirmDelete(){
        this.setState({showConfirmDelete:false})
        this.setState({selectedDelete:[]})
    }
    confirmDeleteBanner(){
        this.removeBanner(this.state.selectedDelete.index,this.state.selectedDelete.banner_id)
        this.closeConfirmDelete()
    }
    removeBanner(i,id){
        const baseUrl="/NLP_Store/public/api/admin/removeBanner/"+id
        axios.delete(baseUrl).then(response=>{
            if(response.data.success){
                const list=this.state.bannerList
                list.splice(i,1)
                this.setState({bannerList:list},()=>this.setState({numItemInTable:this.state.bannerList.length}))
                this.setState({success:true})
                this.setState({message:response.data.message})
                this.closeLoading()
            }
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
    submitAddBannerModal(event){
        event.preventDefault()
        const baseUrl="/NLP_Store/public/api/admin/addBanner"
        var formdata=new FormData()
        formdata.append("title",document.getElementById("addBannerTitle").value)
        formdata.append("description",document.getElementById("addBannerDescription").value)
        formdata.append("link",document.getElementById("addBannerLink").value)
        formdata.append("status",document.getElementById("addBannerStatus").value)
        formdata.append("image",document.getElementById("addBannerImage").files[0])
        axios.post(baseUrl,formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(response=>{
            this.setState({success:true})
            this.setState({message:response.data.message})
            axios.get("/NLP_Store/public/api/admin/getBanners").then(response=>{
                this.setState({bannerList:response.data.banners},()=>this.setState({numItemInTable:this.state.bannerList.length}))
                this.closeLoading()
            }).catch(error=>{
                console.log(error)
            })

        }).catch(error=>{
            console.log(error)
        })
        this.closeAddBannerModal()
        this.openLoading()
    }
    submitEditBannerModal(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/editBanner"
        console.log(this.state.selectedEdit)
        var formdata=new FormData()
        formdata.append("id",this.state.selectedEdit.banner_id)
        formdata.append("title",this.state.selectedEdit.banner_title)
        formdata.append("description",this.state.selectedEdit.banner_description)
        formdata.append("status",this.state.selectedEdit.banner_status)
        formdata.append("link",this.state.selectedEdit.banner_link)
        formdata.append('image',document.getElementById("editBannerImage").files[0])
        axios.post(baseUrl,formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(response=>{
            if(response.data.success){
                this.setState({success:true})
                this.setState({message:response.data.message})
                axios.get("/NLP_Store/public/api/admin/getBanners").then(response=>{
                    this.setState({bannerList:response.data.banners},()=>this.setState({numItemInTable:this.state.bannerList.length}))
                    this.closeLoading()
                }).catch(error=>{
                    console.log(error)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
        this.closeEditBannerModal()
        this.openLoading()
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
    handleEditTitle(event){
        let editBanner=this.state.selectedEdit;
        editBanner.banner_title=event.target.value;
        this.setState({editBanner})
    }
    handleEditDescription(event){
        let editBanner=this.state.selectedEdit;
        editBanner.banner_description=event.target.value;
        this.setState({editBanner})
    }
    handleEditLink(event){
        let editBanner=this.state.selectedEdit;
        editBanner.banner_link=event.target.value;
        this.setState({editBanner})
    }
    handleEditStatus(event){
        let editBanner=this.state.selectedEdit;
        editBanner.banner_status=event.target.value;
        this.setState({editBanner})
    }
}