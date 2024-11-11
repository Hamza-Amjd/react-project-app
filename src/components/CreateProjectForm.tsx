import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { TextField, Button, Box, Typography } from "@mui/material";
type projectProps={
    fetchProjects: any;
}
const CreateProjectForm: React.FC<projectProps> = ({fetchProjects}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "projects"), {
        name,
        description,
        createdAt: new Date().toISOString(),
      }).then(() =>fetchProjects());
      alert("Project added successfully!");
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding:8 }} >
      <Typography variant="h4" align="center" gutterBottom>
        Create New Project
      </Typography>
      <TextField
        label="Project Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Project Description"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button variant="outlined" onClick={handleSubmit}>Create Project</Button>
    </Box>
  );
};

export default CreateProjectForm;
