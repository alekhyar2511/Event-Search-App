import { useEffect, useState } from 'react';

import NoResults from './NoResults';
import FavoriteTable from './FavoriteTable';

export default function Favorites(props) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setFavorites(Object.values({...localStorage}).map((val => JSON.parse(val))).sort(({ timeStamp: a }, { timeStamp: b }) => a - b));
    }, []);
    return (<>
    {Object.keys(favorites).length === 0 ? <NoResults text="No favorite events to show" /> : <><div class="favoriteTitle"> List of your favorite events</div><FavoriteTable favorites={favorites} setFavorites={setFavorites}/></>}
    </>)
}