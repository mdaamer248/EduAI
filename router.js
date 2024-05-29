import { Router } from "express";
import { dbConnect } from "./Database/database.js";
import { parseLessonData, parseOutLine } from "./parseLesson.js";
import pkg from "mssql";
const { Int, SmallInt, NVarChar, VarChar, Decimal, SmallDateTime } = pkg;

const router = Router();
// Create a connection pool
const pool = await dbConnect();

/// Get Course Details
router.get("/syllabus/course/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const result = await pool
      .request()
      .input("courseId", Int, courseId)
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

// Get Course Notes
router.get("/syllabus/notes/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", Int, courseId)
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

// Get Outline
router.get("/get/all/modules/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", Int, courseId)
      .query("SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId");

    const formattedData = [];
    if (result.recordset.length === 0) {
      res.status(404).json({ message: "No lessons found for this course id." });
    } else {
      result.recordset.forEach((data) => {
        if (data.ModuleNo && data.LessonID) {
          formattedData.push({
            moduleNo: data.ModuleNo,
            moduleTitle: data.ModuleTitle,
            info: parseOutLine(data.infoList),
          });
        }
      });
      res.json(formattedData);
    }
  } catch (err) {
    console.error("Error retrieving lessons:", err);
    res
      .status(500)
      .json({ message: "Error retrieving lessons", error: err.message });
  }
});

// Get LessonPlan
router.get("/get/all/lessons/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", Int, courseId)
      .query("SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId");

    const formattedData = [];
    if (result.recordset.length === 0) {
      res.status(404).json({ message: "No lessons found for this course id." });
    } else {
      result.recordset.forEach((data) => {
        if (data.ModuleNo && data.LessonID) {
          formattedData.push({
            syllabusId: data.SyllabusID,
            displayGroup: data.displayGroup,
            lessonId: data.LessonID,
            moduleNo: data.ModuleNo,
            moduleTitle: data.ModuleTitle,
            info: parseLessonData(data.infoList),
          });
        }
      });
      res.json(formattedData);
    }
  } catch (err) {
    console.error("Error retrieving lessons:", err);
    res
      .status(500)
      .json({ message: "Error retrieving lessons", error: err.message });
  }
});

// Add a topic inside course notes section
router.post("/syllabus/notes", async (req, res) => {
  try {
    // Create a connection pool
    const request = pool.request();

    const {
      SylabusID,
      NotesID,
      NotesModule,
      NotesNo,
      NotesTitle,
      NotesDescription,
      DisplayIsStudent,
      DisplayIsInstructor,
      DisplayIsDeveloper,
    } = req.body;

    const result = await request
      .input("SylabusID", Int, SylabusID)
      .input("NotesID", Int, NotesID)
      .input("NotesModule", SmallInt, NotesModule)
      .input("NotesNo", Int, NotesNo)
      .input("NotesTitle", NVarChar, NotesTitle)
      .input("NotesDescription", NVarChar, NotesDescription)
      .input("DisplayIsStudent", VarChar, DisplayIsStudent)
      .input("DisplayIsInstructor", VarChar, DisplayIsInstructor)
      .input("DisplayIsDeveloper", VarChar, DisplayIsDeveloper).query(`
          INSERT INTO admin_syllabusNotes (SylabusID, NotesID, NotesModule, NotesNo, NotesTitle, NotesDescription, DisplayIsStudent, DisplayIsInstructor, DisplayIsDeveloper)
          VALUES (@SylabusID, @NotesID, @NotesModule, @NotesNo, @NotesTitle, @NotesDescription, @DisplayIsStudent, @DisplayIsInstructor, @DisplayIsDeveloper)
        `);

    console.log({ result });

    res.status(201).send({ message: "Syllabus note added successfully" });
  } catch (error) {
    console.error("Error creating notes:", error);
    res
      .status(500)
      .json({ message: "Error creating notes", error: error.message });
  }
});

