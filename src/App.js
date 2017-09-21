import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Config from './config';
import HistorySummary from './HistorySummary';

class App extends Component {

  constructor(...args) {
    super(...args);
    let urlParams = new URLSearchParams(window.location.search);
    this.state = {
      team: urlParams.get('team'),
      events: [],
      eventResults: {},
      error: false
    }
  }

  async componentDidMount() {
    let team = this.state.team;
    let headers = {
      'X-TBA-Auth-Key': Config.TBA_KEY
    }
    try {
      let eventsResponse = await fetch(`${Config.BASE_URL}/team/frc${team}/events/simple`, {headers})
    let events = await eventsResponse.json();
    events = events.filter((e) => Config.EVENT_TYPES.indexOf(e.event_type) >= 0 && e.year >= Config.MIN_YEAR)
    events.map(async (e) => {
      let resultsRes = await fetch(`${Config.BASE_URL}/team/frc${team}/event/${e.key}/status`, {headers})
      let eventResults = await resultsRes.json();
      let allEventResults = this.state.eventResults;
      allEventResults[e.key] = eventResults;
      this.setState({eventResults: allEventResults});
    })
    this.setState({events})
    }
    catch(e){
      console.error(e)
      this.setState({error: true})
    }


  }

  render() {
    return (
      <div className="App">
        {this.state.error ? <Error {...this.state}/> : <HistorySummary events={this.state.events} team={this.state.team} eventResults={this.state.eventResults} />}
      </div>
    );
  }
}

let Error = ({team}) =>
  <div>Something went wrong</div>


export default App;
