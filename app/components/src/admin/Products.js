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

export default class Products extends Component{
    constructor(){
        super();
        this.state={
            changeSize:false,
            showModal:false,
            showDeleteProduct:false,
            showDeleteSpec:false,
            showDeleteCat:false,
            showDeleteColour:false,
            showEditProduct:false,
            showEditSpecType:false,
            showEditCategory:false,
            showLoading:false,
            showEditColour:false,
            selectedProduct:"",
            selectedProductIndex:"",
            selectedSpec:"",
            selectedSpecIndex:"",
            selectedCat:"",
            selectedCatIndex:"",
            selectedColour:"",
            selectedColourIndex:"",
            success:false,
            fail:false,
            hasSpecification:false,
            hasEditSpecification:false,
            specifications:[{specificationType:"",specificationName:"",specificationPrice:0}],
            listSpecs:[],
            listCategory:[],
            listProducts:[],
            selectedProductEdit:[],
            editFormSpecs:[],
            selectedSpecTypeEdit:[],
            selectedCategoryEdit:[],
            selectedColourEdit:[],
            listColours:[],
            message:"",
            productColoursAdd:[],
            productColoursEdit:[],
            activePageProductTable:1,
            activePageSpecsTable:1,
            activePageCategoriesTable:1,
            activePageColoursTable:1,
            numberOfItemProductTable:0,
            productTableSize:5,
            numberOfItemSpecsTable:0,
            numberOfItemCategoriesTable:0,
            numberOfItemColoursTable:0,
            totalPaginationButton:[0,0,0,0],
            filterMinMaxPrice:0
            
        }
    }
    
