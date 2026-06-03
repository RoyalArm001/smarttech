(function (site) {
  function storyLabels() {
    return {
      problem: site.i18n.get("projectsPage.storyProblem", "Problem"),
      solution: site.i18n.get("projectsPage.storySolution", "Solution"),
      result: site.i18n.get("projectsPage.storyResult", "Result")
    };
  }

  function projectNarrative(project, text) {
    var language = site.i18n.language || "hy";
    var works = (text.works || []).slice(0, 2).join(language === "ru" ? ", " : " / ");
    var dictionaries = {
      hy: {
        problem: "Օբյեկտը պահանջում էր կայուն և վերահսկելի ինժեներական համակարգերի համալիր՝ ամենօրյա անխափան աշխատանքի համար։",
        solutionPrefix: "Իրականացրեցինք՝ ",
        resultCurrent: "Նախագիծը ընթացքի մեջ է, համակարգերը փուլային ձևով տեղադրվում ու կարգավորվում են ըստ օբյեկտի աշխատանքային ռիթմի։",
        resultCompleted: "Համակարգերը հանձնված են շահագործման և ապահովում են օբյեկտի անվտանգ ու կայուն աշխատանքը։"
      },
      en: {
        problem: "The facility required a stable and controllable engineering system package for uninterrupted daily operations.",
        solutionPrefix: "Implemented scope: ",
        resultCurrent: "The project is in progress with phased installation and configuration aligned with facility operations.",
        resultCompleted: "Systems are delivered and provide secure, stable daily facility operations."
      },
      ru: {
        problem: "Объекту требовался стабильный и управляемый комплекс инженерных систем для бесперебойной ежедневной работы.",
        solutionPrefix: "Реализовали: ",
        resultCurrent: "Проект в работе: системы поэтапно монтируются и настраиваются с учетом рабочего режима объекта.",
        resultCompleted: "Системы сданы и обеспечивают безопасную и стабильную ежедневную работу объекта."
      }
    };
    var copy = site.i18n.pickLanguageDictionary(dictionaries, language);
    return {
      problem: copy.problem,
      solution: copy.solutionPrefix + (works || "-"),
      result: project.status === "current" ? copy.resultCurrent : copy.resultCompleted
    };
  }

  function storyMarkup(project, text) {
    var e = site.utils.escapeHtml;
    var labels = storyLabels();
    var story = projectNarrative(project, text);
    return '' +
      '<dl class="project-story">' +
        '<div><dt>' + e(labels.problem) + '</dt><dd>' + e(story.problem) + '</dd></div>' +
        '<div><dt>' + e(labels.solution) + '</dt><dd>' + e(story.solution) + '</dd></div>' +
        '<div><dt>' + e(labels.result) + '</dt><dd>' + e(story.result) + '</dd></div>' +
      '</dl>';
  }

  function renderProjectCards(projectList) {
    var e = site.utils.escapeHtml;
    return projectList.map(function (project) {
      var text = site.i18n.project(project);
      var statusLabels = project.statusLabels || {};
      var statusText = statusLabels[site.i18n.language] || statusLabels.en || statusLabels.hy || "";
      var works = (text.works || []).slice(0, 2).map(function (work) {
        return '<li>' + e(work) + '</li>';
      }).join("");

      return '' +
        '<a class="project-card reveal" href="' + e(site.utils.pageUrl("project", project.id)) + '">' +
          '<span class="project-status-badge is-' + e(project.status || "completed") + '">' + e(statusText) + '</span>' +
          '<img src="' + e(project.images[0]) + '" alt="' + e(text.title) + '" loading="lazy">' +
          '<div>' +
            '<h3>' + e(text.title) + '</h3>' +
            storyMarkup(project, text) +
            '<ul>' + works + '</ul>' +
          '</div>' +
        '</a>';
    }).join("");
  }

  site.sections.projects = function projects() {
    var e = site.utils.escapeHtml;
    var projects = site.content.projects || [];
    var featuredId = site.content.featuredProjectId || (projects[0] && projects[0].id);
    var featured = projects.find(function (project) {
      return project.id === featuredId;
    }) || projects[0];
    var featuredText = site.i18n.project(featured);
    var featuredStatusLabels = featured.statusLabels || {};
    var featuredStatusText = featuredStatusLabels[site.i18n.language] || featuredStatusLabels.en || featuredStatusLabels.hy || "";

    var featuredWorks = (featuredText.works || []).map(function (work) {
      return '<li>' + e(work) + '</li>';
    }).join("");

    var currentProjects = projects.filter(function (project) {
      return project.status === "current" && project.id !== featured.id;
    });
    var completedProjects = projects.filter(function (project) {
      return project.status === "completed";
    });

    var currentCards = renderProjectCards(currentProjects);
    var completedCards = renderProjectCards(completedProjects);

    var gallery = (site.content.completedGallery || []).map(function (image, index) {
      return '<img src="' + e(image) + '" alt="Completed project ' + (index + 1) + '" loading="lazy">';
    }).join("");

    var currentHeading = currentProjects.length
      ? '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.current")) + '</h2>' +
        '<p class="projects-section-lead">' + e(site.i18n.get("projectsPage.currentText")) + '</p>' +
        '<div class="projects-grid">' + currentCards + '</div>'
      : "";

    var completedHeading = completedProjects.length
      ? '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.completedList")) + '</h2>' +
        '<div class="projects-grid">' + completedCards + '</div>'
      : "";

    return '' +
      site.sections.pageHero({
        eyebrow: site.i18n.get("projectsPage.eyebrow"),
        eyebrowKey: "projectsPage.eyebrow",
        title: site.i18n.get("projectsPage.title"),
        titleKey: "projectsPage.title",
        text: site.i18n.get("projectsPage.text"),
        textKey: "projectsPage.text",
        action: site.i18n.get("common.requestSurvey", site.i18n.get("common.proposal")),
        actionKey: "common.requestSurvey",
        href: site.utils.pageUrl("request"),
        image: featured.images[0],
        tone: "projects"
      }) +
      '<section id="projects-content" class="section projects-section">' +
        '<div class="container">' +
          '<article class="featured-project reveal">' +
            '<div class="featured-project-image">' +
              '<img src="' + e(featured.images[0]) + '" alt="' + e(featuredText.title) + '">' +
            '</div>' +
            '<div class="featured-project-copy">' +
              '<span class="project-status-badge is-' + e(featured.status || "completed") + '">' + e(featuredStatusText) + '</span>' +
              '<span class="eyebrow">' + e(site.i18n.get("common.selectedProject")) + '</span>' +
              '<h3>' + e(featuredText.title) + '</h3>' +
              storyMarkup(featured, featuredText) +
              '<ul>' + featuredWorks + '</ul>' +
            '</div>' +
          '</article>' +
          currentHeading +
          completedHeading +
          '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.completed")) + '</h2>' +
          '<div class="project-gallery reveal">' + gallery + '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
