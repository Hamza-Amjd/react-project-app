import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export interface ProjectFormData {
  name: string;
  description: string;
  deadline: string;
  status: string;
  priority: string;
  teamSize: number;
}

type projectProps = {
    fetchProjects: any;
    open: boolean;
    onClose: () => void;
};

const CreateProjectForm: React.FC<projectProps> = ({ fetchProjects, open, onClose }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    deadline: "",
    status: "planning",
    priority: "medium",
    teamSize: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        alert("Project name is required!");
        return;
      }

      await addDoc(collection(db, "projects"), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).then(() => {
        fetchProjects();
        setFormData({
          name: "",
          description: "",
          deadline: "",
          status: "planning",
          priority: "medium",
          teamSize: 1
        });
        onClose();
      });
      
    } catch (error) {
      console.error("Error adding project: ", error);
      alert("Failed to create project. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle align="center">Create New Project</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <TextField
            name="name"
            label="Project Name"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          
          <TextField
            name="description"
            label="Project Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
          
          <TextField
            name="deadline"
            label="Project Deadline"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.deadline}
            onChange={handleChange}
          />
          
          <TextField
            name="status"
            label="Project Status"
            select
            fullWidth
            value={formData.status}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </TextField>
          
          <TextField
            name="priority"
            label="Priority"
            select
            fullWidth
            value={formData.priority}
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </TextField>
          
          <TextField
            name="teamSize"
            label="Team Size"
            type="number"
            fullWidth
            InputProps={{ inputProps: { min: 1 } }}
            value={formData.teamSize}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectForm;
