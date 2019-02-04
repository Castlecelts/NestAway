import React, { Component, Fragment } from 'react';

import Request from '../helpers/request.js'

import BookingForm from '../components/BookingForm.js';
import NavBar from '../components/NavBar.js';
import PropertyList from '../components/PropertyList.js';


class siteContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      properties: [],
      filteredProperties: []

    }
    this.criteria = null;

    this.handleBookingCriteriaSubmit = this.handleBookingCriteriaSubmit.bind(this);
  }

  componentDidMount(){
    let request = new Request()
    // TODO check api route with backend
    request.get('/api/properties').then((data) => {
      this.setState({properties: data._embedded.properties})
    })
  }


  handleBookingCriteriaSubmit(criteria){
    this.criteria = criteria;
    let selectedProperties = this.state.properties;
    selectedProperties = selectedProperties.filter(property =>
      property.capacity >= this.criteria.capacity);
      this.setState({filteredProperties: selectedProperties});
      console.log(this.state.filteredProperties);
    }



    render(){
      return (
        <div>
        <Fragment>
        <NavBar/>
        <BookingForm
        filteredProperties={this.state.filteredProperties} onCriteriaSubmit={this.handleBookingCriteriaSubmit} />
        <PropertyList properties = {this.state.properties}/>
        </Fragment>
        </div>
      )
    }

    // <PropertyList properties = {this.state.properties}/>

  }

  export default siteContainer;
