import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import zwift from '../gamesLogo/Zwift.jpg';
import fitXR from '..//gamesLogo/FitXR.avif';
import justDance from '../gamesLogo/JustDanceNowLogo.jpeg';
const games = [
  {
    id: 1,
    name: 'Zwift',
    description: 'Workout anytime, ride with friends \& discover training plans for everyone.',
    imageUrl: zwift,
    url:'https://us.zwift.com/'
  },
  {
    id: 2,
    name: 'fitXR',
    description: 'The FitXR app contains a growing range of fitness studios.',
    imageUrl: fitXR,
    url:'https://fitxr.com/'
  },
  {
    id: 3,
    name: 'Just Dance Now',
    description: 'lets you dance & follow the on-screen dancer\'s moves.',
    imageUrl: justDance,
    url:'https://justdancenow.com/'
  }
];

const FitnessGames = () => {
  const handleInstall = (game) => {
    console.log(`Installing ${game.name}`);
    window.open(game.url, '_blank');
    // Add logic to install the game or navigate to the app store page
  };

  return (
    <div className="container">
    <div className="row justify-content-md-center ">
      <div className="col-md-8 order-md-1 py-5">
      <h2 className="mb-3">Top Fitness Gaming Apps</h2>
      <Row>
        {games.map((game) => (
          <Col key={game.id} md={4}>
            <Card className="mb-4">
              <Card.Img className="card-img" variant="top" src={game.imageUrl}/>
              <Card.Body>
                <Card.Title>{game.name}</Card.Title>
                <Card.Text>{game.description}</Card.Text>
                <Button className="btn btn-success me-3" variant="primary" onClick={() => handleInstall(game)}>
                 Play
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </div>
    </div>
  );
};

export default FitnessGames;
