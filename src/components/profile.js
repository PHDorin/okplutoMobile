'use strict';
import React, {Component} from 'react';
import {View, ScrollView, Text, Image, Linking} from 'react-native';
import ProfileDisplay from './profileDisplay';
import Banner from './banner';

// import {getUsers} from '../services/userServices'
//Parent component for profile page - pulls event info from database, and controls render for profile info and user's events display
import { searchEvents } from '../services/eventServices.js';
import Footer from './footer'
import NavLoggedIn from './nav-loggedin';
// import React, { PropTypes as T } from 'react';
import { PropTypes as T } from 'react';
// import AuthService from '../utils/AuthService.jsx';
// import ProfileDisplay from './profileDisplay.jsx';
import EventList from './eventList';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import MyTheme from '../theme/theme.js';
// import {Tabs, Tab} from 'material-ui/Tabs'
// import Banner from './banner.jsx';
import FooterLoggedIn from './footer-loggedIn';

class Profile extends Component {
  constructor(props) {
    super(props);

    // Events load into state after they are pulled from the database. If there are no events in a particular category, "No events to show" will render to the screen
    // state.value controls which tab is active and visible
    this.state = {
      upcomingEvents: [],
      noUpcomingEvents: false,
      pastEvents: [],
      noPastEvents: false,
      createdEvents: [],
      noCreatedEvents: false,
      value: 'a'
    }
  }
    _navigate(path) {
    this.props.navigator.push({
      name: path,
    })
  }

// Load events and divide into Upcoming,
// Created by this user, and Past categories
  componentDidMount() {
    var self = this;
    // Event Services helper function
    // Searches for events containing current users DataBase ID
    // Returns both attending events, and events created by this user


    searchEvents(this.props.profile.userId) //********* returning undefined
    .then(events => {
      if(!events.attendingEvents.length) {
        self.setState({upcomingEvents: []});
        self.setState({noUpcomingEvents: true});
        self.setState({pastEvents: []});
        self.setState({noPastEvents: true});
      } else {
        let upcoming = [];
        let past = [];
        // Test if event is future or past
        // Divide into categories
        events.attendingEvents.forEach(event => {
        let date = new Date(event.date.slice(0, 11) + event.time.slice(0, 8));
        if (date > new Date()) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
        });
        if (upcoming.length) {
          self.setState({upcomingEvents: upcoming});
        } else {
          self.setState({upcomingEvents: []});
          self.setState({noUpcomingEvents: true});
        }
        if (past.length) {
          self.setState({pastEvents: past});
        } else {
          self.setState({pastEvents: []});
          self.setState({noPastEvents: true});
        }
      }
      if(!events.createdEvents.length) {
        self.setState({createdEvents: []});
        self.setState({noCreatedEvents: true});
      } else {
        self.setState({createdEvents: events.createdEvents});
      }
    });
  }

  // Changes active / visible tab
  // handleChange(value) {
  //   this.setState({
  //     value: value
  //   });
  // }

        //     <MuiThemeProvider muiTheme={getMuiTheme(MyTheme)} >


        //     </MuiThemeProvider>

        // <FooterLoggedIn />

        //     this goes into the
        //     <ProfileDisplay userInfo={this.props.userInfo} resetUserInfo={this.props.resetUserInfo} />



        // <Banner display="Your Profile"/>
        // <NavLoggedIn />




  render () {

    return (
      <View style={{flex:1}}>
        <Banner display={'Profile'}/>
        <ScrollView>
          <View>
            <View>
              <ProfileDisplay profile={this.props.profile} />
            </View>

            <View>
          <Text>Upcoming Events</Text>
              <EventList type="profile" events={this.state.upcomingEvents} noEvents={this.state.noUpcomingEvents} userInfo={this.props.userInfo}/>
            </View>

            <View>
            <Text>Events Created by Me</Text>
              <EventList type="profile" events={this.state.createdEvents} noEvents={this.state.noCreatedEvents} userInfo={this.props.userInfo}/>
            </View>

            <View>
              <Text>Past Events</Text>
                <EventList type="profile" events={this.state.pastEvents} noEvents={this.state.noPastEvents} userInfo={this.props.userInfo}/>
            </View>

          </View>
        </ScrollView>
        <Footer navigate={this._navigate.bind(this)}/>
      </View>
    )
  }
}


const styles = {
  profileInfo:{

  },
  EventViews:{

  }
}
// Make sure auth0 Service is passed in
// correctly as a prop
// Profile.propTypes = {
//   location: T.object,
//   auth: T.instanceOf(AuthService)
// };

module.exports = Profile;