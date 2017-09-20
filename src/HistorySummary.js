import React from 'react';

import {nest} from 'd3-collection';

import './HistorySummary.css';

let HistorySummary = ({team, events, eventResults}) => {

	let years = Array.from(new Set(events.map((e) => new Date(e.start_date).getFullYear())))

	let eventsByYear = nest().key((e) => new Date(e.start_date).getFullYear())
		.sortKeys((e) => new Date(e.start_date))
		.object(events)
	window.eventsByYear = eventsByYear;

	let style = {display: 'grid', gridTemplateColumns: `${'1fr '.repeat(years.length)}`, gridColumnGap: '5px'};

	return(
		<div className='history-summary' style={style}>
			{years.map((y) => {
				return (<div key={y}>{y}
					<YearSummary year={y} eventResults={eventResults} events={eventsByYear} />
				</div>);
			})}
		</div>
	);
}

const YearSummary = ({events, year, eventResults}) => {

	let yearsEvents = events[year]
	return (
		<div> 
		{yearsEvents.map((e) => {
					return (
						<EventSummary eventKey={e.key} eventResults={eventResults} />
					);
				})}
		</div>
	);
}

const EventSummary = ({eventKey, eventResults}) => {
	let results = eventResults[eventKey];
	console.log(results);
		if(results) {
			let {playoff, alliance} = results;
			playoff = playoff || {};
			alliance = alliance || {};
			if(alliance.pick === 0) alliance.pick='C';

			return <div key={eventKey} className={`${playoff.status} ${playoff.level}`} key={eventKey}>A{alliance.number||'?'} P{(alliance.pick)||'?'}</div>
		}
	return null;

}
	

export default HistorySummary;