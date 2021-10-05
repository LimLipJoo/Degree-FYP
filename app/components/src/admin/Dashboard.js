import React, { Component } from 'react';
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
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from "react-router";
import Style from './Styles/Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import {Doughnut, Line} from 'react-chartjs-2';
import ReactWordCloud from'react-wordcloud';
import { Tabs,Tab,Table } from 'react-bootstrap';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

import IsLogged from './IsLogged';
import SideBar from './SideBar';

export default class Dashboard extends Component{
    constructor(){
        super();
        this.state={
            changeSize:false,
            showLoading:false,
            weeklySales:[],
            monthlySales:[],
            weeklySentiment:[],
            monthlySentiment:[],
            totalTweets:0,
            revenue:0,
            totalSales:0,
            numCustomer:0,
            frequent_words:[],
            sentiment_data:[],
            doughnut:[],
            heightDoughnut:"",
            weeklyRevenue:[],
            monthlyRevenue:[],
            salesYearData:[],
            salesYearLabel:[],
            revenueYearLabel:[],
            revenueYearData:[],
            sentimentYearLabel:[],
            sentimentYearData:[],
            customSales:[],
            customRevenue:[],
            customSentiment:[],
            recommend:[],
        }
    }
    componentDidMount(){
        window.addEventListener("resize",this.resize.bind(this))
        this.resize()
        this.updateSentimentBrand()
    }
    
