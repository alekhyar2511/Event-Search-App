import React, { useState } from 'react';
import axios from "axios";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import DetailsCard from '../components/DetailsCard';
import EventTable from '../components/EventTable';
import NoResults from '../components/NoResults';
import '../App.css';

const CATEGORY_VS_SEGMENTID = {
    'default': '',
    'music': 'KZFzniwnSyZfZ7v7nJ',
    'sports': 'KZFzniwnSyZfZ7v7nE', 
    'arts&theatre': 'KZFzniwnSyZfZ7v7na',
    'film': 'KZFzniwnSyZfZ7v7nn',
    'miscellaneous': 'KZFzniwnSyZfZ7v7n1'
  };

export default function EventForm() {
    const defaultFormValues = { keyword: [], distance: "10", category: "default", location: "", autodetect: false };
    const [formDetails, setFormDetails] = useState(defaultFormValues);
    const [keywordOptions, setKeywordOptions] = useState([]);
    const [showEventTable, setShowEventTable] = useState(false);
    const [showDetailsCard, setShowDetailsCard] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(undefined);
    const [selectedEventDetails, setSelectedEventDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);

    async function fetchEventDetais (eventId) {
    const eventDetailsResponse = await axios.get('/fetch-event-details', { params: {id: eventId, apikey: '5X0ZJ5LMFL5a2IMbwGdIyNCkepT0AORe' } });
    const eventDetails = eventDetailsResponse?.data;
    setSelectedEventDetails(eventDetails);
    setShowDetailsCard(true);
    setShowEventTable(false);
    }
      

    const handleChange = (event) => {
        const id = event.target.id;
        if(id === 'autodetect') {
            setFormDetails({...formDetails, [id]: event.target.checked});
        } else {
            const value = event.target.value;
            setFormDetails({...formDetails, [id]: value});
        }
    }

    const onClear = () => {
        setFormDetails(defaultFormValues);
        setShowDetailsCard(false);
        setShowEventTable(false);
        setShowNoResults(false);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const { autodetect, location, distance, keyword, category } = formDetails;
        let lat = "";
        let lng = "";
        if(autodetect === true) {
        const ipInfo = await axios.get('https://ipinfo.io/?token=48c7ccb300744d');
        const loc = ipInfo?.data?.loc;
        const latlng = loc.split(',');
        lat = latlng[0];
        lng = latlng[1];
        } else {
        const parameters = { address: location, key: 'AIzaSyA-Ug-RZESYBErf5bqu5Mpkcb351EtSh70'};
        const geocodingResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params: parameters });
        const results = geocodingResponse?.data?.results;
        lat = results[0]?.geometry?.location?.lat;
        lng = results[0]?.geometry?.location?.lng;
        }
        const ticketMasterParameters = { apikey: '5X0ZJ5LMFL5a2IMbwGdIyNCkepT0AORe', lat, lng, radius: distance || 10, segmentId: CATEGORY_VS_SEGMENTID[category], unit: 'miles', keyword: keyword?.[0], sort: 'date,asc'};
        const ticketMasterResponse = await axios.get('/fetch-events', { params: ticketMasterParameters}); 
        const events = ticketMasterResponse?.data?._embedded?.events;
        if(events !== undefined) {
            setShowNoResults(false);
            setShowEventTable(true);
            setShowDetailsCard(false);
            setEvents(events);
        } else {
            setShowDetailsCard(false);
            setShowNoResults(true);
            setShowEventTable(false);
        }
    }

    const handleSearch = async (query) => {
        setFormDetails({...formDetails, keyword: [query]});
        setIsLoading(true);
        const response = await axios.get('/suggest', { params: { query } })
        const attractions = response?.data?._embedded?.attractions;
        if (attractions !== undefined) {
            setKeywordOptions(attractions.map((attraction) => attraction.name));
        }
        setIsLoading(false);
    }

    const onKeywordChange = (selected) => {
        setFormDetails({...formDetails, keyword: selected});
    }

    const onCheckboxToggle = (event) => {
        const value = event.target.checked;
        if(value) setFormDetails({...formDetails, autodetect: value, location: ''})
        else setFormDetails({...formDetails, autodetect: value});
    }

    return (
        <>
        <Container className='form'>
            <div class="event-search-text">Events Search</div>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3 mt-3" id="keyword">
                    <Form.Label className='required'>Keyword</Form.Label>
                    <AsyncTypeahead
                        id="keyword"
                        labelKey="keyword"
                        onSearch={handleSearch}
                        onChange={onKeywordChange}
                        options={keywordOptions}
                        selected={formDetails.keyword}
                        inputProps={{ required: true }}
                        isLoading={isLoading}
                        useCache={false}
                        delay={500}
                        searchText={<Spinner variant="primary"/>}
                        filterBy={() => true}
                        ></AsyncTypeahead>              
                </Form.Group>
                <Row>
                    <Col sm={12} md={6}>
                        <Form.Group className="mb-3" controlId="distance">
                        <Form.Label >Distance</Form.Label>
                        <Form.Control type="number" placeholder="10" value={formDetails?.distance} onChange={handleChange}/>
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                        <Form.Group className="mb-3" controlId="category" placeholder='default'>
                            <Form.Label className='required'>Category</Form.Label>
                            <br />
                            <Form.Select className='category-select' size="lg" required onChange={handleChange} value={formDetails?.category}>
                                <option value="default" selected>Default</option>
                                <option value="music">Music</option>
                                <option value="sports">Sports</option>
                                <option value="arts&theatre">Arts & Theatre</option>
                                <option value="film"> Film</option>
                                <option value="miscellaneous"> Miscellaneous</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3" controlId="location">
                    <Form.Label className='required'>Location</Form.Label>
                    <Form.Control type="text" required onChange={handleChange} value={formDetails?.location} disabled={formDetails?.autodetect}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="autodetect">
                    <Form.Check type="checkbox" label="Auto-detect your location" onChange={onCheckboxToggle} checked={formDetails?.autodetect}/>
                </Form.Group>
                <Form.Group className="m-auto d-flex justify-content-center">
                <Button variant="danger" type="submit" className='submit-button'>
                    SUBMIT
                </Button>
                <Button variant="primary" className='clear-button' onClick={onClear}>
                    CLEAR
                </Button>
                </Form.Group>
            </Form>
        </Container>
        {showEventTable && <EventTable events={events} setSelectedEvent={setSelectedEvent} fetchEventDetais={fetchEventDetais}/>}
        {showDetailsCard && <DetailsCard eventDetails={selectedEventDetails} setShowDetailsCard={setShowDetailsCard} setShowEventTable={setShowEventTable} />}
        {showNoResults && <NoResults text="No results available" />}
        </>)
}
