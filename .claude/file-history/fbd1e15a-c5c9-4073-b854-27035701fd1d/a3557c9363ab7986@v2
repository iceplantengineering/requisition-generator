import { Box, Typography, Stack, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const FactsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  background: `
    radial-gradient(ellipse at top left, ${theme.palette.secondary.main}15 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, ${theme.palette.warning.main}15 0%, transparent 50%),
    ${theme.palette.background.paper}
  `,
  position: 'relative'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: theme.spacing(6)
}));

const FactCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.common.white}10`,
  borderRadius: '24px',
  transition: 'all 0.3s ease',
  height: '100%',
  boxShadow: `0 4px 20px ${theme.palette.common.black}20`,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    background: 'rgba(255, 255, 255, 0.06)',
    border: `1px solid ${theme.palette.common.white}20`,
    boxShadow: `0 20px 40px ${theme.palette.common.black}40`
  }
}));

const FactsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  maxWidth: '1200px',
  margin: '0 auto'
}));

const NumberHighlight = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1
}));

const facts = [
  {
    number: '8',
    unit: '個',
    title: '惑星の数',
    description: '太陽系には8つの惑星があります。2006年に冥王星は準惑星に分類変更されました。'
  },
  {
    number: '4.6',
    unit: '億年',
    title: '太陽系の年齢',
    description: '太陽系は約46億年前に形成されました。地球の年齢とほぼ同じです。'
  },
  {
    number: '99.86',
    unit: '%',
    title: '太陽の質量比',
    description: '太陽系の全質量の99.86%を太陽が占めています。残りは惑星や小天体です。'
  },
  {
    number: '150',
    unit: '万km',
    title: '天文単位',
    description: '地球と太陽の平均距離は1天文単位（AU）= 約1億5000万kmです。'
  },
  {
    number: '5,900',
    unit: '°C',
    title: '太陽の中心温度',
    description: '太陽の中心部は約1500万°C、表面は約5900°Cの高温です。'
  },
  {
    number: '200+',
    unit: '個',
    title: '衛星の総数',
    description: '太陽系全体で確認されている自然衛星は200個以上あります。'
  },
  {
    number: '165',
    unit: '年',
    title: '海王星の公転周期',
    description: '海王星は太陽を一周するのに約165年かかります。最も長い公転周期です。'
  },
  {
    number: '88',
    unit: '日',
    title: '水星の公転周期',
    description: '水星は最も短い公転周期で、わずか88日で太陽を一周します。'
  },
  {
    number: '318',
    unit: '倍',
    title: '木星の質量',
    description: '木星の質量は地球の約318倍で、太陽系最大の惑星です。'
  }
];

export default function SolarSystemFacts() {
  return (
    <FactsContainer>
      <Stack spacing={6} alignItems="center">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <SectionTitle variant="h2">
            太陽系の驚くべき事実
          </SectionTitle>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '700px' }}>
            太陽系に関する興味深い数字と事実をご紹介します。
            宇宙の壮大さと神秘を感じてください。
          </Typography>
        </Stack>

        <FactsGrid>
          {facts.map((fact, index) => (
            <FactCard key={index}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Stack spacing={2} alignItems="center">
                  <Stack direction="row" alignItems="baseline" spacing={1}>
                    <NumberHighlight>
                      {fact.number}
                    </NumberHighlight>
                    <Typography variant="h6" color="text.secondary">
                      {fact.unit}
                    </Typography>
                  </Stack>
                  
                  <Typography variant="h5" color="text.primary" fontWeight={600}>
                    {fact.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ lineHeight: 1.6 }}
                  >
                    {fact.description}
                  </Typography>
                </Stack>
              </CardContent>
            </FactCard>
          ))}
        </FactsGrid>
      </Stack>
    </FactsContainer>
  );
}