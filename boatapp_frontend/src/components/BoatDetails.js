import {Link, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
const axios = require('axios')


function BoatDetails()  {
    const { id } = useParams();
    const [data, boatDetails] = useState({ boat: [] })

    useEffect(() => {
            
            const getBoatDetails = async () => {
                const res = await axios.get(`/api/boats/${id}`,
                );
                console.log(res)
                if(res) {
                    boatDetails(res.data.data ? res.data.data[0] : res.data[0])
                } 
            
            }
            getBoatDetails();
    }, []);

    
    return (
        <div>
            <h2>Boat ID: {id} details</h2>
            <div>Name: {data.name}</div>
            <div>ID: {data.id}</div>
            <div>Type: {data.type}</div>
            <div>Owner: {data.owner}</div>
            <Link to="/"><button className='btn'>Back To List</button></Link>
        </div>
    )
}

export default BoatDetails