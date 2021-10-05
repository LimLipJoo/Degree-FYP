import React, { Component } from 'react'; 
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class List extends Component {
  constructor(){
    super();
    this.state={
      listCustomer:[]
    }
  }
  componentDidMount(){
    console.log("Mounted App Component");
    axios.get('http://localhost/NLP_Store/public/api/customer/list').then(response=>{
      console.log(response.data);
      this.setState({listCustomer:response.data.data})
    }).catch(error=>{
      alert("Error ===>"+error);
    })
  }
  render() {
    return (
      <section>
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Phone</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.listCustomer.map((data,i)=>{
              return(
                <tr>
                <th scope="row">{data.id}</th>
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>{data.address}</td>
                <td>{data.phone}</td>
                <td>
                  <Link to={"edit/"+data.id} class="btn btn-light"> Edit </Link>
                  <a onClick={()=>this.onClickDelete(i,data.id)}  class="btn btn-danger"> Delete </a>
                </td>
              </tr>
              )
            })}
           
            

          </tbody>
        </table>
      </section>
    )
  }
  onClickDelete(i,id){
    var yes=confirm("Are you sure you want to delete this item?")
    if(yes==true){
      const urlDelete="http://localhost/NLP_Store/public/api/customer/delete/"+id
      axios.delete(urlDelete).then((response)=>{
        const res=response.data
        if(res.success){
          alert(res.message)
          const list=this.state.listCustomer
          list.splice(i,1)
          this.setState({listCustomer:list})
        }
      }).catch(error=>{
        alert("Error"+error)
      })
      
      
    }
  }
}