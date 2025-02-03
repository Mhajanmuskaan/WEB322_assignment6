const express = require("express");
const projectData = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 3000;

const studentName = "Muskaan Mahajan";
const studentId = "165874231";

projectData.initialize().then(() => {
    console.log("Projects data initialized");

    app.get("/", (req, res) => {
        res.send(`Assignment 2: ${studentName} - ${studentId}`);
    });

    app.get("/solutions/projects", (req, res) => {
        projectData.getAllProjects()
            .then((projects) => {
                res.json({ studentName, studentId, timestamp: new Date(), projects });
            })
            .catch((error) => {
                res.status(404).send(error);
            });
    });

    app.get("/solutions/projects/id-demo", (req, res) => {
        projectData.getProjectById(18)
            .then((project) => {
                res.json({ studentName, studentId, timestamp: new Date(), project });
            })
            .catch((error) => {
                res.status(404).send(error);
            });
    });

    app.get("/solutions/projects/sector-demo", (req, res) => {
        projectData.getProjectsBySector("agriculture")
            .then((projects) => {
                res.json({ studentName, studentId, timestamp: new Date(), projects });
            })
            .catch((error) => {
                res.status(404).send(error);
            });
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch((error) => {
    console.error("Error initializing projects:", error);
});
