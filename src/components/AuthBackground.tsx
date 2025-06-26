import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

// Subtle animation for background elements
const float = keyframes`
  0% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-10px) translateX(5px);
  }
  100% {
    transform: translateY(0px) translateX(0px);
  }
`;

// Slower animation for secondary elements
const floatSlow = keyframes`
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) translateX(-10px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
`;

const AuthBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e4e8ef 100%)',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          backgroundImage: 'radial-gradient(#22c55e 0.5px, transparent 0.5px), radial-gradient(#22c55e 0.5px, #f0f9ff 0.5px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        }}
      />
      
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          top: '10%',
          right: '-50px',
          animation: `${float} 8s ease-in-out infinite`,
          filter: 'blur(40px)',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(34, 197, 94, 0.15) 100%)',
          bottom: '-100px',
          left: '-100px',
          animation: `${floatSlow} 12s ease-in-out infinite`,
          filter: 'blur(60px)',
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          top: '40%',
          left: '20%',
          animation: `${float} 10s ease-in-out infinite`,
          filter: 'blur(30px)',
        }}
      />
    </Box>
  );
};

export default AuthBackground;
