import React from "react";
import { 
  Paper, 
  Typography, 
  Grid, 
  Box,
  LinearProgress,
  Avatar,
  Chip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Person,
  TrendingUp,
  Warning,
  Assignment,
  Schedule
} from "@material-ui/icons";
import { green, red, orange, blue, grey } from "@material-ui/core/colors";

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
  technicianCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    transition: 'box-shadow 0.2s',
    '&:hover': {
      boxShadow: theme.shadows[2],
    },
  },
  technicianHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: theme.spacing(2),
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  onlineAvatar: {
    backgroundColor: green[500],
  },
  offlineAvatar: {
    backgroundColor: grey[500],
  },
  workloadInfo: {
    flex: 1,
  },
  workloadBar: {
    height: 12,
    borderRadius: 6,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  statusChip: {
    fontSize: '0.75rem',
  },
  metricRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  metricLabel: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  metricValue: {
    fontWeight: 'bold',
    fontSize: '0.875rem',
  },
  overloaded: {
    border: `2px solid ${red[500]}`,
    backgroundColor: red[50],
  },
  balanced: {
    border: `2px solid ${green[500]}`,
    backgroundColor: green[50],
  },
  underutilized: {
    border: `2px solid ${orange[500]}`,
    backgroundColor: orange[50],
  },
  summaryCard: {
    padding: theme.spacing(2),
    textAlign: 'center',
    border: `1px solid ${theme.palette.divider}`,
  },
  summaryValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
}));

