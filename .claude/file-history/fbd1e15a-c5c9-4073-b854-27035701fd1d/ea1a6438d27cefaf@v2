import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '24px',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  boxShadow: `0 4px 20px ${theme.palette.common.black}20`,
  '&:hover': {
    transform: 'translateY(-8px)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  }
}));

const PlanetImage = styled('img')(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `2px solid ${theme.palette.common.white}20`,
  boxShadow: `0 8px 32px ${theme.palette.common.black}50`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

const SpecItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.common.white}10`,
  '&:last-child': {
    borderBottom: 'none'
  }
}));

interface PlanetData {
  name: string;
  image: string;
  distance: string;
  diameter: string;
  mass: string;
  temperature: string;
  moons: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  atmosphere: string;
}

const planetData: Record<string, PlanetData> = {
  Mercury: {
    name: '水星 (Mercury)',
    image: 'https://images.unsplash.com/photo-1710268470168-67cc9903b660?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxtZXJjdXJ5JTIwcGxhbmV0JTIwc3BhY2V8ZW58MHwyfHx8MTc1OTIzOTYzNXww&ixlib=rb-4.1.0&q=85',
    distance: '5,790万 km',
    diameter: '4,879 km',
    mass: '3.3 × 10²³ kg',
    temperature: '-173°C ～ 427°C',
    moons: '0個',
    orbitalPeriod: '88日',
    rotationPeriod: '59日',
    atmosphere: 'ほぼ真空'
  },
  Venus: {
    name: '金星 (Venus)',
    image: 'https://images.unsplash.com/photo-1707332475192-52eeaad6ec41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw5fHx2ZW51cyUyMHBsYW5ldCUyMHNwYWNlfGVufDB8Mnx8eWVsbG93fDE3NTkyMzk2MzV8MA&ixlib=rb-4.1.0&q=85',
    distance: '1億820万 km',
    diameter: '12,104 km',
    mass: '4.87 × 10²⁴ kg',
    temperature: '462°C',
    moons: '0個',
    orbitalPeriod: '225日',
    rotationPeriod: '243日',
    atmosphere: '二酸化炭素96%'
  },
  Earth: {
    name: '地球 (Earth)',
    image: 'https://images.unsplash.com/photo-1639477878754-4119b60fb02a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxlYXJ0aCUyMHBsYW5ldCUyMGJsdWUlMjBjb250aW5lbnRzfGVufDB8Mnx8Ymx1ZXwxNzU5MjM5NjM1fDA&ixlib=rb-4.1.0&q=85',
    distance: '1億4,960万 km',
    diameter: '12,756 km',
    mass: '5.97 × 10²⁴ kg',
    temperature: '-89°C ～ 58°C',
    moons: '1個',
    orbitalPeriod: '365.25日',
    rotationPeriod: '24時間',
    atmosphere: '窒素78%、酸素21%'
  },
  Mars: {
    name: '火星 (Mars)',
    image: 'https://images.unsplash.com/photo-1639907087057-971905eeda58?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxtYXJzJTIwcGxhbmV0JTIwcmVkJTIwc3BhY2V8ZW58MHwyfHxyZWR8MTc1OTIzOTYzNXww&ixlib=rb-4.1.0&q=85',
    distance: '2億2,790万 km',
    diameter: '6,792 km',
    mass: '6.42 × 10²³ kg',
    temperature: '-87°C ～ -5°C',
    moons: '2個',
    orbitalPeriod: '687日',
    rotationPeriod: '24時間37分',
    atmosphere: '二酸化炭素95%'
  },
  Jupiter: {
    name: '木星 (Jupiter)',
    image: 'https://images.unsplash.com/photo-1548504769-900b70ed122e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxqdXBpdGVyJTIwcGxhbmV0JTIwZ2FzJTIwZ2lhbnQlMjBiYW5kc3xlbnwwfDJ8fG9yYW5nZXwxNzU5MjM5NjM1fDA&ixlib=rb-4.1.0&q=85',
    distance: '7億7,830万 km',
    diameter: '142,984 km',
    mass: '1.90 × 10²⁷ kg',
    temperature: '-110°C',
    moons: '95個',
    orbitalPeriod: '11.9年',
    rotationPeriod: '9時間56分',
    atmosphere: '水素89%、ヘリウム10%'
  },
  Saturn: {
    name: '土星 (Saturn)',
    image: 'https://images.unsplash.com/photo-1707332475192-52eeaad6ec41?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxzYXR1cm4lMjBwbGFuZXQlMjByaW5ncyUyMHNwYWNlfGVufDB8Mnx8eWVsbG93fDE3NTkyMzk2MzV8MA&ixlib=rb-4.1.0&q=85',
    distance: '14億2,670万 km',
    diameter: '120,536 km',
    mass: '5.68 × 10²⁶ kg',
    temperature: '-140°C',
    moons: '146個',
    orbitalPeriod: '29.5年',
    rotationPeriod: '10時間39分',
    atmosphere: '水素96%、ヘリウム3%'
  },
  Uranus: {
    name: '天王星 (Uranus)',
    image: 'https://images.unsplash.com/photo-1639548206689-1a5238f8d5bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx1cmFudXMlMjBwbGFuZXQlMjBibHVlJTIwaWNlJTIwZ2lhbnR8ZW58MHwyfHxibHVlfDE3NTkyMzk2Mzh8MA&ixlib=rb-4.1.0&q=85',
    distance: '28億7,500万 km',
    diameter: '51,118 km',
    mass: '8.68 × 10²⁵ kg',
    temperature: '-195°C',
    moons: '27個',
    orbitalPeriod: '84年',
    rotationPeriod: '17時間14分',
    atmosphere: '水素83%、ヘリウム15%'
  },
  Neptune: {
    name: '海王星 (Neptune)',
    image: 'https://images.unsplash.com/photo-1518713661966-8ce9a2e78bbd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxuZXB0dW5lJTIwcGxhbmV0JTIwYmx1ZSUyMHNwYWNlfGVufDB8Mnx8Ymx1ZXwxNzU5MjM5NjM4fDA&ixlib=rb-4.1.0&q=85',
    distance: '45億440万 km',
    diameter: '49,528 km',
    mass: '1.02 × 10²⁶ kg',
    temperature: '-200°C',
    moons: '16個',
    orbitalPeriod: '165年',
    rotationPeriod: '16時間6分',
    atmosphere: '水素80%、ヘリウム19%'
  }
};

interface PlanetCardProps {
  planetName: string;
  onClick?: () => void;
}

export default function PlanetCard({ planetName, onClick }: PlanetCardProps) {
  const planet = planetData[planetName];

  if (!planet) return null;

  return (
    <GlassCard onClick={onClick}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            <PlanetImage 
              src={planet.image} 
              alt={`${planet.name} - NASA Hubble Space Telescope on Unsplash`}
              style={{ width: '80px', height: '80px' }}
            />
            <Box>
              <Typography variant="h4" color="text.primary" gutterBottom>
                {planet.name}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                太陽からの距離
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.distance}
              </Typography>
            </SpecItem>

            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                直径
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.diameter}
              </Typography>
            </SpecItem>

            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                質量
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.mass}
              </Typography>
            </SpecItem>

            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                表面温度
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.temperature}
              </Typography>
            </SpecItem>

            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                衛星数
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.moons}
              </Typography>
            </SpecItem>

            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                公転周期
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.orbitalPeriod}
              </Typography>
            </SpecItem>

            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                自転周期
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.rotationPeriod}
              </Typography>
            </SpecItem>

            <SpecItem>
              <Typography variant="body2" color="text.secondary">
                大気組成
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {planet.atmosphere}
              </Typography>
            </SpecItem>
          </Stack>
        </Stack>
      </CardContent>
    </GlassCard>
  );
}