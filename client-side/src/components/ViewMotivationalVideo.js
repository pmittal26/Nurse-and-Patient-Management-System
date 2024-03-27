import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useQuery, gql } from '@apollo/client';


const ViewMotivationalVideo = () => {
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
  const { loading, error, data } = useQuery(GET_MOTIVATIONAL_VIDEO, {
    onError: (err) => {
      console.log({ err });
    },
  });
  const [videoUrl, setVideoUrl] = useState('');

  const handleInputChange = (event) => {
    setVideoUrl(event.target.value);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return `Loading error! ${error.message}`;
  return (
    <div className="container motivation-background">
         <div className="row justify-content-md-center ">
           <div className="col-md-6 order-md-1 py-5">
             <h1 className="mb-3"> Motivate Yourself</h1>
      {data.motivationalVideos.map((video) => (
         

             

        <div key={video._id} className='py-4'>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
          <ReactPlayer
            url={video.videoUrl}
            controls
            width="480px"
            height="270px"
          />
        </div>
      ))}
    </div>
              </div>
              </div>

  );
};

export default ViewMotivationalVideo;
