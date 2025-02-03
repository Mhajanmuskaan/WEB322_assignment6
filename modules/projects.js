/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: _muskaan mahajan  Student ID: 165874231  Date: 01-02-2025
*
********************************************************************************/







const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = projectData.map(project => {
                const sector = sectorData.find(sector => sector.id === project.sector_id);
                return {
                    ...project,
                    sector: sector ? sector.sector_name : "Unknown"
                };
            });
            resolve();
        } catch (error) {
            reject("Initialization failed: " + error);
        }
    });
}

function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length > 0) {
            resolve(projects);
        } else {
            reject("No projects available.");
        }
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const project = projects.find(project => project.id === projectId);
        if (project) {
            resolve(project);
        } else {
            reject(`Project with ID ${projectId} not found.`);
        }
    });
}

function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const filteredProjects = projects.filter(project => project.sector.toLowerCase().includes(sector.toLowerCase()));
        if (filteredProjects.length > 0) {
            resolve(filteredProjects);
        } else {
            reject(`No projects found for sector: ${sector}`);
        }
    });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };

// Testing the functions
initialize()
    .then(() => {
        console.log("Initialization complete.");
        return getAllProjects();
    })
    .then(projects => {
        console.log("All Projects:", projects);
        return getProjectById(9);
    })
    .then(project => {
        console.log("Project with ID 9:", project);
        return getProjectsBySector("agriculture");
    })
    .then(projects => {
        console.log("Projects in Agriculture Sector:", projects);
    })
    .catch(error => {
        console.error("Error:", error);
    });
