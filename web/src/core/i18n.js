(function (site) {
  var storageKey = "smarttech.language.v3";
  var fallbackLanguage = "hy";
  var availableLanguages = ["hy", "en", "ru"];

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
    var lang = normalizeLanguage(site.i18n.language);
    var value = getPath(activeDictionary(), path);
    if (value == null && lang === "ru" && site.content.locales.en) {
      value = getPath(site.content.locales.en, path);
    }
    if (value == null) {
      value = getPath(site.content.locales[fallbackLanguage], path);
    }
    return value == null ? fallback : value;
  }

  function service(baseService) {
    if (site.i18n.language === fallbackLanguage) {
      return baseService;
    }
    var translated = get("services." + baseService.id, null);
    if (!translated || typeof translated !== "object") {
      translated = {};
    }
    return Object.assign({}, baseService, translated);
  }

  function project(baseProject) {
    if (site.i18n.language === fallbackLanguage) {
      return baseProject;
    }
    if (baseProject.translations && baseProject.translations[site.i18n.language]) {
      return Object.assign({}, baseProject, baseProject.translations[site.i18n.language]);
    }
    var translated = get("projects." + baseProject.id, {});
    return Object.assign({}, baseProject, translated);
  }

  function pickLanguageDictionary(dictionaries, language) {
    var lang = normalizeLanguage(language || site.i18n.language);
    if (!dictionaries) return {};
    if (dictionaries[lang]) return dictionaries[lang];
    if (lang !== "hy" && dictionaries.en) return dictionaries.en;
    return dictionaries.hy || dictionaries.en || {};
  }

  function secondaryLanguageDictionary(dictionaries, language) {
    var lang = normalizeLanguage(language || site.i18n.language);
    if (!dictionaries) return {};
    if (lang === "hy") return dictionaries.en || dictionaries.hy || {};
    return dictionaries.en || dictionaries.hy || {};
  }

  function teamMember(baseMember) {
    if (site.i18n.language === fallbackLanguage) {
      return baseMember;
    }
    var translated = get("team." + baseMember.id, {});
    var merged = Object.assign({}, baseMember);
    if (translated.title) merged.title = translated.title;
    if (translated.text) merged.text = translated.text;
    if (translated.level) merged.level = translated.level;
    if (translated.experience) merged.experience = translated.experience;
    if (translated.workInfo) merged.workInfo = translated.workInfo;
    return merged;
  }

  site.i18n = {
    language: getSavedLanguage(),
    languages: availableLanguages,
    get: get,
    setLanguage: setLanguage,
    pickLanguageDictionary: pickLanguageDictionary,
    secondaryLanguageDictionary: secondaryLanguageDictionary,
    service: service,
    project: project,
    teamMember: teamMember
  };
})(window.SmartTech);
