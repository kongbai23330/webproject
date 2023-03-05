import React, { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';
function UserProfile() {
  const [user, setUser] = useState({});
  const  userId  = localStorage.getItem('userId');
    const imgurl = localStorage.getItem('profilePicture')
    // Effect hook to get user data
  useEffect(() => {
    const getUserById = () => {
      fetch(`http://localhost:1234/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error(error));
    }
    
    getUserById();
  }, [userId]);

    return (
      
        <div>
            <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/comment">
            {'My Blog'}
                    </Button>
                    <Button color="inherit" component={Link} to="/">
            {'Login'}
                    </Button>        
        </Toolbar>
      </AppBar>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio || 'No bio available'}</p>
      <p>Registered: {new Date(user.registered).toLocaleDateString()}</p>
      <img src={imgurl} alt="User profile" />
      </div>
  );
}

export default UserProfile;
