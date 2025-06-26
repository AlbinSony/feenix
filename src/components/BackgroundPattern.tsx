import { Box } from '@mui/material';

const BackgroundPattern = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.4,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle, #e5e7eb 1px, transparent 1px) 0 0 / 20px 20px,
          radial-gradient(circle, #e5e7eb 1px, transparent 1px) 10px 10px / 20px 20px
        `,
        backgroundColor: '#f9fafb',
      }}
    />
  );
};

export default BackgroundPattern;
