import NoResults from './NoResults';
import CarouselPage from './CarouselPage';
import Carousel from 'react-bootstrap/Carousel';

import { GrPrevious, GrNext } from 'react-icons/gr';

export default function ArtistTeamTab({eventDetails}) {
    const attractions = eventDetails?._embedded?.attractions;
    let musicArtists = [];
    if(attractions) {
        musicArtists = attractions.filter((attraction) =>  {
            if(attraction?.classifications?.[0]?.segment?.name === 'Music') return attraction;
          });
    }

    return(
        musicArtists.length>0 ? (
        <Carousel
        indicators={false}
        nextLabel=""
        prevLabel=""
        interval={null}
        nextIcon={<GrNext size={30}/>}
        prevIcon={<GrPrevious size={30} />}
        controls={musicArtists.length>1 ? true: false}>
            {musicArtists.map((artist) => (
            <Carousel.Item>
                <CarouselPage artist={artist} />
            </Carousel.Item>))}
        </Carousel>
        ) : <NoResults text="No music related artist details to show" />
    );
};