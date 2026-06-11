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

  function applyProjectSettingsCms(settings) {
    if (!settings || typeof settings !== "object" || Array.isArray(settings)) return;
    if (typeof settings.featuredProjectId === "string" && settings.featuredProjectId) {
      site.content.featuredProjectId = settings.featuredProjectId;
    }
    if (Array.isArray(settings.activeProjectIds)) {
      site.content.activeProjectIds = settings.activeProjectIds.slice();
    }
    if (Array.isArray(settings.completedGallery)) {
      site.content.completedGallery = settings.completedGallery.slice();
    }
  }

  function applyProjectStatusesAndOrder() {
    if (!Array.isArray(site.content.projects) || typeof site.content.activeProjectIds === "undefined") return;

    var activeProjectIds = site.content.activeProjectIds || [];
    var projectStatusLabels = {
      current: { hy: "\u0538\u0576\u0569\u0561\u0581\u056b\u056f", en: "In progress", ru: "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435" },
      completed: { hy: "\u0531\u057e\u0561\u0580\u057f\u057e\u0561\u056e", en: "Completed", ru: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e" }
    };
    var originalOrder = {};

    site.content.projects.forEach(function (project, index) {
      originalOrder[project.id] = index;
      var isCurrent = activeProjectIds.indexOf(project.id) >= 0;
      project.status = isCurrent ? "current" : "completed";
      project.statusLabels = projectStatusLabels[project.status];
    });

    site.content.projects.sort(function (a, b) {
      var activeA = activeProjectIds.indexOf(a.id);
      var activeB = activeProjectIds.indexOf(b.id);
      if (activeA >= 0 || activeB >= 0) {
        return (activeA >= 0 ? activeA : activeProjectIds.length + originalOrder[a.id]) -
          (activeB >= 0 ? activeB : activeProjectIds.length + originalOrder[b.id]);
      }
      return originalOrder[a.id] - originalOrder[b.id];
    });
  }

  function applyProjectsCms(projects) {
    if (Array.isArray(projects) && projects.length) {
      site.content.projects = mergeArrayById(site.content.projects || [], projects, "id");
    }
    applyProjectStatusesAndOrder();
  }

  function applyPartnersCms(partners) {
    if (!partners || typeof partners !== "object" || Array.isArray(partners)) return;
    if (Array.isArray(partners.partners)) {
      site.content.partners = partners.partners.slice();
    }
    if (Array.isArray(partners.technologyPartners)) {
      site.content.technologyPartners = partners.technologyPartners.slice();
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
      if (collections.projectSettings) {
        applyProjectSettingsCms(collections.projectSettings);
      }
      if (collections.projects || collections.projectSettings) {
        applyProjectsCms(collections.projects || []);
      }
      if (collections.team) {
        site.content.team = mergeArrayById(site.content.team || [], collections.team, "id");
      }
      if (collections.partners) {
        applyPartnersCms(collections.partners);
      }
      if (collections.navigation) {
        site.content.navigation = collections.navigation.slice();
      }
      if (collections.seoLandings && window) {
        window.SmartTechSeoLandings = collections.seoLandings.slice();
      }
      if (collections.seoArticles && window) {
        window.SmartTechSeoArticles = collections.seoArticles.slice();
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
