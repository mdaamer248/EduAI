const express = require("express");
const mssql = require("mssql");
const db = require("./Database/database");
const router = express.Router();

router.get("/syllabus/course/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Create a connection pool
    const pool = await db.connect();

    const result = await pool
      .request()
      .input("courseId", mssql.Int, courseId)
      .query("SELECT * FROM admin_syllabusCourse WHERE SylabusID = @courseId");

    if (result.recordset.length === 0) {
      res.status(404).json({ message: "No course found with this id." });
    } else {
      res.json(result.recordset[0]);
    }
  } catch (err) {
    console.error("Error retrieving item:", err);
    res
      .status(500)
      .json({ message: "Error retrieving item", error: err.message });
  }
});

router.get("/get/all/lessons/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Create a connection pool
    const pool = await db.connect();

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", mssql.Int, courseId)
      .query("SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId");

    // Check if any rows were returned
    if (result.recordset.length === 0) {
      res.status(404).json({ message: "No lessons found for this course id." });
    } else {
      res.json(result.recordset);
    }
  } catch (err) {
    console.error("Error retrieving lessons:", err);
    res
      .status(500)
      .json({ message: "Error retrieving lessons", error: err.message });
  }
});

// READ: Get all syllabus Notes for a given course ID
router.get("/syllabus/notes/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Create a connection pool
    const pool = await db.connect();

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", mssql.Int, courseId)
      .query("SELECT * FROM admin_syllabusNotes WHERE SylabusID = @courseId");

    // Check if any rows were returned
    if (result.recordset.length === 0) {
      console.log("No notes found for this course id.");
      res.status(404).json({ message: "No notes found for this course id." });
    } else {
      console.log(result.recordset);
      res.json(result.recordset);
    }
  } catch (err) {
    console.error("Error retrieving notes:", err);
    res
      .status(500)
      .json({ message: "Error retrieving notes", error: err.message });
  }
});

module.exports = router;
