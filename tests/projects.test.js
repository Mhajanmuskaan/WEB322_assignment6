const projectData = require("../modules/projects"); // Import the module

describe("Project Data Tests - Muskaan Mahajan - 165874231", () => {
  
  // ✅ Test 1: Ensure getAllProjects returns all projects
  test("getAllProjects should return all projects", async () => {
    const projects = await projectData.getAllProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0); // Ensure at least one project exists
  });

  // ✅ Test 2: Ensure getProjectById returns a project when a valid ID is given
  test("getProjectById should return the correct project when a valid ID is given", async () => {
    const project = await projectData.getProjectsById(1); // Assume ID 1 exists
    expect(project).toHaveProperty("id", 1);
    expect(project).toHaveProperty("title");
  });

  // ✅ Test 3: Ensure getProjectById rejects when given an invalid ID
  test("getProjectById should reject with an error when given an invalid ID", async () => {
    await expect(projectData.getProjectsById(999)).rejects.toMatch("Project with ID 999 not found.");
  });

  // ✅ Test 4: Ensure getProjectsBySector returns projects for a valid sector
  test("getProjectsBySector should return projects for a valid sector", async () => {
    const sector = "Industry";
    const projects = await projectData.getProjectsBySector(sector);
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0]).toHaveProperty("title");
  });

  // ✅ Test 5: Ensure getProjectsBySector rejects for an invalid sector
  test("getProjectsBySector should reject with an error when given an invalid sector", async () => {
    const invalidSector = "InvalidSector";
    await expect(projectData.getProjectsBySector(invalidSector)).rejects.toThrow(`No projects found for sector: ${invalidSector}`);
  });

  // ✅ Test 6: Ensure getProjectsBySector rejects when no projects exist for the sector
  test("getProjectsBySector should reject with an error when no projects are found for the given sector", async () => {
    const emptySector = "Unknown Sector";
    await expect(projectData.getProjectsBySector(emptySector)).rejects.toThrow(`No projects found for sector: ${emptySector}`);
  });

});

