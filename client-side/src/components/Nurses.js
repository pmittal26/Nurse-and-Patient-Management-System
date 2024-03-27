
import React, {useEffect} from 'react';
import { gql, useQuery } from "@apollo/client";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

const GET_NURSES = gql`
{
    nurses{
        fullName
        email
    }
}
`;

const Nurses = () => {
    let navigate = useNavigate();

    const { loading, error, data, refetch } = useQuery(GET_NURSES);

    useEffect(() => {       
        refetch();
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;

    return (

        <div className='App'>
            <h2>Nurses</h2>
            {data.nurses.length === 0 ?
                <p>No nurses found</p> :
                <div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.nurses.map((nurse, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{nurse.fullName}</td>
                                    <td>{nurse.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            }
        </div>
    );
}

export default Nurses