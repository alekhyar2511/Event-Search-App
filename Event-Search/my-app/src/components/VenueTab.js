import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ShowMoreText from "react-show-more-text";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';

export default function VenueTab({ venueName }) {
    const [venueDetails, setVenueDetails] = useState({});
    const [isModalVisible, setModalVisible] = useState(false);
    const address = venueDetails?.address?.line1;
    const city = venueDetails?.city?.name;
    const state = venueDetails?.state?.name;
    const phoneNumberDetail = venueDetails?.boxOfficeInfo?.phoneNumberDetail;
    const openHours = venueDetails?.boxOfficeInfo?.openHoursDetail;
    const generalRule = venueDetails?.generalInfo?.generalRule;
    const childRule = venueDetails?.generalInfo?.childRule;
    const center = {
        lat: Number(venueDetails?.location?.latitude),
        lng: Number(venueDetails?.location?.longitude)
    };
    const containerStyle = {
        height: '465px'
      };
    const { isLoaded } = useLoadScript({
        id: "google-map-script",
        googleMapsApiKey: 'AIzaSyDEsIYd-gZswDWmzlJuvWAUETC8DzEB_bY',
      });

    useEffect(() => {
        async function fetchVenueDetails() {
            const response = await axios.get('/fetch-venue-details', { params: {keyword: venueName, apikey: '5X0ZJ5LMFL5a2IMbwGdIyNCkepT0AORe' } });
            const venues = response?.data?._embedded?.venues;
            const correspondingVenue = venues.find(x => x.name === venueName);
            setVenueDetails(correspondingVenue || venues?.[0]);
        }
        fetchVenueDetails();
    }, [venueName])
    const onClickGoogleMap = () => setModalVisible(true);
    return(
    <>
    <Row className="pt-4 pl-4 pr-4">
        <Col md={6} sm={12} className="d-flex align-items-center flex-column">
          {venueName && <div className="mb-3 text-center"><div className="venueLabel">Name</div><div className="venueValue">{venueName}</div></div>}
          {(address || city || state) && <div className="mb-3 text-center"><div className="venueLabel">Address</div><div className="venueValue">{address || ""}{", "}{city || ""}{", "}{state || ""}</div></div>}
          {phoneNumberDetail && <div className="mb-3 text-center"><div className="venueLabel">Phone Number</div><div className="venueValue">{phoneNumberDetail}</div></div>}
        </Col>
        <Col md={6} sm={12} className="d-flex justify-content-center flex-column">
        {openHours && (<div className="mb-3 text-center"><div className="venueLabel">Open Hours</div><div className="venueValue"><ShowMoreText lines={2} more={<p><a className="showMoreLess">Show More</a><MdOutlineKeyboardArrowDown /></p>}
                less={<p><a className="showMoreLess">Show less</a><MdOutlineKeyboardArrowUp /></p>} truncatedEndingComponent="">{openHours}</ShowMoreText></div></div>)}
        
        {generalRule && <div className="mb-3 text-center"><div className="venueLabel">General Rule</div><div className="venueValue"><ShowMoreText lines={2} more={<p><a className="showMoreLess">Show More</a><MdOutlineKeyboardArrowDown /></p>}
                less={<p><a className="showMoreLess">Show less</a><MdOutlineKeyboardArrowUp /></p>} truncatedEndingComponent="">{generalRule}</ShowMoreText></div></div>}
        {childRule && <div className="mb-3 text-center"><div className="venueLabel">Child Rule</div><div className="venueValue"><ShowMoreText lines={2} more={<p><a className="showMoreLess">Show More</a><MdOutlineKeyboardArrowDown /></p>}
                less={<p><a className="showMoreLess">Show less</a><MdOutlineKeyboardArrowUp /></p>} truncatedEndingComponent="">{childRule}</ShowMoreText></div></div>}
        </Col>
    </Row>
    <div className="text-center"><Button variant="danger" onClick={onClickGoogleMap}>Show venue on Google map</Button></div>
    {<Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={isModalVisible}
      onHide={() => setModalVisible(false)}
    >
      <Modal.Header >
        <Modal.Title id="contained-modal-title-vcenter">
          Event Venue
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {isLoaded ? ( <GoogleMap center={center} zoom={15} mapContainerStyle={containerStyle}>
            <MarkerF position={center}/>
        </GoogleMap>) : <></>}
      </Modal.Body>
        <Button onClick={() => setModalVisible(false)} className="modalCloseButton">Close</Button>
    </Modal>}
    </>);
}