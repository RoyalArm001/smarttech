(function (site) {
  var filterLabels = {
    hy: {
      all: "Բոլոր նախագծերը",
      current: "Ընթացիկ",
      completed: "Ավարտված",
      partial: "Մասնակի",
      viewProject: "Դիտել նախագիծը",
      worksDone: "Իրականացված աշխատանքներ"
    },
    en: {
      all: "All Projects",
      current: "Ongoing",
      completed: "Completed",
      partial: "Partial",
      viewProject: "View Project",
      worksDone: "Implemented Scope"
    },
    ru: {
      all: "Все проекты",
      current: "Текущие",
      completed: "Завершенные",
      partial: "Частичные",
      viewProject: "Смотреть проект",
      worksDone: "Выполненные работы"
    }
  };

  site.sections.projects = function projects() {
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var labels = filterLabels[language] || filterLabels.hy;

    var allProjects = (site.content.projects || []).slice().sort(function (a, b) {
      return (Number(a.order) || 0) - (Number(b.order) || 0) || String(a.id).localeCompare(String(b.id));
    });

    var heroProject = allProjects.find(function (p) { return p.status === "current"; }) || allProjects[0];

    var currentCount = allProjects.filter(function (p) { return p.status === "current"; }).length;
    var completedCount = allProjects.filter(function (p) { return p.status === "completed"; }).length;
    var partialCount = allProjects.filter(function (p) { return p.status === "partial"; }).length;

    var filterTabs = [
      { key: "all", label: labels.all, count: allProjects.length },
      { key: "current", label: labels.current, count: currentCount },
      { key: "completed", label: labels.completed, count: completedCount }
    ];
    if (partialCount > 0) {
      filterTabs.push({ key: "partial", label: labels.partial, count: partialCount });
    }

    var filterBarHtml = '<div class="projects-filter-bar" role="tablist" aria-label="Projects filter">' +
      filterTabs.map(function (tab) {
        return '<button type="button" class="projects-filter-btn' + (tab.key === "all" ? " is-active" : "") + '" data-filter="' + e(tab.key) + '">' +
          '<span>' + e(tab.label) + '</span>' +
          '<span class="projects-filter-count">' + e(String(tab.count)) + '</span>' +
        '</button>';
      }).join("") +
    '</div>';

    var cardsHtml = allProjects.map(function (project, index) {
      var text = site.i18n.project(project);
      var status = project.status || "completed";
      var statusLabels = project.statusLabels || {};
      var statusText = statusLabels[language] || statusLabels.en || statusLabels.hy || "";
      var stageBadge = site.projectBadgeStage ? site.projectBadgeStage(project, language) : (site.projectStages ? site.projectStages.badgeStage(project, language) : "");
      var badgeText = (status === "current" && stageBadge) ? stageBadge : (statusText || (status === "current" ? labels.current : labels.completed));
      var stageNote = site.projectStages ? site.projectStages.label(project, language) : "";
      var showPhaseNote = stageNote && stageNote !== badgeText;
      var image = (project.images && project.images[0]) || "/img/projects/arm-construct-logo.jpg";
      var orderNum = String(index + 1).padStart(2, "0");
      var works = (text.works || project.works || []).slice(0, 3).map(function (w) {
        var label = typeof w === "object" ? (w.title || w.name || "") : w;
        return '<span class="project-card-modern-tag">' + e(label) + '</span>';
      }).join("");

      return '' +
        '<article class="project-card-modern reveal" data-project-id="' + e(project.id) + '" data-status="' + e(status) + '">' +
          '<a class="project-card-modern-inner" href="' + e(site.utils.pageUrl("project", project.id)) + '">' +
            '<div class="project-card-modern-media">' +
              '<img src="' + e(image) + '" alt="' + e(text.title) + '" loading="' + (index < 6 ? "eager" : "lazy") + '" decoding="async" onerror="this.style.opacity=0;">' +
              '<div class="project-card-modern-overlay"></div>' +
              '<span class="project-status-badge is-' + e(status) + '">' + e(badgeText) + '</span>' +
              '<span class="project-card-modern-num">' + e(orderNum) + '</span>' +
            '</div>' +
            '<div class="project-card-modern-body">' +
              '<h3 class="project-card-modern-title">' + e(text.title) + '</h3>' +
              (showPhaseNote ? '<p class="project-card-modern-phase">' + e(stageNote) + '</p>' : '') +
              (project.phase && !showPhaseNote ? '<p class="project-card-modern-phase">' + e(project.phase) + '</p>' : '') +
              '<div class="project-card-modern-works">' + works + '</div>' +
              '<div class="project-card-modern-footer">' +
                '<span class="project-card-modern-link">' + e(labels.viewProject) + '</span>' +
                '<span class="project-card-modern-arrow">→</span>' +
              '</div>' +
            '</div>' +
          '</a>' +
        '</article>';
    }).join("");

    var gallery = (site.content.completedGallery || []).map(function (img, idx) {
      return '<img src="' + e(img) + '" alt="Smart Tech Project ' + (idx + 1) + '" loading="lazy" decoding="async">';
    }).join("");

    if (!site._projectsFilterBound && typeof document !== "undefined") {
      site._projectsFilterBound = true;
      document.addEventListener("click", function (event) {
        var btn = event.target.closest(".projects-filter-btn");
        if (!btn) return;
        var filter = btn.getAttribute("data-filter");
        var bar = btn.closest(".projects-filter-bar");
        if (bar) {
          bar.querySelectorAll(".projects-filter-btn").forEach(function (b) {
            b.classList.remove("is-active");
          });
          btn.classList.add("is-active");
        }
        var grid = document.querySelector(".projects-modern-grid");
        if (grid) {
          grid.querySelectorAll(".project-card-modern").forEach(function (card) {
            var st = card.getAttribute("data-status");
            if (filter === "all" || st === filter) {
              card.classList.remove("is-hidden");
            } else {
              card.classList.add("is-hidden");
            }
          });
        }
      });
    }

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
        image: heroProject && heroProject.images && heroProject.images[0] || "",
        tone: "projects"
      }) +
      '<section id="projects-content" class="section projects-section">' +
        '<div class="container">' +
          filterBarHtml +
          '<div class="projects-modern-grid">' + cardsHtml + '</div>' +
          (gallery ? '<div class="projects-gallery-wrap"><h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.completed", "Ավարտված աշխատանքներից լուսանկարներ")) + '</h2><div id="projects-gallery" class="project-gallery reveal">' + gallery + '</div></div>' : '') +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
