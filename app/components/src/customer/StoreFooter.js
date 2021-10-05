import React, { Component, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-brands-svg-icons';

export default class StoreFooter extends Component{
    constructor(){
        super();
    }
    componentDidMount(){

    }
    render(){
        return(
            <Container fluid className="justify-content-center"  style={{height:"100%"}} style={{backgroundColor:"#9ddbfa"}}>
                <Row className="justify-content-center mt-5 ">
                    <Button className="btnFooter"><FontAwesomeIcon icon={Icons.faTwitter}></FontAwesomeIcon></Button>
                    <Button className="btnFooter"><FontAwesomeIcon icon={Icons.faFacebookF}></FontAwesomeIcon></Button>
                    <Button className="btnFooter"><FontAwesomeIcon icon={Icons.faInstagram}></FontAwesomeIcon></Button>
                </Row>
                <Row className="justify-content-center mt-3" style={{color:'white'}}>Info &bull; Design &bull; Marketing</Row>
                <Row className="justify-content-center mt-3" style={{color:'white'}}>Terms of Use | Privacy Policy</Row>
                <Row className="justify-content-center mt-3 mb-5" style={{color:'white'}}> @2022 Lim Lip Joo</Row>
            </Container>
        )
    }
}