import { parseLessonData, parseSubModules } from "./parseLesson.js";

export function formatLessons(data) {
  const lessons = data;
  const formattedLesson = lessons
    .map((lesson) => {
      const lessonString = [
        lesson.lessonNo,
        `##${lesson.lessonId}`,
        `##${lesson.lessonNo}`,
        `##${lesson.lessonTitle}`,
        `##${lesson.lessonDescription}`,
        `##${lesson.lessonIsStudent ? "checked" : ""}`,
        `##${lesson.lessonIsInstructor ? "checked" : ""}`,
        `##${lesson.lessonIsDeveloper ? "checked" : ""}`,
        `##${lesson.hideDeleteLesson}##`,
      ].join("");

      const lessonPlansString = lesson.formattedLessonPlan
        .map((plan) =>
          [
            `@@${plan.lessonPlanId}`,
            `@@${plan.lessonPlanNo}`,
            `@@${plan.lpTopic}`,
            `@@${plan.lpTopicDescription}`,
            `@@${plan.lpTopicType}`,
            `@@${plan.pTextfileId}`,
            `@@${plan.textPageList}`,
            `@@${plan.fileLocation}`,
            `@@${plan.webLocation}`,
            `@@${plan.webUrl}`,
            `@@${plan.lessonPlanIsStudent ? "checked" : ""}`,
            `@@${plan.lessonPlanIsInstructor ? "checked" : ""}`,
            `@@${plan.lessonPlanIsDeveloper ? "checked" : ""}`,
            `@@${plan.hideDeleteLplan ? "hide" : ""}`,
          ].join("")
        )
        .join("");

      return lessonString + lessonPlansString;
    })
    .join("");

  return formattedLesson;
}

export function formatLessonsForModule(data) {
  const lessons = data;
  const formattedLesson = lessons
    .map((lesson) => {
      const lessonString = [
        lesson.lessonNo,
        `##${lesson.lessonId}`,
        `##${lesson.lessonNo}`,
        `##${lesson.lessonTitle}`,
        `##${lesson.lessonDescription}`,
        `##${lesson.lessonIsStudent ? "checked" : ""}`,
        `##${lesson.lessonIsInstructor ? "checked" : ""}`,
        `##${lesson.lessonIsDeveloper ? "checked" : ""}`,
        `##${lesson.hideDeleteLesson}##`,
      ].join("");

      return lessonString + "@@@@@@@@@@@@@@@@@@@@@@@@@@@@";
    })
    .join("");

  return formattedLesson;
}

export function formatSubModules(subModule, existingSubModules) {
  let infoList;
  if (!existingSubModules) {
    infoList = formatLessonsForModule([subModule]);
  } else {
    const subModuleData = parseSubModules(existingSubModules);
    subModuleData.push(subModule);
    infoList = formatLessonsForModule(subModuleData);
  }
  return infoList;
}

export function formatLessonPlanInSubModule(
  currentInfoList,
  lessonId,
  lessonNo,
  LessonPlan
) {
  currentInfoList.forEach((subModule) => {
    if (subModule.lessonId == lessonId && subModule.lessonNo == lessonNo) {
      subModule.formattedLessonPlan.forEach((lessonPlan) => {
        if (!lessonPlan.lessonPlanId && !lessonPlan.lessonPlanNo) {
          subModule.formattedLessonPlan.pop();
          subModule.formattedLessonPlan.push(LessonPlan);
        } else {
          subModule.formattedLessonPlan.push(LessonPlan);
        }
      });
    }
  });

  const formattedInfoList = formatLessons(currentInfoList);
  return formattedInfoList;
}
