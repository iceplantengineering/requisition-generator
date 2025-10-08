import { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';

const orbit = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const SolarSystemContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `radial-gradient(circle at center, ${theme.palette.grey[900]} 0%, ${theme.palette.background.default} 100%)`,
  overflow: 'hidden',
  borderRadius: '24px'
}));

const Sun = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: `radial-gradient(circle at 30% 30%, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
  boxShadow: `0 0 40px ${theme.palette.warning.main}, 0 0 80px ${theme.palette.warning.main}40`,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
  // Sun remains stationary - no rotation animation
}));

const OrbitPath = styled(Box)<{ size: number }>(({ size }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}));

const PlanetOrbit = styled(Box)<{ 
  size: number; 
  duration: number; 
  isAnimating: boolean;
}>(({ size, duration, isAnimating }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  transformOrigin: 'center',
  animation: isAnimating ? `${orbit} ${duration}s linear infinite` : 'none'
}));

const Planet = styled(Box)<{ 
  planetSize: number; 
  color: string;
  image: string;
}>(({ planetSize, color, image }) => ({
  position: 'absolute',
  width: `${planetSize}px`,
  height: `${planetSize}px`,
  borderRadius: '50%',
  background: `url(${image}) center/cover, radial-gradient(circle at 30% 30%, ${color}80, ${color})`,
  boxShadow: `0 0 20px ${color}40`,
  top: '50%',
  left: '100%',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translate(-50%, -50%) scale(1.2)',
    boxShadow: `0 0 30px ${color}80`
  }
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.grey[700]}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'scale(1.1)'
  }
}));

interface Planet {
  name: string;
  orbitSize: number;
  planetSize: number;
  duration: number;
  color: string;
  image: string;
}

// Realistic orbital data following Kepler's laws and actual solar system ratios
// AU (Astronomical Unit) scaled down for visualization (1 AU = 150px scale)
const planets: Planet[] = [
  {
    name: 'Mercury',
    orbitSize: 60,  // 0.39 AU
    planetSize: 6,
    duration: 4,   // 88 Earth days scaled to animation
    color: '#8C7853',
    image: 'https://images.unsplash.com/photo-1710268470168-67cc9903b660?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxtZXJjdXJ5JTIwcGxhbmV0JTIwc3BhY2V8ZW58MHwyfHx8MTc1OTIzOTYzNXww&ixlib=rb-4.1.0&q=85'
  },
  {
    name: 'Venus',
    orbitSize: 90,  // 0.72 AU
    planetSize: 10,
    duration: 7,   // 225 Earth days
    color: '#FFC649',
    image: 'https://images.unsplash.com/photo-1707332475192-52eeaad6ec41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw5fHx2ZW51cyUyMHBsYW5ldCUyMHNwYWNlfGVufDB8Mnx8eWVsbG93fDE3NTkyMzk2MzV8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    name: 'Earth',
    orbitSize: 120, // 1.00 AU (reference)
    planetSize: 11,
    duration: 10,  // 365 days = 1 year = reference animation
    color: '#6B93D6',
    image: 'https://images.unsplash.com/photo-1639477878754-4119b60fb02a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxlYXJ0aCUyMHBsYW5ldCUyMGJsdWUlMjBjb250aW5lbnRzfGVufDB8Mnx8Ymx1ZXwxNzU5MjM5NjM1fDA&ixlib=rb-4.1.0&q=85'
  },
  {
    name: 'Mars',
    orbitSize: 160, // 1.52 AU
    planetSize: 8,
    duration: 15,  // 687 Earth days
    color: '#CD5C5C',
    image: 'https://images.unsplash.com/photo-1639907087057-971905eeda58?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxtYXJzJTIwcGxhbmV0JTIwcmVkJTIwc3BhY2V8ZW58MHwyfHxyZWR8MTc1OTIzOTYzNXww&ixlib=rb-4.1.0&q=85'
  },
  {
    name: 'Jupiter',
    orbitSize: 280, // 5.20 AU
    planetSize: 22,
    duration: 35,  // 12 Earth years
    color: '#D8CA9D',
    image: 'https://images.unsplash.com/photo-1548504769-900b70ed122e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxqdXBpdGVyJTIwcGxhbmV0JTIwZ2FzJTIwZ2lhbnQlMjBiYW5kc3xlbnwwfDJ8fG9yYW5nZXwxNzU5MjM5NjM1fDA&ixlib=rb-4.1.0&q=85'
  },
  {
    name: 'Saturn',
    orbitSize: 380, // 9.58 AU
    planetSize: 19,
    duration: 50,  // 29 Earth years
    color: '#FAD5A5',
    image: 'https://images.unsplash.com/photo-1707332475192-52eeaad6ec41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxzYXR1cm4lMjBwbGFuZXQlMjByaW5ncyUyMHNwYWNlfGVufDB8Mnx8eWVsbG93fDE3NTkyMzk2MzV8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    name: 'Uranus',
    orbitSize: 460, // 19.22 AU
    planetSize: 14,
    duration: 70,  // 84 Earth years
    color: '#4FD0E7',
    image: 'https://images.unsplash.com/photo-1639548206689-1a5238f8d5bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx1cmFudXMlMjBwbGFuZXQlMjBibHVlJTIwaWNlJTIwZ2lhbnR8ZW58MHwyfHxibHVlfDE3NTkyMzk2Mzh8MA&ixlib=rb-4.1.0&q=85'
  },
  {
    name: 'Neptune',
    orbitSize: 520, // 30.05 AU
    planetSize: 13,
    duration: 100, // 165 Earth years
    color: '#4B70DD',
    image: 'https://images.unsplash.com/photo-1518713661966-8ce9a2e78bbd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxuZXB0dW5lJTIwcGxhbmV0JTIwYmx1ZSUyMHNwYWNlfGVufDB8Mnx8Ymx1ZXwxNzU5MjM5NjM4fDA&ixlib=rb-4.1.0&q=85'
  }
];

interface SolarSystemVisualizationProps {
  onPlanetClick: (planet: string) => void;
}

export default function SolarSystemVisualization({ onPlanetClick }: SolarSystemVisualizationProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <SolarSystemContainer>
      {/* Orbit paths */}
      {planets.map((planet) => (
        <OrbitPath key={`orbit-${planet.name}`} size={planet.orbitSize} />
      ))}

      {/* Sun - remains stationary at center */}
      <Sun />

      {/* Planets */}
      {planets.map((planet) => (
        <PlanetOrbit
          key={planet.name}
          size={planet.orbitSize}
          duration={planet.duration}
          isAnimating={isAnimating}
        >
          <Planet
            planetSize={planet.planetSize}
            color={planet.color}
            image={planet.image}
            onClick={() => onPlanetClick(planet.name)}
            title={planet.name}
          />
        </PlanetOrbit>
      ))}

      {/* Control button */}
      <ControlButton onClick={toggleAnimation}>
        {isAnimating ? <PauseOutlinedIcon /> : <PlayArrowOutlinedIcon />}
      </ControlButton>
    </SolarSystemContainer>
  );
}