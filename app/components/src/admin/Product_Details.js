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
import IsLogged from './IsLogged';
import SideBar from './SideBar';
import { Tabs,Tab,FormControl, Modal, Table, NavItem, Image, Badge,Nav } from 'react-bootstrap';
import {Doughnut, Line} from 'react-chartjs-2';
import ReactWordCloud from'react-wordcloud';

export default class Product_Details extends Component{
    constructor(){
        super();
        this.state={
            changeSize:false,
            product_details:[],
            product_image:"",
            product_specifications:[],
            specification_list:[],
            category_list:[],
            color_list:[],
            product_colours:[],
            countSpecs:[],
            showLoading:false,
            sentiment_data:[],
            doughnut:[],
            frequent_words:[],
            weeklySentiment:[],
            monthlySentiment:[],
            weeklySales:[],
            monthlySales:[]
        }
    }
    componentDidMount(){
        axios.get("/NLP_Store/public/api/admin/getProductDetails/"+this.props.match.params.id).then(response=>{
            this.setState({product_details:response.data.product},()=>this.setState({product_image:this.state.product_details.product_image.replace("..","/NLP_Store")}))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getProductSpecByType/"+this.props.match.params.id).then(response=>{
            console.log(response)
            this.setState({product_specifications:response.data.specs},()=>console.log(this.state.product_specifications))
            this.setState({countSpecs:response.data.specCount},()=>console.log(this.state.countSpecs))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getSpecType").then(response=>{
            this.setState({specification_list:response.data.specType},()=>console.log(this.state.specification_list))
            
        }).catch(error=>{
            console.log(error);
        })
        axios.get("/NLP_Store/public/api/admin/getProductCategory").then(response=>{
            this.setState({category_list:response.data.categories})
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getColours").then(response=>{
            this.setState({color_list:response.data.colours})
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getProductColours/"+this.props.match.params.id).then(response=>{
            this.setState({product_colours:response.data.productColours},()=>console.log(this.state.product_colours))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getFrequentWords/"+this.props.match.params.id).then(response=>{
            var temp=JSON.parse(response.data.frequent_words)
            var arr=[]
            for(var i=0;i<temp.length;i++){
                arr.push({'text':temp[i][0],'value':temp[i][1]})
            }
            this.setState({frequent_words:arr},()=>console.log(this.state.frequent_words))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getRecentSentimentData/"+this.props.match.params.id).then(response=>{
            var labels=[]
            var dataPositive=[]
            var dataNegative=[]
            for(var i=0;i<response.data.length;i++){
                labels.push(response.data[i].sentiment_date)
                dataPositive.push(response.data[i].num_positive)
                dataNegative.push(response.data[i].num_negative)
            }
            this.setState({weeklySentiment:{'labels':labels,'num_positive':dataPositive,'num_negative':dataNegative}},()=>console.log(this.state.weeklySentiment))
        }).catch(error=>{
            console.log(error)
        })
        axios.get("/NLP_Store/public/api/admin/getMonthlySentimentData/"+this.props.match.params.id).then(response=>{
            var labels=[]
            var dataPositive=[]
            var dataNegative=[]
            for(var i=0;i<response.data.length;i++){
                labels.push(response.data[i].sentiment_date)
                dataPositive.push(response.data[i].num_positive)
                dataNegative.push(response.data[i].num_negative)
            }
            this.setState({monthlySentiment:{'labels':labels,'num_positive':dataPositive,'num_negative':dataNegative}},()=>console.log(this.state.weeklySentiment))
        }).catch(error=>{
            console.log(error)
        })
        this.getSentiment()
        this.getWeeklySales()
        this.getMonthlySales()
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
                        <Tabs defaultActiveKey="details" id='productTabs' className='mb-3'>
                            <Tab eventKey='details' title='Product Details'>
                                <Row className="mb-3">
                                    <Col>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                
                                                <Row>
                                                    
                                                <Col md={5}><Image src={this.state.product_image} style={{display:"block",width:"100%",height:"auto"}} fluid></Image></Col>
                                                <Col>
                                                        <h5 class="mt-3">{this.state.product_details.product_name}<Badge style={{color:"white",marginLeft:'0.5vw'}} className={this.state.sentiment_data.avg_compound<0.5?"bg-danger":this.state.sentiment_data.avg_compound<0.75?"bg-warning":"bg-success"}>{parseInt(this.state.sentiment_data.avg_compound*100)}</Badge></h5>
                                                        <span class="mb-3">Initial Price: RM {this.state.product_details.product_price}</span>
                                                        <h6 class="mt-3">Category</h6>
                                                        <span class="mb-3">{this.convertCategory(this.state.product_details.product_category)}</span>
                                                        <h6 class="mt-3">Quantity</h6>
                                                        <span class="mb-3">{this.state.product_details.product_quantity +" in stock"}</span>
                                                        <h6 class="mt-3">Status</h6>
                                                        <span class="mb-3">{this.state.product_details.product_status==1?"Enabled":"Disabled"}</span>
                                                        <h6 class="mt-3">Available Colours</h6>
                                                        <span class="mb-3">
                                                            <Row style={{paddingLeft:"15px"}}>
                                                            {this.state.product_colours.map((data,i)=>{
                                                                return(
                                                                    <Col xs={1} style={{margin:0,padding:0}}>
                                                                        <div style={{height:"3vh",width:"1.5vw",backgroundColor:this.convertColour(data.colour_id),border:" solid 3px black"}}></div>
                                                                            
                                                                    </Col>
                                                                    ) 
                                                            })}
                                                            </Row>
                                                        </span>
                                                        <h6 class="mt-3 mb-3">Specs</h6>
                                                        <Table className="mb-3">
                                                            <thead>
                                                                <th>Type</th>
                                                                <th>Specs</th>
                                                                <th>Price (RM)</th>
                                                            </thead>
                                                            <tbody>
                                                                {this.mapSpecs()}
                                                            </tbody>
                                                        </Table>
                                                </Col> 
                                                </Row>
                                                
                                                
                                            </Card.Body>
                                        </Card>
                                        
                                    </Col>
                                    <Col md={3}>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <h5>Sentiment Ratio</h5>
                                                <Doughnut data={this.state.doughnut} width="10vw" height="5vh">

                                                </Doughnut>
                                            </Card.Body>
                                        </Card>
                                        <Card className="mb-3">
                                            <Card.Body>
                                                <h5>Recent Frequent Words</h5>
                                                <ReactWordCloud className="mx-auto" words={this.state.frequent_words} style={{display:"block",width:"15vw",height:"15vh"}} options={{fontSizes:[15,25]}}></ReactWordCloud>
                                            </Card.Body>
                                        </Card>
                                        
                                        
                                    </Col>
                                    
                                    
                                    
                                </Row>
                            </Tab>
                            <Tab eventKey='statistics' title='Product Statistics'>
                                <Row className="mb-3">
                                    <Col xs={6}>
                                    <Tabs  defaultActiveKey="weekly" id='sentimentTabs' className='mb-3'>
                                        <Tab eventKey='weekly' title='Weekly'>
                                            <Card >
                                                <Card.Body >
                                                    <h5>Weekly Sentiment Trend</h5>
                                                    <Line data={{labels:this.state.weeklySentiment['labels'],datasets:[{label:"Number of positive tweets",data:this.state.weeklySentiment['num_positive'],backgroundColor:'rgba(91,240,61)',borderColor:'rgba(91,240,61,0.8)'},
                                                {label:"Number of negative tweets",data:this.state.weeklySentiment['num_negative'],backgroundColor:'rgba(239,37,37)',borderColor:'rgba(239,37,37,0.8)'}
                                                ]}}></Line>
                                                </Card.Body>
                                            </Card>
                                        </Tab>
                                        <Tab eventKey='monthly' title='Monthly'>
                                            <Card>
                                                <Card.Body>
                                                    <h5>Monthly Sentiment Trend</h5>
                                                    <Line data={{labels:this.state.monthlySentiment['labels'],datasets:[{label:"Number of positive tweets",data:this.state.monthlySentiment['num_positive'],backgroundColor:'rgba(91,240,61)',borderColor:'rgba(91,240,61,0.8)'},
                                                {label:"Number of negative tweets",data:this.state.monthlySentiment['num_negative'],backgroundColor:'rgba(239,37,37)',borderColor:'rgba(239,37,37,0.8)'}
                                                ]}}></Line>
                                                </Card.Body>
                                            </Card>
                                        </Tab>
                                    </Tabs>
                                        
                                    </Col>
                                    <Col xs={6}>
                                    <Tabs  defaultActiveKey="weekly" id='salesTabs' className='mb-3'>
                                        <Tab eventKey='weekly' title='Weekly'>
                                            <Card >
                                                <Card.Body >
                                                    <h5>Weekly Sales Trend</h5>
                                                    <Line data={{labels:this.state.weeklySales['labels'],datasets:[{label:"Number of product sold",data:this.state.weeklySales['quantity'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                ]}}></Line>
                                                </Card.Body>
                                            </Card>
                                        </Tab>
                                        <Tab eventKey='monthly' title='Monthly'>
                                            <Card>
                                                <Card.Body>
                                                    <h5>Monthly Sales Trend</h5>
                                                    <Line data={{labels:this.state.monthlySales['labels'],datasets:[{label:"Number of product sold",data:this.state.monthlySales['quantity'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                ]}}></Line>
                                                </Card.Body>
                                            </Card>
                                        </Tab>
                                    </Tabs>
                                        
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
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
    getWeeklySales(){
        axios.get("/NLP_Store/public/api/admin/getRecentProductSales/"+this.props.match.params.id).then(response=>{
            var labels=[]
            var quantity=[]
            for(var i=0;i<response.data.length;i++){
                labels.push(response.data[i].order_date)
                quantity.push(response.data[i].quantity)
            }
            this.setState({weeklySales:{'labels':labels,'quantity':quantity}})
        }).catch(error=>{
            console.log(error)
        })
    }
    getMonthlySales(){
        axios.get("/NLP_Store/public/api/admin/getMonthlyProductSales/"+this.props.match.params.id).then(response=>{
            var labels=[]
            var quantity=[]
            for(var i=0;i<response.data.length;i++){
                labels.push(response.data[i].order_date)
                quantity.push(response.data[i].quantity)
            }
            this.setState({monthlySales:{'labels':labels,'quantity':quantity}})
        }).catch(error=>{
            console.log(error)
        })
    }
    convertCategory(id){
        for(var i=0;i<this.state.category_list.length;i++){
            if(this.state.category_list[i].category_id==id)
                return this.state.category_list[i].category_name
        }
    }
    convertColour(id){
        for(var i=0;i<this.state.color_list.length;i++){
            if(this.state.color_list[i].colour_id==id)
                return this.state.color_list[i].colour_code
        }
    }
    convertSpecs(id){
        for(var i=0;i<this.state.specification_list.length;i++){
            if(this.state.specification_list[i].product_specification_type_id==id)
                return this.state.specification_list[i].product_specification_type
        }
    }
    mapSpecs(){
        
        var count=0;
        var spec_no=0;
        if(this.state.countSpecs[spec_no]!=undefined){
           return this.state.product_specifications.map((data,i)=>{
                if(count==0){
                    count++
                return(
                    <tr>
                        <td rowspan={this.state.countSpecs[spec_no].count}><b>{this.convertSpecs(data.specification_type)}</b></td>
                        <td>{data.specification_name}</td>
                        <td>{data.specification_price}</td>
                    </tr>
                    ) 
                    
                }
                else if(count>=this.state.countSpecs[spec_no].count){
                    count=1
                    spec_no++
                    return(
                        <tr>
                            <td rowspan={this.state.countSpecs[spec_no].count}><b>{this.convertSpecs(data.specification_type)}</b></td>
                            <td>{data.specification_name}</td>
                            <td>{data.specification_price}</td>
                        </tr>
                        ) 
                }
                else{
                    count++
                return(
                    <tr>
                        <td>{data.specification_name}</td>
                        <td>{data.specification_price}</td>
                    </tr>
                    ) 
                }
            
            }) 
        }
        
    }
    getSentiment(){
        axios.get("/NLP_Store/public/api/admin/getSentimentProductPython/"+this.props.match.params.id).then(response=>{
            axios.get("/NLP_Store/public/api/admin/getSentimentData/"+this.props.match.params.id).then(response=>{
                this.setState({sentiment_data:response.data.sentiment},()=>this.fillDoughtnut())
                this.closeLoading()
            }).catch(error=>{
                console.log(error)
            })
        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
    openLoading(){
        this.setState({showLoading:true})
    }
    closeLoading(){
        this.setState({showLoading:false})
    }
    fillDoughtnut(){
        this.setState({doughnut:{labels:['Number of positive tweets','Number of negative tweets']
        ,datasets:[{label:"Sentiment Ratio",data:[this.state.sentiment_data.num_positive,this.state.sentiment_data.num_negative],backgroundColor:['rgba(91,240,61,0.8)','rgba(239,37,37,0.8)']}]
    }},()=>console.log(this.state.doughnut))
    console.log(this.state.sentiment_data)
    }
}