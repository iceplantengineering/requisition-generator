import { Box, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

const HeaderContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  padding: theme.spacing(3),
  background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
  backdropFilter: 'blur(10px)'
}));

const TitleContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2)
}));

const GlowText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.warning.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: `0 0 30px ${theme.palette.primary.main}40`,
  marginBottom: theme.spacing(1),
  fontWeight: 'bold'
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  opacity: 0.9,
  maxWidth: '800px',
  margin: '0 auto',
  lineHeight: 1.6
}));

const ControlButton = styled(Button)<{ isActive: boolean }>(({ theme, isActive }) => ({
  background: isActive
    ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
    : 'rgba(255, 255, 255, 0.1)',
  color: isActive ? 'white' : theme.palette.text.primary,
  border: `1px solid ${isActive ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.2)'}`,
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: isActive
      ? `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
      : 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.05)'
  }
}));

interface HeroHeaderProps {
  viewMode: '2d' | 'css3d';
  onViewChange: (mode: '2d' | 'css3d') => void;
}

export default function HeroHeader({ viewMode, onViewChange }: HeroHeaderProps) {
  return (
    <HeaderContainer>
      <TitleContainer>
        <GlowText variant="h2">
          太陽系の神秘
        </GlowText>
        <SubtitleText variant="h6">
          惑星の軌道運動と天体の諸元を探索する
        </SubtitleText>
      </TitleContainer>

      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
        <ControlButton
          isActive={viewMode === '2d'}
          onClick={() => onViewChange('2d')}
          startIcon={<ViewInArIcon />}
        >
          2D表示
        </ControlButton>
        <ControlButton
          isActive={viewMode === 'css3d'}
          onClick={() => onViewChange('css3d')}
          startIcon={<ThreeDRotationIcon />}
        >
          CSS3D
        </ControlButton>
      </Stack>
    </HeaderContainer>
  );
}