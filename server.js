const express = require("express");
const projectData = require("./modules/projects"); // Ensure this path is correct
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files properly
app.use(express.json()); // Middleware to parse JSON request bodies

const studentName = "Muskaan Mahajan";
const studentId = "165874231";

// Home Route - Renders home.ejs
app.get("/", (req, res) => {
    res.render("home");
});

// About Route - Renders about.ejs
app.get("/about", (req, res) => {
    res.render("about");
});

// ✅ Solutions/projects Route with Optional Sector Filtering
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector; // Get sector from query parameter

  if (sector) {
    projectData.getProjectsBySector(sector)
      .then((projects) => {
        if (projects.length === 0) {
          return res.status(404).render("404", { 
            message: `No projects found for the sector: ${sector}`,
            studentName,
            studentId,
            timestamp: new Date().toISOString()
          });
        }
        res.render("projects", { projects, studentName, studentId });
      })
      .catch((error) => {
        res.status(404).render("404", { 
          message: error.message, 
          studentName, 
          studentId, 
          timestamp: new Date().toISOString()
        });
      });
  } else {
    projectData.getAllProjects()
      .then((projects) => {
        res.render("projects", { projects, studentName, studentId });
      })
      .catch((error) => {
        res.status(404).render("404", { 
          message: error.message, 
          studentName, 
          studentId, 
          timestamp: new Date().toISOString()
        });
      });
  }
});







// ✅ Dynamic Project ID Route
app.get("/solutions/projects/:id", (req, res) => {
  const projectId = req.params.id;

  projectData.getProjectsById(projectId) // ✅ Make sure the function name is correct
    .then((project) => {
      if (!project) {
        return res.status(404).render("404", { 
          message: `Project with ID ${projectId} not found`, 
          studentName, 
          studentId, 
          timestamp: new Date().toISOString()
        });
      }
      res.render("project", { project, studentName, studentId });
    })
    .catch((error) => {
      res.status(404).render("404", { 
        message: error.message, 
        studentName, 
        studentId, 
        timestamp: new Date().toISOString()
      });
    });
});


// ✅ POST Request Route
app.post("/post-request", (req, res) => {
  res.json({
    studentName,
    studentId,
    timestamp: new Date().toISOString(),
    requestBody: req.body,
  });
});

// ✅ Custom 404 Error Page
app.use((req, res) => {
    res.status(404).render("404", { 
      message: "Page Not Found", 
      studentName, 
      studentId, 
      timestamp: new Date().toISOString()
    });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
