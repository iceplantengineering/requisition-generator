import { Box, Typography, Stack, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const EducationContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  background: `
    radial-gradient(ellipse at center, ${theme.palette.info.main}10 0%, transparent 70%),
    ${theme.palette.background.default}
  `,
  position: 'relative'
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.info.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  marginBottom: theme.spacing(6)
}));

const EducationCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  boxShadow: `0 4px 20px ${theme.palette.common.black}20`,
  '&:hover': {
    transform: 'translateY(-5px)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: `0 8px 30px ${theme.palette.common.black}30`
  }
}));

const ConceptGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto'
}));

const concepts = [
  {
    title: '軌道運動の法則',
    description: 'ケプラーの法則により、惑星は楕円軌道を描き、太陽に近いほど速く移動します。',
    details: '第一法則：惑星の軌道は楕円で、太陽はその焦点の一つにある\n第二法則：惑星と太陽を結ぶ線分は等しい時間に等しい面積を描く\n第三法則：軌道周期の二乗は軌道長半径の三乗に比例する'
  },
  {
    title: '重力の影響',
    description: '太陽の重力が惑星を軌道に保持し、距離の二乗に反比例して作用します。',
    details: 'ニュートンの万有引力の法則：F = G(m₁m₂)/r²\n重力は質量に比例し、距離の二乗に反比例\n太陽系の安定性は重力バランスによって維持される'
  },
  {
    title: '公転と自転',
    description: '惑星は太陽の周りを公転しながら、自身の軸を中心に自転しています。',
    details: '公転：太陽を中心とした軌道運動\n自転：惑星自身の軸回転\n自転周期と公転周期は惑星ごとに異なる\n潮汐ロックされた天体も存在する'
  },
  {
    title: '軌道要素',
    description: '軌道の形状と向きは6つの軌道要素によって完全に決定されます。',
    details: '軌道長半径：軌道の大きさ\n離心率：軌道の楕円度\n軌道傾斜角：軌道面の傾き\n昇交点経度：軌道面の向き\n近点引数：楕円の向き\n平均近点角：軌道上の位置'
  },
  {
    title: '軌道共鳴',
    description: '複数の天体が特定の周期比で軌道運動する現象で、軌道を安定化させます。',
    details: '木星の衛星イオ、エウロパ、ガニメデは2:1:1/2の共鳴\n海王星と冥王星は3:2の共鳴関係\n共鳴により軌道が安定化される\nカークウッド空隙も共鳴の結果'
  },
  {
    title: '摂動効果',
    description: '他の天体の重力による軌道の微小な変化が長期的な軌道進化を引き起こします。',
    details: '惑星間の重力相互作用\n軌道要素の長期変動\n歳差運動や章動\n軌道の長期安定性への影響'
  }
];

export default function OrbitalEducation() {
  return (
    <EducationContainer>
      <Stack spacing={6} alignItems="center">
        <Stack spacing={3} alignItems="center" textAlign="center">
          <SectionTitle variant="h2">
            軌道力学の基礎
          </SectionTitle>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
            太陽系の惑星運動を支配する物理法則と軌道力学の基本概念を学びましょう。
            これらの原理は宇宙探査や人工衛星の軌道設計にも応用されています。
          </Typography>
        </Stack>

        <ConceptGrid>
          {concepts.map((concept, index) => (
            <EducationCard key={index}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Typography variant="h4" color="primary.main" gutterBottom>
                    {concept.title}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {concept.description}
                  </Typography>
                  <Box 
                    sx={{ 
                      p: 2, 
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
                    >
                      {concept.details}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </EducationCard>
          ))}
        </ConceptGrid>
      </Stack>
    </EducationContainer>
  );
}