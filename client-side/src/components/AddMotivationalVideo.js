import React, { Component,useState } from 'react';
import { useMutation ,gql} from "@apollo/client";
import { Form,Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
const ADD_MOTIVATIONAL_VIDEO = gql`
    mutation AddMotivationalVideo(       
        $title: String!
        $description: String!
        $videoUrl: String!
    ) {
        addMotivationalVideo(
            title: $title
            description: $description
            videoUrl: $videoUrl
        ) {
            _id
        }
    }
`;

function AddMotivationalVideo() {
    const [currentVideo, setCurrentVideo] = useState({  title: "",   description: "",  videoUrl: ""});
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [addMotivationalVideo] = useMutation(ADD_MOTIVATIONAL_VIDEO);
    let navigate = useNavigate();
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentVideo({ ...currentVideo, [name]: value });
      };

      const saveVideo = (e) => {
        e.preventDefault();
        addMotivationalVideo({
          variables: {
            title: currentVideo.title,
            description: currentVideo.description,
            videoUrl: currentVideo.videoUrl,
          },
        })
          .then(({ data }) => {
            console.log(data);
            setMessage('Video Added Successfully');
            setSuccessful(true);
            navigate("/ManageMotivationalVideo");
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    
        setCurrentVideo({ id: null, title: '', description: '', videoUrl: '' });
      };
      const manageMotivationalVideo = () => {
        navigate("/ManageMotivationalVideo");
      };
    return (
      <div className="container motivation-background motivation-background-update">
      <div className="row justify-content-md-center ">
        <div className="col-md-8 order-md-1 py-5">

            <h2>Manage Motivational Video</h2>
            {!successful && (
              
            <Form onSubmit={saveVideo} className="needs-validation" noValidate>
                  <div className="row" >
                    <Form.Group className="mb-3" controlId="title">
                      <Form.Label>Title</Form.Label>
                      <Form.Control type="text" name="title" placeholder="Title" value={currentVideo.title}  onChange={handleInputChange} required />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control type="text" name="description" placeholder="Description" value={currentVideo.description}  onChange={handleInputChange} required />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="videoUrl">
                      <Form.Label>Video URL</Form.Label>
                      <Form.Control type="text" name="videoUrl" placeholder="Video URL" value={currentVideo.videoUrl}  onChange={handleInputChange} required />
                    </Form.Group>
                    <div className="mb-3">
                      <Button type="submit" className="btn btn-success me-3">
                        Add Video
                      </Button>
                      <Button type="submit" className="btn btn-success me-3" onClick={()=>{manageMotivationalVideo()}}>
                        Cancel
                      </Button>
                    </div>
                    
                  </div>
                </Form>
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
        </div>
        </div></div>
    )
}
export default AddMotivationalVideo;