// Endpoint to update a course note
router.put("/syllabus/notes/:NotesID", async (req, res) => {
  try {
    const request = pool.request();

    const { NotesID } = req.params;
    const {
      SylabusID,
      NotesModule,
      NotesNo,
      NotesTitle,
      NotesDescription,
      DisplayIsStudent,
      DisplayIsInstructor,
      DisplayIsDeveloper,
    } = req.body;

    const result = await request
      .input("SylabusID", Int, SylabusID)
      .input("NotesModule", SmallInt, NotesModule)
      .input("NotesNo", Int, NotesNo)
      .input("NotesTitle", NVarChar, NotesTitle)
      .input("NotesDescription", NVarChar, NotesDescription)
      .input("DisplayIsStudent", VarChar, DisplayIsStudent)
      .input("DisplayIsInstructor", VarChar, DisplayIsInstructor)
      .input("DisplayIsDeveloper", VarChar, DisplayIsDeveloper)
      .input("NotesID", Int, NotesID).query(`
        UPDATE admin_syllabusNotes
        SET 
          SylabusID = @SylabusID,
          NotesModule = @NotesModule,
          NotesNo = @NotesNo,
          NotesTitle = @NotesTitle,
          NotesDescription = @NotesDescription,
          DisplayIsStudent = @DisplayIsStudent,
          DisplayIsInstructor = @DisplayIsInstructor,
          DisplayIsDeveloper = @DisplayIsDeveloper
        WHERE NotesID = @NotesID
      `);

    console.log({ result });

    res.status(200).send({ message: "Syllabus note updated successfully" });
  } catch (error) {
    console.error("Error updating notes:", error);
    res
      .status(500)
      .json({ message: "Error updating notes", error: error.message });
  }
});

router.post("/add/course", async (req, res) => {
  try {
    const {
      SylabusID,
      CourseNo,
      CourseTitle,
      LectureClipURL,
      sVersion,
      UpdateOn,
      CardFrame,
      CardImage,
      CardDifficulty,
      CardLevel,
      CardCategory,
      CardStatus,
      TotalModule,
      TotalLesson,
      TotalNotes,
      TotalCoursework,
      TotalAssignments,
      TotalExam,
      TotalPractice,
      TotalDiagnostic,
    } = req.body;

    // Create a new request
    const request = pool.request();

    // Insert data into admin_syllabusCourse
    const result = await request
      .input("SylabusID", Int, SylabusID)
      .input("CourseNo", NVarChar, CourseNo)
      .input("CourseTitle", NVarChar, CourseTitle)
      .input("LectureClipURL", NVarChar, LectureClipURL)
      .input("sVersion", Decimal(18, 2), sVersion)
      .input("UpdateOn", SmallDateTime, UpdateOn)
      .input("CardFrame", NVarChar, CardFrame)
      .input("CardImage", NVarChar, CardImage)
      .input("CardDifficulty", Int, CardDifficulty)
      .input("CardLevel", Int, CardLevel)
      .input("CardCategory", NVarChar, CardCategory)
      .input("CardStatus", VarChar, CardStatus)
      .input("TotalModule", Int, TotalModule)
      .input("TotalLesson", Int, TotalLesson)
      .input("TotalNotes", Int, TotalNotes)
      .input("TotalCoursework", Int, TotalCoursework)
      .input("TotalAssignments", Int, TotalAssignments)
      .input("TotalExam", Int, TotalExam)
      .input("TotalPractice", Int, TotalPractice)
      .input("TotalDiagnostic", Int, TotalDiagnostic).query(`
        INSERT INTO admin_syllabusCourse (
          SylabusID, CourseNo, CourseTitle, LectureClipURL, sVersion, UpdateOn, CardFrame, CardImage, CardDifficulty,
          CardLevel, CardCategory, CardStatus, TotalModule, TotalLesson, TotalNotes, TotalCoursework,
          TotalAssignments, TotalExam, TotalPractice, TotalDiagnostic
        )
        VALUES (
          @SylabusID, @CourseNo, @CourseTitle, @LectureClipURL, @sVersion, @UpdateOn, @CardFrame, @CardImage, @CardDifficulty,
          @CardLevel, @CardCategory, @CardStatus, @TotalModule, @TotalLesson, @TotalNotes, @TotalCoursework,
          @TotalAssignments, @TotalExam, @TotalPractice, @TotalDiagnostic
        )
      `);

    console.log({ result });

    res.status(201).send({ message: "Syllabus course added successfully" });
  } catch (error) {
    console.error("SQL error", error);
    res
      .status(500)
      .send({ error: "An error occurred while adding the syllabus course" });
  }
});

export const courseRouter = router;
