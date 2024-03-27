// Patients.js

import React, {useEffect} from 'react';
import { gql, useQuery } from "@apollo/client";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';

const GET_INFOS_BY_PATIENTS = gql`

query infoById( $patientId:String!){

    infosByPatientId( patientId: $patientId) {
        patientId
        date
        pulseRate
        bloodPressure
        weight
        temperature
        respiratoryRate            
    }
}
`;


const PatientHealthInfo = () => {
    let navigate = useNavigate();
    let {patientId} = useParams();
    console.log('this is the patient id:', typeof(patientId));
    //const { loading, error, data, refetch } = 
    console.log('this is the patient id:', patientId);
    const { loading, error, data, refetch } = useQuery(GET_INFOS_BY_PATIENTS,{
        variables:{patientId:patientId}
    });

    useEffect(() => { 
        refetch();
        if(data ){
            console.log("this is the data I am passing", data);
        }
        
    },[data, refetch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    const addInfo = (id) => {
        console.log('the id of the patient is:', id);
         navigate('/addInfo/' + id);
     }

    return (

        <div className='App'>
            <h2>Patient Health Info</h2>
            {data && data.infosByPatientId.length === 0 ?
                <p>No patients record found for patient id: "{patientId}" </p> :
                <div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Date</th>                                
                                <th>Pulse Rate</th>
                                <th>Blood Pressure</th>
                                <th>Weight</th>
                                <th>Temperature</th>
                                <th>Respiratory Rate</th>

                            </tr>
                        </thead>
                        <tbody>
                            {data.infosByPatientId.map((info, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{info.date}</td>
                                    <td>{info.pulseRate}</td>                                    
                                    <td>{info.bloodPressure}</td>
                                    <td>{info.weight}</td>
                                    <td>{info.temperature}</td>
                                    <td>{info.respiratoryRate}</td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* <Button type="button" variant="primary" onClick={() => { addRecord (patientId)}}>ADD RECORD</Button>&nbsp; */}

                </div>
            }
            <Button type="button" variant="primary" onClick={() => { addInfo (patientId)}}>ADD INFO</Button>&nbsp;

        </div>
        
    );
}

export default PatientHealthInfo;
