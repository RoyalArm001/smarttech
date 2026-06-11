(function (window) {
  "use strict";

  var state = {
    collections: [],
    activeId: "contacts",
    data: {},
    meta: null,
    dirty: false,
    initialized: false
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function setStatus(message, isError) {
    if (typeof window.adminSetStatus === "function") {
      window.adminSetStatus(message, isError);
    }
  }

  function requestJson(url, options) {
    if (typeof window.adminRequestJson !== "function") {
      return Promise.reject(new Error("Admin session is not ready"));
    }
    return window.adminRequestJson(url, options);
  }

  function prettyJson(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      return "{}";
    }
  }

  function parseJsonInput(text, fallback) {
    var trimmed = String(text || "").trim();
    if (!trimmed) return fallback;
    return JSON.parse(trimmed);
  }

  function isArrayCollection(id) {
    return ["services", "projects", "team", "navigation", "seoLandings", "seoArticles"].indexOf(id) >= 0;
  }

  function contactsTemplate(data) {
    data = data || {};
    var phones = Array.isArray(data.phones) && data.phones.length ? data.phones : [{ label: "", number: "" }];
    var socials = Array.isArray(data.socials) && data.socials.length ? data.socials : [{ label: "", href: "" }];

    function phoneRows() {
      return phones.map(function (phone, index) {
        return '' +
          '<div class="cms-repeat-row" data-phone-row="' + index + '">' +
            '<label><span>Label</span><input type="text" data-field="phones.' + index + '.label" value="' + escapeHtml(phone.label || "") + '"></label>' +
            '<label><span>Number</span><input type="text" data-field="phones.' + index + '.number" value="' + escapeHtml(phone.number || "") + '"></label>' +
          '</div>';
      }).join("");
    }

    function socialRows() {
      return socials.map(function (social, index) {
        return '' +
          '<div class="cms-repeat-row" data-social-row="' + index + '">' +
            '<label><span>Label</span><input type="text" data-field="socials.' + index + '.label" value="' + escapeHtml(social.label || "") + '"></label>' +
            '<label><span>URL</span><input type="url" data-field="socials.' + index + '.href" value="' + escapeHtml(social.href || "") + '"></label>' +
          '</div>';
      }).join("");
    }

    return '' +
      '<form class="cms-form" id="cms-contacts-form">' +
        '<label><span>Email</span><input type="email" data-field="email" value="' + escapeHtml(data.email || "") + '"></label>' +
        '<label><span>Address (EN)</span><input type="text" data-field="address" value="' + escapeHtml(data.address || "") + '"></label>' +
        '<label><span>Address (HY)</span><input type="text" data-field="addressHy" value="' + escapeHtml(data.addressHy || "") + '"></label>' +
        '<div class="cms-repeat-block"><div class="cms-repeat-head"><strong>Phones</strong></div>' + phoneRows() + '</div>' +
        '<div class="cms-repeat-block"><div class="cms-repeat-head"><strong>Social links</strong></div>' + socialRows() + '</div>' +
        '<div class="cms-form-actions">' +
          '<button type="submit" class="cms-button cms-button-primary">Save contacts</button>' +
          '<button type="button" class="cms-button cms-button-muted" data-cms-reset>Reset CMS override</button>' +
        '</div>' +
      '</form>';
  }

  function companyTemplate(data) {
    data = data || {};
    var stats = Array.isArray(data.stats) && data.stats.length ? data.stats : [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }];
    var about = Array.isArray(data.about) ? data.about.join("\n\n") : "";

    function statRows() {
      return stats.map(function (item, index) {
        return '' +
          '<div class="cms-repeat-row" data-stat-row="' + index + '">' +
            '<label><span>Value</span><input type="text" data-field="stats.' + index + '.value" value="' + escapeHtml(item.value || "") + '"></label>' +
            '<label><span>Label</span><input type="text" data-field="stats.' + index + '.label" value="' + escapeHtml(item.label || "") + '"></label>' +
          '</div>';
      }).join("");
    }

    return '' +
      '<form class="cms-form" id="cms-company-form">' +
        '<label><span>Public name</span><input type="text" data-field="name" value="' + escapeHtml(data.name || "") + '"></label>' +
        '<label><span>Hero title</span><input type="text" data-field="heroTitle" value="' + escapeHtml(data.heroTitle || "") + '"></label>' +
        '<label><span>Hero lead</span><textarea rows="4" data-field="heroLead">' + escapeHtml(data.heroLead || "") + '</textarea></label>' +
        '<label><span>Tagline</span><input type="text" data-field="tagline" value="' + escapeHtml(data.tagline || "") + '"></label>' +
        '<label><span>Description</span><textarea rows="3" data-field="description">' + escapeHtml(data.description || "") + '</textarea></label>' +
        '<div class="cms-repeat-block"><div class="cms-repeat-head"><strong>Homepage stats</strong></div>' + statRows() + '</div>' +
        '<label><span>About paragraphs (blank line between paragraphs)</span><textarea rows="8" data-field="aboutText">' + escapeHtml(about) + '</textarea></label>' +
        '<div class="cms-form-actions">' +
          '<button type="submit" class="cms-button cms-button-primary">Save company</button>' +
          '<button type="button" class="cms-button cms-button-muted" data-cms-reset>Reset CMS override</button>' +
        '</div>' +
      '</form>';
  }

  function jsonEditorTemplate(id, data, meta) {
    return '' +
      '<form class="cms-form cms-json-form" id="cms-json-form">' +
        '<p class="cms-json-help">' + escapeHtml(meta.description || "") + '</p>' +
        '<label><span>JSON override</span><textarea class="cms-json-editor" rows="22" spellcheck="false">' + escapeHtml(prettyJson(data)) + '</textarea></label>' +
        '<div class="cms-form-actions">' +
          '<button type="button" class="cms-button cms-button-muted" data-cms-format>Format JSON</button>' +
          '<button type="submit" class="cms-button cms-button-primary">Save ' + escapeHtml(meta.label || id) + '</button>' +
          '<button type="button" class="cms-button cms-button-muted" data-cms-reset>Reset CMS override</button>' +
        '</div>' +
      '</form>';
  }

  function readContactsForm(form) {
    var output = {
      email: form.querySelector('[data-field="email"]').value,
      address: form.querySelector('[data-field="address"]').value,
      addressHy: form.querySelector('[data-field="addressHy"]').value,
      phones: [],
      socials: []
    };

    form.querySelectorAll("[data-phone-row]").forEach(function (row) {
      var label = row.querySelector('[data-field$=".label"]').value;
      var number = row.querySelector('[data-field$=".number"]').value;
      if (number.trim()) output.phones.push({ label: label, number: number });
    });

    form.querySelectorAll("[data-social-row]").forEach(function (row) {
      var label = row.querySelector('[data-field$=".label"]').value;
      var href = row.querySelector('[data-field$=".href"]').value;
      if (href.trim()) output.socials.push({ label: label, href: href });
    });

    return output;
  }

  function readCompanyForm(form) {
    var output = {
      name: form.querySelector('[data-field="name"]').value,
      heroTitle: form.querySelector('[data-field="heroTitle"]').value,
      heroLead: form.querySelector('[data-field="heroLead"]').value,
      tagline: form.querySelector('[data-field="tagline"]').value,
      description: form.querySelector('[data-field="description"]').value,
      stats: [],
      about: []
    };

    form.querySelectorAll("[data-stat-row]").forEach(function (row) {
      var value = row.querySelector('[data-field$=".value"]').value;
      var label = row.querySelector('[data-field$=".label"]').value;
      if (value.trim() || label.trim()) output.stats.push({ value: value, label: label });
    });

    String(form.querySelector('[data-field="aboutText"]').value || "")
      .split(/\n\s*\n/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean)
      .forEach(function (paragraph) {
        output.about.push(paragraph);
      });

    return output;
  }

  function renderCollectionNav() {
    var nav = byId("cms-collection-nav");
    if (!nav) return;

    nav.innerHTML = state.collections.map(function (item) {
      var active = item.id === state.activeId ? " is-active" : "";
      var badge = item.hasData ? '<em>live</em>' : "";
      return '' +
        '<button type="button" class="cms-collection-item' + active + '" data-cms-collection="' + escapeHtml(item.id) + '">' +
          '<strong>' + escapeHtml(item.label) + '</strong>' +
          '<span>' + escapeHtml(item.description) + '</span>' +
          badge +
        '</button>';
    }).join("");
  }

  function renderEditor() {
    var panel = byId("cms-editor-panel");
    var title = byId("cms-editor-title");
    var subtitle = byId("cms-editor-subtitle");
    if (!panel || !state.meta) return;

    if (title) title.textContent = state.meta.label || state.activeId;
    if (subtitle) subtitle.textContent = state.meta.description || "";

    if (state.activeId === "contacts") {
      panel.innerHTML = contactsTemplate(state.data);
    } else if (state.activeId === "company") {
      panel.innerHTML = companyTemplate(state.data);
    } else {
      panel.innerHTML = jsonEditorTemplate(state.activeId, state.data, state.meta);
    }

    bindEditorEvents();
  }

  function bindEditorEvents() {
    var panel = byId("cms-editor-panel");
    if (!panel) return;

    var form = panel.querySelector("form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        saveActiveCollection(form);
      });
    }

    panel.querySelectorAll("[data-cms-reset]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!window.confirm("Remove CMS override for " + state.activeId + "? The site will fall back to files in src/content.")) return;
        resetActiveCollection();
      });
    });

    var formatButton = panel.querySelector("[data-cms-format]");
    if (formatButton) {
      formatButton.addEventListener("click", function () {
        var textarea = panel.querySelector(".cms-json-editor");
        if (!textarea) return;
        try {
          textarea.value = prettyJson(parseJsonInput(textarea.value, {}));
          setStatus("JSON formatted.");
        } catch (error) {
          setStatus(error.message, true);
        }
      });
    }
  }

  function saveActiveCollection(form) {
    var payload;

    try {
      if (state.activeId === "contacts") {
        payload = readContactsForm(form);
      } else if (state.activeId === "company") {
        payload = readCompanyForm(form);
      } else {
        payload = parseJsonInput(form.querySelector(".cms-json-editor").value, isArrayCollection(state.activeId) ? [] : {});
      }
    } catch (error) {
      setStatus(error.message, true);
      return;
    }

    setStatus("Saving CMS content...");
    requestJson("/api/admin/cms/" + encodeURIComponent(state.activeId), {
      method: "PUT",
      body: payload
    }).then(function (response) {
      state.data = response.data || payload;
      state.dirty = false;
      if (Array.isArray(response.collections)) {
        state.collections = response.collections;
        renderCollectionNav();
      }
      setStatus((state.meta.label || state.activeId) + " saved. Refresh the public site to see changes.");
    }).catch(function (error) {
      setStatus(error.message, true);
    });
  }

  function resetActiveCollection() {
    setStatus("Resetting CMS override...");
    requestJson("/api/admin/cms/" + encodeURIComponent(state.activeId), {
      method: "DELETE"
    }).then(function (response) {
      if (Array.isArray(response.collections)) {
        state.collections = response.collections;
      }
      return loadCollection(state.activeId);
    }).then(function () {
      setStatus("CMS override removed.");
    }).catch(function (error) {
      setStatus(error.message, true);
    });
  }

  function loadCollection(id) {
    state.activeId = id;
    renderCollectionNav();
    return requestJson("/api/admin/cms/" + encodeURIComponent(id)).then(function (payload) {
      state.meta = payload.meta || null;
      state.data = payload.data || (isArrayCollection(id) ? [] : {});
      renderEditor();
    });
  }

  function loadCollections() {
    return requestJson("/api/admin/cms").then(function (payload) {
      state.collections = payload.collections || [];
      renderCollectionNav();
      var preferred = state.collections.some(function (item) { return item.id === state.activeId; })
        ? state.activeId
        : ((state.collections[0] && state.collections[0].id) || "contacts");
      return loadCollection(preferred);
    });
  }

  function bindNav() {
    var nav = byId("cms-collection-nav");
    if (!nav) return;
    nav.addEventListener("click", function (event) {
      var button = event.target.closest("[data-cms-collection]");
      if (!button) return;
      var id = button.getAttribute("data-cms-collection");
      if (!id || id === state.activeId) return;
      loadCollection(id).catch(function (error) {
        setStatus(error.message, true);
      });
    });
  }

  function openCmsWorkspace() {
    if (!state.collections.length) {
      loadCollections().catch(function (error) {
        setStatus(error.message, true);
      });
    }
  }

  window.SmartTechAdminCms = {
    init: function initCms() {
      if (state.initialized) return;
      state.initialized = true;
      bindNav();
    },
    open: openCmsWorkspace,
    reload: function reloadCms() {
      return loadCollections();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.SmartTechAdminCms.init);
  } else {
    window.SmartTechAdminCms.init();
  }
})(window);
