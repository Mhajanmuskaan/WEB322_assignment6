const express = require("express");
const projectService = require("./modules/projects"); // updated import name
const path = require("path");

const app = express();
const HTTP_PORT = process.env.PORT || 3000;

const studentName = "Muskaan Mahajan";
const studentId = "165874231";

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Home Route
app.get("/", (req, res) => {
    res.render("home");
});

// ✅ About Route
app.get("/about", (req, res) => {
    res.render("about");
});

// ✅ Projects Route (With Optional Sector Filter)
app.get("/solutions/projects", (req, res) => {
    const sector = req.query.sector;

    if (sector) {
        projectService.getProjectsBySector(sector)
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
        projectService.getAllProjects()
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

// ✅ Dynamic Project Details by ID
app.get("/solutions/projects/:id", (req, res) => {
    const projectId = req.params.id;

    projectService.getProjectsById(projectId)
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

// ✅ POST Request Test Route
app.post("/post-request", (req, res) => {
    res.json({
        studentName,
        studentId,
        timestamp: new Date().toISOString(),
        requestBody: req.body,
    });
});

// ✅ GET route for Add Project form
app.get("/solutions/addProject", (req, res) => {
  projectService.getAllSectors()
    .then(sectors => {
      res.render("addProject", { sectors });
    })
    .catch(err => {
      res.render("500", { message: `Unable to load form: ${err}` });
    });
});

// ✅ POST route to handle form submission
app.post("/solutions/addProject", (req, res) => {
  projectService.addProject(req.body)
    .then(() => {
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});


// ✅ GET: Load edit project form
app.get("/solutions/editProject/:id", (req, res) => {
  const id = req.params.id;
  let sectorsData;

  projectService.getAllSectors()
    .then(sectors => {
      sectorsData = sectors;
      return projectService.getProjectsById(id);
    })
    .then(project => {
      res.render("editProject", { project, sectors: sectorsData });
    })
    .catch(err => {
      res.status(404).render("404", { message: err.message });
    });
});

// ✅ POST: Handle project update form
app.post("/solutions/editProject", (req, res) => {
  const id = req.body.id;

  projectService.editProject(id, req.body)
    .then(() => {
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});


// ✅ DELETE route to remove a project
app.get("/solutions/deleteProject/:id", (req, res) => {
  const id = req.params.id;

  projectService.deleteProject(id)
    .then(() => {
      res.redirect("/solutions/projects");
    })
    .catch(err => {
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
    });
});

// ✅ 404 Error Page
app.use((req, res) => {
    res.status(404).render("404", {
        message: "Page Not Found",
        studentName,
        studentId,
        timestamp: new Date().toISOString()
    });
});


// // ✅ 404 Error Page
// app.use((req, res) => {
//     res.status(404).render("404", {
//         message: "Page Not Found",
//         studentName,
//         studentId,
//         timestamp: new Date().toISOString()
//     });
// });

// ✅ Start Server After DB Initialization
projectService.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server is running on http://localhost:${HTTP_PORT}`);
    });
}).catch((err) => {
    console.error("Failed to initialize project module:", err);
});
