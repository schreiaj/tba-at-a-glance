import React from 'react';

import {nest} from 'd3-collection';

import ordinal from 'ordinal';

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
				return (<div className='year'key={y}>{y}
					<YearSummary year={y} eventResults={eventResults} events={eventsByYear} />
				</div>);
			})}
		</div>
	);
}

const YearSummary = ({events, year, eventResults}) => {

	let yearsEvents = events[year]
	return (
		<div key={year}>
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
		if(results) {
			let {playoff, alliance} = results;
			const pickPos = {0: 'Captain', 1: '1st Pick', 2: '2nd Pick', 3: '3rd Pick'};
			const elimFinish = {'ef': 'Eightfinalist', 'qf': 'Quarterfinalist', 'sf': 'Semifinalist', 'f': 'Winner'}
			let playoffResult = null;
			if (playoff && playoff.status == 'won' && playoff.level=='f') {
				playoffResult = 'Winner'
			}
			else {
				playoffResult = elimFinish[(playoff||{}).level]
			}
			if(playoff && alliance) {
				return <div className={`event`} key={eventKey}>{ordinal(alliance.number)} Alliance <br/> {pickPos[alliance.pick]}<br/>{playoffResult}</div>
			} else if(playoff && !alliance) {
				return <div className={`event`} key={eventKey}>Played<br/>-<br/>{playoffResult}</div>
			} else {
				return <div className='event' key={eventKey}><br/>Not picked<br/></div>
			}
		}
	return null;

}


export default HistorySummary;
