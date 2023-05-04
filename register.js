// Importing necessary dependencies and components from MUI and React libraries
import { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Button, TextField, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const API_URL = 'http://localhost:1234';
// Styling the text field component
const MyTextField = styled(TextField)({
  marginBottom: '16px',
});
// Defining the Register Page component
const RegisterPage = () => {
    const navigate = useNavigate();
    // Defining the state variables for email, password and profile picture
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log(password);
      const image = localStorage.getItem('profilePicture')
      // Sending a POST request to the server to register the user
    const response = await fetch(`${API_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({
            email,
            password,
            // profilePicture:image,
        })
    });
      console.log(email)
      console.log(password);
      const data = await response.json();
      alert('Registration Successful')
// Navigating to the home page after successful registration
      navigate('/')
    console.log(data); // TODO: Handle response from server
    };
    // Handling the profile picture upload
  const handlePictureUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageBase64 = reader.result;
        localStorage.setItem('profilePicture', imageBase64);
        console.log(localStorage)
    };
  };
  return (
    <>
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
      <Container maxWidth="xs">
        <Box sx={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Register</h2>
          <form onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MyTextField label="Email" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ width: '100%' }} />
            <MyTextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ width: '100%' }}
                      />
                      <label htmlFor="profilePicture">Profile Picture:</label>
            <input type="file" id="profilePicture" name="profilePicture" onChange={handlePictureUpload} />
            <Button variant="contained" type="submit">
              Register
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};
// Exporting the RegisterPage component
export default RegisterPage;
