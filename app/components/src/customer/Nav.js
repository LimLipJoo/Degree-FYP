import React, { Component } from 'react'; 
import { Link, Redirect } from "react-router-dom";
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import { Jumbotron, Modal, NavDropdown, Alert, Toast, Overlay } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Style from './Styles/Store.css';
import { InputGroup } from 'react-bootstrap';

export default class StoreNav extends Component {
  constructor(){
    super();
    this.state={
      //states for category dropdown
      productCategories:[],
      //state for login modal
      showLogin:false,
      showSignUp:false,

      //error states
      emailError:false,
      emailErrorMessage:"",

      confirmPasswordError:false,
      confirmPasswordErrorMessage:"",

      successSignUp:false,
      successSignUpMessage:"",
      
      passwordError:false,
      passwordErrorMessage:"",

      //Customer login status
      isCustomerLoggedIn:false,

      //state for showing profile overlay
      showProfile:false,
      overlayTarget:"",

      //Toast states
      showToast:false,
      toastMessage:"",

      //search
      searchQuery:"",
      searchRedirect:false,
    }
    this.overlayRefSmall=React.createRef()
    this.overlayRefBig=React.createRef()
    this.login=this.openLogin.bind(this)
  }
  componentDidMount(){
    axios.get("/NLP_Store/public/api/admin/getProductCategory").then(response=>{
      this.setState({productCategories:response.data.categories})
    }).catch(error=>{
      console.log(error)
    })
    if(this.props.login!==undefined)
      this.props.login(this.login);
    axios.get("/NLP_Store/public/api/customer/isCustomerLoggedIn").then(response=>{
      if(response.data.isCustomerLoggedIn){
        this.setState({isCustomerLoggedIn:true})
      }
    }).catch(error=>{
      console.log(error)
    })
  }
  render() {let path="/NLP_Store/public";
    return (
        <>
        <Navbar expand='lg' variant="light" fixed="top" style={{backgroundColor:"#9ddbfa"}}>
          
          <Navbar.Brand style={{color:"#4E6D7D"}} href="/NLP_Store/public/customer/index">NLP Store</Navbar.Brand>
          <Nav className="ml-auto rightNavSmall">
          <Overlay 
              show={this.state.showProfile}
              target={this.overlayRefSmall.current}
              placement="bottom">
                <div className="rightNavSmall" style={{zIndex:1030}}>
                {this.overlayContent()}
                </div>
          </Overlay>
            <Row style={{marginRight:"2vw"}}>
              <Col ><Nav.Link className="mr-2" ref={this.overlayRefSmall} href="" onClick={()=>this.openLogin()} ><FontAwesomeIcon icon={Icons.faUser} ></FontAwesomeIcon></Nav.Link></Col>
              <Col><Nav.Link className="mr-2" href={this.state.isCustomerLoggedIn?"/NLP_Store/public/customer/wishlist":""} onClick={()=>this.cart()}><FontAwesomeIcon icon={Icons.faHeart} ></FontAwesomeIcon></Nav.Link></Col>
              <Col><Nav.Link className="mr-2" href={this.state.isCustomerLoggedIn?"/NLP_Store/public/customer/cart":""} onClick={()=>this.cart()}><FontAwesomeIcon icon={Icons.faShoppingBag} ></FontAwesomeIcon></Nav.Link></Col>
            </Row>
              
              
              
          </Nav>
          <Navbar.Toggle aria-controls='navbar'></Navbar.Toggle>
          <Navbar.Collapse id='navbar'>
            <Nav className="mr-auto my-2 my-lg-0" >
              <NavDropdown title="Products" id='products' className="dropdownArrow">
                {this.state.productCategories.map((data,i)=>{
                  return(
                    <NavDropdown.Item href={"/NLP_Store/public/customer/category/"+data.category_id}>{data.category_name}</NavDropdown.Item>
                  )
                })}
              </NavDropdown>
              <Form id="searchBig" onSubmit={this.search.bind(this)}>
                <InputGroup>
                  <Form.Control onChange={this.handleSearch.bind(this)} value={this.state.searchQuery} type='input' placeholder="Search for Products" style={{paddingRight:"10vw"}}></Form.Control>
                  <Button className='btnSearch' type="submit"><FontAwesomeIcon icon={Icons.faSearch}></FontAwesomeIcon></Button>
                </InputGroup>
              </Form>
            </Nav>
            <Nav className="mr-4 my-2 my-lg-0 rightNavBig">
              <Overlay 
              show={this.state.showProfile}
              target={this.overlayRefBig.current}
              placement="bottom">
                <div className="rightNavBig" style={{zIndex:1030}}>
                {this.overlayContent()}
                </div>
              </Overlay>
              <Nav.Link className="mr-2" href="" ref={this.overlayRefBig} onClick={()=>this.openLogin()} ><FontAwesomeIcon icon={Icons.faUser} className="navIcons"></FontAwesomeIcon><span className="navIconText">User</span></Nav.Link>
              
              <Nav.Link className="mr-2" href={this.state.isCustomerLoggedIn?"/NLP_Store/public/customer/wishlist":""} onClick={()=>this.cart()}><FontAwesomeIcon icon={Icons.faHeart} className="navIcons"></FontAwesomeIcon><span className="navIconText">Wishlist</span></Nav.Link>
              <Nav.Link className="mr-2" href={this.state.isCustomerLoggedIn?"/NLP_Store/public/customer/cart":""} onClick={()=>this.cart()}><FontAwesomeIcon icon={Icons.faShoppingBag} className="navIcons"></FontAwesomeIcon><span className="navIconText">Cart</span></Nav.Link>
            </Nav>
            <Form id="searchSmall" onSubmit={this.search.bind(this)}>
                <InputGroup>
                  <Form.Control onChange={this.handleSearch.bind(this)} value={this.state.searchQuery} type='input' placeholder="Search for Products" style={{paddingRight:"10vw"}}></Form.Control>
                  <Button className='btnSearch' type="submit" ><FontAwesomeIcon icon={Icons.faSearch}></FontAwesomeIcon></Button>
                </InputGroup>
            </Form>
          </Navbar.Collapse>
          {this.state.searchRedirect?this.searchRedirect():""}
        </Navbar>
        <Toast className="ToastCustom" show={this.state.showToast} delay={5000} autohide onClose={()=>this.setState({showToast:false})}>
          <Toast.Header ><strong className="mr-auto my-2 my-lg-0">NLP Store</strong></Toast.Header>
          <Toast.Body>{this.state.toastMessage}</Toast.Body>
        </Toast>
        <Modal
        show={this.state.showLogin}
        onHide={()=>this.closeLogin()}
        backdrop="static"
        keyboard={false}
        size="md"
        >
          <Modal.Body>
                <Modal.Title className="mb-3">Sign In</Modal.Title>
                <Alert variant="success" show={this.state.successSignUp} dismissible onClose={()=>this.setState({successSignUp:false})}>{this.state.successSignUpMessage}</Alert>
                  <Form onSubmit={this.submitLogin.bind(this)}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control type="email" placeholder="E-mail" required></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loginPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control isInvalid={this.state.passwordError} type="password" placeholder="Password" required></Form.Control>
                      <Form.Control.Feedback type="invalid">{this.state.passwordErrorMessage}</Form.Control.Feedback>
                    </Form.Group>
                    <Link onClick={()=>this.noAcc()}><small>Don't have an account?</small></Link>
                    <div>
                    <Button variant="secondary" style={{float:"right"}} onClick={()=>this.closeLogin()}>Close</Button>
                    <Button style={{float:"right"}} type="submit">Login</Button></div>
                  </Form>
          </Modal.Body>
        </Modal>
        <Modal
        show={this.state.showSignUp}
        onHide={()=>this.closeSignUp()}
        backdrop="static"
        keyboard={false}
        size="md"
        >
          <Modal.Body>
            <Modal.Title className="mb-3">Sign Up</Modal.Title>
            <Form onSubmit={this.submitSignUp.bind(this)}>
              <Form.Group className="mb-3" controlId="name">
                <Row>
                  <Col>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="input" id="fname" placeholder="First Name" required></Form.Control>
                  </Col>
                  <Col>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="input" id="lname" placeholder="Last Name" required></Form.Control>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="signupEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control isInvalid={this.state.emailError} type="email" placeholder="E-mail" required></Form.Control>
                <Form.Control.Feedback type="invalid">{this.state.emailErrorMessage}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="signupPhone">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="tel" minLength="10" maxLength="10" placeholder="Phone Number" required></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="signupPassword">
                <Row>
                  <Col>
                    <Form.Label>Password</Form.Label>
                      <Form.Control id="signupPassword" type="password" placeholder="Password" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" minLength="8" required></Form.Control>
                    
                  </Col>
                  <Col>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control isInvalid={this.state.confirmPasswordError} id="confirmPassword"type="password" placeholder="Confirm Password" required></Form.Control>
                    <Form.Control.Feedback type="invalid">{this.state.confirmPasswordErrorMessage}</Form.Control.Feedback>
                  </Col>
                </Row>
              </Form.Group>
              <Alert className="mb-3" variant="info">Password Rules:<br></br>&bull; Must have at least 8 characters<br></br>&bull; Must have at least one uppercase character <br></br>&bull; Must have at least one lowercase character<br></br>&bull; Must have at least one number<br></br> &bull; Must have at least 1 special character</Alert>
              <div>
                <Button variant="secondary" style={{float:"right"}} onClick={()=>this.closeSignUp()}>Close</Button>
                <Button style={{float:"right"}} type="submit">Sign Up</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        </>
    )
  }
  openLogin(){
    if(this.state.isCustomerLoggedIn){
      this.setState({showProfile:!this.state.showProfile})
    }
    else{
      this.setState({showLogin:true})
    }
    
  }
  closeLogin(){
    this.setState({showLogin:false})
  }
  openSignUp(){
    this.setState({showSignUp:true})
  }
  closeSignUp(){
    this.setState({showSignUp:false,emailError:false,emailErrorMessage:"",confirmPasswordError:false,confirmPasswordErrorMessage:""})
  }
  noAcc(){
    this.closeLogin()
    this.openSignUp()
  }
  submitLogin(event){
    event.preventDefault();
    var formdata=new FormData();
    formdata.append("email",document.getElementById("loginEmail").value)
    formdata.append("password",document.getElementById("loginPassword").value)
    axios.post("/NLP_Store/public/api/customer/signIn",formdata).then(response=>{
      if(response.data.success){
        this.setState({isCustomerLoggedIn:true,showToast:true,toastMessage:response.data.message})
        if(this.props.isLogged!==undefined){
          this.props.isLogged(true)
        }
        this.closeLogin()
      }
      else{
        if(response.data.message.password){
          this.setState({passwordError:true,passwordErrorMessage:response.data.message.password.validateLogin})
        }
      }
    }).catch(error=>{
      console.log(error)
    })
  }
  submitSignUp(event){
    event.preventDefault();
    var formdata=new FormData();
    formdata.append("fname",document.getElementById("fname").value)
    formdata.append("lname",document.getElementById("lname").value)
    formdata.append("email",document.getElementById("signupEmail").value)
    formdata.append("password",document.getElementById("signupPassword").value)
    formdata.append("phone",document.getElementById("signupPhone").value)
    formdata.append("confirmPassword",document.getElementById("confirmPassword").value)
    axios.post("/NLP_Store/public/api/customer/signUp",formdata).then(response=>{
      if(!response.data.success){
        if(response.data.message.email){
          this.setState({emailError:true,emailErrorMessage:response.data.message.email})
        }
        else{
          this.setState({emailError:false,emailErrorMessage:""})
        }
        if(response.data.message.confirmPassword){
          this.setState({confirmPasswordError:true,confirmPasswordErrorMessage:response.data.message.confirmPassword})
        }
        else{
          this.setState({confirmPasswordError:false,confirmPasswordErrorMessage:""})
        }
      }
      else{
        this.setState({successSignUp:true,successSignUpMessage:response.data.message})
        this.closeSignUp()
        this.openLogin()
      }
    }).catch(error=>{
      console.log(error)
    })
  }
  overlayContent(){
    return(
      <Card>
        <Card.Body>
          <h6>Profile</h6>
          <Nav>
            <Nav.Link href="/NLP_Store/public/customer/orderHistory">Order History</Nav.Link>
            <Nav.Link onClick={()=>this.logout()}>Logout</Nav.Link>
          </Nav>
        </Card.Body>
      </Card>
    )
  }
  logout(){
    axios.get("/NLP_Store/public/api/customer/logout").then(response=>{
      if(response.data.success){
        this.setState({showToast:true,toastMessage:response.data.message,showProfile:false,isCustomerLoggedIn:false})
        if(this.props.isLogged!==undefined){
          this.props.isLogged(false)
        }
      }
    }).catch(error=>{
      console.log(error)
    })
  }
  cart(){
    if(!this.state.isCustomerLoggedIn){
      this.openLogin()
    }
  }
  handleSearch(event){
    this.setState({searchQuery:event.target.value})
  }
  search(event){
    event.preventDefault()
    if(this.state.searchQuery!="")
      this.setState({searchRedirect:true})
  }
  searchRedirect(){
    this.setState({searchRedirect:false})
    if(this.props.search!==undefined){
      this.props.search(this.state.searchQuery)
      return <Redirect to={'/NLP_Store/public/customer/search/'+this.state.searchQuery}/>
    }
    else{
      return <Redirect to={'/NLP_Store/public/customer/search/'+this.state.searchQuery}/>
    }
    
  }
}