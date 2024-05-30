export const parseLessonData = (data) => {
  const lessons = data?.split("##").slice(1);
  const result = [];

  let i = 0;
  while (i < lessons?.length) {
    const lessonId = lessons[i];
    const lessonNo = lessons[i + 1];
    const lessonTitle = lessons[i + 2];
    const lessonDescription = lessons[i + 3];
    const lessonIsStudent = lessons[i + 4];
    const lessonIsInstructor = lessons[i + 5];
    const lessonIsDeveloper = lessons[i + 6];
    const hideDeleteLesson = lessons[i + 7];

    const lessonPlanPart = lessons[i + 8];

    const lessonPlans = lessonPlanPart?.split("@@").slice(1);

    const formattedLessonPlan = [];

    for (let j = 0; j < lessonPlans?.length; j += 14) {
      const lessonPlanId = lessonPlans[j];
      const lessonPlanNo = lessonPlans[j + 1];
      const lpTopic = lessonPlans[j + 2];
      const lpTopicDescription = lessonPlans[j + 3];
      const lpTopicType = lessonPlans[j + 4];
      const pTextfileId = lessonPlans[j + 5];
      const textPageList = lessonPlans[j + 6];
      const fileLocation = lessonPlans[j + 7];
      const webLocation = lessonPlans[j + 8];
      const webUrl = lessonPlans[j + 9];
      const lessonPlanIsStudent = lessonPlans[j + 10];
      const lessonPlanIsInstructor = lessonPlans[j + 11];
      const lessonPlanIsDeveloper = lessonPlans[j + 12];
      const hideDeleteLPlan = lessonPlans[j + 13]?.includes("hide")
        ? "hide"
        : "";

      const parsedLessonData = {
        lessonPlanId,
        lessonPlanNo,
        lpTopic,
        lpTopicDescription,
        lpTopicType,
        pTextfileId,
        textPageList,
        fileLocation,
        webLocation,
        webUrl,
        lessonPlanIsStudent,
        lessonPlanIsInstructor,
        lessonPlanIsDeveloper,
        hideDeleteLPlan,
      };

      formattedLessonPlan.push(parsedLessonData);
    }

    result.push({
      lessonId,
      lessonNo,
      lessonTitle,
      lessonDescription,
      lessonIsStudent,
      lessonIsInstructor,
      lessonIsDeveloper,
      hideDeleteLesson,
      formattedLessonPlan,
    });

    i += 9;
  }

  return result;
};

export const parseOutLine = (data) => {
  const lessons = data?.split("##").slice(1);
  const result = [];

  let i = 0;
  while (i < lessons?.length) {
    const lessonId = lessons[i];
    const lessonNo = lessons[i + 1];
    const lessonTitle = lessons[i + 2];
    const lessonDescription = lessons[i + 3];

    const lessonIsStudent = lessons[i + 4];
    const lessonIsInstructor = lessons[i + 5];
    const lessonIsDeveloper = lessons[i + 6];
    const hideDeleteLesson = lessons[i + 7];

    result.push({
      lessonId,
      lessonNo,
      lessonTitle,
      lessonDescription,
      lessonIsStudent,
      lessonIsInstructor,
      lessonIsDeveloper,
      hideDeleteLesson,
    });

    i += 9;
  }
  return result;
};

export const parseSubModules = (data) => {
  const lessons = data?.split("##").slice(1);
  const result = [];

  let i = 0;
  while (i < lessons?.length) {
    const lessonId = lessons[i];
    const lessonNo = lessons[i + 1];
    const lessonTitle = lessons[i + 2];
    const lessonDescription = lessons[i + 3];
    const lessonIsStudent = lessons[i + 4];
    const lessonIsInstructor = lessons[i + 5];
    const lessonIsDeveloper = lessons[i + 6];
    const hideDeleteLesson = lessons[i + 7];

    result.push({
      lessonId,
      lessonNo,
      lessonTitle,
      lessonDescription,
      lessonIsStudent,
      lessonIsInstructor,
      lessonIsDeveloper,
      hideDeleteLesson,
    });

    i += 9;
  }
  return result;
};
