import { formatLessons } from "./formatLesson.js";
import { parseLessonData } from "./parseLesson.js";

export const updateSubModule = (infoList, lessonNo, newSubModuleProperties) => {
  try {
    const parsedInfoList = parseLessonData(infoList);
    parsedInfoList.forEach((subModule) => {
      if (subModule.lessonNo == lessonNo) {
        Object.assign(subModule, newSubModuleProperties);
      }
    });

    const updatedInfoList = formatLessons(parsedInfoList);
    return updatedInfoList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateLessonPlan = (
  infoList,
  lessonNo,
  lessonPlanNo,
  newLessonPlanProperties
) => {
  try {
    const parsedInfoList = parseLessonData(infoList);
    parsedInfoList.forEach((subModule) => {
      if (subModule.lessonNo == lessonNo) {
        subModule.formattedLessonPlan.forEach((lessonPlan) => {
          if (lessonPlan.lessonPlanNo == lessonPlanNo)
            Object.assign(lessonPlan, newLessonPlanProperties);
        });
      }
    });

    const updatedInfoList = formatLessons(parsedInfoList);
    return updatedInfoList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
