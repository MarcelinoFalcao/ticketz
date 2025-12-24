import React from "react";
import { 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Box,
  Chip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { 
  TrendingUp, 
  Star, 
  Speed, 
  Assignment,
  AccessTime
} from "@material-ui/icons";
import { green, blue, orange, purple, red } from "@material-ui/core/colors";

// Utility function to safely format numbers
const safeToFixed = (value, decimals = 1) => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) ? num.toFixed(decimals) : '0.0';
};

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  performerCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2),
    fontWeight: 'bold',
  },
  rankBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
  },
  metricLabel: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  topRating: {
    backgroundColor: green[500],
  },
  topVolume: {
    backgroundColor: blue[500],
  },
  topSpeed: {
    backgroundColor: orange[500],
  },
  topEfficiency: {
    backgroundColor: purple[500],
  },
  needsAttention: {
    backgroundColor: red[500],
  },
}));

const TopPerformers = ({ attendants = [] }) => {
  const classes = useStyles();

  // Calcular rankings
  const getTopByRating = () => {
    return [...attendants]
      .filter(a => a.averageRating && !isNaN(a.averageRating) && a.averageRating > 0)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 3);
  };

  const getTopByVolume = () => {
    return [...attendants]
      .sort((a, b) => b.closedTickets - a.closedTickets)
      .slice(0, 3);
  };

  const getTopBySpeed = () => {
    return [...attendants]
      .filter(a => a.avgServiceTime && !isNaN(a.avgServiceTime) && a.avgServiceTime > 0)
      .sort((a, b) => (a.avgServiceTime || 0) - (b.avgServiceTime || 0))
      .slice(0, 3);
  };

  const getTopByEfficiency = () => {
    return [...attendants]
      .map(a => ({
        ...a,
        efficiency: a.totalTickets > 0 ? (a.closedTickets / a.totalTickets) * 100 : 0
      }))
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 3);
  };

  const getNeedsAttention = () => {
    return [...attendants]
      .filter(a => (a.averageRating && !isNaN(a.averageRating) && a.averageRating < 3) || 
                   (a.avgServiceTime && !isNaN(a.avgServiceTime) && a.avgServiceTime > 120))
      .slice(0, 3);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const PerformerCard = ({ performer, rank, type, value, label, icon: Icon, color }) => (
    <Card className={classes.performerCard}>
      <CardContent>
        <Box className={classes.cardHeader}>
          <Box position="relative">
            <Avatar 
              className={`${classes.avatar} ${classes[color]}`}
              style={{ backgroundColor: type === 'needsAttention' ? red[500] : undefined }}
            >
              {performer.name?.charAt(0) || '?'}
            </Avatar>
            <Chip 
              label={`#${rank}`} 
              size="small" 
              className={classes.rankBadge}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="h6" noWrap>
              {performer.name}
            </Typography>
            <Box display="flex" alignItems="center">
              <Icon style={{ fontSize: 16, marginRight: 4 }} />
              <Typography className={classes.metricLabel}>
                {label}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography className={classes.metricValue} color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Paper className={classes.container}>
      <Typography variant="h6" className={classes.sectionTitle} color="primary">
        🏆 Top Performers & Análise de Equipe
      </Typography>

      {/* Top por Rating */}
      <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold' }}>
        ⭐ Melhores Avaliados
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        {getTopByRating().map((performer, index) => (
          <Grid item xs={12} md={4} key={`rating-${performer.id}`}>
            <PerformerCard
              performer={performer}
              rank={index + 1}
              type="rating"
              value={`${safeToFixed(performer.averageRating)} ⭐`}
              label="Avaliação Média"
              icon={Star}
              color="topRating"
            />
          </Grid>
        ))}
      </Grid>

      {/* Top por Volume */}
      <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold' }}>
        📈 Maior Volume de Atendimentos
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        {getTopByVolume().map((performer, index) => (
          <Grid item xs={12} md={4} key={`volume-${performer.id}`}>
            <PerformerCard
              performer={performer}
              rank={index + 1}
              type="volume"
              value={`${performer.closedTickets} tickets`}
              label="Tickets Resolvidos"
              icon={Assignment}
              color="topVolume"
            />
          </Grid>
        ))}
      </Grid>

      {/* Top por Velocidade */}
      <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold' }}>
        ⚡ Mais Rápidos
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        {getTopBySpeed().map((performer, index) => (
          <Grid item xs={12} md={4} key={`speed-${performer.id}`}>
            <PerformerCard
              performer={performer}
              rank={index + 1}
              type="speed"
              value={formatTime(performer.avgServiceTime)}
              label="Tempo Médio de Atendimento"
              icon={Speed}
              color="topSpeed"
            />
          </Grid>
        ))}
      </Grid>

      {/* Top por Eficiência */}
      <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold' }}>
        🎯 Maior Taxa de Resolução
      </Typography>
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        {getTopByEfficiency().map((performer, index) => (
          <Grid item xs={12} md={4} key={`efficiency-${performer.id}`}>
            <PerformerCard
              performer={performer}
              rank={index + 1}
              type="efficiency"
              value={`${safeToFixed(performer.efficiency)}%`}
              label="Taxa de Resolução"
              icon={TrendingUp}
              color="topEfficiency"
            />
          </Grid>
        ))}
      </Grid>

      {/* Precisam de Atenção */}
      {getNeedsAttention().length > 0 && (
        <>
          <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold', color: red[500] }}>
            ⚠️ Precisam de Atenção
          </Typography>
          <Grid container spacing={2}>
            {getNeedsAttention().map((performer, index) => (
              <Grid item xs={12} md={4} key={`attention-${performer.id}`}>
                <PerformerCard
                  performer={performer}
                  rank={index + 1}
                  type="needsAttention"
                  value={performer.averageRating && !isNaN(performer.averageRating) && performer.averageRating < 3 ? 
                    `${safeToFixed(performer.averageRating)} ⭐` : 
                    formatTime(performer.avgServiceTime || 0)}
                  label={performer.averageRating && !isNaN(performer.averageRating) && performer.averageRating < 3 ? "Avaliação Baixa" : "Tempo Alto"}
                  icon={performer.averageRating && !isNaN(performer.averageRating) && performer.averageRating < 3 ? Star : AccessTime}
                  color="needsAttention"
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default TopPerformers; 