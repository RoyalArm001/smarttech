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

  function currentProjectsOrdered(projects) {
    var activeIds = site.content.activeProjectIds || [];
    var byId = {};
    projects.forEach(function (project) {
      byId[project.id] = project;
    });
    var ordered = activeIds.map(function (id) {
      return byId[id];
    }).filter(function (project) {
      return project && project.status === "current";
    });
    if (ordered.length) return ordered;
    return projects.filter(function (project) {
      return project.status === "current";
    });
  }

  function renderFeaturedSlide(project, index) {
    var e = site.utils.escapeHtml;
    var text = site.i18n.project(project);
    var statusLabels = project.statusLabels || {};
    var statusText = statusLabels[site.i18n.language] || statusLabels.en || statusLabels.hy || "";
    var works = (text.works || []).map(function (work) {
      return "<li>" + e(work) + "</li>";
    }).join("");
    var isActive = index === 0;
    var slideClass = "featured-project current-project-slide" + (isActive ? " is-active" : "");

    return "" +
      '<article class="' + slideClass + '" data-current-project-slide role="group" aria-roledescription="slide" aria-hidden="' + (isActive ? "false" : "true") + '">' +
        '<div class="featured-project-image">' +
          '<img src="' + e(project.images[0]) + '" alt="' + e(text.title) + '" loading="lazy">' +
        "</div>" +
        '<div class="featured-project-copy">' +
          '<span class="project-status-badge is-' + e(project.status || "completed") + '">' + e(statusText) + "</span>" +
          '<span class="eyebrow">' + e(site.i18n.get("projectsPage.ongoingHighlight")) + "</span>" +
          "<h3>" + e(text.title) + "</h3>" +
          storyMarkup(project, text) +
          "<ul>" + works + "</ul>" +
        "</div>" +
      "</article>";
  }

  function renderCurrentProjectsCarousel(currentList) {
    if (!currentList.length) return "";

    var e = site.utils.escapeHtml;
    var slides = currentList.map(function (project, index) {
      return renderFeaturedSlide(project, index);
    }).join("");

    var dots = currentList.map(function (project, index) {
      var text = site.i18n.project(project);
      return '<button type="button" class="current-projects-dot' + (index === 0 ? " is-active" : "") + '" data-carousel-dot="' + index + '" aria-label="' + e(text.title) + '" aria-current="' + (index === 0 ? "true" : "false") + '"></button>';
    }).join("");
    var rail = currentList.map(function (project, index) {
      var text = site.i18n.project(project);
      var works = (text.works || []).slice(0, 2).map(function (work) {
        return '<span>' + e(work) + '</span>';
      }).join("");
      return "" +
        '<button type="button" class="current-projects-rail-item' + (index === 0 ? " is-active" : "") + '" data-carousel-dot="' + index + '" aria-label="' + e(text.title) + '">' +
          '<b>' + e(String(index + 1).padStart(2, "0")) + "</b>" +
          '<strong>' + e(text.title) + "</strong>" +
          '<em>' + works + "</em>" +
        "</button>";
    }).join("");

    var prevLabel = e(site.i18n.get("projectsPage.carouselPrev", "Previous project"));
    var nextLabel = e(site.i18n.get("projectsPage.carouselNext", "Next project"));

    return "" +
      '<div id="current-projects" class="current-projects-carousel reveal" data-current-projects-carousel data-interval="6500">' +
        '<div class="current-projects-system">' +
          '<span>' + e(site.i18n.get("projectsPage.ongoingHighlight")) + "</span>" +
          '<strong>' + e(site.i18n.get("projectsPage.current")) + "</strong>" +
        "</div>" +
        '<div class="current-projects-viewport">' +
          '<div class="current-projects-track">' + slides + "</div>" +
        "</div>" +
        '<div class="current-projects-meter" aria-hidden="true"><span data-carousel-meter></span></div>' +
        '<div class="current-projects-rail" aria-label="' + e(site.i18n.get("projectsPage.current")) + '">' + rail + "</div>" +
        '<div class="current-projects-controls">' +
          '<button type="button" class="current-projects-arrow" data-carousel-prev aria-label="' + prevLabel + '">' +
            '<span aria-hidden="true">&#8249;</span>' +
          "</button>" +
          '<div class="current-projects-dots" role="tablist" aria-label="' + e(site.i18n.get("projectsPage.current")) + '">' + dots + "</div>" +
          '<button type="button" class="current-projects-arrow" data-carousel-next aria-label="' + nextLabel + '">' +
            '<span aria-hidden="true">&#8250;</span>' +
          "</button>" +
        "</div>" +
        '<p class="current-projects-progress" data-carousel-progress aria-live="polite"></p>' +
      "</div>";
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
    var currentProjects = currentProjectsOrdered(projects);
    var heroProject = currentProjects[0] || projects[0];
    var completedProjects = projects.filter(function (project) {
      return project.status === "completed";
    });

    var currentCarousel = renderCurrentProjectsCarousel(currentProjects);
    var completedCards = renderProjectCards(completedProjects);

    var gallery = (site.content.completedGallery || []).map(function (image, index) {
      return '<img src="' + e(image) + '" alt="Completed project ' + (index + 1) + '" loading="lazy">';
    }).join("");

    var currentHeading = currentProjects.length && !currentCarousel
      ? '<div id="projects-current-list">' +
          '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.current")) + '</h2>' +
          '<p class="projects-section-lead">' + e(site.i18n.get("projectsPage.currentText")) + '</p>' +
          '<div class="projects-grid">' + renderProjectCards(currentProjects) + '</div>' +
        "</div>"
      : currentProjects.length
        ? '<div class="projects-current-intro">' +
            '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.current")) + '</h2>' +
            '<p class="projects-section-lead">' + e(site.i18n.get("projectsPage.currentText")) + '</p>' +
          "</div>"
        : "";

    var completedHeading = completedProjects.length
      ? '<div id="completed-projects">' +
          '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.completedList")) + '</h2>' +
          '<div class="projects-grid">' + completedCards + '</div>' +
        "</div>"
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
        image: heroProject.images[0],
        tone: "projects"
      }) +
      '<section id="projects-content" class="section projects-section">' +
        '<div class="container">' +
          currentHeading +
          currentCarousel +
          completedHeading +
          '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.completed")) + '</h2>' +
          '<div id="projects-gallery" class="project-gallery reveal">' + gallery + '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
