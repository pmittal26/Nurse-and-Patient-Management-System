import React, { Component,useState } from 'react';
import { useMutation ,gql,useQuery} from "@apollo/client";
import { Form,Button,Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const GET_MOTIVATIONAL_VIDEO = gql`
  query GetMotivationalVideo {
    motivationalVideos {
      _id
      title
      description
      videoUrl
    }
  }
`;
const DELETE_MOTIVATIONAL_VIDEO = gql`
  mutation DeleteMotivationalVideo($id: String!) {
    deleteMotivationalVideo(id: $id) {
      _id
    }
  }
`;

function ManageMotivationalVideo() {
  const { loading, error, data ,refetch} = useQuery(GET_MOTIVATIONAL_VIDEO,{
    fetchPolicy:"network-only",
      onCompleted: (data) => {
        console.log(data.motivationalVideos);
      },
  });
  const [deleteMotivationalVideo] = useMutation(DELETE_MOTIVATIONAL_VIDEO,{
    onCompleted: (data) => {
      refetch();
    }
  });
  let navigate = useNavigate();

  const handleDelete = (id) => {
    deleteMotivationalVideo({ variables: { id } });
  };

  const handleUpdate = (video) => {
    navigate("/UpdateMotivationalVideo/"+video._id);
  };

  const handleAddVideo = () => {
    // Logic to add a new video
    navigate("/AddMotivationalVideo");
  };
  if (loading) return <p>Loading...</p>;
  if (error) return `Error! ${error.message}`;

  return (
    <div className="container motivation-background">
         <div className="row justify-content-md-center ">
           <div className="col-md-8 order-md-1 py-5">
             <h1 className="mb-3"> Manage Motivational Videos</h1>
             <Button variant="success" onClick={handleAddVideo} className="mb-3">
        Add Video
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Video URL</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.motivationalVideos.map((video) => (
            <tr key={video._id}>
              <td>{video.title}</td>
              <td>{video.description}</td>
              <td>{video.videoUrl}</td>
              <td>
                <Button
                  variant="success"
                  onClick={() => handleUpdate(video)}
                  className="me-2"
                >
                  Update
                </Button>
                </td>
                <td>
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(video._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
</div>
</div>
</div>

 
  );

}
export default ManageMotivationalVideo;