import React, { useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';

import '../App.css';

export default function EventTable({events, setSelectedEvent, fetchEventDetais}) {
    return (
      <>
      <Table responsive="sm" className='eventsTable' borderless>
        <thead>
          <tr className="dark-tr">
            <th width={150} className="dark-th">Date/Time</th>
            <th className="dark-th">Icon</th>
            <th className="dark-th">Event</th>
            <th className="dark-th">Genre</th>
            <th className="dark-th">Venue</th>
          </tr>
        </thead>
        <tbody>
          {events.slice(0,20).map(event => (
            <tr onClick={() => {
              setSelectedEvent(event?.id);
              fetchEventDetais(event?.id);
            }} className="dark-tr">
              <td className="font-weight-bold text-center">{event?.dates?.start?.localDate}<br/>{event?.dates?.start?.localTime}</td>
              <td className='text-center'><img src={event?.images?.[0]?.url} alt="Event Icon" className='eventTableIcon'/></td>
              <td class="event-name text-center">{event?.name}</td>
              <td className='text-center'>{event?.classifications?.[0]?.segment?.name}</td>
              <td className='text-center'>{event?._embedded?.venues?.[0]?.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </>
    );
  }