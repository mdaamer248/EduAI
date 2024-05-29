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
