import { Box, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import SolarSystemVisualization from './SolarSystemVisualization';

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
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
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

const GlowText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.warning.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: `0 0 30px ${theme.palette.primary.main}40`,
  marginBottom: theme.spacing(2)
}));

interface HeroSectionProps {
  onPlanetClick: (planet: string) => void;
}

export default function HeroSection({ onPlanetClick }: HeroSectionProps) {
  return (
    <HeroContainer>
      <ContentWrapper spacing={6}>
        <Stack spacing={3} alignItems="center">
          <GlowText variant="h1">
            太陽系の神秘
          </GlowText>
          <Typography 
            variant="h3" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', lineHeight: 1.6 }}
          >
            惑星の軌道運動と天体の諸元を探索する
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ maxWidth: '600px', opacity: 0.8 }}
          >
            インタラクティブな太陽系シミュレーションで、各惑星の特性と軌道の美しさを体験してください
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', maxWidth: '900px' }}>
          <SolarSystemVisualization onPlanetClick={onPlanetClick} />
        </Box>
      </ContentWrapper>
    </HeroContainer>
  );
}