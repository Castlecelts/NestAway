import React, { Component, Fragment } from 'react';

import Request from '../helpers/Request.js'

import Home from '../components/Home.js';
import NavBar from '../components/NavBar.js';
import BookingForm from '../components/BookingForm.js';
import PropertiesList from '../components/PropertiesList.js';
import PropertyForm from '../components/PropertyForm.js';
import Bookings from '../components/Bookings.js';
import CustomerForm from '../components/CustomerForm.js';
import CustomersList from '../components/CustomersList.js';
import BookingsList from '../components/BookingsList.js';
import { BrowserRouter as Router, Route } from "react-router-dom";

class SiteContainer extends Component{

  constructor(props){
    super(props);
    this.state = {
      properties: [],
      filteredProperties: [],
      customers: [],
      bookings: []
    }
    this.selectedCustomer = null;
    this.criteria = null;
    this.selectedProperty = null;
    this.bookingInfo = null;

    this.handleBookingCriteriaSubmit = this.handleBookingCriteriaSubmit.bind(this);
    this.setSelectedCustomer = this.setSelectedCustomer.bind(this);
    this.setSelectedProperty = this.setSelectedProperty.bind(this);
  }

  componentDidMount(){
    let request = new Request()
    request.get('/api/properties').then((propertiesData) => {
      this.setState({properties: propertiesData._embedded.properties})
    });
    request.get('/api/customers').then((customersData) => {
      this.setState({customers: customersData._embedded.customers})
      console.log(this.state.customers);
    });
    request.get('/api/bookings').then((bookingData) => {
     this.setState({bookings: bookingData._embedded.bookings})
     console.log(this.state.bookings);
   });

  }


  handleBookingCriteriaSubmit(criteria){
    this.criteria = criteria;
    let selectedProperties = this.state.properties;
    selectedProperties = selectedProperties.filter(property =>
      property.capacity >= this.criteria.capacity);
      this.setState({filteredProperties: selectedProperties});
    }

  handleCustomerPost(customerInfo){
    const request = new Request();
    request.post('/api/customers', customerInfo).then(() => {
      window.location = '/bookingform'
    })
  }

  handlePropertyPost(propertyInfo){
    const request = new Request();
    request.post('/api/properties', propertyInfo).then(() => {
      window.location = '/properties'
    })
  }

  setSelectedCustomer(index){
    this.selectedCustomer = index;
    console.log(this.selectedCustomer);
  }

  setSelectedProperty(index){
    this.selectedProperty = index;
    console.log(this.selectedProperty);
  }

  handleBookingPost(){
    const confirmedBooking = {
      "customer_id": this.selectedCustomer,
      "property_id": this.selectedProperty
      // TODO add the remaining booking criteria - ie dates
    }
    const request = new Request();
    request.post('/api/bookings', confirmedBooking).then(() => {
      window.location = '/bookings'
    })
  }

  render(){
    return (
      <Router>
      <Fragment>
      <h1>NestAway</h1>
      <NavBar/>
      <Route exact path="/" component={Home} />

      <Route path="/bookingform"
        render={() => <BookingForm
          filteredProperties={this.state.filteredProperties} onCriteriaSubmit={this.handleBookingCriteriaSubmit}
          existingCustomers={this.state.customers}
          setSelectedCustomer={this.setSelectedCustomer}
          setSelectedProperty={this.setSelectedProperty}
          handleBookingPost={this.handleBookingPost}
        />
      }
      />

      <Route path="/customerform"
        render={() => <CustomerForm
          handleCustomerPost={this.handleCustomerPost}
        />
      }
      />

      <Route path="/customers"
        render={() => <CustomersList
          customers={this.state.customers}
        />
      }
      />

      <Route path="/propertyform"
        render={() => <PropertyForm handlePropertyPost={this.handlePropertyPost}
        />
      }
      />

      <Route path="/properties"
        render={() => <PropertiesList
          properties={this.state.properties}
        />
      }
      />

      <Route path="/bookings" render={() => <BookingsList bookings={this.state.bookings} />
      }
      />
      </Fragment>
      </Router>
    )
  }


}

  export default SiteContainer;
