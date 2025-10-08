import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import SolarSystemVisualization from './SolarSystemVisualization';
import CSS3DSolarSystem from './CSS3DSolarSystem';
import HeroHeader from './HeroHeader';
import { useState } from 'react';

const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: `
    radial-gradient(ellipse at top, ${theme.palette.primary.main}20 0%, transparent 50%),
    radial-gradient(ellipse at bottom, ${theme.palette.secondary.main}20 0%, transparent 50%),
    linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)
  `,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("https://images.unsplash.com/photo-1593609045621-3950fcce54ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxzcGFjZSUyMHN0YXJzJTIwbmVidWxhJTIwZ2FsYXh5fGVufDB8MHx8YmxhY2t8MTc1OTIzOTYzOXww&ixlib=rb-4.1.0&q=85")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.1,
    zIndex: 0
  }
}));

const ContentWrapper = styled(Stack)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: '1200px',
  width: '100%',
  textAlign: 'center',
  padding: theme.spacing(4)
}));

interface HeroSectionProps {
  onPlanetClick: (planet: string) => void;
}

export default function HeroSection({ onPlanetClick }: HeroSectionProps) {
  const [viewMode, setViewMode] = useState<'2d' | 'css3d'>('css3d');

  const handleViewChange = (mode: '2d' | 'css3d') => {
    setViewMode(mode);
  };

  const renderContent = () => {
    switch (viewMode) {
      case '2d':
        return (
          <ContentWrapper>
            <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: 4 }}>
              <SolarSystemVisualization onPlanetClick={onPlanetClick} />
            </Box>
          </ContentWrapper>
        );
      case 'css3d':
        return <CSS3DSolarSystem onPlanetClick={onPlanetClick} />;
      default:
        return null;
    }
  };

  return (
    <HeroContainer>
      <HeroHeader viewMode={viewMode} onViewChange={handleViewChange} />
      {renderContent()}
    </HeroContainer>
  );
}