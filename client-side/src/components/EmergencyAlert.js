import React, { useState, useEffect } from "react";
import { useMutation ,gql} from "@apollo/client";
import { useAuthUserToken, useAuthUserType } from "../components/config/auth";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import emergency from '../emergency.jpg';

const ADD_ALERT = gql`
  mutation AddAlert(
    $patient: String!
    $situation: String!
    $contactNumber: String!
  ) {
    addAlert(
      patient: $patient
      situation: $situation
      contactNumber: $contactNumber
    ) {
      _id
    }
  }
`;
function EmergencyAlert() {
  const [addAlert, { error, loading }] = useMutation(ADD_ALERT, {
    onError: (err) => {
      console.log({ err });
    },
  });
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);
  const initialAlertState = {
    id: null,
    patient: "",
    situation: "",
    contactNumber: "",
  };
  const [currentAlert, setCurrentAlert] = useState(initialAlertState);

  const [authUserToken] = useAuthUserToken();
  const [authType] = useAuthUserType();
  const [content, setContent] = useState("");
  useEffect(() => {
    if (authUserToken && authType) {
      setContent(sessionStorage.getItem("user_id"));
    }
  }, [authUserToken, authType]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentAlert({ ...currentAlert, [name]: value });
  };

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  const saveAlert = (e) => {
    e.preventDefault();
    setMessage("Alert Sent Successfully");
    setSuccessful(true);
    addAlert({
      variables: {
        patient: content,
        situation: currentAlert.situation,
        contactNumber: currentAlert.contactNumber,
      },
    });
  };

  return (
    <>
      {content && authType === "patient" ? (
        <>
          {!successful && (
            <div className="container alert-background">
            <div className="row justify-content-md-center ">
              <div className="col-md-6 order-md-1 py-5">
                <h2 className="mb-3"> Emergency Alert</h2>
      
                <Form onSubmit={saveAlert} className="needs-validation" noValidate>
                  <div className="row" >
                    <Form.Group className="mb-3" controlId="studentNumber">
                      <Form.Label>Situation</Form.Label>
                      <Form.Control as="textarea" rows={3} name="situation" placeholder="Describe situation" value={currentAlert.situation}  onChange={handleInputChange} required />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="contactNumber">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control type="text" name="contactNumber" placeholder="Contact number" value={currentAlert.contactNumber}  onChange={handleInputChange} required />
                    </Form.Group>
      
                    <div className="mb-3">
                      <Button type="submit" className="btn btn-success btn-lg me-3">
                        Send Alert
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>

              
            </div>
            
          </div>



          )}
          {message && (
            <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-md-4 order-md-1">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>

              </div>
            </div>
          </div>

          
          )}
        </>
      ) : (
        <div className="container">
          <header className="jumbotron">
            <h3>Unauthorized! Please Login</h3>
          </header>
        </div>
      )}
    </>
  );
};

export default EmergencyAlert;
