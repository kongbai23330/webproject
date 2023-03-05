import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

const Header = () => {

  // The Header component renders a navigation bar at the top of the screen.
  // It contains three buttons: one for registration, one for login, and one for viewing the posts.

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/register">
          {('register')}
        </Button>
        <Button color="inherit" component={Link} to="/login">
          {('login')}
        </Button>
        <Button color="inherit" component={Link} to="/comment">
          {('post')}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
