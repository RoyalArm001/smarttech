(function (site) {
  function copy() {
    var language = site.i18n.language || "hy";
    return site.i18n.pickLanguageDictionary({
      hy: {
        eyebrow: "Աշխատանքների ալբոմ",
        title: "Կատարված աշխատանքների նկարների ալբոմ",
        text: "Նկարները բաժանված են 2 մասի՝ ընթացիկ և ավարտված աշխատանքներ, որպեսզի այցելուն արագ տեսնի իրական օբյեկտների արդյունքը։",
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
        title: "Photo album of completed works",
        text: "The gallery is split into two clear parts: active projects and completed works, so visitors can quickly review real site results.",
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
        title: "Фотоальбом выполненных работ",
        text: "Галерея разделена на две части: текущие проекты и завершённые работы, чтобы посетитель быстро видел реальные объекты.",
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
    var labels = project.statusLabels || {};
    return labels[site.i18n.language] || labels.en || labels.hy || "";
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
    return (site.content.adminAlbumPhotos || [])
      .filter(function (item) {
        return item && item.section === section && item.image;
      })
      .map(function (item, index) {
        return {
          image: item.image,
          title: item.title || "Smart Tech",
          caption: item.caption || item.title || "Smart Tech",
          status: item.status || (section === "current" ? "Active work" : "Completed work"),
          index: index
        };
      });
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
          '<em>' + e(copy().photo) + ' ' + e(String((item.index || 0) + 1).padStart(2, "0")) + '</em>' +
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
            '<span class="eyebrow">' + e(title) + '</span>' +
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
    var currentPhotos = collectAdminAlbumPhotos("current").concat(collectProjectPhotos(projects, "current"));
    var completedPhotos = collectAdminAlbumPhotos("completed").concat(collectProjectPhotos(projects, "partial"), collectProjectPhotos(projects, "completed"), collectCompletedGalleryPhotos(text));
    var heroPhoto = (currentPhotos[0] || completedPhotos[0] || {}).image || (site.content.company.heroImages || [])[0];

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
            '</div>' +
            '<div class="album-stats">' +
              stat(text.currentStat, currentPhotos.length) +
              stat(text.completedStat, completedPhotos.length) +
              stat(text.totalStat, currentPhotos.length + completedPhotos.length) +
            '</div>' +
          '</div>' +
          albumPart("album-current", text.currentTitle, text.currentText, currentPhotos) +
          albumPart("album-completed", text.completedTitle, text.completedText, completedPhotos) +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