    render(){
        
        return(
            
            <Container fluid  style={{margin:0,padding:0,height:"100%"}}>
                <Row style={{height:"100%"}}>
                    <IsLogged/>
                    <SideBar location={location.pathname} ></SideBar>
                    <Col id="content" className="content">
                        <Row className="mb-3">
                            <Col className="mb-3" xs={3}>
                                <Card className="dashboardColor">
                                    <Card.Body>
                                        
                                        <Row>
                                            <Col className="my-auto d-flex justify-content-center">
                                                <FontAwesomeIcon icon={Icons.faUser} className="fa-3x"></FontAwesomeIcon>
                                            </Col>
                                            <Col className="my-auto">
                                                <Row>
                                                    <Col><h6 className="mb-3">Customers</h6></Col>
                                                    
                                                </Row>
                                                <Row>
                                                    <Col>{this.state.numCustomer}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="mb-3" xs={3}>
                                <Card className="dashboardColor">
                                    <Card.Body>
                                        
                                        <Row>
                                            <Col className="my-auto d-flex justify-content-center">
                                                <FontAwesomeIcon icon={Icons.faClipboard} className="fa-3x"></FontAwesomeIcon>
                                            </Col>
                                            <Col className="my-auto">
                                                <Row>
                                                    <Col><h6   className="mb-3">Sales</h6></Col>
                                                    
                                                </Row>
                                                <Row>
                                                    <Col>{this.state.numCustomer}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="mb-3" xs={3}>
                                <Card className="dashboardColor">
                                    <Card.Body>
                                        
                                        <Row>
                                            <Col className="my-auto d-flex justify-content-center">
                                                <FontAwesomeIcon icon={Icons.faMoneyBill} className="fa-3x"></FontAwesomeIcon>
                                            </Col>
                                            <Col className="my-auto">
                                                <Row>
                                                    <Col><h6  className="mb-3">Revenue</h6></Col>
                                                    
                                                </Row>
                                                <Row>
                                                    <Col>RM {this.state.revenue==undefined?0:this.state.revenue}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="mb-3" xs={3}>
                                <Card className="dashboardColor">
                                    <Card.Body>
                                        
                                        <Row>
                                            <Col className="my-auto d-flex justify-content-center">
                                                <FontAwesomeIcon icon={Icons.faRetweet} className="fa-3x"></FontAwesomeIcon>
                                            </Col>
                                            <Col className="my-auto">
                                                <Row>
                                                    <Col><h6  className="mb-3">Tweets</h6></Col>
                                                    
                                                </Row>
                                                <Row>
                                                    <Col>{this.state.totalTweets}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Card>
                                    <Card.Body>
                                        <h5 className="mb-3">Recommended Action</h5>
                                        <Table className="text-center" responsive striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Recommended Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                
                                                {this.state.recommend.length==0?<tr ><td colspan="2">No recommended actions</td></tr>:this.state.recommend.map(data=>{
                                                    
                                                    if(parseFloat(data.compound)>0.75){
                                                        return(
                                                            <tr>
                                                                <td>{data.product_name}</td>
                                                                <td style={{color:"green"}} className="my-auto"><FontAwesomeIcon style={{marginRight:"5px"}} icon={Icons.faCheckCircle}></FontAwesomeIcon>Increase amount of stock for this item due to very positive sentiments received.</td>
                                                            </tr>  
                                                        )
                                                        
                                                    }
                                                    else if(parseFloat(data.compound)<0.5){
                                                        return(
                                                            <tr>
                                                                <td>{data.product_name}</td>
                                                                <td style={{color:"crimson"}} className="my-auto"><FontAwesomeIcon style={{marginRight:"5px"}} icon={Icons.faTimesCircle}></FontAwesomeIcon>Decrease amount of stock or discontinue this item due to poor sentiments received.</td>
                                                            </tr>
                                                        )
                                                        
                                                    }
                                                    
                                                })}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mb-3" >
                            <Col xs={6} className="mb-3">
                                <Card>
                                    <Card.Body>
                                        <Tabs  defaultActiveKey="weeklySales" id='salesTabs' className='mb-3'>
                                            <Tab eventKey='weeklySales' title='Weekly'>
                                                
                                                        <h5>Weekly Sales Trend</h5>
                                                        <Line data={{labels:this.state.weeklySales['labels'],datasets:[{label:"Number of product sold",data:this.state.weeklySales['quantity'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                    ]}}></Line>
                                            </Tab>
                                            <Tab eventKey='monthlySales' title='Monthly'>
                                                
                                                        <h5>Monthly Sales Trend</h5>
                                                        <Line data={{labels:this.state.monthlySales['labels'],datasets:[{label:"Number of product sold",data:this.state.monthlySales['quantity'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                    ]}}></Line>
                                            </Tab>
                                            <Tab eventKey='customSales' title='Custom'>
                                                        
                                                        <h5>Custom Sales Trend</h5>
                                                        <Form onSubmit={this.customSales.bind(this)}>
                                                            <Row className="mb-3">
                                                                <Col xs={4}><Form.Control type="date" id='startSales' onChange={this.handleSalesDate.bind(this)} required></Form.Control></Col>
                                                                <Col xs={1}>~</Col>
                                                                <Col xs={4}><Form.Control type="date" id='endSales' required ></Form.Control></Col>
                                                                <Col><Button type="submit">Search</Button></Col>
                                                            </Row>
                                                        </Form>
                                                        <Line data={{labels:this.state.customSales['labels'],datasets:[{label:"Number of product sold",data:this.state.customSales['quantity'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                    ]}}></Line>
                                            </Tab>
                                            <Tab eventKey='yearComparison' title='Comparison (Year)'>
                                                <h5>Yearly Sales Comparison</h5>
                                                <Line data={this.state.salesYearData.length!=0?{labels:this.state.salesYearLabel,datasets:[{label:this.state.salesYearData[0].label,data:this.state.salesYearData[0].data,backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'},
                                                {label:this.state.salesYearData[1].label,data:this.state.salesYearData[1].data,backgroundColor:'rgba(252, 186, 3)',borderColor:'rgba(252, 186, 3,0.8)'},
                                                {label:this.state.salesYearData[2].label,data:this.state.salesYearData[2].data,backgroundColor:'rgba(198, 3, 252)',borderColor:'rgba(198, 3, 252,0.8)'}
                                                ]}:{}}></Line>
                                            </Tab>
                                        </Tabs>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={6} className="mb-3">
                                <Card >
                                    <Card.Body>
                                        <Tabs  defaultActiveKey="weeklyRevenue" id='revenueTabs' className='mb-3'>
                                            <Tab eventKey='weeklyRevenue' title='Weekly'>
                                                
                                                        <h5>Weekly Revenue Trend</h5>
                                                        <Line data={{labels:this.state.weeklyRevenue['labels'],datasets:[{label:"Revenue",data:this.state.weeklyRevenue['revenue'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                    ]}}></Line>
                                            </Tab>
                                            <Tab eventKey='monthlyRevenue' title='Monthly'>
                                                
                                                        <h5>Monthly Revenue Trend</h5>
                                                        <Line data={{labels:this.state.monthlyRevenue['labels'],datasets:[{label:"Revenue",data:this.state.monthlyRevenue['revenue'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                    ]}}></Line>
                                            </Tab>
                                            <Tab eventKey='customRevenue' title='Custom'>
                                                        
                                                        <h5>Custom Revenue Trend</h5>
                                                        <Form onSubmit={this.customRevenue.bind(this)}>
                                                            <Row className="mb-3">
                                                                <Col xs={4}><Form.Control type="date" id='startRevenue' onChange={this.handleRevenueDate.bind(this)} required></Form.Control></Col>
                                                                <Col xs={1}>~</Col>
                                                                <Col xs={4}><Form.Control type="date" id='endRevenue' required ></Form.Control></Col>
                                                                <Col><Button type="submit">Search</Button></Col>
                                                            </Row>
                                                        </Form>
                                                        <Line data={{labels:this.state.customRevenue['labels'],datasets:[{label:"Number of product sold",data:this.state.customRevenue['revenue'],backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'}
                                                    ]}}></Line>
                                            </Tab>
                                            <Tab eventKey='yearComparison' title='Comparison (Year)'>
                                                <h5>Yearly Revenue Comparison</h5>
                                                <Line data={this.state.revenueYearData.length!=0?{labels:this.state.revenueYearLabel,datasets:[{label:this.state.revenueYearData[0].label,data:this.state.revenueYearData[0].data,backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'},
                                                {label:this.state.revenueYearData[1].label,data:this.state.revenueYearData[1].data,backgroundColor:'rgba(252, 186, 3)',borderColor:'rgba(252, 186, 3,0.8)'},
                                                {label:this.state.revenueYearData[2].label,data:this.state.revenueYearData[2].data,backgroundColor:'rgba(198, 3, 252)',borderColor:'rgba(198, 3, 252,0.8)'}
                                                ]}:{}}></Line>
                                            </Tab>
                                        </Tabs>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3} className="mb-3">
                                <Card id="doughnut" >
                                    <Card.Body >
                                        <h5>Sentiment Ratio</h5>
                                          <Doughnut data={this.state.doughnut}>

                                          </Doughnut>  
                                        
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={3} className="mb-3">
                                <Card >
                                    <Card.Body  className="my-auto">
                                        <h5>Frequent Words</h5>
                                        <ReactWordCloud className="mx-auto" words={this.state.frequent_words} style={{display:"block",height:"200px"}} options={{fontSizes:[15,25]}}></ReactWordCloud>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={6} className="mb-3">
                                <Card>
                                    <Card.Body>
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
                                            <Tab eventKey='customSentiment' title='Custom'>
                                                        
                                                        <h5>Custom Sentiment Trend</h5>
                                                        <Form onSubmit={this.customSentiment.bind(this)}>
                                                            <Row className="mb-3">
                                                                <Col xs={4}><Form.Control type="date" id='startSentiment' onChange={this.handleSentimentDate.bind(this)} required></Form.Control></Col>
                                                                <Col xs={1}>~</Col>
                                                                <Col xs={4}><Form.Control type="date" id='endSentiment' required ></Form.Control></Col>
                                                                <Col><Button type="submit">Search</Button></Col>
                                                            </Row>
                                                        </Form>
                                                        <Line data={{labels:this.state.customSentiment['labels'],datasets:[{label:"Number of positive tweets",data:this.state.customSentiment['num_positive'],backgroundColor:'rgba(91,240,61)',borderColor:'rgba(91,240,61,0.8)'},
                                                    {label:"Number of negative tweets",data:this.state.customSentiment['num_negative'],backgroundColor:'rgba(239,37,37)',borderColor:'rgba(239,37,37,0.8)'}
                                                    ]}}></Line>
                                            </Tab>
                                            <Tab eventKey='yearComparison' title='Comparison (Year)'>
                                                <h5>Yearly Sentiment Comparison</h5>
                                                <Line data={this.state.sentimentYearData.length!=0?{labels:this.state.sentimentYearLabel,datasets:[{label:this.state.sentimentYearData[0].label,data:this.state.sentimentYearData[0].data,backgroundColor:'rgba(0, 204, 255)',borderColor:'rgba(0, 204, 255,0.8)'},
                                                {label:this.state.sentimentYearData[1].label,data:this.state.sentimentYearData[1].data,backgroundColor:'rgba(252, 186, 3)',borderColor:'rgba(252, 186, 3,0.8)'},
                                                {label:this.state.sentimentYearData[2].label,data:this.state.sentimentYearData[2].data,backgroundColor:'rgba(198, 3, 252)',borderColor:'rgba(198, 3, 252,0.8)'}
                                                ]}:{}}></Line>
                                            </Tab>
                                        </Tabs>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
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
    updateSentimentBrand(){
        axios.get("/NLP_Store/public/api/admin/getSentimentStorePython").then(response=>{
            this.closeLoading()
            this.getWeeklySales()
            this.getMonthlySales()
            this.getWeeklySentiment()
            this.getMonthlySentiment()
            this.getWeeklyRevenue()
            this.getMonthlyRevenue()
            this.getNumCustomer()
            this.getTotalSales()
            this.getTotalRevenue()
            this.getTotalTweets()
            this.getFrequentWords()
            this.getOverallSentiment()
            this.salesYear()
            this.revenueYear()
            this.sentimentYear()
            this.getRecommendedAction()

        }).catch(error=>{
            console.log(error)
        })
        this.openLoading()
    }
    getWeeklySales(){
        axios.get("/NLP_Store/public/api/admin/getWeeklyTotalSales").then(response=>{
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
        axios.get("/NLP_Store/public/api/admin/getMonthlyTotalSales").then(response=>{
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
    getWeeklyRevenue(){
        axios.get("/NLP_Store/public/api/admin/getWeeklyTotalRevenue").then(response=>{
            var labels=[]
            var revenue=[]
            for(var i=0;i<response.data.length;i++){
                labels.push(response.data[i].order_date)
                revenue.push(response.data[i].revenue)
            }
            this.setState({weeklyRevenue:{'labels':labels,'revenue':revenue}})
        }).catch(error=>{
            console.log(error)
        })
    }
    getMonthlyRevenue(){
        axios.get("/NLP_Store/public/api/admin/getMonthlyTotalRevenue").then(response=>{
            console.log(response)
            var labels=[]
            var revenue=[]
            for(var i=0;i<response.data.length;i++){
                labels.push(response.data[i].order_date)
                revenue.push(response.data[i].revenue)
            }
            this.setState({monthlyRevenue:{'labels':labels,'revenue':revenue}},()=>console.log(this.state.monthlyRevenue))
        }).catch(error=>{
            console.log(error)
        })
    }
    getWeeklySentiment(){
        axios.get("/NLP_Store/public/api/admin/getWeeklyBrandSentiment").then(response=>{
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
    }
    getMonthlySentiment(){
        axios.get("/NLP_Store/public/api/admin/getMonthlyBrandSentiment").then(response=>{
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
    }
    getNumCustomer(){
        axios.get("/NLP_Store/public/api/admin/getNumberOfCustomers").then(response=>{
            this.setState({numCustomer:response.data.numCustomers})
        }).catch(error=>{
            console.log(error)
        })
    }
    getTotalSales(){
        axios.get("/NLP_Store/public/api/admin/getMonthlySales").then(response=>{
            this.setState({totalSales:response.data.numSales})
        }).catch(error=>{
            console.log(error)
        })
    }
    getTotalRevenue(){
        axios.get("/NLP_Store/public/api/admin/getMonthlyRevenue").then(response=>{
            this.setState({revenue:response.data.revenue})
        }).catch(error=>{
            console.log(error)
        })
    }
    getTotalTweets(){
        axios.get("/NLP_Store/public/api/admin/getTotalTweets").then(response=>{
            this.setState({totalTweets:response.data.numTweets})
        }).catch(error=>{
            console.log(error)
        })
    }
    getFrequentWords(){
        axios.get("/NLP_Store/public/api/admin/getFrequentWordsBrand").then(response=>{
            var temp=JSON.parse(response.data.frequent_words)
            var arr=[]
            for(var i=0;i<temp.length;i++){
                arr.push({'text':temp[i][0],'value':temp[i][1]})
            }
            this.setState({frequent_words:arr})
        }).catch(error=>{
            console.log(error)
        })
    }
    getOverallSentiment(){
        axios.get("/NLP_Store/public/api/admin/getSentimentDataBrand").then(response=>{
            this.setState({sentiment_data:response.data.sentiment},()=>this.fillDoughtnut())
            this.closeLoading()
        }).catch(error=>{
            console.log(error)
        })
    }
    fillDoughtnut(){
        this.setState({doughnut:{labels:['Number of positive tweets','Number of negative tweets']
        ,datasets:[{label:"Sentiment Ratio",data:[this.state.sentiment_data.num_positive,this.state.sentiment_data.num_negative],backgroundColor:['rgba(91,240,61,0.8)','rgba(239,37,37,0.8)']}]
    }},()=>console.log(this.state.doughnut))
    console.log(this.state.sentiment_data)
    }
    openLoading(){
        this.setState({showLoading:true})
    }
    closeLoading(){
        this.setState({showLoading:false})
    }
    salesYear(){
        axios.get("/NLP_Store/public/api/admin/salesYear").then(response=>{
            console.log(response)
            var labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
            var thisyear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.sales!=undefined){
              for(var i=0;i<response.data.sales.length;i++){
                thisyear[response.data.sales[i].month-1]=response.data.sales[i].numSales;
                }  
            }
            var lastYear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.sales2!=undefined){
                for(var i=0;i<response.data.sales2.length;i++){
                    lastYear[response.data.sales2[i].month-1]=response.data.sales2[i].numSales;
                }
            }
            
            var lastlastYear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.sales3!=undefined){
              for(var i=0;i<response.data.sales3.length;i++){
                lastlastYear[response.data.sales3[i].month-1]=response.data.sales3[i].numSales;
                }  
            }
            
            this.setState({salesYearData:[{label:response.data.labels.year1,data:thisyear},{label:response.data.labels.year2,data:lastYear},{label:response.data.labels.year3,data:lastlastYear}]},()=>console.log(this.state.salesYearData))
            this.setState({salesYearLabel:labels})
        }).catch(error=>{
            console.log(error)
        })
    }
    revenueYear(){
        axios.get("/NLP_Store/public/api/admin/revenueYear").then(response=>{
            console.log(response)
            var labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
            var thisyear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.revenue!=undefined){
              for(var i=0;i<response.data.revenue.length;i++){
                thisyear[response.data.revenue[i].month-1]=response.data.revenue[i].revenue;
                }  
            }
            var lastYear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.revenue2!=undefined){
                for(var i=0;i<response.data.revenue2.length;i++){
                    lastYear[response.data.revenue2[i].month-1]=response.data.revenue2[i].revenue;
                }
            }
            
            var lastlastYear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.revenue3!=undefined){
              for(var i=0;i<response.data.revenue3.length;i++){
                lastlastYear[response.data.revenue3[i].month-1]=response.data.revenue3[i].revenue;
                }  
            }
            
            this.setState({revenueYearData:[{label:response.data.labels.year1,data:thisyear},{label:response.data.labels.year2,data:lastYear},{label:response.data.labels.year3,data:lastlastYear}]},()=>console.log(this.state.revenueYearData))
            this.setState({revenueYearLabel:labels})
        }).catch(error=>{
            console.log(error)
        })
        
    }
    sentimentYear(){
        axios.get("/NLP_Store/public/api/admin/sentimentYear").then(response=>{
            console.log(response)
            var labels=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
            var thisyear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.sentiment!=undefined){
              for(var i=0;i<response.data.sentiment.length;i++){
                thisyear[response.data.sentiment[i].month-1]=response.data.sentiment[i].compound;
                }  
            }
            var lastYear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.sentiment2!=undefined){
                for(var i=0;i<response.data.sentiment2.length;i++){
                    thisyear[response.data.sentiment2[i].month-1]=response.data.sentiment2[i].compound;
                }
            }
            
            var lastlastYear=[0,0,0,0,0,0,0,0,0,0,0,0]
            if(response.data.sentiment3!=undefined){
              for(var i=0;i<response.data.sentiment3.length;i++){
                thisyear[response.data.sentiment3[i].month-1]=response.data.sentiment3[i].compound;
                }  
            }
            
            this.setState({sentimentYearData:[{label:response.data.labels.year1,data:thisyear},{label:response.data.labels.year2,data:lastYear},{label:response.data.labels.year3,data:lastlastYear}]})
            this.setState({sentimentYearLabel:labels})
        }).catch(error=>{
            console.log(error)
        })
        
    }
    handleSalesDate(event){
        document.getElementById('endSales').min=event.target.value;
    }
    handleRevenueDate(event){
        document.getElementById('endRevenue').min=event.target.value;
    }
    handleSentimentDate(event){
        document.getElementById('endSentiment').min=event.target.value;
    }
    customSales(event){
        event.preventDefault();
        var formdata=new FormData();
        formdata.append('start',document.getElementById('startSales').value)
        formdata.append('end',document.getElementById('endSales').value)
        axios.post("/NLP_Store/public/api/admin/customSales",formdata).then(response=>{
            console.log(response)
            var labels=[]
            var quantity=[]
            for(var i=0;i<response.data.sales.length;i++){
                labels.push(response.data.sales[i].order_date)
                quantity.push(response.data.sales[i].quantity)
            }
            this.setState({customSales:{'labels':labels,'quantity':quantity}})
        }).catch(error=>{
            console.log(error)
        })
    }
    customRevenue(event){
        event.preventDefault();
        var formdata=new FormData();
        formdata.append('start',document.getElementById('startRevenue').value)
        formdata.append('end',document.getElementById('endRevenue').value)
        axios.post("/NLP_Store/public/api/admin/customRevenue",formdata).then(response=>{
            console.log(response)
            var labels=[]
            var revenue=[]
            for(var i=0;i<response.data.revenue.length;i++){
                labels.push(response.data.revenue[i].order_date)
                revenue.push(response.data.revenue[i].revenue)
            }
            this.setState({customRevenue:{'labels':labels,'revenue':revenue}})
        }).catch(error=>{
            console.log(error)
        })
    }
    customSentiment(event){
        event.preventDefault();
        var formdata=new FormData();
        formdata.append('start',document.getElementById('startSentiment').value)
        formdata.append('end',document.getElementById('endSentiment').value)
        axios.post("/NLP_Store/public/api/admin/customSentiment",formdata).then(response=>{
            var labels=[]
            var dataPositive=[]
            var dataNegative=[]
            for(var i=0;i<response.data.length;i++){
                labels.push(response.data[i].sentiment_date)
                dataPositive.push(response.data[i].num_positive)
                dataNegative.push(response.data[i].num_negative)
            }
            this.setState({customSentiment:{'labels':labels,'num_positive':dataPositive,'num_negative':dataNegative}})   
        }).catch(error=>{
            console.log(error)
        })
    }
    getRecommendedAction(){
        axios.get("/NLP_Store/public/api/admin/getRecommendedAction").then(response=>{
            this.setState({recommend:response.data},()=>console.log(this.state.recommend))
        }).catch(error=>{
            console.log(error)
        })
    }
}

