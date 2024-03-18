/* Code for SwipeableViews, TabPanel and Tabs taken reference from https://codesandbox.io/s/w2vmph?file=/demo.js */

import { useState } from 'react';
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from 'react-bootstrap/Container';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import EventsTab from './EventsTab';
import ArtistTeamTab from './ArtistTeamTab';
import VenueTab from './VenueTab';
import '../App.css';

export default function DetailsCard({eventDetails, setShowDetailsCard, setShowEventTable}) {
  const [activeTab, setActiveTab] = React.useState(0);
    const eventName = eventDetails?.name;
    const venueName = eventDetails?._embedded?.venues?.[0]?.name;
    const [isFavorite, setIsFavorite] = useState(JSON.parse(localStorage.getItem(eventDetails?.id))?.isFavorite || false);
    const onBackClick = () => {
      setShowDetailsCard(false);
      setShowEventTable(true);
    }
    const date = eventDetails?.dates?.start?.localDate;
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
    const favoriteData = {
      id: eventDetails?.id,
      date,
      eventName,
      category: genres,
      venue,
    }

    const onClickFavorite = () => {
      if(!isFavorite){
        alert('Event Added to Favorites!');
        localStorage.setItem(eventDetails?.id, JSON.stringify({...favoriteData, isFavorite: !isFavorite, timeStamp: Date.now()}))
      }
      else {
        alert('Removed from Favorites!');
        localStorage.removeItem(eventDetails?.id);
      }
      setIsFavorite(!isFavorite);
    };

    const handleChange = (event, newValue) => {
      setActiveTab(newValue);
    };
  
    const handleChangeIndex = (index) => {
      setActiveTab(index);
    };

    function TabPanel(props) {
      const { children, value, index, ...other } = props;
    
      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`full-width-tabpanel-${index}`}
          aria-labelledby={`full-width-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );
    }

    return (
    <Container className='detailsContainer'>
    <div className='d-flex text-light backText'>
    <div>{'<'}&nbsp;</div>
    <div onClick={onBackClick} className="back">{"Back"}</div>
    </div>
    <div className='d-flex mt-4 mb-4 justify-content-center align-items-baseline'>
    <h5 className='text-light text-center'><span className='mr-3'>{eventName}</span>{isFavorite && <MdFavorite color='red' className='favoriteIcon' onClick={onClickFavorite}/>}
    {!isFavorite && <MdFavoriteBorder className='favoriteIcon' onClick={onClickFavorite}/>}</h5>&nbsp;&nbsp; &nbsp;   
    </div>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          className="tabPanel d-flex align-content-center justify-content-center"
          centered
        >
          <Tab
					value={0}
					label="Events"
          className='tab'
          style={{ textTransform: "none" }}
				></Tab>
				<Tab
					value={1}
					label="Artist/Teams"
          className='tab'
          style={{ textTransform: "none" }}
				></Tab>
				<Tab
					value={2}
					label="Venue"
          className='tab'
          style={{ textTransform: "none" }}
				></Tab>
			</Tabs>

<SwipeableViews
        index={activeTab}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={activeTab} index={0}>
        <EventsTab eventDetails={eventDetails} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
        <ArtistTeamTab eventDetails={eventDetails}/>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
        <VenueTab venueName={venueName} />
        </TabPanel>
      </SwipeableViews>
    </Container>
    );

}