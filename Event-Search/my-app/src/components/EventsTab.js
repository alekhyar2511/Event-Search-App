import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FaTwitter } from 'react-icons/fa';
import {ImFacebook2} from 'react-icons/im';

import '../App.css';

const TICKET_STATUS_VS_TEXT = {
  'onsale': 'On Sale',
  'offsale': 'Off Sale',
  'cancelled': 'Canceled',
  'postponed': 'Postponed',
  'rescheduled': 'Rescheduled',
};

const TICKET_STATUS_VS_COLOR = {
  'onsale': 'green',
  'offsale': 'red',
  'cancelled': 'black',
  'postponed': 'orange',
  'rescheduled': 'orange',
}

export default function EventsTab ({eventDetails}) { 
    const eventName = eventDetails?.name;
    let artistTeam = "";
    const attractions = eventDetails?._embedded?.attractions;
    if(attractions !== undefined) {
      attractions.forEach(attraction => {
        if(attraction?.name !== undefined || attraction?.name !== 'Undefined' || attraction?.name !== '') {
          artistTeam += attraction?.name +" | ";
        }
      });
    }
    const venue = eventDetails?._embedded?.venues?.[0]?.name;
    const classifications = eventDetails?.classifications?.[0];
    const subGenre = classifications?.subGenre;
    const genre = classifications?.genre;
    const segment = classifications?.segment;
    const subType = classifications?.subType;
    const type = classifications?.type;
    const genres = [subGenre?.name, genre?.name, segment?.name, subType?.name, type?.name].filter((val) => {
    return val !== undefined && val !=='Undefined' && val;
    }).join(" | ");
    const minPrice = eventDetails?.priceRanges?.[0]?.min;
    const maxPrice = eventDetails?.priceRanges?.[0]?.max;
    const priceRange = minPrice + " - " + maxPrice;
    const ticketStatus = eventDetails?.dates?.status?.code;
    const buyAt = eventDetails?.url;
    const seatMap = eventDetails?.seatmap?.staticUrl;
    const localDate = eventDetails?.dates?.start?.localDate;
    const localTime = eventDetails?.dates?.start?.localTime;
    
    const facebookCreate = () => {
      var open = 'http://www.facebook.com/share.php?u=' + buyAt;
      return open
    };
    
    const twitterCreate = () => {
      var open = encodeURI('https://twitter.com/intent/tweet?text=Check ' + eventName + ' on Ticketmaster. ' + buyAt);
      return open
    };
    
    return (
    <>
    <div class="card-content">
      <Row className='w-100'>
      <Col sm={12} md={4}>
      <div className='text-center'>
        {localDate || localTime ? (<div class="label-val"><div class="card-label">Date</div><div class="text-white">{localDate || ""}</div><div className='text-light'>{localTime || ""}</div></div>): ''}
        {artistTeam? (<div class="label-val"><div class="card-label">Artist/Team</div><div class="card-value">{artistTeam.slice(0, artistTeam.length-2)}</div></div>): ""}
        {venue? (<div class="label-val"><div class="card-label">Venue</div><div class="card-value">{venue}</div></div>): ""}
        {genres? (<div class="label-val"><div class="card-label">Genres</div><div class="card-value">{genres}</div></div>): ""}
        {minPrice && maxPrice ? (<div class="label-val"><div class="card-label">Price Ranges</div><div class="card-value">{priceRange}</div></div>): ""}
        {ticketStatus ? (<div class="label-val"><div class="card-label">Ticket Status</div><div class={'card-value ticket-status '+TICKET_STATUS_VS_COLOR[ticketStatus]}>{TICKET_STATUS_VS_TEXT[ticketStatus]}</div></div>): ""}
        {buyAt? (<div class="label-val"><div class="card-label">Buy Ticket At:</div><div class="card-value"><a href={buyAt} target="_blank" class="card-url">Ticketmaster</a></div></div>): ""}
      </div>
      </Col>
      <Col sm={12} md={8}>
      <div className='d-flex justify-content-end align-content-center seatMapContainer'>
      {seatMap ? <img class="card-image" src={seatMap}></img>: ""}
      </div>
      </Col>
      </Row>
    </div>
    <div className='mt-4 text-center text-white'>
    <p>Share on: &nbsp;
      <a href={twitterCreate()} target="_blank"><FaTwitter className="twitterIcon" size="20px" alt="Twitter" /></a>&nbsp;
      <a href={facebookCreate()} target="_blank"><ImFacebook2 className="facebookIcon" size="20px" alt="Facebook" /></a>&nbsp;
    </p>
    </div>
      </>);
    }