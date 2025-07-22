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
        zIndex: -1, // Changed from 0 to -1 to stay behind content
        opacity: 0.5,
        pointerEvents: 'none',
        background: `
          linear-gradient(135deg, #f5f7fa 25%, transparent 25%) -10px 0,
          linear-gradient(225deg, #f5f7fa 25%, transparent 25%) -10px 0,
          linear-gradient(315deg, #f5f7fa 25%, transparent 25%),
          linear-gradient(45deg, #f5f7fa 25%, transparent 25%)
        `,
        backgroundColor: '#ffffff',
        backgroundSize: '20px 20px',
      }}
    />
  );
};

export default BackgroundPattern;
