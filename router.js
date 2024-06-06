import { Router } from "express";
import { dbConnect } from "./Database/database.js";
import { parseLessonData, parseOutLine } from "./parseLesson.js";
import {
  formatLessons,
  formatLessonsForModule,
  formatSubModules,
  formatLessonPlanInSubModule,
} from "./formatLesson.js";
import pkg from "mssql";
import { updateSubModule, updateLessonPlan } from "./updateLesson.js";
import { deleteLessonPlan, deleteSubModule } from "./deleteLesson.js";
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

// Get Module of the Course
router.get("/get/module/:moduleNo/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const moduleNo = req.params.moduleNo;

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", Int, courseId)
      .input("moduleNo", Int, moduleNo)

      .query(
        "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
      );

    const formattedData = [];
    if (result.recordset.length === 0) {
      res.status(404).json({ message: "No lessons found for this course id." });
    } else {
      result.recordset.forEach((data) => {
        if (data.ModuleNo && data.LessonID) {
          formattedData.push({
            SyllabusID: data.SyllabusID,
            displayGroup: data.displayGroup,
            LessonID: data.LessonID,
            ModuleNo: data.ModuleNo,
            ModuleTitle: data.ModuleTitle,
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
      // res.json(result.recordset);
      result.recordset.forEach((data) => {
        if (data.ModuleNo && data.LessonID) {
          formattedData.push({
            SyllabusID: data.SyllabusID,
            displayGroup: data.displayGroup,
            LessonID: data.LessonID,
            ModuleNo: data.ModuleNo,
            ModuleTitle: data.ModuleTitle,
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

// Endpoint to add a record to the admin_syllabusLesson table

/// Adding Module
/// Adding Outline Module
router.post("/syllabus/outline/module", async (req, res) => {
  try {
    const { SyllabusID, displayGroup, LessonID, ModuleNo, ModuleTitle } =
      req.body;

    const result = await pool
      .request()
      .input("SyllabusID", Int, SyllabusID)
      .input("displayGroup", NVarChar, displayGroup)
      .input("LessonID", Int, LessonID)
      .input("ModuleNo", Int, ModuleNo)
      .input("ModuleTitle", NVarChar, ModuleTitle).query(`
              INSERT INTO admin_syllabusLesson (SyllabusID, displayGroup, LessonID, ModuleNo, ModuleTitle)
              VALUES (@SyllabusID, @displayGroup, @LessonID, @ModuleNo, @ModuleTitle)
          `);

    res.status(201).send({ message: "Module added successfully", result });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res
      .status(500)
      .json({ message: "Error creating lesson", error: error.message });
  }
});

/// Adding Outline subModule inside Module
router.post("/syllabus/outline/module/submodule", async (req, res) => {
  try {
    const {
      SyllabusID,
      displayGroup,
      LessonID,
      ModuleNo,
      ModuleTitle,
      subModule,
    } = req.body;

    /// Get the module first

    const module = await pool
      .request()
      .input("SyllabusID", Int, SyllabusID)
      .input("ModuleNo", Int, ModuleNo)
      .query(
        "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @SyllabusID AND ModuleNo = @ModuleNo"
      );

    const moduleData = module.recordset[0];
    const infoList = formatSubModules(subModule, moduleData.infoList);

    const result = await pool
      .request()
      .input("SyllabusID", Int, SyllabusID)
      .input("ModuleNo", Int, ModuleNo)
      .input("infoList", NVarChar, infoList).query(`
        UPDATE admin_syllabusLesson
        SET infoList = @infoList
        WHERE SyllabusID = @SyllabusID
        AND ModuleNo = @ModuleNo  
    `);
    res.status(201).send({ message: "Sub-Module added successfully", result });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res
      .status(500)
      .json({ message: "Error creating lesson", error: error.message });
  }
});

// Adding Lesson plans inside subModule
router.post(
  "/syllabus/outline/module/submodule/lessonplan",
  async (req, res) => {
    try {
      const {
        SyllabusID,
        displayGroup,
        LessonID,
        ModuleNo,
        ModuleTitle,
        subModule,
      } = req.body;

      const { lessonId, lessonNo, LessonPlan } = subModule[0];

      // Get current infoList property of module
      const moduleDetails = await pool
        .request()
        .input("SyllabusID", Int, SyllabusID)
        .input("ModuleNo", Int, ModuleNo)

        .query(
          "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @SyllabusID AND ModuleNo = @ModuleNo"
        );

      const module = moduleDetails.recordset[0];
      const currentInfoList = parseLessonData(module.infoList);

      const newInfoList = formatLessonPlanInSubModule(
        currentInfoList,
        lessonId,
        lessonNo,
        LessonPlan[0]
      );

      const result = await pool
        .request()
        .input("SyllabusID", Int, SyllabusID)
        .input("displayGroup", NVarChar, displayGroup)
        .input("LessonID", Int, LessonID)
        .input("ModuleNo", Int, ModuleNo)
        .input("ModuleTitle", NVarChar, ModuleTitle)
        .input("infoList", NVarChar, newInfoList).query(`
      UPDATE admin_syllabusLesson
      SET infoList = @infoList
      WHERE SyllabusID = @SyllabusID
        AND displayGroup = @displayGroup
        AND LessonID = @LessonID
        AND ModuleNo = @ModuleNo
        AND ModuleTitle = @ModuleTitle
          `);

      res.status(201).send({ message: "Lessons added successfully", result });

      // res.status(201).send({ message: "Lesson added successfully", infoList });
    } catch (error) {
      console.error("Error creating lesson:", error);
      res
        .status(500)
        .json({ message: "Error creating lesson", error: error.message });
    }
  }
);

// Endpoint to add a record to the admin_syllabusLesson table
router.post("/syllabus/lesson", async (req, res) => {
  try {
    const pool = await poolPromise;

    const {
      SyllabusID,
      displayGroup,
      LessonID,
      ModuleNo,
      ModuleTitle,
      infoList,
    } = req.body;

    const {
      lessonId,
      lessonNo,
      lessonTitle,
      lessonDescription,
      lessonIsStudent,
      lessonIsInstructor,
      lessonIsDeveloper,
      hideDeleteLesson,
    } = infoList;

    const result = await pool
      .request()
      .input("SyllabusID", sql.Int, SyllabusID)
      .input("displayGroup", sql.NVarChar, displayGroup)
      .input("LessonID", sql.Int, LessonID)
      .input("ModuleNo", sql.Int, ModuleNo)
      .input("ModuleTitle", sql.NVarChar, ModuleTitle)
      .input("infoList", sql.NVarChar, infoList).query(`
              INSERT INTO admin_syllabusLesson (SyllabusID, displayGroup, LessonID, ModuleNo, ModuleTitle, infoList)
              VALUES (@SyllabusID, @displayGroup, @LessonID, @ModuleNo, @ModuleTitle, @infoList)
          `);

    res.status(201).send({ message: "Lesson added successfully", result });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res
      .status(500)
      .json({ message: "Error creating lesson", error: error.message });
  }
});

//// Update Endpoints
// Updating Module Title
router.put("/update/module/:courseId/:moduleNo", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const moduleNo = req.params.moduleNo;

    const newModuleTitle = req.body.newModuleTitle;

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", Int, courseId)
      .input("moduleNo", Int, moduleNo)
      .query(
        "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
      );

    if (!result.recordset[0])
      throw new Error("Invalid module number or course id.");

    const updatedResult = await pool
      .request()
      .input("courseId", Int, courseId)
      .input("moduleNo", Int, moduleNo)
      .input("newModuleTitle", NVarChar, newModuleTitle)
      .query(
        "UPDATE admin_syllabusLesson SET ModuleTitle = @newModuleTitle WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
      );

    if (!updatedResult.rowsAffected[0])
      throw new Error("Error while updating the module record.");

    res.status(200).send({ message: "Module title updated successfully." });
  } catch (err) {
    console.error("Error Updating Module:", err);
    res
      .status(500)
      .json({ message: "Error Updating Module.", error: err.message });
  }
});

// Updating Sub Module
router.put(
  "/update/subModule/:courseId/:moduleNo/:lessonNo",
  async (req, res) => {
    try {
      const { courseId, moduleNo, lessonNo } = req.params;

      // Execute the query using the connection pool
      const result = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .query(
          "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!result.recordset[0])
        throw new Error("Invalid module number or course id.");

      const updatedInfoList = updateSubModule(
        result.recordset[0].infoList,
        lessonNo,
        req.body
      );

      const updatedResult = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .input("updatedInfoList", NVarChar, updatedInfoList)
        .query(
          "UPDATE admin_syllabusLesson SET infoList = @updatedInfoList WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!updatedResult.rowsAffected[0])
        throw new Error("Error while updating the module record.");

      res.status(200).send({ message: "Sub Module updated successfully." });
    } catch (err) {
      console.error("Error Updating Sub Module:", err);
      res
        .status(500)
        .json({ message: "Error Updating Sub Module.", error: err.message });
    }
  }
);

// Updating Lesson Plan
router.put(
  "/update/lessonPlan/:courseId/:moduleNo/:lessonNo/:lessonPlanNo",
  async (req, res) => {
    try {
      const { courseId, moduleNo, lessonNo, lessonPlanNo } = req.params;

      // Execute the query using the connection pool
      const result = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .query(
          "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!result.recordset[0])
        throw new Error("Invalid module number or course id.");

      const updatedInfoList = updateLessonPlan(
        result.recordset[0].infoList,
        lessonNo,
        lessonPlanNo,
        req.body
      );

      const updatedResult = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .input("updatedInfoList", NVarChar, updatedInfoList)
        .query(
          "UPDATE admin_syllabusLesson SET infoList = @updatedInfoList WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!updatedResult.rowsAffected[0])
        throw new Error("Error while updating the module record.");

      res.status(200).send({ message: "Lesson plan updated successfully." });
    } catch (err) {
      console.error("Error Updating Lesson Plan:", err);
      res
        .status(500)
        .json({ message: "Error Updating Lesson Plan.", error: err.message });
    }
  }
);

////// Deleting Section
// Deleting Module
// Get Module of the Course
router.delete("/delete/module/:courseId/:moduleNo", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const moduleNo = req.params.moduleNo;

    // Execute the query using the connection pool
    const result = await pool
      .request()
      .input("courseId", Int, courseId)
      .input("moduleNo", Int, moduleNo)

      .query(
        "DELETE FROM admin_syllabusLesson WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
      );

    res.status(200).send({ message: "Module record deleted sucessfully." });
  } catch (err) {
    console.error("Error Deleting Module:", err);
    res
      .status(500)
      .json({ message: "Error deleting moduel", error: err.message });
  }
});

// Deleting Sub Module
router.delete(
  "/delete/subModule/:courseId/:moduleNo/:lessonNo",
  async (req, res) => {
    try {
      const { courseId, moduleNo, lessonNo } = req.params;

      // Execute the query using the connection pool
      const result = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .query(
          "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!result.recordset[0])
        throw new Error("Invalid module number or course id.");

      const updatedInfoList = deleteSubModule(
        result.recordset[0].infoList,
        lessonNo,
        req.body
      );

      const updatedResult = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .input("updatedInfoList", NVarChar, updatedInfoList)
        .query(
          "UPDATE admin_syllabusLesson SET infoList = @updatedInfoList WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!updatedResult.rowsAffected[0])
        throw new Error("Error while updating the module record.");

      res.status(200).send({ message: "Sub Module deleted successfully." });
    } catch (err) {
      console.error("Error Updating Sub Module:", err);
      res
        .status(500)
        .json({ message: "Error Deleting Sub Module.", error: err.message });
    }
  }
);

// Deleting Lesson Plan
router.delete(
  "/delete/lessonPlan/:courseId/:moduleNo/:lessonNo/:lessonPlanNo",
  async (req, res) => {
    try {
      const { courseId, moduleNo, lessonNo, lessonPlanNo } = req.params;

      // Execute the query using the connection pool
      const result = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .query(
          "SELECT * FROM admin_syllabusLesson WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!result.recordset[0])
        throw new Error("Invalid module number or course id.");

      const updatedInfoList = deleteLessonPlan(
        result.recordset[0].infoList,
        lessonNo,
        lessonPlanNo,
        req.body
      );

      const updatedResult = await pool
        .request()
        .input("courseId", Int, courseId)
        .input("moduleNo", Int, moduleNo)
        .input("updatedInfoList", NVarChar, updatedInfoList)
        .query(
          "UPDATE admin_syllabusLesson SET infoList = @updatedInfoList WHERE SyllabusID = @courseId AND ModuleNo = @moduleNo"
        );

      if (!updatedResult.rowsAffected[0])
        throw new Error("Error while updating the module record.");

      res.status(200).send({ message: "Lesson plan deleted successfully." });
    } catch (err) {
      console.error("Error Deleting Lesson Plan:", err);
      res
        .status(500)
        .json({ message: "Error Deleting Lesson Plan.", error: err.message });
    }
  }
);

export const courseRouter = router;
