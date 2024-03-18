import Table from 'react-bootstrap/Table';
import { BsTrash3 } from 'react-icons/bs';

export default function FavoriteTable({favorites, setFavorites }) {
    const deleteItem = (eventId) => {
        alert('Removed from Favorites!');
        localStorage.removeItem(eventId);
        setFavorites(Object.values({...localStorage}).map((val => JSON.parse(val))).sort(({ timeStamp: a }, { timeStamp: b }) => a - b));

    }
    return(<Table className='m-auto favoriteTable' responsive="sm">
        <thead>
            <tr>
            <th>#</th>
            <th>Date</th>
            <th>Event</th>
            <th>Category</th>
            <th>Venue</th>
            <th>Favorite</th>
            </tr>
        </thead>
        <tbody>
            {favorites.map((data, index)=> {
                return (
                    <tr className='light-tr'>
                    <td className='text-center font-weight-bold'>{index+1}</td>
                    <td className='text-center'>{data?.date}</td>
                    <td className='text-center'>{data?.eventName}</td>
                    <td className='text-center'>{data?.category}</td>
                    <td className='text-center'>{data?.venue}</td>
                    <td className='text-center'><BsTrash3 onClick={() => deleteItem(data?.id)} /></td>
                    </tr>
                )
            })}
        </tbody>
    </Table>)
}