/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Muskaan Mahajan  Student ID: 165874231  Date: 01-02-2025
*
********************************************************************************/

require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

// Define Sector model
const Sector = sequelize.define('Sector', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sector_name: Sequelize.STRING
}, {
    timestamps: false
});

// Define Project model
const Project = sequelize.define('Project', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: Sequelize.STRING,
    feature_img_url: Sequelize.STRING,
    summary_short: Sequelize.TEXT,
    intro_short: Sequelize.TEXT,
    impact: Sequelize.TEXT,
    original_source_url: Sequelize.STRING,
    sector_id: Sequelize.INTEGER
}, {
    timestamps: false
});

Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Initialize DB
function initialize() {
    return sequelize.sync()
        .then(() => {
            console.log("Sequelize connected and synced.");
        })
        .catch((err) => {
            console.error("Sequelize sync error:", err);
            throw err;
        });
}

// Get all projects
function getAllProjects() {
    return Project.findAll({ include: Sector })
        .then((projects) => {
            if (projects.length > 0) {
                return projects;
            } else {
                throw new Error("No projects available.");
            }
        });
}

// Get project by ID
function getProjectsById(id) {
    return Project.findAll({
        where: { id: id },
        include: [Sector]
    }).then((projects) => {
        if (projects.length > 0) {
            return projects[0];
        } else {
            throw new Error("Unable to find requested project");
        }
    });
}

// Get projects by sector name
function getProjectsBySector(sector) {
    return Project.findAll({
        include: [Sector],
        where: {
            '$Sector.sector_name$': {
                [Op.iLike]: `%${sector}%`
            }
        }
    }).then((projects) => {
        if (projects.length > 0) {
            return projects;
        } else {
            throw new Error("Unable to find requested projects");
        }
    });
}

// Get all sectors
function getAllSectors() {
    return Sector.findAll()
        .then((sectors) => sectors)
        .catch((err) => {
            throw new Error("Unable to retrieve sectors");
        });
}

// Add new project
function addProject(projectData) {
    return Project.create(projectData)
        .then(() => {})
        .catch((err) => {
            throw new Error(err.errors[0].message);
        });
}

// ✅ Edit existing project
function editProject(id, projectData) {
    return Project.update(projectData, { where: { id: id } })
      .then(() => {})
      .catch(err => {
        throw new Error(err.errors[0].message);
      });
  }
  

// ✅ Delete existing project
function deleteProject(id) {
    return Project.destroy({ where: { id: id } })
        .then(() => {})
        .catch(err => {
            throw new Error(err.errors ? err.errors[0].message : "Failed to delete project");
        });
}

// Export all functions
module.exports = {
    initialize,
    getAllProjects,
    getProjectsById,
    getProjectsBySector,
    getAllSectors,
    addProject,
    editProject,
    deleteProject // ✅ Included here
};