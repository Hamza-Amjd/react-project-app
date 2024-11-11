import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ProjectDetailModal: React.FC<{ project: any; open: boolean; onClose: () => void }> = ({ project, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Project Details</DialogTitle>
      <DialogContent>
        <p>Name: {project.name}</p>
        <p>Description: {project.description}</p>
        <p>Created At: {new Date(project.createdAt).toLocaleString()}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetailModal;
