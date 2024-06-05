import { formatLessons } from "./formatLesson.js";
import { parseLessonData } from "./parseLesson.js";

export const deleteSubModule = (infoList, lessonNo, newSubModuleProperties) => {
  try {
    const parsedInfoList = parseLessonData(infoList);
    const newInfoList = parsedInfoList.filter((subModule) => {
      return subModule.lessonNo != lessonNo;
    });

    const updatedInfoList = formatLessons(newInfoList);
    return updatedInfoList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteLessonPlan = (
  infoList,
  lessonNo,
  lessonPlanNo,
  newLessonPlanProperties
) => {
  try {
    const parsedInfoList = parseLessonData(infoList);
    parsedInfoList.forEach((subModule) => {
      if (subModule.lessonNo == lessonNo) {
        const newFormattedLessonPlan = subModule.formattedLessonPlan.filter(
          (lessonPlan) => lessonPlan.lessonPlanNo != lessonPlanNo
        );

        subModule.formattedLessonPlan = newFormattedLessonPlan;
      }
    });

    const updatedInfoList = formatLessons(parsedInfoList);
    return updatedInfoList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
