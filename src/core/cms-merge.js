(function (site) {
  function deepMerge(target, source) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return source;
    }

    var output = Object.assign({}, target && typeof target === "object" && !Array.isArray(target) ? target : {});
    Object.keys(source).forEach(function (key) {
      var next = source[key];
      if (next && typeof next === "object" && !Array.isArray(next) &&
        output[key] && typeof output[key] === "object" && !Array.isArray(output[key])) {
        output[key] = deepMerge(output[key], next);
      } else if (next !== undefined) {
        output[key] = next;
      }
    });
    return output;
  }

  function mergeArrayById(baseArray, patches, idField) {
    if (!Array.isArray(patches) || !patches.length) {
      return Array.isArray(baseArray) ? baseArray : [];
    }

    var base = Array.isArray(baseArray) ? baseArray : [];
    var byId = {};
    base.forEach(function (item) {
      if (item && item[idField]) byId[item[idField]] = item;
    });

    patches.forEach(function (patch) {
      if (!patch || !patch[idField]) return;
      byId[patch[idField]] = deepMerge(byId[patch[idField]] || { id: patch[idField] }, patch);
    });

    var seen = {};
    var merged = base.map(function (item) {
      seen[item[idField]] = true;
      return byId[item[idField]] || item;
    });

    patches.forEach(function (patch) {
      if (patch && patch[idField] && !seen[patch[idField]]) {
        merged.push(byId[patch[idField]]);
      }
    });

    return merged;
  }

  function applyProjectsCms(projects) {
    if (!Array.isArray(projects) || !projects.length) return;
    site.content.projects = mergeArrayById(site.content.projects || [], projects, "id");
    if (typeof site.content.activeProjectIds !== "undefined") {
      var activeProjectIds = site.content.activeProjectIds || [];
      var projectStatusLabels = {
        current: { hy: "Ընթացիկ", en: "In progress", ru: "В работе" },
        completed: { hy: "Ավարտված", en: "Completed", ru: "Завершено" }
      };
      site.content.projects.forEach(function (project) {
        var isCurrent = activeProjectIds.indexOf(project.id) >= 0;
        project.status = isCurrent ? "current" : "completed";
        project.statusLabels = projectStatusLabels[project.status];
      });
    }
  }

  site.cms = {
    loaded: false,
    signature: "",
    apply: function applyCmsPayload(payload) {
      if (!payload || !payload.collections) return;

      var collections = payload.collections;
      if (collections.contacts) {
        site.content.contacts = deepMerge(site.content.contacts || {}, collections.contacts);
      }
      if (collections.company) {
        site.content.company = deepMerge(site.content.company || {}, collections.company);
      }
      if (collections.services) {
        site.content.services = mergeArrayById(site.content.services || [], collections.services, "id");
      }
      if (collections.projects) {
        applyProjectsCms(collections.projects);
      }
      if (collections.locales) {
        ["hy", "en", "ru"].forEach(function (lang) {
          if (!collections.locales[lang]) return;
          site.content.locales[lang] = deepMerge(site.content.locales[lang] || {}, collections.locales[lang]);
        });
      }

      site.cms.loaded = true;
      site.cms.signature = JSON.stringify(payload.collections);
    }
  };
})(window.SmartTech);
