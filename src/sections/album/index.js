(function (site) {
  function copy() {
    var language = site.i18n.language || "hy";
    return site.i18n.pickLanguageDictionary({
      hy: {
        eyebrow: "Աշխատանքների ալբոմ",
        title: "Նախագծերի լուսանկարներ",
        text: "Մեր նախագծերի լուսանկարները՝ ըստ աշխատանքների ընթացքի։",
        projectsTitle: "Այլ լուսանկարներ",
        projectsText: "Նախագծերի լուսանկարներ, որոնց աշխատանքների կարգավիճակը դեռ նշված չէ։",
        currentTitle: "Ընթացիկ աշխատանքներ",
        currentText: "Այստեղ հավաքված են այն օբյեկտների նկարները, որոնց աշխատանքները ներկայումս ընթացքի մեջ են։",
        completedTitle: "Կատարված աշխատանքներ",
        completedText: "Այս բաժնում ներկայացված են հանձնված օբյեկտների և ավարտված աշխատանքների ընտրված նկարները։",
        currentButton: "Ընթացիկ նկարներ",
        completedButton: "Կատարված նկարներ",
        currentStat: "Ընթացիկ նկար",
        completedStat: "Կատարված նկար",
        totalStat: "Ընդհանուր նկար",
        open: "Բացել նկարը",
        photo: "Նկար",
        standaloneTitle: "Կատարված աշխատանքներ",
        empty: "Այս բաժնում նկարներ դեռ ավելացված չեն։"
      },
      en: {
        eyebrow: "Work Album",
        title: "Project photo album",
        text: "Photos from our projects, grouped by work status.",
        projectsTitle: "Other photos",
        projectsText: "Project photos whose work status has not yet been specified.",
        currentTitle: "Active works",
        currentText: "Photos from objects where Smart Tech work is currently in progress.",
        completedTitle: "Completed works",
        completedText: "Selected photos from delivered objects and finished technical work.",
        currentButton: "Active photos",
        completedButton: "Completed photos",
        currentStat: "Active photos",
        completedStat: "Completed photos",
        totalStat: "Total photos",
        open: "Open photo",
        photo: "Photo",
        standaloneTitle: "Completed works",
        empty: "No photos have been added to this section yet."
      },
      ru: {
        eyebrow: "Альбом работ",
        title: "Фотоальбом проектов",
        text: "Фотографии наших проектов по статусу работ.",
        projectsTitle: "Другие фотографии",
        projectsText: "Фотографии проектов, для которых статус работ пока не указан.",
        currentTitle: "Текущие работы",
        currentText: "Фотографии объектов, где работы Smart Tech сейчас находятся в процессе.",
        completedTitle: "Выполненные работы",
        completedText: "Избранные фотографии сданных объектов и завершённых технических работ.",
        currentButton: "Текущие фото",
        completedButton: "Завершённые фото",
        currentStat: "Текущие фото",
        completedStat: "Завершённые фото",
        totalStat: "Всего фото",
        open: "Открыть фото",
        photo: "Фото",
        standaloneTitle: "Выполненные работы",
        empty: "В этом разделе пока нет фотографий."
      }
    }, language);
  }

  function projectTitle(project) {
    return (site.i18n.project(project) || {}).title || project.title || "";
  }

  function projectStatus(project) {
    if (project.status === "current") {
      var stage = site.projectStages.label(project, site.i18n.language);
      if (stage) return stage;
    }
    var labels = project.statusLabels || {};
    var defaults = {
      hy: { current: "Ընթացիկ", partial: "Մասամբ ավարտված", completed: "Ավարտված" },
      en: { current: "In progress", partial: "Partially completed", completed: "Completed" },
      ru: { current: "В работе", partial: "Частично завершено", completed: "Завершено" }
    };
    return labels[site.i18n.language] || site.i18n.pickLanguageDictionary(defaults)[project.status] || "";
  }

  function collectProjectPhotos(projects, status) {
    var photos = [];
    projects.forEach(function (project) {
      if (project.status !== status) return;
      var text = site.i18n.project(project) || {};
      (project.images || []).forEach(function (image, index) {
        var workCaption = (text.works || [])[index] || (text.works || [])[0] || projectTitle(project);
        photos.push({
          image: image,
          project: project,
          title: projectTitle(project),
          caption: workCaption,
          status: projectStatus(project),
          index: index
        });
      });
    });
    return photos;
  }

  function collectCompletedGalleryPhotos(text) {
    return (site.content.completedGallery || []).map(function (image, index) {
      return {
        image: image,
        title: text.standaloneTitle,
        status: text.completedTitle,
        index: index
      };
    });
  }

  function collectAdminAlbumPhotos(section) {
    var projects = site.content.projects || [];
    return (site.content.adminAlbumPhotos || [])
      .filter(function (item) { return item && item.image; })
      .map(function (item, index) {
        var project = projects.find(function (project) {
          return project.id === item.projectId || (project.images || []).indexOf(item.image) >= 0;
        });
        var status = project ? project.status : item.section;
        return {
          image: item.image,
          section: status === "partial" ? "current" : status,
          title: project ? projectTitle(project) : item.title || "Smart Tech",
          caption: project ? (site.i18n.project(project).works || []).join(" · ") : item.caption || item.title || "Smart Tech",
          status: projectStatus(project || { status: status }),
          index: index
        };
      })
      .filter(function (item) { return item.section === section; });
  }

  function photoCard(item, index) {
    var e = site.utils.escapeHtml;
    var sizeClass = index % 9 === 0 ? " is-tall" : index % 5 === 0 ? " is-wide" : "";
    var workLabel = item.caption || item.title || "";
    var locationLabel = item.title || "";
    var label = workLabel + " · " + (item.status || "");

    return '' +
      '<a class="album-photo-card reveal' + sizeClass + '" href="' + e(item.image) + '" target="_blank" rel="noreferrer" aria-label="' + e(label) + '">' +
        '<img src="' + e(item.image) + '" alt="' + e(workLabel) + '" loading="lazy" decoding="async">' +
        '<span class="album-photo-shine" aria-hidden="true"></span>' +
        '<span class="album-photo-caption">' +
          '<small>' + e(item.status || "") + '</small>' +
          '<strong>' + e(workLabel) + '</strong>' +
          (locationLabel && locationLabel !== workLabel
            ? '<span class="album-photo-location">' + e(locationLabel) + '</span>'
            : "") +
        '</span>' +
      '</a>';
  }

  function albumPart(id, title, text, items) {
    var e = site.utils.escapeHtml;
    var cards = items.length
      ? items.map(function (item, index) {
          return photoCard(item, index);
        }).join("")
      : '<p class="album-empty">' + e(copy().empty) + '</p>';

    return '' +
      '<section id="' + e(id) + '" class="album-part">' +
        '<div class="album-part-head reveal">' +
          '<div>' +
            '<h2>' + e(title) + '</h2>' +
            '<p>' + e(text) + '</p>' +
          '</div>' +
          '<strong>' + e(String(items.length).padStart(2, "0")) + '</strong>' +
        '</div>' +
        '<div class="album-grid">' + cards + '</div>' +
      '</section>';
  }

  function stat(label, value) {
    var e = site.utils.escapeHtml;
    return '' +
      '<div class="album-stat reveal">' +
        '<strong>' + e(String(value).padStart(2, "0")) + '</strong>' +
        '<span>' + e(label) + '</span>' +
      '</div>';
  }

  site.sections.album = function album() {
    var e = site.utils.escapeHtml;
    var text = copy();
    var projects = site.content.projects || [];
    var seen = new Set();
    function uniquePhoto(item) {
      if (seen.has(item.image)) return false;
      seen.add(item.image);
      return true;
    }
    var currentPhotos = collectProjectPhotos(projects, "current").concat(collectProjectPhotos(projects, "partial"), collectAdminAlbumPhotos("current")).filter(uniquePhoto);
    var completedPhotos = collectProjectPhotos(projects, "completed").concat(collectAdminAlbumPhotos("completed"), collectCompletedGalleryPhotos(text)).filter(uniquePhoto);
    var otherPhotos = collectAdminAlbumPhotos("projects").filter(uniquePhoto);
    var heroPhoto = (currentPhotos[0] || completedPhotos[0] || otherPhotos[0] || {}).image || (site.content.company.heroImages || [])[0];

    return '' +
      site.sections.pageHero({
        eyebrow: text.eyebrow,
        title: text.title,
        text: text.text,
        action: text.completedButton,
        href: "#album-completed",
        image: heroPhoto,
        tone: "projects"
      }) +
      '<section id="album-content" class="section album-section">' +
        '<div class="container">' +
          '<div class="album-control-panel reveal">' +
            '<div class="album-switches" aria-label="' + e(text.eyebrow) + '">' +
              '<a href="#album-current">' + e(text.currentButton) + '</a>' +
              '<a href="#album-completed">' + e(text.completedButton) + '</a>' +
              (otherPhotos.length ? '<a href="#album-projects">' + e(text.projectsTitle) + '</a>' : '') +
            '</div>' +
            '<div class="album-stats">' +
              stat(text.currentStat, currentPhotos.length) +
              stat(text.completedStat, completedPhotos.length) +
              stat(text.totalStat, currentPhotos.length + completedPhotos.length + otherPhotos.length) +
            '</div>' +
          '</div>' +
          albumPart("album-current", text.currentTitle, text.currentText, currentPhotos) +
          albumPart("album-completed", text.completedTitle, text.completedText, completedPhotos) +
          (otherPhotos.length ? albumPart("album-projects", text.projectsTitle, text.projectsText, otherPhotos) : '') +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
