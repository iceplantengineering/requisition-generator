import { useState, useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';

const orbit = keyframes`
  from {
    transform: rotateX(60deg) rotateZ(0deg);
  }
  to {
    transform: rotateX(60deg) rotateZ(360deg);
  }
`;

const planetRotation = keyframes`
  from {
    transform: rotateY(0deg) rotateX(-60deg);
  }
  to {
    transform: rotateY(360deg) rotateX(-60deg);
  }
`;

const SolarSystemContainer = styled(Box)<{ scale: number }>(({ scale }) => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
    radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%)
  `,
  overflow: 'hidden',
  position: 'relative',
  perspective: '1500px',
  transform: `scale(${scale})`,
  transformOrigin: 'center center',
  transition: 'transform 0.3s ease',
  margin: 0,
  padding: 0
}));

const System3D = styled(Box)(() => ({
  position: 'relative',
  width: '800px',
  height: '800px',
  transformStyle: 'preserve-3d',
  transform: 'rotateX(25deg)',
  margin: 'auto'
}));

const Sun3D = styled(Box)(() => ({
  position: 'absolute',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 30% 30%, #ffeb3b, #ff9800)',
  boxShadow: `
    0 0 60px #ff9800,
    0 0 100px rgba(255, 152, 0, 0.4),
    inset -10px -10px 20px rgba(0,0,0,0.3)
  `,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
  animation: `${planetRotation} 25s linear infinite`
}));

const Orbit3D = styled(Box)<{ size: number; speed: number; isAnimating: boolean; tiltAngle?: number }>(({
  size,
  speed,
  isAnimating,
  tiltAngle = 0
}) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%) rotateX(${tiltAngle}deg)`,
  transformStyle: 'preserve-3d',
  animation: isAnimating ? `${orbit} ${speed}s linear infinite` : 'none'
}));

const Planet3D = styled(Box)<{
  planetSize: number;
  color: string;
  orbitRadius: number;
  isHovered: boolean;
  rotationSpeed: number;
}>(({ planetSize, color, orbitRadius, isHovered, rotationSpeed }) => {
  const planetOrbitAnimation = keyframes`
    from {
      transform: translate(-50%, -50%) rotateX(-60deg) rotateY(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotateX(-60deg) rotateY(360deg);
    }
  `;

  return {
    position: 'absolute',
    width: `${planetSize}px`,
    height: `${planetSize}px`,
    borderRadius: '50%',
    background: `
      radial-gradient(circle at 30% 30%, ${color}CC, ${color}88, ${color}44),
      linear-gradient(135deg, ${color}, ${color}66)
    `,
    boxShadow: `
      0 0 20px ${color}60,
      inset -5px -5px 10px rgba(0,0,0,0.4),
      inset 5px 5px 10px rgba(255,255,255,0.2)
    `,
    top: '50%',
    left: `${orbitRadius}px`,
    transform: `translate(-50%, -50%) rotateX(-60deg)`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transformStyle: 'preserve-3d',
    animation: `${planetOrbitAnimation} ${rotationSpeed}s linear infinite`,
    ...(isHovered && {
      transform: `translate(-50%, -50%) rotateX(-60deg) scale(1.5)`,
      boxShadow: `
        0 0 40px ${color}80,
        inset -5px -5px 10px rgba(0,0,0,0.4),
        inset 5px 5px 10px rgba(255,255,255,0.3)
      `,
      zIndex: 20
    })
  };
});

const SaturnRing = styled(Box)<{ size: number; color: string }>(({ size, color }) => ({
  position: 'absolute',
  width: `${size * 2}px`,
  height: `${size * 2}px`,
  border: `3px solid ${color}66`,
  borderRadius: '50%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotateX(70deg)',
  boxShadow: `0 0 10px ${color}40`
}));

const ControlPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '30px',
  right: '30px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  zIndex: 100
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: theme.palette.text.primary,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    transform: 'scale(1.1)'
  }
}));

const InfoPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '30px',
  left: '30px',
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '14px',
  fontFamily: 'monospace',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: theme.spacing(2),
  borderRadius: '8px',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  zIndex: 100
}));

