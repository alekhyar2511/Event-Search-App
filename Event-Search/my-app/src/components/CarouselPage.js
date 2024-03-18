import axios from "axios";
import { useEffect, useState } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {GrSpotify} from 'react-icons/gr';

export default function CarouselPage({ artist }) {
    const [albums, setAlbums] = useState([]);
    const [artistData, setArtistData] = useState([]);
    useEffect(() => {
        async function fetchSpotify() {
            const response = await axios.get('/fetch-spotify-details', { params: {name: artist?.name,apikey: '5X0ZJ5LMFL5a2IMbwGdIyNCkepT0AORe' } });
            const albums = response?.data?.[0];
            const artistData = response?.data?.[1];
            setAlbums(albums);
            setArtistData(artistData);
        }
        fetchSpotify();
    }, [artist]);
    
    return (<div class="carousel">
        <Row className="mx-auto d-flex justify-content-start w-75 carouselRow">
            <Col sm={12} md={3} className="d-flex justify-content-start align-items-center flex-column"><img className="profilePicture" src={artistData?.images?.[0]?.url} /><div class="artistName">{artistData?.name}</div></Col>
            <Col sm={12} md={3} className="d-flex justify-content-start align-items-center flex-column"><div className="artistLabel">Popularity</div><div className="artistValue"><Box sx={{ position: 'relative', display: 'inline-flex' }}><CircularProgress variant="determinate" value={artistData?.popularity} sx={{ color: 'red', width: '45px !important' }} /><Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="white"
        >{artistData?.popularity}</Typography>
      </Box></Box></div></Col>
            <Col sm={12} md={3} className="d-flex justify-content-start align-items-center flex-column"><div className="artistLabel">Followers</div><div className="artistValue">{(artistData?.followers?.total)?.toLocaleString("en-US")}</div></Col>
            <Col sm={12} md={3} className="d-flex justify-content-start align-items-center flex-column"><div className="artistLabel">Spotify Link</div><div className="artistValue"><a href={artistData?.external_urls?.spotify} target="_blank"><GrSpotify color="green" size={35}/></a></div></Col>
        </Row>
        <Row className="mb-2 mt-4 albumFeaturing">Album featuring {artistData?.name}</Row>
        <Row className="w-75 mx-auto">
            {albums?.[0]?.images?.[0]?.url && <Col sm={12} md={4} className="d-flex justify-content-center carouselImage"><img src={albums?.[0]?.images?.[0]?.url} height={175} width={175} /></Col>}
            {albums?.[1]?.images?.[0]?.url && <Col sm={12} md={4} className="d-flex justify-content-center carouselImage"><img src={albums?.[1]?.images?.[0]?.url} height={175} width={175} /></Col>}
            {albums?.[2]?.images?.[0]?.url && <Col sm={12} md={4} className="d-flex justify-content-center carouselImage"><img src={albums?.[2]?.images?.[0]?.url} height={175} width={175} /></Col>}
        </Row>
    </div>);
}