import React from 'react';

import {nest} from 'd3-collection';

import './HistorySummary.css';

let HistorySummary = ({team, events, eventResults}) => {

	let years = Array.from(new Set(events.map((e) => new Date(e.start_date).getFullYear())))

	let eventsByYear = nest().key((e) => new Date(e.start_date).getFullYear())
		.key((e) => {
			switch (e.event_type) {
			case 0:
				return 1
				break;
			case 2:
				return 2
				break;
			default:
				return e.event_type
			}
		})
		.sortValues((a,b) => new Date(a.start_date) - new Date(b.start_date))
		.object(events)
	window.eventsByYear = eventsByYear;

	let style = {display: 'grid', gridTemplateColumns: `2fr ${'1fr '.repeat(years.length)}`, gridColumnGap: '5px'};

	return(
		<div className='history-summary'>
			<div style={style}>
				<div>
					<div>.</div>
					<div className='label event'>Event 1</div>
					<div className='label event'>Event 2</div>
					<div className='label event'>Event 3 or DCMP</div>
					<div className='label event'>CMP Division</div>
					<div className='label event'>Einstein</div>
					<div className='label event'>FoC</div>
				</div>
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

	let eventYear = events[year]||[];
	let yearsEvents = []
	yearsEvents.push((eventYear[1]||[]).pop());
	yearsEvents.push((eventYear[1]||[]).pop());
	if(eventYear[2]) {
		yearsEvents.push((eventYear[2]||[]).pop());
	} else {
		yearsEvents.push((eventYear[1]||[]).pop());
	}
	yearsEvents.push((eventYear[3]||[]).pop());
	yearsEvents.push((eventYear[4]||[]).pop());
	yearsEvents.push((eventYear[6]||[]).pop());



	return (
		<div key={year}>
		{yearsEvents.map((e,i) => {
					if(!e) {
						return <div className='event' key={i}></div>;
					}
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
			let {playoff, alliance, qual} = results;
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
				return <div onClick={() => console.log(results)} className={`event ${playoffResult}`} key={eventKey}><span className='content'>A{alliance.number}P{pickPos[alliance.pick]}</span></div>
			} else if(playoff && !alliance) {
				return <div onClick={() => console.log(results)} className={`event ${playoffResult}`} key={eventKey}><span className='content'>Played*</span></div>
			} else if(qual) {
				return <div onClick={() => console.log(results)} className='event np' key={eventKey}>NP</div>
			} else {
				return <div onClick={() => console.log(results)} className='event' key={eventKey}></div>
			}
		}
	return <div className='event placeholder' key={eventKey}>loading...</div>;

}


export default HistorySummary;