    componentDidMount(){
        axios.get("/NLP_Store/public/api/admin/getSpecType").then(response=>{
            this.setState({listSpecs:response.data.specType},()=>this.setState({numberOfItemSpecsTable:this.state.listSpecs.length}))
            
        }).catch(error=>{
            console.log(error);
        })
        axios.get("/NLP_Store/public/api/admin/getProductCategory").then(response=>{
            this.setState({listCategory:response.data.categories},()=>this.setState({numberOfItemCategoriesTable:this.state.listCategory.length}))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getProducts").then(response=>{
            this.setState({listProducts:response.data.products},()=>this.setState({numberOfItemProductTable:this.state.listProducts.length}))
            
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getColours").then(response=>{
            this.setState({listColours:response.data.colours},()=>this.setState({numberOfItemColoursTable:this.state.listColours.length}))
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
                    <Col id="content" className="content">
                            <Alert show={this.state.success} variant="success" dismissible onClose={()=>this.setState({success:false})}>{this.state.message}</Alert>
                            <Tabs defaultActiveKey="productList" id="addProductTabs" className="mb-3">
                                <Tab eventKey="productList" title="Product List">
                                    <Row>
                                    <Col md="9">
                                        <Card>
                                            <Card.Body>
                                                <h5>Product List</h5>
                                                <small>A list of products</small>
                                                <br>
                                                </br>
                                                
                                                    <Button size="sm" variant="primary" onClick={()=>this.openModal()}><FontAwesomeIcon icon={Icons.faPlusCircle} style={{marginRight:"5px"}}></FontAwesomeIcon>New</Button>
                                                    <Button size="sm" variant="light" style={{backgroundColor:"#ECF5F6"}} onClick={()=>this.updateProductSentiment()}><FontAwesomeIcon icon={Icons.faSync}></FontAwesomeIcon></Button>
                                                
                                                
                                                <Table style={{textAlign:"center"}} responsive striped bordered hover id='productsTable'>
                                                    <thead >
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Product Name</th>
                                                            <th>Product Price (RM)</th>
                                                            <th>Product Quantity</th>
                                                            <th>Product Category</th>
                                                            <th>Status</th>
                                                            <th></th>

                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        {this.limitTableContent(this.state.listProducts,this.state.activePageProductTable,this.state.productTableSize).map((data,i)=>{
                                                            return(
                                                                <tr>
                                                                    <td>{data.product_id}</td>
                                                                    <td>{data.product_name}</td>
                                                                    <td>{data.product_price}</td>
                                                                    <td>{data.product_quantity}</td>
                                                                    <td>{this.findCategory(data.product_category)}</td>
                                                                    <td>{data.product_status==1?"Enabled":"Disabled"}</td>
                                                                    <td ><Link to={"/NLP_Store/public/admin/product_details/"+data.product_id} >
                                                                        <Button style={{margin:"2%",minWidth:"3vw",maxWidth:"3vw"}}>
                                                                        <FontAwesomeIcon icon={Icons.faInfo}></FontAwesomeIcon></Button></Link>
                                                                        <Button style={{margin:"2%",minWidth:"3vw",maxWidth:"3vw"}} variant="info" onClick={()=>this.openEditProduct(data.product_id)}><FontAwesomeIcon icon={Icons.faWrench}></FontAwesomeIcon></Button>
                                                                        <Button variant="secondary" style={{margin:"2%",minWidth:"3vw",maxWidth:"3vw"}}  onClick={()=>this.openConfirmDeleteProduct(((this.state.activePageProductTable-1)*this.state.productTableSize)+i,data.product_id)}><FontAwesomeIcon icon={Icons.faTrash}></FontAwesomeIcon></Button>
                                                                        
                                                                        </td>
                                                                </tr>
                                                            )
                                                            
                                                        })}
                                                    </tbody>
                                                </Table>
                                                <Pagination >{this.setProductTablePagination()}</Pagination>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Header>
                                                <h5>Filter</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Form onSubmit={this.submitFilter.bind(this)}>
                                                    <Form.Group className="mb-3" controlId="filterName">
                                                        <Form.Label>Product Name</Form.Label>
                                                        <Form.Control type="input" placeholder="Product Name"></Form.Control>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="filterPrice">
                                                        <Form.Label>Price Range (RM)</Form.Label>
                                                        <Row>
                                                            <Col>
                                                                <Form.Control type="number" min="0" onChange={this.handleFilterMinPrice.bind(this)} placeholder="Min Price" step="0.01" name="minPrice"></Form.Control>
                                                            </Col>
                                                                -
                                                            <Col>
                                                                <Form.Control type="number" min={this.state.filterMinMaxPrice} placeholder="Max Price" step="0.01" name="maxPrice"></Form.Control>
                                                            </Col>
                                                        </Row>
                                                        
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="filterCategory">
                                                        <Form.Label>Category</Form.Label>
                                                        <Form.Control name="filterCategory" defaultValue="" as="select">
                                                            <option value="">All</option>
                                                            {this.state.listCategory.map((data,i)=>{
                                                                return(
                                                                    <option value={data.category_id}>{data.category_name}</option>
                                                                )
                                                            })}
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="filterStatus">
                                                        <Form.Label>Status</Form.Label>
                                                        <Form.Control name="filterStatus" defaultValue="" as="select">
                                                            <option  value="">All</option>
                                                            <option value={1}>Enabled</option>
                                                            <option value={0}>Disabled</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Button variant="primary" type="submit" style={{float:"right"}}>Filter</Button>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                </Tab>
                                <Tab eventKey="productSettings" title="Product Settings">
                                    <Row>
                                        <Col>
                                            <Card className="mb-3">
                                                <Card.Body>
                                                    
                                                    <h5>Product Specifications</h5>
                                                    <small class="mb-3">Types of system specifications</small>
                                                    <br>
                                                    </br>
                                                    <Form onSubmit={this.submitAddSpecType.bind(this)}>
                                                        <Form.Group as={Row} className="mb-3" controlId="addSpecType" style={{textAlign:"left"}}>
                                                            <Form.Label column sm={3}>New Specification Type</Form.Label>
                                                            <Col>
                                                            <Form.Control type="input" required placeholder="Enter specification type"></Form.Control>
                                                            </Col>
                                                            <Col>
                                                                <Button variant="primary" type="submit"><FontAwesomeIcon icon={Icons.faPlus}></FontAwesomeIcon></Button>
                                                            </Col>
                                                        </Form.Group>
                                                    </Form>
                                                    <Table responsive striped bordered hover id="specTypeTable">
                                                        <thead>
                                                            <th>#</th>
                                                            <th>Specfication Type</th>
                                                            <th></th>
                                                        </thead>
                                                        <tbody>
                                                            {this.limitTableContent(this.state.listSpecs,this.state.activePageSpecsTable,this.state.productTableSize).map((data,i)=>{
                                                                return(
                                                                    <tr>
                                                                        <td>{data.product_specification_type_id}</td>
                                                                        <td>{data.product_specification_type}</td>
                                                                        <td style={{textAlign:"center"}}><Button variant="danger"  onClick={()=>this.openConfirmDeleteSpec(((this.state.activePageSpecsTable-1)*this.state.productTableSize)+i,data.product_specification_type_id)}><FontAwesomeIcon icon={Icons.faTrash}></FontAwesomeIcon></Button>
                                                                        <Button variant="info" onClick={()=>this.openEditSpecType(data.product_specification_type_id,data.product_specification_type)}><FontAwesomeIcon icon={Icons.faWrench} ></FontAwesomeIcon></Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                    <Pagination>{this.setSpecificationPagination()}</Pagination>
                                                </Card.Body>
                                            </Card>
                                            <Card className="mb-3">
                                                <Card.Body>
                                                    <h5>Product Categories</h5>
                                                    <small class="mb-3">Categories of products</small>
                                                    <br></br>
                                                    <Form onSubmit={this.submitAddProductCategory.bind(this)}>
                                                        <Form.Group as={Row} className="mb-3" controlId="addProductCategory" style={{textAlign:"left"}}>
                                                            <Form.Label column sm={3}>New Category</Form.Label>
                                                            <Col>
                                                                <Form.Control type="input" required placeholder="Enter category name"></Form.Control>
                                                            </Col>
                                                            <Col>
                                                                <Button variant="primary" type="submit"><FontAwesomeIcon icon={Icons.faPlus}></FontAwesomeIcon></Button>
                                                            </Col>
                                                        </Form.Group>
                                                    </Form>
                                                    <Table responsive striped bordered hover id="prodCategoryTable">
                                                        <thead>
                                                            <th>#</th>
                                                            <th>Product Category</th>
                                                            <th></th>
                                                        </thead>
                                                        <tbody>
                                                            {this.limitTableContent(this.state.listCategory,this.state.activePageCategoriesTable,this.state.productTableSize).map((data,i)=>{
                                                                return(
                                                                    <tr>
                                                                        <td>{data.category_id}</td>
                                                                        <td>{data.category_name}</td>
                                                                        <td style={{textAlign:"center"}}><Button variant="danger"  onClick={()=>this.openConfirmDeleteCat(((this.state.activePageCategoriesTable-1)*this.state.productTableSize)+i,data.category_id)}><FontAwesomeIcon icon={Icons.faTrash}></FontAwesomeIcon></Button>
                                                                        <Button variant="info" onClick={()=>this.openEditCategory(data.category_id,data.category_name)}><FontAwesomeIcon icon={Icons.faWrench}></FontAwesomeIcon></Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                    <Pagination>{this.setCategoriesPagination()}</Pagination>
                                                </Card.Body>
                                            </Card>
                                            <Card>
                                                <Card.Body>
                                                    <h5>Product Colours</h5>
                                                    <small class="mb-3">Available colour palattes</small>
                                                    <br></br>
                                                    <Form onSubmit={this.submitAddColour.bind(this)}>
                                                            <Form.Group as={Row} className="mb-3" controlId="AddNewColour" style={{textAlign:"left"}}>
                                                                <Form.Label column sm={3}>New Colour</Form.Label>
                                                                <Col>
                                                                    <Form.Control type="input" required placeholder="Enter colour"></Form.Control>
                                                                </Col>
                                                                <Col sm={1}>
                                                                    <Form.Control type="color" id="colorHexa" defaultValue="#FFFFFF"></Form.Control>
                                                                </Col>
                                                                <Col>
                                                                <Button variant="primary" type="submit"><FontAwesomeIcon icon={Icons.faPlus}></FontAwesomeIcon></Button>
                                                            </Col>
                                                            </Form.Group>
                                                    </Form>
                                                    <Table responsive striped bordered hover id="colorTable">
                                                            <thead>
                                                                <th>#</th>
                                                                <th>Colour Name</th>
                                                                <th>Colour</th>
                                                                <th></th>
                                                            </thead>
                                                            <tbody>
                                                                {this.limitTableContent(this.state.listColours,this.state.activePageColoursTable,this.state.productTableSize).map((data,i)=>{
                                                                    return(
                                                                        <tr>
                                                                            <td>{data.colour_id}</td>
                                                                            <td>{data.colour_name}</td>
                                                                            <td><div style={{height:"5vh",width:"5vw",backgroundColor:data.colour_code,border:" solid 3px black"}}></div></td>
                                                                            <td style={{textAlign:"center"}}>
                                                                                <Button variant="danger" onClick={()=>this.openConfirmDeleteColour(((this.state.activePageColoursTable-1)*this.state.productTableSize)+i,data.colour_id)}><FontAwesomeIcon icon={Icons.faTrash}></FontAwesomeIcon></Button>
                                                                                <Button variant="info" onClick={()=>this.openEditColour(data.colour_id,data.colour_name,data.colour_code)}><FontAwesomeIcon icon={Icons.faWrench}></FontAwesomeIcon></Button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                    </Table>
                                                    <Pagination>{this.setColoursPagination()}</Pagination>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Tab>
                            </Tabs>
                            
                        
                       

                    </Col>
                        
                    
                    
                </Row>
                <Modal
                show={this.state.showModal}
                onHide={()=>this.closeModal()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header  className="ModalHead">
                        <Modal.Title>New Product</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.submitAddForm.bind(this)}>
                    <Modal.Body>
                        <Tabs defaultActiveKey="general" id="addProductTabs" className="mb-3">
                            <Tab eventKey="general" title="General">
                                <Form.Group className="mb-3" controlId="AddProductName" >
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control name="name" type="input" placeholder="e.g. Samsung Galaxy S10" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="AddProductPrice">
                                    <Form.Label>Product Price (RM)</Form.Label>
                                    <Form.Control name="price" type="number"  placeholder="Enter Price" required step="0.01"></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="AddProductQuantity">
                                    <Form.Label>Product Quantity</Form.Label>
                                    <Form.Control name="quantity" type="number" min="1" placeholder="Enter Quantity" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="AddProductStatus" >
                                    <Form.Label>Product Status</Form.Label>
                                    <Form.Control name="status" defaultValue="" as="select" required>
                                        <option disabled value="">Choose a status</option>
                                        <option value="1">Enabled</option>
                                        <option value="0">Disabled</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="AddProductCategory">
                                    <Form.Label>Product Category</Form.Label>
                                    <Form.Control name="category" defaultValue="" as="select" required>
                                        <option disabled value="">Choose a category</option>
                                        {this.state.listCategory.map((data,i)=>{
                                            return(
                                                <option value={data.category_id}>{data.category_name}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="AddProductImage">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Control  name="image" type="file" required accept="image/png, image/jpeg"></Form.Control>
                                </Form.Group>
                            </Tab>
                            <Tab eventKey="specification" title="Specification">
                                <Form.Group className="mb-3" controlId="AddProductColour">
                                    <Form.Label>Colours</Form.Label>
                                    <div>
                                    {this.state.listColours.map((data,i)=>{
                                        return(
                                            <Form.Check required inline label={data.colour_name} name="addColour" onChange={()=>this.addColourToProduct(data.colour_id)} type="checkbox" value={data.colour_id}></Form.Check>
                                        )
                                    })}
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="AddProductSpecification">
                                    <Form.Label>Specifications</Form.Label>
                                    <Form.Check type="switch" id="specificationSwitch" label="Yes/No" className="mb-3" onChange={()=>this.showSpecification()}>
                                        
                                    </Form.Check>
                                    <Table responsive id="tableSpecification" className="hidden">
                                        
                                        <thead >
                                            <tr>
                                                <th>Specification Type</th>
                                                <th>Specification</th>
                                                <th>Price</th>
                                                <th><Button variant="primary" onClick={this.addSpecification.bind(this)}><FontAwesomeIcon icon={Icons.faPlus}></FontAwesomeIcon></Button></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.createSpecification()}
                                        </tbody>
                                    </Table>
                                </Form.Group>
                            </Tab>
                        </Tabs>
                            
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.closeModal()}>Close</Button>
                        <Button variant="primary" type="submit" >Submit</Button>
                        
                    </Modal.Footer>
                    </Form>
                </Modal>
                <Modal
                show={this.state.showDeleteProduct}
                onHide={()=>this.closeConfirmDeleteProduct()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="ModalHead">
                        <Modal.Title>Are you Sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
                    <Modal.Footer><Button variant="secondary" onClick={()=>this.closeConfirmDeleteProduct()}>No</Button>
                        <Button variant="primary" onClick={()=>this.confirmDeleteProduct()} >Yes</Button></Modal.Footer>
                </Modal>
                <Modal
                show={this.state.showDeleteSpec}
                onHide={()=>this.closeConfirmDeleteSpec()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="ModalHead">
                        <Modal.Title>Are you Sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this specification type?</Modal.Body>
                    <Modal.Footer><Button variant="secondary" onClick={()=>this.closeConfirmDeleteSpec()}>No</Button>
                        <Button variant="primary" onClick={()=>this.confirmDeleteSpec()} >Yes</Button></Modal.Footer>
                </Modal>
                <Modal
                show={this.state.showDeleteCat}
                onHide={()=>this.closeConfirmDeleteCat()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="ModalHead">
                        <Modal.Title>Are you Sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this product category?</Modal.Body>
                    <Modal.Footer><Button variant="secondary" onClick={()=>this.closeConfirmDeleteCat()}>No</Button>
                        <Button variant="primary" onClick={()=>this.confirmDeleteCat()} >Yes</Button></Modal.Footer>
                </Modal>
                <Modal
                show={this.state.showDeleteColour}
                onHide={()=>this.closeConfirmDeleteColour()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="ModalHead">
                        <Modal.Title>Are you Sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this colour?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.closeConfirmDeleteColour()}>No</Button>
                        <Button variant="primary" onClick={()=>this.confirmDeleteColour()}>Yes</Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                show={this.state.showEditProduct}
                onHide={()=>this.closeEditProduct()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header  className="ModalHead">
                        <Modal.Title>Edit Product</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.submitEditProduct.bind(this)}>
                    <Modal.Body>
                        <Tabs defaultActiveKey="editgeneral" id="editProductTabs" className="mb-3">
                            <Tab eventKey="editgeneral" title="General">
                                <Form.Group className="mb-3" controlId="EditProductName" >
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control name="name" onChange={this.handleEditProductName.bind(this)} defaultValue={this.state.selectedProductEdit.product_name} type="input" placeholder="e.g. Samsung Galaxy S10" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="EditProductPrice">
                                    <Form.Label>Product Price (RM)</Form.Label>
                                    <Form.Control name="price" type="number" onChange={this.handleEditProductPrice.bind(this)} defaultValue={this.state.selectedProductEdit.product_price} placeholder="Enter Price" required step="0.01"></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="EditProductQuantity">
                                    <Form.Label>Product Quantity</Form.Label>
                                    <Form.Control name="quantity" onChange={this.handleEditProductQuantity.bind(this)} defaultValue={this.state.selectedProductEdit.product_quantity} type="number" min="1" placeholder="Enter Quantity" required></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="EditProductStatus" >
                                    <Form.Label>Product Status</Form.Label>
                                    <Form.Control name="status" as="select" onChange={this.handleEditProductStatus.bind(this)} defaultValue={this.state.selectedProductEdit.product_status} required>
                                        <option disabled value="">Choose a status</option>
                                        <option value="1">Enabled</option>
                                        <option value="0">Disabled</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="EditProductCategory">
                                    <Form.Label>Product Category</Form.Label>
                                    <Form.Control name="category" onChange={this.handleEditProductCategory.bind(this)} defaultValue={this.state.selectedProductEdit.product_category} as="select" required>
                                        <option disabled value="">Choose a category</option>
                                        {this.state.listCategory.map((data,i)=>{
                                            return(
                                                <option value={data.category_id}>{data.category_name}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="EditProductImage">
                                    <Form.Label>Product Image</Form.Label>
                                    <Form.Control  name="image" type="file" accept="image/png, image/jpeg"></Form.Control>
                                </Form.Group>
                            </Tab>
                            <Tab eventKey="editspecification" title="Specification">
                                <Form.Group className="mb-3" controlId="EditProductColour">
                                    <Form.Label>Colours</Form.Label>
                                    <div>
                                    {this.state.listColours.map((data,i)=>{
                                        return(
                                            <Form.Check inline  label={data.colour_name} name="editColour" onChange={()=>this.editProductColour(data.colour_id)} type="checkbox" value={data.colour_id}></Form.Check>
                                        )
                                    })}
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="EditProductSpecification">
                                    <Form.Label>Specifications</Form.Label>
                                    <Form.Check type="switch" id="editSpecificationSwitch" label="Yes/No" className="mb-3" onChange={()=>this.showEditSpecification()}>
                                        
                                    </Form.Check>
                                    <Table responsive id="tableEditSpecification" className="hidden">
                                        <thead >
                                            <tr>
                                                <th>Specification Type</th>
                                                <th>Specification</th>
                                                <th>Price</th>
                                                <th><Button variant="primary" onClick={this.addEditSpecification.bind(this)}><FontAwesomeIcon icon={Icons.faPlus}></FontAwesomeIcon></Button></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.createEditSpecification()}
                                        </tbody>
                                    </Table>
                                </Form.Group>
                            </Tab>
                        </Tabs>
                            
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.closeEditProduct()}>Close</Button>
                        <Button variant="primary" type="submit" >Submit</Button>
                        
                    </Modal.Footer>
                    </Form>
                </Modal>
                <Modal
                show={this.state.showEditSpecType}
                onHide={()=>this.closeEditSpecType()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="ModalHead">
                        <Modal.Title>Edit Specification Type</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.submitEditSpecType.bind(this)}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="EditSpecificationType">
                                <Form.Label>Specification Type</Form.Label>
                                <Form.Control type="input" onChange={this.handleEditSpecTypeName.bind(this)} placeholder="Enter specification type" defaultValue={this.state.selectedSpecTypeEdit.product_specification_type}></Form.Control>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>this.closeEditSpecType()}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                    
                </Modal>
                <Modal
                show={this.state.showEditCategory}
                onHide={()=>this.closeEditCategory()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="ModalHead">
                        <Modal.Title>Edit Category</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.submitEditCategory.bind(this)}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="EditCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control type="input" onChange={this.handleEditCategory.bind(this)} placeholder="Enter specification type" defaultValue={this.state.selectedCategoryEdit.category_name}></Form.Control>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>this.closeEditCategory()}>Close</Button>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Modal.Footer>
                    </Form>
                    
                </Modal>
                <Modal
                show={this.state.showEditColour}
                onHide={()=>this.closeEditColour()}
                backdrop="static"
                keyboard={false}
                >
                    <Modal.Header className="ModalHead">
                        <Modal.Title>Edit Colour</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={this.submitEditColour.bind(this)}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="EditColour">
                                <Form.Label>Colour Name</Form.Label>
                                <Form.Control type='input' onChange={this.handleEditColour.bind(this)} placeholder="Enter colour name" defaultValue={this.state.selectedColourEdit.colour_name}></Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="EditColourCode">
                                <Form.Label>Colour</Form.Label>
                                <Row>
                                    <Col sm={2}>
                                        <Form.Control size="sm" type="color" onChange={this.handleEditColourCode.bind(this)} defaultValue={this.state.selectedColourEdit.colour_code}></Form.Control>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>
                                
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={()=>this.closeEditColour()}>Close</Button>
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
    closeModal(){
        this.setState({showModal:false});
        this.setState({productColoursAdd:[]})
    }
    openModal(){
        this.setState({showModal:true});
    }
    closeConfirmDeleteProduct(){
        this.setState({showDeleteProduct:false});
        this.setState({selectedProduct:""})
        this.setState({selectedProductIndex:""})
    }
    openConfirmDeleteProduct(i,id){
        this.setState({showDeleteProduct:true});
        this.setState({selectedProduct:id})
        this.setState({selectedProductIndex:i})
    }
    closeConfirmDeleteCat(){
        this.setState({showDeleteCat:false})
        this.setState({selectedCat:""})
        this.setState({selectedCatIndex:""})
    }
    openConfirmDeleteCat(i,id){
        this.setState({showDeleteCat:true});
        this.setState({selectedCat:id})
        this.setState({selectedCatIndex:i})
    }
    closeConfirmDeleteSpec(){
        this.setState({showDeleteSpec:false});
        this.setState({selectedSpec:""})
        this.setState({selectedSpecIndex:""})
    }
    openConfirmDeleteSpec(i,id){
        this.setState({showDeleteSpec:true});
        this.setState({selectedSpec:id})
        this.setState({selectedSpecIndex:i})
    }
    confirmDeleteProduct(){
        this.removeProduct(this.state.selectedProductIndex,this.state.selectedProduct);
        this.closeConfirmDeleteProduct();
    }
    confirmDeleteSpec(){
        this.removeSpecType(this.state.selectedSpecIndex,this.state.selectedSpec);
        this.closeConfirmDeleteSpec();
    }
    confirmDeleteCat(){
        this.removeProductCategory(this.state.selectedCatIndex,this.state.selectedCat);
        this.closeConfirmDeleteCat();
    }
    submitAddForm(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/addProduct"
        var formdata=new FormData();
        console.log(this.state.productColoursAdd)
        formdata.append ("image",document.getElementById("AddProductImage").files[0]);
        formdata.append("name",document.getElementById("AddProductName").value);
        formdata.append("price",document.getElementById("AddProductPrice").value);
        formdata.append("quantity",document.getElementById("AddProductQuantity").value);
        formdata.append("status",document.getElementById("AddProductStatus").value);
        formdata.append("category",document.getElementById("AddProductCategory").value);
        formdata.append("colours",JSON.stringify(this.state.productColoursAdd))
        if(this.state.specifications!=null && this.state.hasSpecification){
            formdata.append("specification",JSON.stringify(this.state.specifications));
        }
        axios.post(baseUrl,formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(response=>{
            if(response.data.success){
                this.setState({success:true})
                this.setState({message:response.data.message})
                this.setState({specifications:[{specificationType:"",specificationName:"",specificationPrice:0}]})
                axios.get("/NLP_Store/public/api/admin/getProducts").then(response=>{
                    this.setState({listProducts:response.data.products},()=>this.setState({numberOfItemProductTable:this.state.listProducts.length}))
                    this.closeLoading()
                }).catch(error=>{
                    console.log(error)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
        this.setState({productColoursAdd:[]})
        this.setState({showModal:false})
        this.openLoading()
    }
    submitAddSpecType(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/addSpecType"
        var formdata=new FormData();
        formdata.append("type",document.getElementById("addSpecType").value);
        axios.post(baseUrl,formdata).then(response=>{
            this.setState({success:true})
            this.setState({message:response.data.message})
            axios.get("/NLP_Store/public/api/admin/getSpecType").then(response=>{
                this.setState({listSpecs:response.data.specType},()=>this.setState({numberOfItemSpecsTable:this.state.listSpecs.length}))
                document.getElementById("addSpecType").value=""
                this.closeLoading()
            }).catch(error=>{
                console.log(error);
            })
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
    removeSpecType(i,id){
        const baseUrl="/NLP_Store/public/api/admin/removeSpecType/"+id
        axios.delete(baseUrl).then(response=>{
            if(response.data.success){
                const list=this.state.listSpecs
                list.splice(i,1)
                this.setState({listCustomer:list},()=>this.setState({numberOfItemSpecsTable:this.state.listSpecs.length},()=>this.changeNumPagination(1)))
                this.setState({success:true})
                this.setState({message:response.data.message})
                this.closeLoading()
            }
            else{
                this.setState({fail:true})
            }
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
    submitAddProductCategory(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/addProductCategory"
        var formdata=new FormData();
        formdata.append("category",document.getElementById("addProductCategory").value)
        axios.post(baseUrl,formdata).then(response=>{
            this.setState({success:true})
            this.setState({message:response.data.message})
            axios.get("/NLP_Store/public/api/admin/getProductCategory").then(response=>{
                this.setState({listCategory:response.data.categories},()=>this.setState({numberOfItemCategoriesTable:this.state.listCategory.length}))
                document.getElementById("addProductCategory").value=""
                this.closeLoading();
            }).catch(error=>{
                console.log(error)
            })
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading();
    }
    removeProductCategory(i,id){
        const baseUrl="/NLP_Store/public/api/admin/removeProductCategory/"+id
        var formdata=new FormData();
        formdata.append("id",id)
        axios.delete(baseUrl).then(response=>{
            if(response.data.success){
                const list=this.state.listCategory
                list.splice(i,1)
                this.setState({listCategory:list},()=>this.setState({numberOfItemCategoriesTable:this.state.listCategory.length}))
                this.setState({success:true})
                this.setState({message:response.data.message})
                axios.get("/NLP_Store/public/api/admin/getProducts").then(response=>{
                    this.setState({listProducts:response.data.products},()=>this.setState({numberOfItemProductTable:this.state.listProducts.length},()=>this.changeNumPagination(2)))
                    this.closeLoading()
                }).catch(error=>{
                    console.log(error)
                })
                
            }
            else{
                this.setState({fail:true})
            }
        })
        this.openLoading()
    }
    removeProduct(i,id){
        const baseUrl="/NLP_Store/public/api/admin/removeProduct/"+id
        var formdata=new FormData();
        formdata.append("id",id)
        axios.delete(baseUrl).then(response=>{
            if(response.data.success){
                const list=this.state.listProducts
                list.splice(i,1)
                this.setState({listProducts:list},()=>this.setState({numberOfItemProductTable:this.state.listProducts.length},()=>this.changeNumPagination(0)))
                this.setState({success:true});
                this.setState({message:response.data.message})
                this.closeLoading()
            }
            else{
                this.setState({fail:true});
            }
        })
        this.openLoading()
    }
    showSpecification(){
        document.getElementById("tableSpecification").classList.toggle("hidden");
        
        if(this.state.hasSpecification){
            this.setState({hasSpecification:false})
        }
        else{
            this.setState({hasSpecification:true})
        }
    }
    showEditSpecification(){
        console.log(this.state.hasEditSpecification)
        document.getElementById("tableEditSpecification").classList.toggle("hidden");
        if(this.state.hasEditSpecification){
            console.log("true case")
            this.setState({hasEditSpecification:false})
        }
        else if (this.state.hasEditSpecification==false){
            console.log("false case")
            this.setState({hasEditSpecification:true})
        }
        console.log(this.state.hasEditSpecification)
    }
    createSpecification(){
        return this.state.specifications.map((el,i)=>
            <tr key={i}>
                <td><Form.Control name="specificationType[]" defaultValue="" as="select" onChange={this.handleSpecType.bind(this,i)} required={this.state.hasSpecification}>
                        <option disabled value="">Choose a type</option>
                        {this.state.listSpecs.map((item,index)=>
                            <option value={item.product_specification_type_id}>{item.product_specification_type}</option>
                        )}
                    </Form.Control>
                </td>
                <td><Form.Control name="specification[]" required={this.state.hasSpecification} value={el.specificationName||""} onChange={this.handleSpecName.bind(this,i)} type="input" placeholder="Enter specification option" ></Form.Control></td>
                <td><Form.Control name="specificationPrice[]" step="0.01" required={this.state.hasSpecification} value={el.specificationPrice||0} type="number" onChange={this.handleSpecPrice.bind(this,i)} placeholder="Enter Price" ></Form.Control></td>
                <td style={{textAlign:"center"}}><Button variant="secondary" onClick={this.removeSpecification.bind(this,i)}><FontAwesomeIcon icon={Icons.faTimes}></FontAwesomeIcon></Button></td>
            </tr>
            
        )
    }
    createEditSpecification(){
        return this.state.editFormSpecs.map((data,i)=>
            <tr key={i}>
                <td><Form.Control name="editspecificationType[]" defaultValue={data.specification_type} as="select" onChange={this.handleEditSpecType.bind(this,i)} required={this.state.hasEditSpecification}>
                        <option disabled value="">Choose a type</option>
                        {this.state.listSpecs.map((item,index)=>
                            <option value={item.product_specification_type_id}>{item.product_specification_type}</option>
                        )}
                    </Form.Control>
                </td>
                <td><Form.Control name="editspecification[]" required={this.state.hasEditSpecification} value={data.specification_name||""} onChange={this.handleEditSpecName.bind(this,i)} type="input" placeholder="Enter specification option" ></Form.Control></td>
                <td><Form.Control name="editspecificationPrice[]" step="0.01" required={this.state.hasEditSpecification} value={data.specification_price||0} type="number" onChange={this.handleEditSpecPrice.bind(this,i)} placeholder="Enter Price" ></Form.Control></td>
                <td style={{textAlign:"center"}}><Button variant="secondary" onClick={this.removeEditSpecification.bind(this,i)}><FontAwesomeIcon icon={Icons.faTimes}></FontAwesomeIcon></Button></td>
            </tr> 
        )
    }
    removeSpecification(i){
        let specifications=[...this.state.specifications];
        specifications.splice(i,1);
        this.setState({specifications});
    }
    removeEditSpecification(i){
        
        let editSpecifications=[...this.state.editFormSpecs];
        editSpecifications.splice(i,1);
        this.setState({editFormSpecs:editSpecifications});
    }
    addSpecification(){
        this.setState(prevState=>({specifications:[...prevState.specifications,{specification_type:"",specificationName:"",specificationPrice:0}]}))
        console.log(this.state.specifications)
    }
    addEditSpecification(){
        this.setState(prevState=>({editFormSpecs:[...prevState.editFormSpecs,{specification_type:"",specification_name:"",specification_price:0}]}))
    }
    handleSpecName(i,event){
        let specifications=[...this.state.specifications];
        if(specifications!=null)
        specifications[i].specificationName=event.target.value;
        this.setState({specifications});
        console.log(JSON.stringify(this.state.specifications))
    }
    handleEditSpecName(i,event){
        let editSpecifications=[...this.state.editFormSpecs];
        if(editSpecifications!=null)
        editSpecifications[i].specification_name=event.target.value;
        this.setState({editSpecifications});
        console.log(this.state.editFormSpecs)
    }
    handleSpecPrice(i,event){
        let specifications=[...this.state.specifications];
        if(specifications!=null)
        specifications[i].specificationPrice=event.target.value;
        this.setState({specifications});
        console.log(JSON.stringify(this.state.specifications))
    }
    handleEditSpecPrice(i,event){
        let editSpecifications=[...this.state.editFormSpecs];
        if(editSpecifications!=null)
        editSpecifications[i].specification_price=event.target.value;
        this.setState({editSpecifications});
        console.log(JSON.stringify(this.state.editFormSpecs))
    }
    handleSpecType(i,event){
        let specifications=[...this.state.specifications];
        if(specifications!=null)
        specifications[i].specificationType=event.target.value;
        console.log(JSON.stringify(this.state.specifications))
        this.setState({specifications});
    }
    handleEditSpecType(i,event){
        let editSpecifications=[...this.state.editFormSpecs];
        if(editSpecifications!=null)
        editSpecifications[i].specification_type=event.target.value;
        console.log(JSON.stringify(this.state.editFormSpecs))
        this.setState({editSpecifications});
    }
    findCategory(id){
        for(var i=0;i<this.state.listCategory.length;i++){
            if(this.state.listCategory[i].category_id==id){
                return this.state.listCategory[i].category_name
            }
        }
    }
    openEditProduct(id){
        for(var i=0;i<this.state.listProducts.length;i++){
            if(this.state.listProducts[i].product_id==id){
                this.setState({selectedProductEdit:this.state.listProducts[i]})
                var baseUrl="/NLP_Store/public/api/admin/getProductSpec/"+id
                axios.get(baseUrl).then(response=>{
                    console.log(response)
                    if(response.data.success &&response.data.specs.length!=0){
                        this.setState({editFormSpecs:response.data.specs});
                        document.getElementById("tableEditSpecification").classList.toggle("hidden");
                        document.getElementById("editSpecificationSwitch").checked=true;
                        this.setState({hasEditSpecification:true})

                        console.log(this.state.hasEditSpecification)
                        console.log(this.state.editFormSpecs)
                    }
                    else{
                        this.setState({hasEditSpecification:false})
                    }
                }).catch(error=>{
                    console.log(error)
                })
                baseUrl="/NLP_Store/public/api/admin/getProductColours/"+id
                axios.get(baseUrl).then(response=>{
                    this.setState({productColoursEdit:response.data.productColours})
                    var checkbox=document.getElementsByName("editColour")
                    for(var i=0;i<checkbox.length;i++){
                        for(var x=0;x<response.data.productColours.length;x++){
                          if(checkbox[i].value==response.data.productColours[x].colour_id){
                            checkbox[i].checked=true;
                            }  
                        }
                        
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }
        }
        this.setState({showEditProduct:true})
        
    }
    closeEditProduct(){
        this.setState({showEditProduct:false})
        this.setState({selectedProductEdit:[]})

    }
    submitEditProduct(event){
        console.log(this.state.hasEditSpecification)
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/editProduct"
        var formdata=new FormData();
        formdata.append("id",this.state.selectedProductEdit.product_id)
        formdata.append("name",this.state.selectedProductEdit.product_name)
        formdata.append("price",this.state.selectedProductEdit.product_price)
        formdata.append("quantity",this.state.selectedProductEdit.product_quantity)
        formdata.append("status",this.state.selectedProductEdit.product_status)
        formdata.append("category",this.state.selectedProductEdit.product_category)
        formdata.append("colours",JSON.stringify(this.state.productColoursEdit))
        formdata.append("image",document.getElementById("EditProductImage").files[0])
        if(this.state.hasEditSpecification){
            formdata.append("specification",JSON.stringify(this.state.editFormSpecs))
        }
        axios.post(baseUrl,formdata,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }).then(response=>{
            if(response.data.success){
                this.setState({success:true})
                this.setState({message:response.data.message})
                this.setState({editFormSpecs:[]})
                axios.get("/NLP_Store/public/api/admin/getProducts").then(response=>{
                    this.setState({listProducts:response.data.products},()=>this.setState({numberOfItemProductTable:this.state.listProducts.length}))
                    this.closeLoading()
                }).catch(error=>{
                    console.log(error)
                })
            }
        }).catch(error=>{
            console.log(error)
        })
        this.setState({showEditProduct:false})
        this.openLoading()
    }
    handleEditProductName(event){
        let editProduct=this.state.selectedProductEdit;
        editProduct.product_name=event.target.value;
        this.setState({editProduct})
        console.log(this.state.selectedProductEdit)
    }
    handleEditProductQuantity(event){
        let editProduct=this.state.selectedProductEdit;
        editProduct.product_quantity=event.target.value;
        this.setState({editProduct})
        console.log(this.state.selectedProductEdit)
    }
    handleEditProductPrice(event){
        let editProduct=this.state.selectedProductEdit;
        editProduct.product_price=event.target.value;
        this.setState({editProduct})
        console.log(this.state.selectedProductEdit)
    }
    handleEditProductCategory(event){
        let editProduct=this.state.selectedProductEdit;
        editProduct.product_category=event.target.value;
        this.setState({editProduct})
        console.log(this.state.selectedProductEdit)
    }
    handleEditProductStatus(event){
        let editProduct=this.state.selectedProductEdit;
        editProduct.product_status=event.target.value;
        this.setState({editProduct})
        console.log(this.state.selectedProductEdit)
    }
    openEditSpecType(id,specType){
        this.setState({selectedSpecTypeEdit:{product_specification_type_id:id,product_specification_type:specType}})
        this.setState({showEditSpecType:true})
    }
    closeEditSpecType(){
        this.setState({showEditSpecType:false})
        this.setState({selectedSpecTypeEdit:[]})
    }
    handleEditSpecTypeName(event){
        let editSpecType=this.state.selectedSpecTypeEdit;
        editSpecType.product_specification_type=event.target.value;
        this.setState({editSpecType})
        console.log(this.state.selectedSpecTypeEdit)
    }
    submitEditSpecType(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/editSpecificationType"
        var formdata=new FormData();
        formdata.append("id",this.state.selectedSpecTypeEdit.product_specification_type_id);
        formdata.append("spec_type",this.state.selectedSpecTypeEdit.product_specification_type);
        axios.post(baseUrl,formdata).then(response=>{
            
            this.setState({success:true})
            this.setState({message:response.data.message})
            axios.get("/NLP_Store/public/api/admin/getSpecType").then(response=>{
                this.setState({listSpecs:response.data.specType},()=>this.setState({numberOfItemSpecsTable:this.state.listSpecs.length}))
                this.closeLoading()
            }).catch(error=>{
                console.log(error);
            })
        }).catch(error=>{
            console.log(error)
        })
        this.setState({showEditSpecType:false})
        this.openLoading()
    }
    openEditCategory(id,name){
        this.setState({selectedCategoryEdit:{category_id:id,category_name:name}});
        console.log(name)
        this.setState({showEditCategory:true})
    }
    closeEditCategory(){
        this.setState({showEditCategory:false})
        this.setState({selectedCategoryEdit:[]});
    }
    handleEditCategory(event){
        let editCategory=this.state.selectedCategoryEdit
        editCategory.category_name=event.target.value;
        this.setState({editCategory})
        
    }
    submitEditCategory(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/editCategory"
        var formdata=new FormData();
        formdata.append("id",this.state.selectedCategoryEdit.category_id)
        formdata.append("category_name",this.state.selectedCategoryEdit.category_name)
        axios.post(baseUrl,formdata).then(response=>{
            
            this.setState({success:true})
            this.setState({message:response.data.message})
            axios.get("/NLP_Store/public/api/admin/getProductCategory").then(response=>{
                this.setState({listCategory:response.data.categories},()=>this.setState({numberOfItemCategoriesTable:this.state.listCategory.length}))
                this.closeLoading()
            }).catch(error=>{
                console.log(error)
            })
        }).catch(error=>{
            console.log(error)
        })
        this.setState({showEditCategory:false})
        this.openLoading()
    }
    openLoading(){
        this.setState({showLoading:true})
    }
    closeLoading(){
        this.setState({showLoading:false})
    }
    submitAddColour(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/addNewColour"
        var formdata=new FormData()
        formdata.append("colour_name",document.getElementById("AddNewColour").value)
        formdata.append("colour_code",document.getElementById("colorHexa").value)
        axios.post(baseUrl,formdata).then(response=>{
            this.setState({success:true})
            this.setState({message:response.data.message})
            axios.get("/NLP_Store/public/api/admin/getColours").then(response=>{
                this.setState({listColours:response.data.colours},()=>this.setState({numberOfItemColoursTable:this.state.listColours.length}))
                document.getElementById("AddNewColour").value=""
                document.getElementById("colorHexa").value="#FFFFFF"
                this.closeLoading()
            }).catch(error=>{
                console.log(error)
            })
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
        
    }
    openConfirmDeleteColour(i,id){
        this.setState({showDeleteColour:true})
        this.setState({selectedColour:id})
        this.setState({selectedColourIndex:i})
    }
    closeConfirmDeleteColour(){
        this.setState({showDeleteColour:false});
        this.setState({selectedColour:""})
        this.setState({selectedColourIndex:""})
    }
    confirmDeleteColour(){
        this.removeColour(this.state.selectedColourIndex,this.state.selectedColour)
        this.closeConfirmDeleteColour()
    }
    removeColour(i,id){
        const baseUrl="/NLP_Store/public/api/admin/removeColour/"+id
        var formdata=new FormData()
        formdata.append("id",id)
        axios.delete(baseUrl).then(response=>{
            if(response.data.success){
                const list=this.state.listColours
                list.splice(i,1)
                this.setState({listColours:list},()=>this.setState({numberOfItemColoursTable:this.state.listColours.length},()=>this.changeNumPagination(3)))
                this.setState({success:true})
                this.setState({message:response.data.message})
                this.closeLoading()
            }
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
    openEditColour(id,name,code){
        this.setState({selectedColourEdit:{colour_id:id,colour_name:name,colour_code:code}})
        this.setState({showEditColour:true})
        console.log(this.state.selectedColourEdit)
    }
    closeEditColour(){
        this.setState({showEditColour:false})
        this.setState({selectedColourEdit:[]})
    }
    handleEditColour(event){
        let editColour=this.state.selectedColourEdit;
        editColour.colour_name=event.target.value;
        this.setState({editColour})
    }
    handleEditColourCode(event){
        let editColour=this.state.selectedColourEdit;
        editColour.colour_code=event.target.value;
        this.setState({editColour})
    }
    submitEditColour(event){
        event.preventDefault();
        const baseUrl="/NLP_Store/public/api/admin/editColour"
        var formdata=new FormData()
        formdata.append("id",this.state.selectedColourEdit.colour_id)
        formdata.append("colour_name",this.state.selectedColourEdit.colour_name)
        formdata.append("colour_code",this.state.selectedColourEdit.colour_code)
        axios.post(baseUrl,formdata).then(response=>{
            this.setState({success:true})
            this.setState({message:response.data.message})
            axios.get("/NLP_Store/public/api/admin/getColours").then(response=>{
                this.setState({listColours:response.data.colours},()=>this.setState({numberOfItemColoursTable:this.state.listColours.length}))
                this.closeLoading()
            }).catch(error=>{
                console.log(error)
            })
        }).catch(error=>{
            console.log(error)
        })
        this.closeEditColour()
        this.openLoading()
    }
    addColourToProduct(id){
        var hasColour=false;
        if(this.state.productColoursAdd.length!=0){
            for(var i=0;i<this.state.productColoursAdd.length;i++){
                if(this.state.productColoursAdd[i].colour_id==id){
                    hasColour=true;
                    this.state.productColoursAdd.splice(i,1)
                    this.setRequiredAddProductColour();
                }
            }
            
        }
        
        
        if(!hasColour){
            this.setState(prevState=>({productColoursAdd:[...prevState.productColoursAdd,{colour_id:id}]}),()=>this.setRequiredAddProductColour())
        }
    }
    editProductColour(id){
        var hasColour=false;
        for(var i=0;i<this.state.productColoursEdit.length;i++){
            if(this.state.productColoursEdit[i].colour_id==id){
                hasColour=true;
                this.state.productColoursEdit.splice(i,1)
                this.setRequiredEditProductColour()
            }
        }
        if(!hasColour){
            this.setState(prevState=>({productColoursEdit:[...prevState.productColoursEdit,{colour_id:id}]}),()=>this.setRequiredEditProductColour())
        }
    }
    setRequiredAddProductColour(){
        console.log(this.state.productColoursAdd)
        if(this.state.productColoursAdd.length!=0){
            var checkbox=document.getElementsByName("addColour")
            for(var i=0;i<checkbox.length;i++){
                checkbox[i].required=false
            }
        }
        else{
            var checkbox=document.getElementsByName("addColour")
            for(var i=0;i<checkbox.length;i++){
                checkbox[i].required=true
            }
        }
    }
    setRequiredEditProductColour(){
        console.log(this.state.productColoursEdit)
        if(this.state.productColoursEdit.length!=0){
            var checkbox=document.getElementsByName("editColour")
            for(var i=0;i<checkbox.length;i++){
                checkbox[i].required=false
            }
        }
        else{
            var checkbox=document.getElementsByName("editColour")
            for(var i=0;i<checkbox.length;i++){
                checkbox[i].required=true
            }
        }
    }
    setProductTablePagination(){
        
        var pages=this.countPageRange(this.state.numberOfItemProductTable,this.state.activePageProductTable)
      return  pages.map((data)=>{
          if(data=="dots"){
            return(
                <Pagination.Ellipsis></Pagination.Ellipsis>
            )
          }
          else{

          
            return(<Pagination.Item key={data} active={data===this.state.activePageProductTable} 
            onClick={()=>this.setState({activePageProductTable:data})}>
                {data}
            </Pagination.Item>
            )
           }
        })
    }
    setSpecificationPagination(){
        var pages=this.countPageRange(this.state.numberOfItemSpecsTable,this.state.activePageSpecsTable)
        return pages.map((data)=>{
            if(data=="dots"){
                return(
                    <Pagination.Ellipsis></Pagination.Ellipsis>
                )
              }
              else{
    
              
                return(<Pagination.Item key={data} active={data===this.state.activePageSpecsTable} 
                onClick={()=>this.setState({activePageSpecsTable:data})}>
                    {data}
                </Pagination.Item>
                )
               }
        })
    }
    setCategoriesPagination(){
        var pages=this.countPageRange(this.state.numberOfItemCategoriesTable,this.state.activePageCategoriesTable)
        return pages.map((data)=>{
            if(data=="dots"){
                return(
                    <Pagination.Ellipsis></Pagination.Ellipsis>
                )
              }
              else{
    
              
                return(<Pagination.Item key={data} active={data===this.state.activePageCategoriesTable} 
                onClick={()=>this.setState({activePageCategoriesTable:data})}>
                    {data}
                </Pagination.Item>
                )
               }
        })
    }
    setColoursPagination(){
        var pages=this.countPageRange(this.state.numberOfItemColoursTable,this.state.activePageColoursTable)
        return pages.map((data)=>{
            if(data=="dots"){
                return(
                    <Pagination.Ellipsis></Pagination.Ellipsis>
                )
              }
              else{
    
              
                return(<Pagination.Item key={data} active={data===this.state.activePageColoursTable} 
                onClick={()=>this.setState({activePageColoursTable:data})}>
                    {data}
                </Pagination.Item>
                )
               }
        })
    }
    range(start, end){
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    }
    countPageRange(total,currentPage){
        const siblingCount=1
        const totalPageCount=Math.ceil(total/this.state.productTableSize)
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
            console.log("hi")
            return  [...leftRange,"dots",totalPageCount]
        }
        
        if(shouldShowLeftDots && ! shouldShowRightDots){
            let rightItemCount=3+2*siblingCount
            let rightRange=this.range(totalPageCount-rightItemCount+1,totalPageCount)
            console.log("hi")
            return [firstPageIndex,"dots",...rightRange]
        }

        if(shouldShowLeftDots && shouldShowRightDots){
            let middleRange=this.range(leftSiblingIndex,rightSiblingIndex)
            console.log("hi")
            return [firstPageIndex,"dots",...middleRange,"dots",lastPageIndex]
        }
    }
    limitTableContent(data,currentPage,pageSize){
        const firstPageIndex=(currentPage -1)*pageSize
        const lastPageIndex=firstPageIndex+pageSize
        return data.slice(firstPageIndex,lastPageIndex)
    }
    changeNumPagination(num){
        switch(num){
            case 0: var temp=this.state.totalPaginationButton
                    temp[0]=Math.ceil(this.state.numberOfItemProductTable/this.state.productTableSize)
                    this.setState({totalPaginationButton:temp},()=>{if(this.state.totalPaginationButton[0]<this.state.activePageProductTable&&this.state.totalPaginationButton[0]!=0){this.setState({activePageProductTable:temp[0]})}})
                    break;
            case 1: var temp=this.state.totalPaginationButton
                    console.log("hi")
                    temp[1]=Math.ceil(this.state.numberOfItemSpecsTable/this.state.productTableSize)
                    this.setState({totalPaginationButton:temp},()=>{if(this.state.totalPaginationButton[1]<this.state.activePageSpecsTable&&this.state.totalPaginationButton[1]!=0){this.setState({activePageSpecsTable:temp[1]})}})
                    break;

            case 2: var temp=this.state.totalPaginationButton
                    temp[2]=Math.ceil(this.state.numberOfItemCategoriesTable/this.state.productTableSize)
                    this.setState({totalPaginationButton:temp},()=>{if(this.state.totalPaginationButton[2]<this.state.activePageCategoriesTable&&this.state.totalPaginationButton[2]!=0){this.setState({activePageCategoriesTable:temp[2]})}})
                    break;
            case 3: var temp=this.state.totalPaginationButton
                    temp[3]=Math.ceil(this.state.numberOfItemColoursTable/this.state.productTableSize)
                    this.setState({totalPaginationButton:temp},()=>{if(this.state.totalPaginationButton[3]<this.state.activePageColoursTable&&this.state.totalPaginationButton[3]!=0){this.setState({activePageColoursTable:temp[3]})}})
                    break;
            default:console.log("Invalid option")
                    break;
        }
    }
    handleFilterMinPrice(event){
        this.setState({filterMinMaxPrice:(parseFloat(event.target.value)+0.01)})
    }
    submitFilter(event){
        event.preventDefault();
        var formdata=new FormData();
        if(document.getElementById("filterName").value!=undefined){
          formdata.append("name",document.getElementById("filterName").value)
        }
            
        if(document.getElementsByName("minPrice")[0].value!=undefined){
            formdata.append("minPrice",document.getElementsByName("minPrice")[0].value)
        }
            
        if(document.getElementsByName("maxPrice")[0].value!=undefined){
            formdata.append("maxPrice",document.getElementsByName("maxPrice")[0].value)
        }
            
        if(document.getElementById("filterCategory").value!=undefined){
            formdata.append("category",document.getElementById("filterCategory").value)
        }
            
        if(document.getElementById("filterStatus").value!=undefined){
            formdata.append("status",document.getElementById("filterStatus").value)
        }
        
        const baseUrl="/NLP_Store/public/api/admin/filterProducts"
        axios.post(baseUrl,formdata).then(response=>{
            if(response.data.success){
                this.setState({listProducts:response.data.filter},()=>this.setState({numberOfItemProductTable:this.state.listProducts.length},()=>this.changeNumPagination(0)))
                console.log(this.state.activePageProductTable)
            }
            this.closeLoading()
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
    updateProductSentiment(){
        const baseUrl="/NLP_Store/public/api/admin/getAllProductSentimentPython"
        axios.get(baseUrl).then(response=>{
            this.setState({success:true})
            this.setState({message:response.data.message})
            this.closeLoading()
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
}
