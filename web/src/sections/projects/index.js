(function (site) {
  site.sections.projects = function projects() {
    var e = site.utils.escapeHtml;
    var projects = site.content.projects;
    var featured = projects[4] || projects[0];
    var featuredText = site.i18n.project(featured);

    var featuredWorks = featuredText.works.map(function (work) {
      return '<li>' + e(work) + '</li>';
    }).join("");

    var projectCards = projects.map(function (project) {
      var text = site.i18n.project(project);
      var works = text.works.slice(0, 3).map(function (work) {
        return '<li>' + e(work) + '</li>';
      }).join("");

      return '' +
        '<a class="project-card reveal" href="' + e(site.utils.pageUrl("project", project.id)) + '">' +
          '<img src="' + e(project.images[0]) + '" alt="' + e(text.title) + '" loading="lazy">' +
          '<div>' +
            '<h3>' + e(text.title) + '</h3>' +
            '<ul>' + works + '</ul>' +
          '</div>' +
        '</a>';
    }).join("");

    var gallery = (site.content.completedGallery || []).map(function (image, index) {
      return '<img src="' + e(image) + '" alt="Completed project ' + (index + 1) + '" loading="lazy">';
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: site.i18n.get("projectsPage.eyebrow"),
        eyebrowKey: "projectsPage.eyebrow",
        title: site.i18n.get("projectsPage.title"),
        titleKey: "projectsPage.title",
        text: site.i18n.get("projectsPage.text"),
        textKey: "projectsPage.text",
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
              '<span class="eyebrow">' + e(site.i18n.get("common.selectedProject")) + '</span>' +
              '<h3>' + e(featuredText.title) + '</h3>' +
              '<ul>' + featuredWorks + '</ul>' +
            '</div>' +
          '</article>' +
          '<div class="projects-grid">' + projectCards + '</div>' +
          '<h2 class="gallery-heading">' + e(site.i18n.get("projectsPage.completed")) + '</h2>' +
          '<div class="project-gallery reveal">' + gallery + '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
