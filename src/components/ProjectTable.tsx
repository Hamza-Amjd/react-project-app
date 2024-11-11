import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import ProjectDetailModal from "./ProjectDetailModal";
import { Delete, Info } from "@mui/icons-material";
import CreateProjectForm from "./CreateProjectForm";

const ProjectTable: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectData = querySnapshot.docs.map((doc) => doc.data());
    console.log(projectData);
    setProjects(projectData);
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
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={index}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenModal(project)}>
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedProject && (
          <ProjectDetailModal
            open={openModal}
            project={selectedProject}
            onClose={() => setOpenModal(false)}
          />
        )}
      </TableContainer>
      <CreateProjectForm fetchProjects={fetchProjects} />
    </>
  );
};

export default ProjectTable;
