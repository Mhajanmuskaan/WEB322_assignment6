const express = require("express");
const projectData = require("./modules/projects"); // Adjust if your project data module path is different.
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // Serve static files from the "public" folder
app.use(express.json()); // Middleware to parse JSON request bodies

const studentName = "Muskaan Mahajan";
const studentId = "165874231";

// Home route: Serves home.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// About route: Serves about.html
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Solutions/projects route with sector query parameter support
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  if (sector) {
    projectData.getProjectsBySector(sector)
      .then((projects) => {
        res.json({ studentName, studentId, timestamp: new Date(), sector, projects });
      })
      .catch((error) => {
        res.status(404).json({ studentName, studentId, timestamp: new Date(), error: error.message });
      });
  } else {
    projectData.getAllProjects()
      .then((projects) => {
        res.json({ studentName, studentId, timestamp: new Date(), projects });
      })
      .catch((error) => {
        res.status(404).json({ studentName, studentId, timestamp: new Date(), error: error.message });
      });
  }
});

// Dynamic project route based on project ID
app.get("/solutions/projects/:id", (req, res) => {
  const projectId = req.params.id;
  projectData.getProjectById(projectId)
    .then((project) => {
      res.json({ studentName, studentId, timestamp: new Date(), project });
    })
    .catch((error) => {
      res.status(404).json({ studentName, studentId, timestamp: new Date(), error: error.message });
    });
});

// POST route at /post-request
app.post("/post-request", (req, res) => {
  res.json({
    studentName,
    studentId,
    timestamp: new Date(),
    requestBody: req.body,
  });
});

// Custom 404 Error Page
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
