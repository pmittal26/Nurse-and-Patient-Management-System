// UserProfile.js

import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import nurse from '../nurse.png';
import patient from '../patient.png';

function UserProfile(props) {
    const {userType: userType, username: username, email: email} = props;
    //console.log(props);
    //console.log(userType);
    const profileElement = (title, substitle) => {
        return (
            <div>
                <Card.Title>{title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{substitle}</Card.Subtitle>
            </div>
        );
    }
    return (
        <div className='App'>
            <Card>
                <Card.Body>
                    <div className="ProfileIcon">
                        <Image src={userType === "nurse" ? nurse : patient} className="ProfileIconIimage" alt="Profile Icon" />
                    </div>
                    {profileElement("Username", username)}
                    {profileElement("User Type", userType)}
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>&#xF0E0; email: {email}</ListGroup.Item>
                </ListGroup>
            </Card>
        </div>
    );
}

export default UserProfile;