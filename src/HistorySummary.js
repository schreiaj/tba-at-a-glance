import React from 'react';

import {nest} from 'd3-collection';

import './HistorySummary.css';

let HistorySummary = ({team, events, eventResults}) => {

	let years = Array.from(new Set(events.map((e) => new Date(e.start_date).getFullYear())))

	let eventsByYear = nest().key((e) => new Date(e.start_date).getFullYear())
		// .sortKeys((a,b) => new Date(b.start_date) - new Date(a.start_date))
		.object(events)
	window.eventsByYear = eventsByYear;

	let style = {display: 'grid', gridTemplateColumns: `${'1fr '.repeat(years.length)}`, gridColumnGap: '5px'};

	return(
		<div className='history-summary'>
			<div style={style}>
				{years.map((y) => {
					return (<div className='year'key={y}>{y}
						<YearSummary year={y} eventResults={eventResults} events={eventsByYear} />
					</div>);
				})}
			</div>
			<div className='legend-holder'>
				<span>NP</span><span className='legend np'/>
				<span>QF</span><span className='legend qf'/>
				<span>SF</span><span className='legend sf'/>
				<span>F</span><span className='legend f'/>
				<span>W</span><span className='legend won'/>
				<div> *No selection data available for this event </div>

			</div>


		</div>
	);
}

const YearSummary = ({events, year, eventResults}) => {

	let yearsEvents = events[year].sort((a,b) => new Date(a.start_date) - new Date(b.start_date));
	return (
		<div key={year}>
		{yearsEvents.map((e) => {
					return (
						<EventSummary key={e.key} eventKey={e.key} eventResults={eventResults} />
					);
				})}
		</div>
	);
}

const EventSummary = ({eventKey, eventResults}) => {
	let results = eventResults[eventKey];
		if(results) {
			let {playoff, alliance} = results;
			const pickPos = {0: 'C', 1: '1', 2: '2', 3: 'B'};
			// const elimFinish = {'ef': 'Eightfinalist', 'qf': 'Quarterfinalist', 'sf': 'Semifinalist', 'f': 'Finalist'}
			let playoffResult = null;
			if (playoff && playoff.status === 'won' && playoff.level === 'f') {
				playoffResult = 'won'
			}
			else {
				playoffResult = (playoff||{}).level
			}
			if(playoff && alliance) {
				return <div className={`event ${playoffResult}`} key={eventKey}><span className='content'>A{alliance.number}P{pickPos[alliance.pick]}</span></div>
			} else if(playoff && !alliance) {
				return <div className={`event ${playoffResult}`} key={eventKey}><span className='content'>Played*</span></div>
			} else {
				return <div className='event np' key={eventKey}>NP</div>
			}
		}
	return <div className='event placeholder' key={eventKey}>loading...</div>;

}


export default HistorySummary;