const PlanetData = [
  { name: 'Mercury', size: 8, orbitRadius: 100, speed: 4, color: '#8C7853', tiltAngle: 7, rotationSpeed: 3 },
  { name: 'Venus', size: 14, orbitRadius: 140, speed: 7, color: '#FFC649', tiltAngle: 3, rotationSpeed: 5 },
  { name: 'Earth', size: 15, orbitRadius: 180, speed: 10, color: '#6B93D6', tiltAngle: 0, rotationSpeed: 8 },
  { name: 'Mars', size: 10, orbitRadius: 220, speed: 15, color: '#CD5C5C', tiltAngle: 5, rotationSpeed: 7 },
  { name: 'Jupiter', size: 35, orbitRadius: 300, speed: 35, color: '#D8CA9D', tiltAngle: 3, rotationSpeed: 12 },
  { name: 'Saturn', size: 30, orbitRadius: 380, speed: 50, color: '#FAD5A5', tiltAngle: 6, rotationSpeed: 15, hasRing: true },
  { name: 'Uranus', size: 20, orbitRadius: 460, speed: 70, color: '#4FD0E7', tiltAngle: 15, rotationSpeed: 20 },
  { name: 'Neptune', size: 19, orbitRadius: 520, speed: 100, color: '#4B70DD', tiltAngle: 8, rotationSpeed: 18 }
];

interface CSS3DSolarSystemProps {
  onPlanetClick: (planetName: string) => void;
}

export default function CSS3DSolarSystem({ onPlanetClick }: CSS3DSolarSystemProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [scale, setScale] = useState(1);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.3));
  };

  const handleReset = () => {
    setScale(1);
  };

  const handlePlanetClick = (planetName: string) => {
    onPlanetClick(planetName);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.3, Math.min(3, prev + delta)));
  };

  return (
    <SolarSystemContainer
      ref={containerRef}
      scale={scale}
      onWheel={handleWheel}
    >
      <System3D>
        {/* Sun */}
        <Sun3D />

        {/* Planets and Orbits */}
        {PlanetData.map((planet) => (
          <Orbit3D
            key={planet.name}
            size={planet.orbitRadius * 2}
            speed={planet.speed}
            isAnimating={isAnimating}
            tiltAngle={planet.tiltAngle}
          >
            <Planet3D
              planetSize={planet.size}
              color={planet.color}
              orbitRadius={planet.orbitRadius}
              isHovered={hoveredPlanet === planet.name}
              rotationSpeed={planet.rotationSpeed}
              onClick={() => handlePlanetClick(planet.name)}
              onMouseEnter={() => setHoveredPlanet(planet.name)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {planet.hasRing && (
                <SaturnRing size={planet.size} color={planet.color} />
              )}
            </Planet3D>
          </Orbit3D>
        ))}
      </System3D>

      {/* Control Panel */}
      <ControlPanel>
        <ControlButton onClick={() => setIsAnimating(!isAnimating)}>
          {isAnimating ? <PauseOutlinedIcon /> : <PlayArrowOutlinedIcon />}
        </ControlButton>
        <ControlButton onClick={handleZoomIn}>
          <ZoomInIcon />
        </ControlButton>
        <ControlButton onClick={handleZoomOut}>
          <ZoomOutIcon />
        </ControlButton>
        <ControlButton onClick={handleReset}>
          <CenterFocusStrongIcon />
        </ControlButton>
      </ControlPanel>

      {/* Info Panel */}
      <InfoPanel>
        <div>🖱️ スクロール: ズーム</div>
        <div>🎮 ボタン: 操作</div>
        <div>🪐 惑星: クリックで詳細</div>
        <div>📏 スケール: {(scale * 100).toFixed(0)}%</div>
        {hoveredPlanet && (
          <div style={{ marginTop: 8, color: '#fff' }}>
            <strong>{hoveredPlanet}</strong>
          </div>
        )}
      </InfoPanel>
    </SolarSystemContainer>
  );
}