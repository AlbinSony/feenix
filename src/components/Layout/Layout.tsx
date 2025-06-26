import { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Button,
  Avatar,
  Divider,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Group,
  People,
  Notifications,
  Receipt,
  Analytics,
  Settings,
  Logout,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BackgroundPattern from '../BackgroundPattern';

interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Group Management', icon: <Group />, path: '/groups' },
  { text: 'Student/Client Management', icon: <People />, path: '/clients' },
  { text: 'Fee Plans & Payment Requests', icon: <Receipt />, path: '/payments' }, // Updated path
  { text: 'Reminders', icon: <Notifications />, path: '/reminders' },
  { text: 'Receipts and Status', icon: <Receipt />, path: '/receipts' },
  { text: 'Reports', icon: <Analytics />, path: '/reports' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ 
      bgcolor: '#ffffff', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: 'none' 
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2, 
          bgcolor: 'background.paper',
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, mr: 2 }}>F</Avatar>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Feenix
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                bgcolor: isActive ? 'primary.light' : 'transparent',
                color: isActive ? 'primary.contrastText' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive ? 'primary.light' : 'rgba(34, 197, 94, 0.08)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive ? 'primary.contrastText' : 'primary.main',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500 
                }}
              />
              {isActive && <KeyboardArrowRight color="inherit" />}
            </ListItem>
          )}
        )}
      </List>

      <Box p={2}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ 
            justifyContent: 'flex-start',
            borderRadius: 2,
            py: 1
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: '100vw', overflow: 'hidden' }}>
      <BackgroundPattern />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: 'primary.main',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/profile')}
            >
              A
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: isMobile ? 2 : 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#f5f7fa',
          p: { xs: 2, sm: 3 },
          overflowX: 'hidden',
        }}
      >
        <Toolbar />
        <Fade in timeout={500}>
          <Box sx={{ 
            width: '100%',
            overflowX: 'hidden'
          }}>
            {children}
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default Layout;