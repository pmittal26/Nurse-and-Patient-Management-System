import React, { useState } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import { useParams,useNavigate } from "react-router-dom";

const UpdateMotivationalVideo = () => {
    const { id } = useParams();

    const GET_MOTIVATIONAL_VIDEO = gql`
    query GetMotivationalVideo($id :String!) {
        motivationalVideo(id: $id){
            _id
            title
            description
            videoUrl        
        }
    }
    `;
    const UPDATE_MOTIVATIONAL_VIDEO = gql`
    mutation UpdateMotivationalVideo($id: String!, $title: String!, $description: String!, $videoUrl: String!) {
        updateMotivationalVideo(id: $id, title: $title, description: $description, videoUrl: $videoUrl) {
            _id
            title
            description
            videoUrl
        }
    }
    `;
    const [data, setData] = useState([]);
    
    const [updateMotivationalVideo] = useMutation(UPDATE_MOTIVATIONAL_VIDEO,{
        onCompleted: (data) => {
            navigate("/ManageMotivationalVideo");}
    });
    let navigate = useNavigate();

    const { loading, error, dataVideo } = useQuery(GET_MOTIVATIONAL_VIDEO,{
        variables: { id },
        fetchPolicy:"network-only",
        onCompleted: (data) => {
            setData(data.motivationalVideo);
        },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return `Error! ${error.message}`;
    
   

    
    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };
    const updateVideo = (event) => {
        event.preventDefault();
        updateMotivationalVideo({
                variables: {
                    ...data,id}});
                };            
    return (
      <div className="container motivation-background motivation-background-update">
         <div className="row justify-content-md-center ">
           <div className="col-md-8 order-md-1 py-5">
             <h2 className="mb-3"> Update Motivational Video</h2>
             <Form onSubmit={updateVideo} className="needs-validation py-4" noValidate>
                  <div className="row" >
                    <Form.Group className="mb-3 col-md-8" controlId="title">
                      <Form.Label>Title</Form.Label>
                      <Form.Control type="text" name="title" placeholder="Title" value={data.title}  onChange={handleInputChange} required />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={3} name="description" placeholder="Description" value={data.description}  onChange={handleInputChange} required />

                    </Form.Group>
      
                    <Form.Group className="mb-3 col-md-8" controlId="videoUrl">
                      <Form.Label>Video URL</Form.Label>
                      <Form.Control type="text" name="videoUrl" placeholder="Video URL" value={data.videoUrl}  onChange={handleInputChange} required />
                    </Form.Group>
                    <div className="mb-3">
                      <Button type="submit" className="btn btn-success me-3">
                        Update Video
                      </Button>
                    </div>
                  </div>
                </Form>
             </div>
             </div>
             </div>

    
    );
    }
    export default UpdateMotivationalVideo;