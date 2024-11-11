import React from "react";
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Button,
  Typography,
  Box,
  styled
} from "@mui/material";
import { ProjectFormData } from "./CreateProjectForm";


interface ProjectDetailModalProps {
  project: ProjectFormData;
  open: boolean;
  onClose: () => void;
}

const DetailRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .label': {
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.5),
  },
  '& .content': {
    color: theme.palette.text.primary,
  }
}));

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, 
  open, 
  onClose 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'planning': '#3498db',
      'in-progress': '#f1c40f',
      'on-hold': '#e74c3c',
      'completed': '#2ecc71'
    };
    return colors[status as keyof typeof colors] || '#777';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': '#2ecc71',
      'medium': '#f1c40f',
      'high': '#e74c3c'
    };
    return colors[priority as keyof typeof colors] || '#777';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {project.name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, my: 2 }}>
          <DetailRow>
            <Typography className="label">Description</Typography>
            <Typography className="content">{project.description || 'No description provided'}</Typography>
          </DetailRow>

          <DetailRow>
            <Typography className="label">Deadline</Typography>
            <Typography className="content">
              {project.deadline ? formatDate(project.deadline) : 'No deadline set'}
            </Typography>
          </DetailRow>

          <DetailRow>
            <Typography className="label">Status</Typography>
            <Typography 
              className="content" 
              sx={{ 
                display: 'inline-block',
                bgcolor: `${getStatusColor(project.status)}20`,
                color: getStatusColor(project.status),
                padding: '4px 12px',
                borderRadius: '16px',
                fontWeight: 'medium'
              }}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Typography>
          </DetailRow>

          <DetailRow>
            <Typography className="label">Priority</Typography>
            <Typography 
              className="content"
              sx={{ 
                display: 'inline-block',
                bgcolor: `${getPriorityColor(project.priority)}20`,
                color: getPriorityColor(project.priority),
                padding: '4px 12px',
                borderRadius: '16px',
                fontWeight: 'medium'
              }}
            >
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
            </Typography>
          </DetailRow>

          <DetailRow>
            <Typography className="label">Team Size</Typography>
            <Typography className="content">
              {project.teamSize} {project.teamSize === 1 ? 'member' : 'members'}
            </Typography>
          </DetailRow>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetailModal;
