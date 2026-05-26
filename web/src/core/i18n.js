(function (site) {
  var storageKey = "smarttech.language";
  var fallbackLanguage = "hy";
  var availableLanguages = ["hy", "en", "ru", "be", "fr", "ka"];

  function normalizeLanguage(language) {
    return availableLanguages.indexOf(language) >= 0 ? language : fallbackLanguage;
  }

  function getSavedLanguage() {
    try {
      var queryLanguage = new URLSearchParams(window.location.search).get("lang");
      if (queryLanguage) {
        return normalizeLanguage(queryLanguage);
      }
      return normalizeLanguage(window.localStorage.getItem(storageKey) || fallbackLanguage);
    } catch (error) {
      return fallbackLanguage;
    }
  }

  function setLanguage(language) {
    var nextLanguage = normalizeLanguage(language);
    try {
      window.localStorage.setItem(storageKey, nextLanguage);
    } catch (error) {
      // The site still works when storage is blocked.
    }
    site.i18n.language = nextLanguage;
  }

  function activeDictionary() {
    return site.content.locales[site.i18n.language] || site.content.locales[fallbackLanguage];
  }

  function getPath(source, path) {
    return path.split(".").reduce(function (value, key) {
      return value && value[key] != null ? value[key] : undefined;
    }, source);
  }

  function get(path, fallback) {
    var value = getPath(activeDictionary(), path);
    if (value == null) {
      value = getPath(site.content.locales[fallbackLanguage], path);
    }
    return value == null ? fallback : value;
  }

  function service(baseService) {
    if (site.i18n.language === fallbackLanguage) {
      return baseService;
    }
    var translated = get("services." + baseService.id, {});
    return Object.assign({}, baseService, translated);
  }

  function project(baseProject) {
    if (site.i18n.language === fallbackLanguage) {
      return baseProject;
    }
    var translated = get("projects." + baseProject.id, {});
    return Object.assign({}, baseProject, translated);
  }

  function teamMember(baseMember) {
    var translated = get("team." + baseMember.id, {});
    return Object.assign({}, baseMember, translated);
  }

  site.i18n = {
    language: getSavedLanguage(),
    languages: availableLanguages,
    get: get,
    setLanguage: setLanguage,
    service: service,
    project: project,
    teamMember: teamMember
  };
})(window.SmartTech);
