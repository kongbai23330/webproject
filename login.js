import { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { AppBar, Toolbar, Button, TextField, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const API_URL = 'http://localhost:1234';
// Styled component for customizing text fields
const MyTextField = styled(TextField)({
  marginBottom: '16px',
});

const LoginPage = () => {
     // State variables for email, password, and login status
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
     // Function for logging out the user
     const handleLogout = () => {// Function to handle logout
        localStorage.removeItem('token');
        localStorage.removeItem('profilePicture')
        localStorage.removeItem('userId')
        localStorage.removeItem('useremail')
        setLoggedIn(false);
    };
    
    // Function for handling the form submission when logging in
    const handleSubmit = async (e) => {
        
  
        
        e.preventDefault();
        const response = await fetch(`${API_URL}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        // If login fails, set error message
        if (response.status !== 200) {
            alert("Please enter correct username password");
            setErrorMessage('Login failed');
            return;
        }
        const data = await response.json();
         // If logging in as administrator, set token and log in
        if (email === "Administrator@gmail.com"||password==="!Abc123321123") {
            console.log("1")
            localStorage.setItem('token', "1");
            console.log(data)
            localStorage.setItem('userId', data.email);
            const userId  = localStorage.getItem('userId');
            
            setLoggedIn(true);
            // navigate('/comment');
        }
        // If successful login, set token and log in
        else if (data.success) {
            
            localStorage.setItem('token', data.token);
            
            setLoggedIn(true);
            const  userId  = localStorage.getItem('userId');
            console.log(userId)
            alert("You are authenticated, Welcome <username")
            navigate('/comment');
        }
             // If unsuccessful login, set error message
        else {
            setErrorMessage(data.message);
        }
        localStorage.setItem('userId', data.email);
        localStorage.setItem('useremail',data.trueemail)
        console.log(localStorage);
        const  userId  = localStorage.getItem('useremail');
        console.log(userId)// TODO: Handle response from server
    };
    
  

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" component={Link} to="/comment">
                        {'My Blog'}
                    </Button>
                    {loggedIn && (
                        <Button color="inherit" onClick={handleLogout}>
                            {'Logout'}
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container maxWidth="xs">
                <Box sx={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Login</h2>
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
                        
                        <Button variant="contained" type="submit">
                            Login
                        </Button>
                        <Button variant="contained" color="inherit" component={Link} to="/register">
                            {'Register'}
                        </Button>
                        {errorMessage && <p>{errorMessage}</p>}
                    </form>
                    
                </Box>
            </Container>
        </>
    );
};


export default LoginPage;
