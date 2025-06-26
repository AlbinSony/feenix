import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Alert,
  Fade,
  Avatar,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthBackground from '../components/AuthBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    const success = login(email, password);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        position: 'relative',
      }}
    >
      {/* Background Component */}
      <AuthBackground />
      
      <Fade in timeout={600}>
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              width: '100%',
              maxWidth: '500px',
              mx: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar 
                sx={{ 
                  m: 1, 
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlined fontSize="large" />
              </Avatar>
              
              <Typography 
                component="h1" 
                variant="h4" 
                color="primary" 
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                Login
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                Welcome back to Feenix! Please login to continue.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <MuiLink component={Link} to="#" variant="body2">
                      Forgot password?
                    </MuiLink>
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 3, 
                    mb: 3, 
                    py: 1.5, 
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                  }}
                >
                  Login
                </Button>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body1">
                    Don't have an account?{' '}
                    <MuiLink 
                      component={Link} 
                      to="/signup" 
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                    >
                      Sign up
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

// Make sure the component is properly exported as default
export default Login;
