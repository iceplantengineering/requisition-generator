import { useState } from 'react';
import { Box, Typography, Stack, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';

const ComparisonContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  background: `
    linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.background.default} 100%)
  `,
  position: 'relative'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.warning.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: theme.spacing(6)
}));

const ComparisonCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  height: '100%',
  boxShadow: `0 4px 20px ${theme.palette.common.black}20`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 8px 30px ${theme.palette.common.black}30`
  }
}));

const PlanetSelector = styled(Button)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: '12px',
  background: isSelected 
    ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
    : 'rgba(255, 255, 255, 0.05)',
  border: `1px solid ${isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.1)'}`,
  color: theme.palette.text.primary,
  minWidth: '100px',
  '&:hover': {
    background: isSelected 
      ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
      : 'rgba(255, 255, 255, 0.1)'
  }
}));

const ComparisonMetric = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  '&:last-child': {
    borderBottom: 'none'
  }
}));

const planetData = {
  Mercury: { name: '水星', diameter: 4879, mass: 0.33, distance: 57.9, temperature: 167, moons: 0 },
  Venus: { name: '金星', diameter: 12104, mass: 4.87, distance: 108.2, temperature: 464, moons: 0 },
  Earth: { name: '地球', diameter: 12756, mass: 5.97, distance: 149.6, temperature: 15, moons: 1 },
  Mars: { name: '火星', diameter: 6792, mass: 0.642, distance: 227.9, temperature: -65, moons: 2 },
  Jupiter: { name: '木星', diameter: 142984, mass: 1898, distance: 778.5, temperature: -110, moons: 95 },
  Saturn: { name: '土星', diameter: 120536, mass: 568, distance: 1432, temperature: -140, moons: 146 },
  Uranus: { name: '天王星', diameter: 51118, mass: 86.8, distance: 2867, temperature: -195, moons: 27 },
  Neptune: { name: '海王星', diameter: 49528, mass: 102, distance: 4515, temperature: -200, moons: 16 }
};

const planets = Object.keys(planetData);

export default function PlanetComparison() {
  const [planet1, setPlanet1] = useState('Earth');
  const [planet2, setPlanet2] = useState('Mars');

  const data1 = planetData[planet1 as keyof typeof planetData];
  const data2 = planetData[planet2 as keyof typeof planetData];

  const getComparisonRatio = (metric: string) => {
    const value1 = data1[metric as keyof typeof data1] as number;
    const value2 = data2[metric as keyof typeof data2] as number;
    return value1 / value2;
  };

  const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'diameter': return `${value.toLocaleString()} km`;
      case 'mass': return `${value} × 10²³ kg`;
      case 'distance': return `${value} 万km`;
      case 'temperature': return `${value}°C`;
      case 'moons': return `${value}個`;
      default: return value.toString();
    }
  };

  return (
    <ComparisonContainer>
      <Stack spacing={6} alignItems="center">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <SectionTitle variant="h2">
            惑星比較ツール
          </SectionTitle>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px' }}>
            2つの惑星を選択して、サイズ、質量、距離などの特性を比較してみましょう。
          </Typography>
        </Stack>

        <Stack spacing={4} sx={{ width: '100%', maxWidth: '1000px' }}>
          {/* Planet 1 Selector */}
          <Stack spacing={2}>
            <Typography variant="h6" color="primary.main" textAlign="center">
              惑星 1を選択
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              {planets.map((planet) => (
                <PlanetSelector
                  key={planet}
                  isSelected={planet1 === planet}
                  onClick={() => setPlanet1(planet)}
                >
                  {planetData[planet as keyof typeof planetData].name}
                </PlanetSelector>
              ))}
            </Stack>
          </Stack>

          {/* Planet 2 Selector */}
          <Stack spacing={2}>
            <Typography variant="h6" color="secondary.main" textAlign="center">
              惑星 2を選択
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              {planets.map((planet) => (
                <PlanetSelector
                  key={planet}
                  isSelected={planet2 === planet}
                  onClick={() => setPlanet2(planet)}
                >
                  {planetData[planet as keyof typeof planetData].name}
                </PlanetSelector>
              ))}
            </Stack>
          </Stack>

          {/* Comparison Results */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <ComparisonCard sx={{ flex: 1 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Typography variant="h4" color="primary.main" textAlign="center">
                    {data1.name}
                  </Typography>
                  <Stack spacing={1}>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">直径</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data1.diameter, 'diameter')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">質量</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data1.mass, 'mass')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">太陽からの距離</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data1.distance, 'distance')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">平均温度</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data1.temperature, 'temperature')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">衛星数</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data1.moons, 'moons')}
                      </Typography>
                    </ComparisonMetric>
                  </Stack>
                </Stack>
              </CardContent>
            </ComparisonCard>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <BalanceOutlinedIcon sx={{ fontSize: '3rem', color: 'warning.main' }} />
            </Box>

            <ComparisonCard sx={{ flex: 1 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Typography variant="h4" color="secondary.main" textAlign="center">
                    {data2.name}
                  </Typography>
                  <Stack spacing={1}>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">直径</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data2.diameter, 'diameter')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">質量</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data2.mass, 'mass')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">太陽からの距離</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data2.distance, 'distance')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">平均温度</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data2.temperature, 'temperature')}
                      </Typography>
                    </ComparisonMetric>
                    <ComparisonMetric>
                      <Typography variant="body2" color="text.secondary">衛星数</Typography>
                      <Typography variant="body2" color="text.primary" fontWeight={500}>
                        {formatValue(data2.moons, 'moons')}
                      </Typography>
                    </ComparisonMetric>
                  </Stack>
                </Stack>
              </CardContent>
            </ComparisonCard>
          </Stack>

          {/* Comparison Summary */}
          <ComparisonCard>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" color="warning.main" textAlign="center" gutterBottom>
                比較結果
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.primary" textAlign="center">
                  <strong>{data1.name}</strong>は<strong>{data2.name}</strong>と比較して：
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    直径は約 <strong>{getComparisonRatio('diameter').toFixed(1)}倍</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    質量は約 <strong>{getComparisonRatio('mass').toFixed(1)}倍</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    太陽からの距離は約 <strong>{getComparisonRatio('distance').toFixed(1)}倍</strong>
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </ComparisonCard>
        </Stack>
      </Stack>
    </ComparisonContainer>
  );
}