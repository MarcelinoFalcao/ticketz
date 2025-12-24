import React from "react";
import { 
  Paper, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  LinearProgress,
  Chip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { 
  TrendingUp, 
  TrendingDown,
  Timeline,
  People,
  AccessTime,
  CheckCircle,
  Warning,
  Speed
} from "@material-ui/icons";
import { green, red, orange, blue, purple } from "@material-ui/core/colors";

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
  metricCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  metricIcon: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '50%',
    backgroundColor: theme.palette.grey[100],
  },
  metricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    lineHeight: 1.2,
  },
  metricSubValue: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  trendUp: {
    color: green[500],
  },
  trendDown: {
    color: red[500],
  },
  trendNeutral: {
    color: theme.palette.text.secondary,
  },
  progressBar: {
    marginTop: theme.spacing(1),
    height: 8,
    borderRadius: 4,
  },
  statusChip: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  alertCard: {
    border: `2px solid ${orange[500]}`,
  },
  excellentCard: {
    border: `2px solid ${green[500]}`,
  },
  warningCard: {
    border: `2px solid ${red[500]}`,
  },
}));

const PerformanceMetrics = ({ attendants = [], ticketsData = {} }) => {
  const classes = useStyles();

  // Calcular métricas
  const calculateMetrics = () => {
    if (attendants.length === 0) return {};

    const totalTickets = attendants.reduce((sum, a) => sum + (a.totalTickets || 0), 0);
    const totalClosed = attendants.reduce((sum, a) => sum + (a.closedTickets || 0), 0);
    const totalOpen = attendants.reduce((sum, a) => sum + (a.openTickets || 0), 0);
    const avgRating = attendants.reduce((sum, a) => sum + (a.averageRating && !isNaN(a.averageRating) ? a.averageRating : 0), 0) / attendants.length;
    const avgServiceTime = attendants.reduce((sum, a) => sum + (a.avgServiceTime && !isNaN(a.avgServiceTime) ? a.avgServiceTime : 0), 0) / attendants.length;
    const avgWaitTime = attendants.reduce((sum, a) => sum + (a.avgWaitTime && !isNaN(a.avgWaitTime) ? a.avgWaitTime : 0), 0) / attendants.length;
    
    const resolutionRate = totalTickets > 0 ? (totalClosed / totalTickets) * 100 : 0;
    const activeAttendants = attendants.filter(a => a.online).length;
    const totalAttendants = attendants.length;
    const teamAvailability = totalAttendants > 0 ? (activeAttendants / totalAttendants) * 100 : 0;

    // Tickets com resolução rápida (menos de 30 min)
    const quickResolutions = attendants.filter(a => a.avgServiceTime && !isNaN(a.avgServiceTime) && a.avgServiceTime <= 30).length;
    const quickResolutionRate = totalAttendants > 0 ? (quickResolutions / totalAttendants) * 100 : 0;

    // Técnicos com rating alto (>= 4.0)
    const highRatedTechs = attendants.filter(a => a.averageRating && !isNaN(a.averageRating) && a.averageRating >= 4.0).length;
    const highRatingRate = totalAttendants > 0 ? (highRatedTechs / totalAttendants) * 100 : 0;

    return {
      totalTickets,
      totalClosed,
      totalOpen,
      resolutionRate,
      avgRating,
      avgServiceTime,
      avgWaitTime,
      teamAvailability,
      activeAttendants,
      totalAttendants,
      quickResolutionRate,
      highRatingRate,
      quickResolutions,
      highRatedTechs
    };
  };

  const metrics = calculateMetrics();

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (value, good, warning) => {
    if (value >= good) return green[500];
    if (value >= warning) return orange[500];
    return red[500];
  };

  const getStatusChip = (value, good, warning, label) => {
    let color, text;
    if (value >= good) {
      color = green[500];
      text = "Excelente";
    } else if (value >= warning) {
      color = orange[500];
      text = "Atenção";
    } else {
      color = red[500];
      text = "Crítico";
    }

    return (
      <Chip 
        label={text} 
        size="small" 
        style={{ backgroundColor: color, color: 'white' }}
        className={classes.statusChip}
      />
    );
  };

  const getCardClass = (value, good, warning) => {
    if (value >= good) return classes.excellentCard;
    if (value >= warning) return classes.alertCard;
    return classes.warningCard;
  };

  const MetricCard = ({ 
    title, 
    value, 
    subValue, 
    icon: Icon, 
    color, 
    progress = null, 
    trend = null,
    statusValue = null,
    statusGood = null,
    statusWarning = null
  }) => (
    <Card className={`${classes.metricCard} ${statusValue !== null ? getCardClass(statusValue, statusGood, statusWarning) : ''}`}>
      <CardContent>
        {statusValue !== null && getStatusChip(statusValue, statusGood, statusWarning)}
        
        <Box className={classes.metricHeader}>
          <Box className={classes.metricIcon} style={{ backgroundColor: `${color}20` }}>
            <Icon style={{ color, fontSize: 24 }} />
          </Box>
          <Typography variant="subtitle2" color="textSecondary" style={{ flex: 1 }}>
            {title}
          </Typography>
        </Box>

        <Typography className={classes.metricValue} style={{ color }}>
          {value}
        </Typography>

        {subValue && (
          <Typography className={classes.metricSubValue}>
            {subValue}
          </Typography>
        )}

        {progress !== null && (
          <Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              className={classes.progressBar}
              style={{ backgroundColor: `${color}20` }}
            />
                         <Typography variant="caption" style={{ marginTop: 4 }}>
               {safeToFixed(progress)}%
             </Typography>
          </Box>
        )}

        {trend && (
          <Box display="flex" alignItems="center" marginTop={1}>
            {trend > 0 ? (
              <TrendingUp className={classes.trendUp} style={{ fontSize: 16 }} />
            ) : trend < 0 ? (
              <TrendingDown className={classes.trendDown} style={{ fontSize: 16 }} />
            ) : null}
            <Typography 
              variant="caption" 
              className={trend > 0 ? classes.trendUp : trend < 0 ? classes.trendDown : classes.trendNeutral}
              style={{ marginLeft: 4 }}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Paper className={classes.container}>
      <Typography variant="h6" className={classes.sectionTitle} color="primary">
        📊 Métricas de Performance da Equipe
      </Typography>

      <Grid container spacing={3}>
        {/* Taxa de Resolução */}
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Taxa de Resolução"
            value={`${safeToFixed(metrics.resolutionRate)}%`}
            subValue={`${metrics.totalClosed} de ${metrics.totalTickets} tickets`}
            icon={CheckCircle}
            color={green[500]}
            progress={metrics.resolutionRate}
            statusValue={metrics.resolutionRate}
            statusGood={85}
            statusWarning={70}
          />
        </Grid>

        {/* Rating Médio da Equipe */}
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Rating Médio da Equipe"
            value={`${safeToFixed(metrics.avgRating)} ⭐`}
            subValue={`${metrics.highRatedTechs} técnicos com rating alto`}
            icon={People}
            color={blue[500]}
            progress={metrics.highRatingRate}
            statusValue={metrics.avgRating}
            statusGood={4.0}
            statusWarning={3.5}
          />
        </Grid>

        {/* Disponibilidade da Equipe */}
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Equipe Online"
            value={`${metrics.activeAttendants}/${metrics.totalAttendants}`}
            subValue={`${safeToFixed(metrics.teamAvailability)}% disponível`}
            icon={Timeline}
            color={purple[500]}
            progress={metrics.teamAvailability}
            statusValue={metrics.teamAvailability}
            statusGood={80}
            statusWarning={60}
          />
        </Grid>

        {/* Tempo Médio de Atendimento */}
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Tempo Médio de Atendimento"
            value={formatTime(metrics.avgServiceTime)}
            subValue={`${metrics.quickResolutions} técnicos rápidos`}
            icon={Speed}
            color={orange[500]}
            progress={metrics.quickResolutionRate}
            statusValue={metrics.avgServiceTime}
            statusGood={30}
            statusWarning={60}
          />
        </Grid>

        {/* Tempo Médio de Espera */}
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Tempo Médio de Espera"
            value={formatTime(metrics.avgWaitTime)}
            subValue="Tempo antes do primeiro atendimento"
            icon={AccessTime}
            color={red[500]}
            statusValue={metrics.avgWaitTime}
            statusGood={15}
            statusWarning={30}
          />
        </Grid>

        {/* Tickets em Aberto */}
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Tickets em Atendimento"
            value={metrics.totalOpen}
            subValue="Atendimentos ativos"
            icon={Warning}
            color={orange[600]}
          />
        </Grid>
      </Grid>

      {/* Alertas e Insights */}
      <Box marginTop={3}>
        <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold' }}>
          💡 Insights e Recomendações
        </Typography>
        
        <Grid container spacing={2}>
          {metrics.resolutionRate < 70 && (
            <Grid item xs={12}>
              <Card style={{ backgroundColor: red[50], border: `1px solid ${red[200]}` }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Warning style={{ color: red[500], marginRight: 8 }} />
                    <Typography color="error">
                                             <strong>Taxa de Resolução Baixa:</strong> Apenas {safeToFixed(metrics.resolutionRate)}% dos tickets são resolvidos. 
                      Considere revisar processos e treinamentos.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {metrics.avgRating < 3.5 && (
            <Grid item xs={12}>
              <Card style={{ backgroundColor: orange[50], border: `1px solid ${orange[200]}` }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Warning style={{ color: orange[500], marginRight: 8 }} />
                    <Typography style={{ color: orange[700] }}>
                                             <strong>Rating da Equipe Baixo:</strong> Rating médio de {safeToFixed(metrics.avgRating)} estrelas. 
                      Foque em qualidade do atendimento e treinamento.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {metrics.teamAvailability < 60 && (
            <Grid item xs={12}>
              <Card style={{ backgroundColor: red[50], border: `1px solid ${red[200]}` }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Warning style={{ color: red[500], marginRight: 8 }} />
                    <Typography color="error">
                      <strong>Baixa Disponibilidade:</strong> Apenas {safeToFixed(metrics.teamAvailability)}% da equipe está online. 
                      Verifique escalas e necessidade de contratação.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {metrics.resolutionRate >= 85 && metrics.avgRating >= 4.0 && (
            <Grid item xs={12}>
              <Card style={{ backgroundColor: green[50], border: `1px solid ${green[200]}` }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <CheckCircle style={{ color: green[500], marginRight: 8 }} />
                    <Typography style={{ color: green[700] }}>
                      <strong>Excelente Performance!</strong> Sua equipe está mantendo alta qualidade e eficiência. 
                      Continue assim! 🎉
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default PerformanceMetrics; 