import React, { useState, useEffect } from "react";
import { useQuery,gql,useMutation } from "@apollo/client";
import { useAuthUserToken, useAuthUserType } from "../components/config/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle  } from '@fortawesome/free-solid-svg-icons'


const QUERY_PATIENTSALERT = gql`
    query getAlerts {
        alerts {
            _id
            situation
            contactNumber
            isAttended
            patient{              
              fullName
            }
        }
    }
`;

const ATTEND_ALERT = gql`
  mutation attendAlert($id: String!) {
    attendAlert(id: $id) {
      _id
    }
  }
`;


const ViewAlert = () => {
  const [selectdPatient, setSelectedPatient] = useState(null);
  const [patientInfo, setPatientInfo] = useState([]);
  const [currentPatientName, setCurrentPatientName] = useState("");
  const [authUserToken] = useAuthUserToken();
  const [authType] = useAuthUserType();
  const [content, setContent] = useState("");

  const { loading, error, data,refetch } = useQuery(QUERY_PATIENTSALERT, {
    onError: (err) => {
      console.log({ err });
    },
  });

  const [attendAlert, { error: attendAlertError, loading: attendAlertLoading }] = useMutation(ATTEND_ALERT, {
    onError: (err) => {
      console.log({ err });
    },
    onCompleted: (data) => {
      console.log("Marked as attended");
      refetch();
    }
  });
    
  

  useEffect(() => {
    if (authUserToken && authType) {
      setContent(authUserToken);
    }
  }, [authUserToken, authType]);

  const markAttended = (id) => {
    attendAlert({ variables: { id } });
    
  };

  if (loading) return <p>Loading...</p>;
  if (error) return `Submission error! ${error.message}`;

  return (
    <div>
      {content && authType === "nurse" ? (
        <div className="container alert-background">
        <div className="row justify-content-md-center ">
          <div className="col-md-6 order-md-1 py-5 com-example">
            <h2 className="mb-3"> Alerts</h2>
            <div className="alert-list">
            <table class="table table-striped table-light">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Situation</th>
                <th scope="col">Contact #</th>
                <th scope="col">Patient Name</th>
                <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>            
                {data.alerts.filter(alert => !alert.isAttended).map((alert, idx) => (
                 <tr>   
                    <td>{idx+1}</td>
                    <td scope="row" key={alert._id}>{alert.situation}</td>
                    <td>{alert.contactNumber}</td>
                    <td>{alert.patient.fullName}</td>
                    <td>
                    <div class="btn-group">
                    <a class="dropdown-item d-flex align-items-center pe-4" href="#" title="Attend" onClick={()=>markAttended(alert._id)}><FontAwesomeIcon icon={faCheckCircle  } size="x" color="green" /></a>
                    {/* <a class="dropdown-item d-flex align-items-center pe-4" href="#" title="Attend"><FontAwesomeIcon icon={faTimesCircle } size="x" color="#ff0000" /></a> */}
                    </div>
                    </td>

                </tr>
                ))}
            
            </tbody>
            </table>
          </div>
            </div>
          </div>
        </div>

      ) : (
        <div className="container">
          <header className="jumbotron">
            <h3>Unauthorized! Please Login</h3>
          </header>
        </div>
      )}
    </div>
  );
};

export default ViewAlert;
