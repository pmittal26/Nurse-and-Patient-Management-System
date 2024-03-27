

import React, {useEffect} from 'react';
import { gql, useQuery } from "@apollo/client";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';

const GET_RECORDS_BY_PATIENTS = gql`

query recordById( $patientId:String!){

    recordsByPatientId( patientId: $patientId) {
        patientId
        nurseId
        date
        bodyTemperature
        bloodPressure
        heartRate
        respiratoryRate
            
    }
}
`;


const PatientRecord = () => {
    let navigate = useNavigate();
    let {patientId} = useParams();
    console.log('this is the patient id:', patientId);
    //const { loading, error, data, refetch } = 
    console.log('this is the patient id:', patientId);
    const { loading, error, data, refetch } = useQuery(GET_RECORDS_BY_PATIENTS,{
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
    
    const addRecord = (id) => {
        console.log('the id of the patient is:', id);
         navigate('/create/record/' + id);
     }

    return (

        <div className='App'>
            <h2>Patient Record</h2>
            {data && data.recordsByPatientId.length === 0 ?
                <p>No patients record found for patient id: "{patientId}" </p> :
                <div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient ID</th>
                                <th>Nurse ID</th>
                                <th>Date</th>
                                <th>Body Temperature</th>
                                <th>Blood Pressure</th>
                                <th>Heart Rate</th>
                                <th>Respiratory Rate</th>

                            </tr>
                        </thead>
                        <tbody>
                            {data.recordsByPatientId.map((record, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{record.patientId}</td>
                                    <td>{record.nurseId}</td>
                                    <td>{record.date}</td>
                                    <td>{record.bodyTemperature}</td>
                                    <td>{record.bloodPressure}</td>
                                    <td>{record.heartRate}</td>
                                    <td>{record.respiratoryRate}</td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* <Button type="button" variant="primary" onClick={() => { addRecord (patientId)}}>ADD RECORD</Button>&nbsp; */}

                </div>
            }
            <Button type="button" variant="primary" onClick={() => { addRecord (patientId)}}>ADD RECORD</Button>&nbsp;

        </div>
        
    );
}

export default PatientRecord;
