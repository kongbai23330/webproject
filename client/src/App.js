import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter as Router,Routes, Route } from 'react-router-dom';

import Header from './components/Homee';
import RegisterPage from './components/register';
import LoginPage from './components/login';
import BlogList from './components/comment';
import UserProfile from './components/User'
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Create a MUI theme
const theme = createTheme({
    palette: {
      primary: {
        main: '#f44336',
      },
      secondary: {
        main: '#3f51b5',
      },
    },
  });
function App() {
    return (
        // Apply the MUI theme
        <ThemeProvider theme={theme}>
        
        <div className="App">
          <Router>
      <Routes>
        
        <Route exact path="/register" element={<RegisterPage/>} />
                  <Route path="/" element={<LoginPage />} />
                        <Route path="/comment" element={<BlogList />} />
                        <Route path="/User" element={<UserProfile/>}/>
              </Routes>
              </Router>
    </div>
        
      </ThemeProvider>
      
  );
}

export default App;
