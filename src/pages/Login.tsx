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
  Fade,
  Avatar,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthBackground from '../components/AuthBackground';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      const success = await login(email, password);
      
      if (success) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
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
        bgcolor: '#f5f5f5',
        backgroundImage: 'linear-gradient(135deg, #22c55e15 25%, transparent 25%), linear-gradient(225deg, #22c55e15 25%, transparent 25%), linear-gradient(45deg, #22c55e15 25%, transparent 25%), linear-gradient(315deg, #22c55e15 25%, #f5f5f5 25%)',
        backgroundPosition: '40px 0, 40px 0, 0 0, 0 0',
        backgroundSize: '80px 80px',
        backgroundRepeat: 'repeat',
      }}
    >
      <AuthBackground />
      
      <Fade in timeout={800}>
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
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(12px)',
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
                  width: 70,
                  height: 70,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                }}
              >
                <LockOutlined sx={{ fontSize: 35 }} />
              </Avatar>
              
              <Typography 
                component="h1" 
                variant="h4" 
                color="primary" 
                fontWeight="bold"
                textAlign="center"
                sx={{ mb: 1 }}
              >
                Welcome to Feenix
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                align="center"
                sx={{ mb: 4 }}
              >
                Smart Payments Assistant
              </Typography>

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
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ 
                    mt: 4, 
                    mb: 3, 
                    py: 2,
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                    }
                  }}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <MuiLink 
                      component={Link} 
                      to="#" 
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      Forgot password?
                    </MuiLink>
                  </Grid>
                </Grid>
                
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

export default Login;
