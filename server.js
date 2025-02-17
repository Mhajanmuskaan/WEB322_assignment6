/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Muskaan Mahajan
* Student ID: 165874231
* Date: ___________
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects"); // Ensure this path is correct
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files properly
app.use(express.json()); // Middleware to parse JSON request bodies

const studentName = "Muskaan Mahajan";
const studentId = "165874231";

// Home Route - Serves home.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// About Route - Serves about.html
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Solutions/projects Route with Optional Sector Filtering
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  if (sector) {
    projectData.getProjectsBySector(sector)
      .then((projects) => {
        res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          sector,
          projects,
        });
      })
      .catch((error) => {
        res.status(404).json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          error: error.message,
        });
      });
  } else {
    projectData.getAllProjects()
      .then((projects) => {
        res.json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          projects,
        });
      })
      .catch((error) => {
        res.status(404).json({
          studentName,
          studentId,
          timestamp: new Date().toISOString(),
          error: error.message,
        });
      });
  }
});

// Dynamic Project ID Route
app.get("/solutions/projects/:id", (req, res) => {
  const projectId = req.params.id;
  projectData.getProjectById(projectId)
    .then((project) => {
      res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        project,
      });
    })
    .catch((error) => {
      res.status(404).json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    });
});

// POST Request Route
app.post("/post-request", (req, res) => {
  res.json({
    studentName,
    studentId,
    timestamp: new Date().toISOString(),
    requestBody: req.body,
  });
});

// Custom 404 Error Page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