const WorkloadDistribution = ({ attendants = [] }) => {
  const classes = useStyles();

  // Calcular estatísticas de distribuição
  const calculateDistribution = () => {
    if (attendants.length === 0) return { attendants: [], stats: {} };

    const totalTickets = attendants.reduce((sum, a) => sum + a.totalTickets, 0);
    const avgTicketsPerTechnician = totalTickets / attendants.length;
    
    const enrichedAttendants = attendants.map(attendant => {
      const workloadPercentage = totalTickets > 0 ? (attendant.totalTickets / totalTickets) * 100 : 0;
      const efficiencyRate = attendant.totalTickets > 0 ? (attendant.closedTickets / attendant.totalTickets) * 100 : 0;
      const isOverloaded = attendant.totalTickets > avgTicketsPerTechnician * 1.5;
      const isUnderutilized = attendant.totalTickets < avgTicketsPerTechnician * 0.5 && attendant.online;
      
      let status = 'balanced';
      if (isOverloaded) status = 'overloaded';
      else if (isUnderutilized) status = 'underutilized';

      return {
        ...attendant,
        workloadPercentage,
        efficiencyRate,
        status,
        isOverloaded,
        isUnderutilized
      };
    });

    // Ordenar por carga de trabalho (maior para menor)
    enrichedAttendants.sort((a, b) => b.totalTickets - a.totalTickets);

    const stats = {
      totalTechnicians: attendants.length,
      onlineTechnicians: attendants.filter(a => a.online).length,
      overloadedCount: enrichedAttendants.filter(a => a.isOverloaded).length,
      underutilizedCount: enrichedAttendants.filter(a => a.isUnderutilized).length,
      avgTicketsPerTechnician: avgTicketsPerTechnician,
      totalTickets
    };

    return { attendants: enrichedAttendants, stats };
  };

  const { attendants: distributedAttendants, stats } = calculateDistribution();

  const getStatusColor = (status) => {
    switch (status) {
      case 'overloaded': return red[500];
      case 'underutilized': return orange[500];
      default: return green[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'overloaded': return 'Sobrecarregado';
      case 'underutilized': return 'Subutilizado';
      default: return 'Balanceado';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'overloaded': return <Warning />;
      case 'underutilized': return <TrendingUp />;
      default: return <Assignment />;
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const TechnicianCard = ({ attendant }) => (
    <Box className={`${classes.technicianCard} ${classes[attendant.status]}`}>
      <Box className={classes.technicianHeader}>
        <Avatar 
          className={`${classes.avatar} ${attendant.online ? classes.onlineAvatar : classes.offlineAvatar}`}
        >
          {attendant.name?.charAt(0) || '?'}
        </Avatar>
        <Box className={classes.workloadInfo}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {attendant.name}
            </Typography>
            <Chip 
              label={getStatusText(attendant.status)}
              size="small"
              style={{ 
                backgroundColor: getStatusColor(attendant.status), 
                color: 'white' 
              }}
              icon={getStatusIcon(attendant.status)}
              className={classes.statusChip}
            />
          </Box>
          <Box display="flex" alignItems="center" marginTop={1}>
            <Typography variant="body2" color="textSecondary">
              {attendant.online ? '🟢 Online' : '🔴 Offline'}
            </Typography>
            <Typography variant="body2" style={{ marginLeft: 16 }}>
              {safeToFixed(attendant.workloadPercentage)}% da carga total
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Barra de Carga de Trabalho */}
      <Box marginBottom={2}>
        <Typography variant="subtitle2" gutterBottom>
          Distribuição de Tickets
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(attendant.workloadPercentage * 2, 100)} // Escala visual
          className={classes.workloadBar}
          style={{ 
            backgroundColor: `${getStatusColor(attendant.status)}20`,
          }}
        />
        <Typography variant="caption" color="textSecondary">
          {attendant.totalTickets} tickets de {stats.totalTickets} total
        </Typography>
      </Box>

      {/* Métricas Detalhadas */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box className={classes.metricRow}>
            <Typography className={classes.metricLabel}>Abertos:</Typography>
            <Typography className={classes.metricValue} style={{ color: orange[600] }}>
              {attendant.openTickets}
            </Typography>
          </Box>
          <Box className={classes.metricRow}>
            <Typography className={classes.metricLabel}>Fechados:</Typography>
            <Typography className={classes.metricValue} style={{ color: green[600] }}>
              {attendant.closedTickets}
            </Typography>
          </Box>
          <Box className={classes.metricRow}>
            <Typography className={classes.metricLabel}>Taxa Resolução:</Typography>
            <Typography className={classes.metricValue} style={{ color: blue[600] }}>
              {safeToFixed(attendant.efficiencyRate)}%
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className={classes.metricRow}>
            <Typography className={classes.metricLabel}>Rating:</Typography>
            <Typography className={classes.metricValue}>
              {attendant.averageRating ? `${safeToFixed(attendant.averageRating)} ⭐` : 'N/A'}
            </Typography>
          </Box>
          <Box className={classes.metricRow}>
            <Typography className={classes.metricLabel}>Tmp. Atendimento:</Typography>
            <Typography className={classes.metricValue}>
              {attendant.avgServiceTime ? formatTime(attendant.avgServiceTime) : 'N/A'}
            </Typography>
          </Box>
          <Box className={classes.metricRow}>
            <Typography className={classes.metricLabel}>Tmp. Espera:</Typography>
            <Typography className={classes.metricValue}>
              {attendant.avgWaitTime ? formatTime(attendant.avgWaitTime) : 'N/A'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Paper className={classes.container}>
      <Typography variant="h6" className={classes.sectionTitle} color="primary">
        📊 Distribuição de Carga de Trabalho
      </Typography>

      {/* Resumo Geral */}
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={3}>
          <Box className={classes.summaryCard}>
            <Typography className={classes.summaryValue} style={{ color: blue[500] }}>
              {stats.totalTechnicians}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Total de Técnicos
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className={classes.summaryCard}>
            <Typography className={classes.summaryValue} style={{ color: green[500] }}>
              {stats.onlineTechnicians}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Online Agora
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className={classes.summaryCard}>
            <Typography className={classes.summaryValue} style={{ color: red[500] }}>
              {stats.overloadedCount}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Sobrecarregados
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className={classes.summaryCard}>
            <Typography className={classes.summaryValue} style={{ color: orange[500] }}>
              {stats.underutilizedCount}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Subutilizados
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Lista de Técnicos */}
      <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold' }}>
        📋 Detalhamento por Técnico
      </Typography>

      <Grid container spacing={2}>
        {distributedAttendants.map((attendant, index) => (
          <Grid item xs={12} md={6} key={attendant.id}>
            <TechnicianCard attendant={attendant} />
          </Grid>
        ))}
      </Grid>

      {/* Recomendações */}
      {(stats.overloadedCount > 0 || stats.underutilizedCount > 0) && (
        <Box marginTop={3}>
          <Typography variant="subtitle1" style={{ marginBottom: 16, fontWeight: 'bold' }}>
            💡 Recomendações de Balanceamento
          </Typography>
          
          <Grid container spacing={2}>
            {stats.overloadedCount > 0 && (
              <Grid item xs={12}>
                <Box 
                  padding={2} 
                  style={{ 
                    backgroundColor: red[50], 
                    border: `1px solid ${red[200]}`,
                    borderRadius: 8
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Warning style={{ color: red[500], marginRight: 8 }} />
                    <Typography style={{ color: red[700] }}>
                      <strong>Atenção:</strong> {stats.overloadedCount} técnico(s) sobrecarregado(s). 
                      Considere redistribuir tickets ou adicionar mais recursos.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
            
            {stats.underutilizedCount > 0 && (
              <Grid item xs={12}>
                <Box 
                  padding={2} 
                  style={{ 
                    backgroundColor: orange[50], 
                    border: `1px solid ${orange[200]}`,
                    borderRadius: 8
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <TrendingUp style={{ color: orange[500], marginRight: 8 }} />
                    <Typography style={{ color: orange[700] }}>
                      <strong>Oportunidade:</strong> {stats.underutilizedCount} técnico(s) com baixa utilização. 
                      Podem receber mais tickets para otimizar a distribuição.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default WorkloadDistribution; 