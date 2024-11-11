import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import {
  IconButton,
  Box,
  Typography,
  Card,
  CardActions,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";
import ProjectDetailModal from "./ProjectDetailModal";
import { Delete, Info } from "@mui/icons-material";
import CreateProjectForm from "./CreateProjectForm";

const ProjectTable: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectData = querySnapshot.docs.map((doc) => doc.data());
      console.log(projectData);
      setProjects(projectData);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project: any) => {
    setSelectedProject(project);
    setOpenModal(true);
  };
  const handleDelete = async (project: any) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const docToDelete = querySnapshot.docs.find(
        (doc) =>
          doc.data().name === project.name &&
          doc.data().createdAt === project.createdAt
      );

      if (docToDelete) {
        await deleteDoc(doc(db, "projects", docToDelete.id));
        setProjects(projects.filter((p) => p.createdAt !== project.createdAt));
      }
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };
  const handleProjectComplete = async (project:any) => {
    // Update the local state
    const updatedProjects = projects.map(p => 
      p.createdAt === project.createdAt 
        ? {...p, completed: !p.completed}
        : p
    );
    setProjects(updatedProjects);
    
    // Find and update the document in Firestore
    const querySnapshot = await getDocs(collection(db, "projects"));
    const docToUpdate = querySnapshot.docs.find(
      (doc) =>
        doc.data().name === project.name &&
        doc.data().createdAt === project.createdAt
    );
    if (docToUpdate) {
      await updateDoc(doc(db, "projects", docToUpdate.id), {
        completed: !project.completed
      });
    }
  }
  return (
    <>
       <Box padding={8}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="text.secondary">
            No projects found. Create one to get started!
          </Typography>
        </Box>
      ) : (projects.map((project, index) => (
            <Card 
              key={index}
              sx={{
                marginBottom: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                padding={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Checkbox 
                    checked={project.completed} 
                    onChange={() => handleProjectComplete(project)}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                  />
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{ 
                        textDecoration: project.completed ? 'line-through' : 'none',
                        color: project.completed ? 'text.secondary' : 'text.primary'
                      }}
                    >
                      {project.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        textDecoration: project.completed ? 'line-through' : 'none',
                        mt: 0.5
                      }}
                    >
                      {project.description}
                    </Typography>
                  </Box>
                </Box>
                
                <CardActions sx={{ gap: 1 }}>
                  <IconButton 
                    onClick={() => handleOpenModal(project)}
                    size="small"
                    color="primary"
                  >
                    <Info />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(project)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Box>
            </Card> 
      )))}
      <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => setIsCreateModalOpen(true)}>New Project</Button>
        </Box>
      </Box>
      {selectedProject && (
        <ProjectDetailModal
          open={openModal}
          project={selectedProject}
          onClose={() => setOpenModal(false)}
        />
      )}
      <CreateProjectForm 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        fetchProjects={fetchProjects}
      />
    </>
  );
};

export default ProjectTable;
