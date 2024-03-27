// Patients.js

import React, {useEffect} from 'react';
import { gql, useQuery } from "@apollo/client";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';

const GET_PATIENTS = gql`
{
    patients{
        _id
        fullName
        email
    }
}
`;

const Patients = () => {
    let navigate = useNavigate();

    const { loading, error, data, refetch } = useQuery(GET_PATIENTS);

    useEffect(() => {       
        refetch();
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :</p>;

    const showRecord = (id) => {
       console.log('the id of the patient is:', id);
        navigate('/record/' + id);
    }

    const showInfo = (id) => {
        console.log('the id of the patient is:', id);
         navigate('/healthInfo/' + id);
     }

    return (

        <div className='App'>
            <h2>Patients</h2>
            {data.patients.length === 0 ?
                <p>No patients found</p> :
                <div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>ID</th>

                            </tr>
                        </thead>
                        <tbody>
                            {data.patients.map((patient, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{patient.fullName}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient._id}</td>
                                    <Button style={{color: "blue"}}type="button" variant="primary" onClick={() => { showInfo(patient._id) }}>HEALTH INFO</Button>&nbsp;
                                    <Button style={{color: "blue"}}type="button" variant="primary" onClick={() => { showRecord(patient._id) }}>RECORD</Button>&nbsp;
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            }
        </div>
    );
}

export default Patients
