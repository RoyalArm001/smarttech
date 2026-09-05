(function (window) {
  "use strict";

  var state = {
    collections: [],
    activeId: "projects",
    data: [],
    meta: null,
    entityIndex: 0,
    language: "hy",
    locales: {},
    initialized: false
  };

  var schemas = {
    projects: {
      singular: "նախագիծ / պրոդուկտ",
      folder: "projects",
      defaults: { id: "", title: "", status: "current", stage: "", phase: "", order: 0, featured: false, works: [], images: [], systemImages: [], translations: {} },
      fields: [
        { key: "id", label: "ID / slug", type: "text", required: true, hint: "Միայն լատինատառ․ օրինակ՝ new-project" },
        { key: "title", label: "Անվանում", type: "text", required: true },
        { key: "status", label: "Նախագծի ընդհանուր կարգավիճակ", type: "select", options: [["current", "Ընթացիկ — ցուցադրել առաջինը"], ["partial", "Մասամբ ավարտված — տեղափոխել հետին պլան"], ["completed", "Ավարտված"]] },
        { key: "stage", label: "Աշխատանքի փուլ", type: "select", hint: "Փուլն ընտրեք առանձին։ Նախագիծն ավարտված է միայն «Ավարտված» կարգավիճակը նշելուց հետո։", options: [["", "Փուլը նշված չէ"]].concat(window.SmartTech.projectStages.all.map(function (stage, index) { return [stage.id, (index + 1) + ". " + stage.labels.hy]; })) },
        { key: "phase", label: "Փուլի լրացուցիչ նկարագրություն", type: "text", hint: "Ոչ պարտադիր․ օրինակ՝ մալուխավորման կամ փորձարկման մանրամասներ" },
        { key: "order", label: "Հերթականություն", type: "number" },
        { key: "featured", label: "Ցուցադրել որպես գլխավոր նախագիծ", type: "checkbox", wide: true },
        { key: "works", label: "Աշխատանքներ (մեկը՝ յուրաքանչյուր տողում)", type: "lines", wide: true },
        { key: "images", label: "Նախագծի նկարներ", type: "images", wide: true },
        { key: "translations", label: "Լեզուներ և թարգմանություններ", type: "translations", wide: true }
      ]
    },
    services: {
      singular: "ծառայություն",
      folder: "services",
      defaults: { id: "", title: "", lead: "", tags: [], image: "", gallery: [] },
      fields: [
        { key: "id", label: "ID / slug", type: "text", required: true },
        { key: "title", label: "Վերնագիր", type: "text", required: true },
        { key: "lead", label: "Կարճ նկարագրություն", type: "textarea", wide: true },
        { key: "tags", label: "Առավելություններ / tags (մեկը՝ յուրաքանչյուր տողում)", type: "lines", wide: true },
        { key: "image", label: "Գլխավոր նկար", type: "image", wide: true },
        { key: "gallery", label: "Լրացուցիչ նկարներ", type: "images", wide: true }
      ]
    },
    team: {
      singular: "աշխատակից",
      folder: "team",
      defaults: { id: "", title: "", cardTitle: "", email: "", text: "", department: "", roleLevel: "specialist", managerId: "", order: 0, image: "", coverImage: "" },
      fields: [
        { key: "id", label: "ID / slug", type: "text", required: true },
        { key: "title", label: "Պաշտոն / անուն", type: "text", required: true },
        { key: "cardTitle", label: "Քարտի վերնագիր", type: "text" },
        { key: "email", label: "Էլ․ հասցե", type: "email" },
        { key: "department", label: "Բաժին", type: "text" },
        { key: "roleLevel", label: "Մակարդակ", type: "select", options: [["director", "Director"], ["manager", "Manager"], ["specialist", "Specialist"]] },
        { key: "managerId", label: "Ղեկավարի ID", type: "text" },
        { key: "order", label: "Հերթականություն", type: "number" },
        { key: "text", label: "Կենսագրություն / նկարագրություն", type: "textarea", wide: true },
        { key: "image", label: "Անձնական նկար", type: "image", wide: true },
        { key: "coverImage", label: "Cover նկար", type: "image", wide: true }
      ]
    },
    partners: partnerSchema("գործընկեր"),
    technologyPartners: partnerSchema("տեխնոլոգիական գործընկեր"),
    navigation: {
      singular: "մենյուի կետ",
      folder: "general",
      defaults: { href: "", label: "" },
      fields: [
        { key: "label", label: "Անվանում", type: "text" },
        { key: "href", label: "Հղում", type: "text", required: true }
      ]
    },
    seoLandings: {
      singular: "SEO էջ",
      folder: "general",
      defaults: { id: "", title: "", description: "", image: "" },
      fields: [
        { key: "id", label: "ID / slug", type: "text", required: true },
        { key: "title", label: "Վերնագիր", type: "text", required: true },
        { key: "description", label: "Meta description", type: "textarea", wide: true },
        { key: "image", label: "Նկար", type: "image", wide: true },
        { key: "content", label: "Մանրամասն տվյալներ (JSON)", type: "json", wide: true }
      ]
    },
    seoArticles: {
      singular: "հոդված",
      folder: "general",
      defaults: { id: "", title: "", description: "", image: "" },
      fields: [
        { key: "id", label: "ID / slug", type: "text", required: true },
        { key: "title", label: "Վերնագիր", type: "text", required: true },
        { key: "description", label: "Կարճ նկարագրություն", type: "textarea", wide: true },
        { key: "image", label: "Նկար", type: "image", wide: true },
        { key: "sections", label: "Հոդվածի բաժիններ (JSON)", type: "json", wide: true }
      ]
    }
  };

  function partnerSchema(singular) {
    return {
      singular: singular,
      folder: "partners",
      defaults: { name: "", logo: "" },
      fields: [
        { key: "name", label: "Անվանում", type: "text", required: true },
        { key: "logo", label: "Լոգո", type: "image", wide: true }
      ]
    };
  }

  function byId(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char];
    });
  }

  function setStatus(message, isError) {
    if (typeof window.adminSetStatus === "function") window.adminSetStatus(message, isError);
  }

  function requestJson(url, options) {
    if (typeof window.adminRequestJson !== "function") return Promise.reject(new Error("Admin session is not ready"));
    return window.adminRequestJson(url, options);
  }

  function prettyJson(value) {
    try { return JSON.stringify(value == null ? {} : value, null, 2); } catch (error) { return "{}"; }
  }

  function splitLines(value) {
    if (Array.isArray(value)) return value;
    return String(value || "").split(/\r?\n/).map(function (item) { return item.trim(); }).filter(Boolean);
  }

  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(String(reader.result || "")); };
      reader.onerror = function () { reject(new Error("Նկարը չհաջողվեց կարդալ")); };
      reader.readAsDataURL(file);
    });
  }

  function renderCollectionNav() {
    var nav = byId("cms-collection-nav");
    if (!nav) return;
    nav.innerHTML = state.collections.map(function (item) {
      var active = item.id === state.activeId ? " is-active" : "";
      return '<button type="button" class="cms-collection-item' + active + '" data-cms-collection="' + escapeHtml(item.id) + '">' +
        '<strong>' + escapeHtml(item.label || item.id) + '</strong>' +
        '<span>' + escapeHtml(item.description || "") + '</span>' +
        (item.hasData ? '<em>live</em>' : "") + '</button>';
    }).join("");
  }

  function contactsTemplate(data) {
    data = data || {};
    return '<form class="cms-form" id="cms-object-form" data-object-kind="contacts"><div class="cms-form-grid">' +
      fieldHtml({ key: "email", label: "Էլ․ հասցե", type: "email", wide: true }, data.email) +
      fieldHtml({ key: "addressHy", label: "Հասցե (HY)", type: "text", wide: true }, data.addressHy) +
      fieldHtml({ key: "address", label: "Հասցե (EN)", type: "text", wide: true }, data.address) +
      fieldHtml({ key: "phones", label: "Հեռախոսներ (JSON)", type: "json", wide: true }, data.phones || []) +
      fieldHtml({ key: "socials", label: "Սոցիալական հղումներ (JSON)", type: "json", wide: true }, data.socials || []) +
      '</div>' + formActions(false) + '</form>';
  }

  function companyTemplate(data) {
    data = data || {};
    return '<form class="cms-form" id="cms-object-form" data-object-kind="company"><div class="cms-form-grid">' +
      fieldHtml({ key: "name", label: "Հրապարակային անուն", type: "text" }, data.name) +
      fieldHtml({ key: "legalName", label: "Իրավաբանական անուն", type: "text" }, data.legalName) +
      fieldHtml({ key: "heroTitle", label: "Գլխավոր վերնագիր", type: "text", wide: true }, data.heroTitle) +
      fieldHtml({ key: "heroLead", label: "Գլխավոր նկարագրություն", type: "textarea", wide: true }, data.heroLead) +
      fieldHtml({ key: "tagline", label: "Կարգախոս", type: "text", wide: true }, data.tagline) +
      fieldHtml({ key: "description", label: "Ընկերության նկարագրություն", type: "textarea", wide: true }, data.description) +
      fieldHtml({ key: "about", label: "Մեր մասին պարբերություններ (JSON)", type: "json", wide: true }, data.about || []) +
      fieldHtml({ key: "stats", label: "Գլխավոր թվեր (JSON)", type: "json", wide: true }, data.stats || []) +
      fieldHtml({ key: "heroImages", label: "Գլխավոր նկարներ", type: "images", wide: true }, data.heroImages || []) +
      '</div>' + formActions(false) + '</form>';
  }

  function fieldHtml(field, value) {
    var wide = field.wide ? " cms-span-2" : "";
    var required = field.required ? " required" : "";
    var hint = field.hint ? '<small>' + escapeHtml(field.hint) + '</small>' : "";
    if (field.type === "checkbox") {
      return '<label class="' + wide.trim() + '"><span><input type="checkbox" data-entity-field="' + escapeHtml(field.key) + '"' + (value ? " checked" : "") + '> ' + escapeHtml(field.label) + '</span></label>';
    }
    if (field.type === "select") {
      return '<label class="' + wide.trim() + '"><span>' + escapeHtml(field.label) + '</span><select data-entity-field="' + escapeHtml(field.key) + '">' +
        (field.options || []).map(function (option) { return '<option value="' + escapeHtml(option[0]) + '"' + (String(value) === String(option[0]) ? " selected" : "") + '>' + escapeHtml(option[1]) + '</option>'; }).join("") +
        '</select>' + hint + '</label>';
    }
    if (field.type === "images") {
      return '<div class="cms-image-field cms-gallery-field' + wide + '"><span>' + escapeHtml(field.label) + '</span>' +
        '<input type="hidden" data-entity-field="' + escapeHtml(field.key) + '" data-field-type="images" value="' + escapeHtml((Array.isArray(value) ? value : splitLines(String(value || ""))).join("\n")) + '">' +
        '<div class="cms-gallery-grid"></div><label class="cms-image-upload">+ Ավելացնել նկար<input type="file" accept="image/jpeg,image/png,image/webp" data-cms-upload="' + escapeHtml(field.key) + '"></label>' +
        '<small>Առաջին նկարը գլխավորն է։ Փոփոխություններից հետո սեղմեք պահպանել։</small></div>';
    }
    if (field.type === "textarea" || field.type === "lines" || field.type === "json" || field.type === "images") {
      var text = field.type === "json" ? prettyJson(value) : (Array.isArray(value) ? value.join("\n") : String(value || ""));
      var upload = field.type === "images" ? '<label class="cms-image-upload">+ Բեռնել նկար<input type="file" accept="image/jpeg,image/png,image/webp" data-cms-upload="' + escapeHtml(field.key) + '"></label>' : "";
      var textarea = '<label class="' + wide.trim() + '"><span>' + escapeHtml(field.label) + '</span><textarea rows="' + (field.type === "json" ? "8" : "5") + '" data-entity-field="' + escapeHtml(field.key) + '" data-field-type="' + escapeHtml(field.type) + '"' + required + '>' + escapeHtml(text) + '</textarea>' + hint + '</label>';
      return field.type === "images" ? '<div class="cms-image-field ' + wide.trim() + '">' + textarea + upload + '</div>' : textarea;
    }
    if (field.type === "image") {
      var imageValue = String(value || "");
      return '<div class="cms-image-field ' + wide.trim() + '"><label><span>' + escapeHtml(field.label) + '</span><input type="text" data-entity-field="' + escapeHtml(field.key) + '" data-field-type="image" value="' + escapeHtml(imageValue) + '"' + required + '></label>' +
        '<label class="cms-image-upload">Փոխել նկարը<input type="file" accept="image/jpeg,image/png,image/webp" data-cms-upload="' + escapeHtml(field.key) + '"></label>' +
        (imageValue ? '<img class="cms-image-preview cms-span-2" src="' + escapeHtml(imageValue) + '" alt="">' : "") + '</div>';
    }
    var numberAttrs = field.type === "number"
      ? (field.min != null ? ' min="' + escapeHtml(field.min) + '"' : "") +
        (field.max != null ? ' max="' + escapeHtml(field.max) + '"' : "") +
        (field.step != null ? ' step="' + escapeHtml(field.step) + '"' : "")
      : "";
    return '<label class="' + wide.trim() + '"><span>' + escapeHtml(field.label) + '</span><input type="' + escapeHtml(field.type || "text") + '" data-entity-field="' + escapeHtml(field.key) + '" value="' + escapeHtml(value == null ? "" : value) + '"' + numberAttrs + required + '>' + hint + '</label>';
  }

  function formActions(allowReset) {
    return '<div class="cms-form-actions"><button type="submit" class="cms-button cms-button-primary">Պահպանել փոփոխությունները</button>' +
      (allowReset ? '<button type="button" class="cms-button cms-button-muted" data-cms-reset>Վերականգնել նախնականը</button>' : "") + '</div>';
  }

  function entityName(item, index) {
    return item && (item.title || item.name || item.cardTitle || item.label || item.id || item.href) || ("Նոր գրառում " + (index + 1));
  }

  function entityMeta(item) {
    if (state.activeId !== "projects") return item.id || item.href || item.email || "";
    var labels = { current: "Ընթացիկ", partial: "Մասամբ ավարտված", completed: "Ավարտված" };
    var stage = window.SmartTech.projectStages.label(item, "hy");
    return (labels[item.status] || labels.current) + (stage ? " · " + stage : "");
  }

  var projectTextKeys = ["title", "phase", "works"];
  var languages = [["hy", "Հայերեն"], ["en", "English"], ["ru", "Русский"]];

  function projectTranslationsHtml(item) {
    var tabs = languages.map(function (language) {
      var active = state.language === language[0];
      return '<button type="button" role="tab" id="cms-language-' + language[0] + '" aria-controls="cms-language-panel-' + language[0] + '" aria-selected="' + active + '" tabindex="' + (active ? '0' : '-1') + '" data-cms-language="' + language[0] + '">' + language[1] + '</button>';
    }).join("");
    var panels = languages.map(function (language) {
      var lang = language[0];
      var translation = lang === "hy" ? item : (item.translations && item.translations[lang] || {});
      var dictionary = state.locales[lang] && state.locales[lang].projects && state.locales[lang].projects[item.id] || {};
      var fields = schemas.projects.fields.filter(function (field) { return projectTextKeys.indexOf(field.key) >= 0; }).map(function (field) {
        if (lang === "hy") return fieldHtml(field, item[field.key]);
        var fallback = dictionary[field.key] || item[field.key] || "";
        var value = translation[field.key] || "";
        var attrs = ' lang="' + lang + '" data-translation-language="' + lang + '" data-translation-key="' + field.key + '" placeholder="' + escapeHtml(Array.isArray(fallback) ? fallback.join("\n") : fallback) + '"';
        var control = field.type === "lines"
          ? '<textarea rows="4"' + attrs + '>' + escapeHtml(Array.isArray(value) ? value.join("\n") : value) + '</textarea>'
          : '<input type="text"' + attrs + ' value="' + escapeHtml(value) + '">';
        return '<label class="cms-span-2"><span>' + escapeHtml(field.label) + '</span>' + control + '</label>';
      }).join("");
      return '<section role="tabpanel" id="cms-language-panel-' + lang + '" aria-labelledby="cms-language-' + lang + '" data-cms-language-panel="' + lang + '"' + (state.language === lang ? '' : ' hidden') + '><div class="cms-form-grid">' + fields + '</div></section>';
    }).join("");
    return '<div class="cms-translations cms-span-2"><h3>Լեզուներ և թարգմանություններ</h3><p>Գրեք հայերեն և պահպանեք։ Փոփոխված տեքստերի անգլերեն ու ռուսերեն թարգմանությունները կստեղծվեն ավտոմատ։ Դրանք կարող եք նաև խմբագրել համապատասխան լեզվի պատուհանում։ Հայերենը նորից փոխելիս այդ դաշտերի թարգմանությունները կթարմացվեն։</p><div class="cms-language-tabs" role="tablist" aria-label="Խմբագրման լեզու">' + tabs + '</div>' + panels + '</div>';
  }

  function readProjectTranslations(form, base) {
    // Preserve other languages and fields not exposed by this editor.
    var output = Object.assign({}, base || {});
    ["en", "ru"].forEach(function (lang) {
      var translation = Object.assign({}, output[lang] || {});
      form.querySelectorAll('[data-translation-language="' + lang + '"]').forEach(function (control) {
        var key = control.getAttribute("data-translation-key");
        var value = key === "works" ? splitLines(control.value) : control.value.trim();
        if (value.length) translation[key] = value;
        else delete translation[key];
      });
      if (Object.keys(translation).length) output[lang] = translation;
      else delete output[lang];
    });
    return output;
  }

  function arrayEditorTemplate(data, schema) {
    var items = Array.isArray(data) ? data : [];
    if (state.entityIndex >= items.length) state.entityIndex = Math.max(0, items.length - 1);
    var current = items[state.entityIndex];
    var list = items.map(function (item, index) {
      return '<button type="button" class="cms-entity-item' + (index === state.entityIndex ? " is-active" : "") + '" data-entity-index="' + index + '"><strong>' + escapeHtml(entityName(item, index)) + '</strong><small>' + escapeHtml(entityMeta(item)) + '</small></button>';
    }).join("");
    var editor = current ? '<form class="cms-form" id="cms-entity-form" data-entity-index="' + state.entityIndex + '"><div class="cms-form-grid">' +
      schema.fields.map(function (field) {
        if (field.type === "translations") return projectTranslationsHtml(current);
        if (state.activeId === "projects" && projectTextKeys.indexOf(field.key) >= 0) return "";
        return fieldHtml(field, field.key === "stage" ? window.SmartTech.projectStages.selected(current) : current[field.key]);
      }).join("") +
      '</div><div class="cms-form-actions"><button type="submit" class="cms-button cms-button-primary">Պահպանել ամբողջ բաժինը</button><button type="button" class="cms-button cms-danger" data-delete-entity>Ջնջել այս ' + escapeHtml(schema.singular) + '</button></div></form>' :
      '<div class="cms-entity-empty"><p>Այս բաժնում գրառում չկա։<br>Սեղմեք «+ Ավելացնել»։</p><button type="button" class="cms-button cms-button-primary" data-save-empty>Պահպանել դատարկ բաժինը</button></div>';
    return '<div class="cms-entity-shell"><aside class="cms-entity-list-panel"><div class="cms-entity-toolbar"><strong>Գրառումներ (' + items.length + ')</strong><button type="button" class="cms-add-item" data-add-entity>+ Ավելացնել</button></div><div class="cms-entity-list">' + list + '</div></aside><div class="cms-entity-editor">' + editor + '</div></div>';
  }

  function simpleListTemplate(data) {
    return '<form class="cms-form" id="cms-simple-list-form"><label><span>Արժեքներ (մեկը՝ յուրաքանչյուր տողում)</span><textarea rows="18" data-simple-list>' + escapeHtml((Array.isArray(data) ? data : []).join("\n")) + '</textarea></label>' + formActions(false) + '</form>';
  }

  function jsonEditorTemplate(data) {
    return '<form class="cms-form" id="cms-json-form"><p class="cms-json-help">Այս բաժինը ունի ընդլայնված կառուցվածք։ Փոփոխելուց առաջ պահպանեք ճիշտ JSON ձևաչափը։</p><label><span>Մանրամասն JSON կարգավորում</span><textarea class="cms-json-editor" rows="24" spellcheck="false">' + escapeHtml(prettyJson(data)) + '</textarea></label><div class="cms-form-actions"><button type="button" class="cms-button cms-button-muted" data-cms-format>Կարգավորել JSON-ը</button><button type="submit" class="cms-button cms-button-primary">Պահպանել</button></div></form>';
  }

  function renderEditor() {
    var panel = byId("cms-editor-panel");
    var title = byId("cms-editor-title");
    var subtitle = byId("cms-editor-subtitle");
    if (!panel || !state.meta) return;
    if (title) title.textContent = state.meta.label || state.activeId;
    if (subtitle) subtitle.textContent = state.meta.description || "";
    if (state.activeId === "contacts") panel.innerHTML = contactsTemplate(state.data);
    else if (state.activeId === "company") panel.innerHTML = companyTemplate(state.data);
    else if (schemas[state.activeId]) panel.innerHTML = arrayEditorTemplate(state.data, schemas[state.activeId]);
    else if (state.activeId === "activeProjectIds" || state.activeId === "completedGallery") panel.innerHTML = simpleListTemplate(state.data);
    else panel.innerHTML = jsonEditorTemplate(state.data);
    bindEditorEvents();
  }

  function readFields(form, schema, base) {
    var output = Object.assign({}, base || {});
    schema.fields.forEach(function (field) {
      if (field.type === "translations") {
        output.translations = readProjectTranslations(form, output.translations);
        return;
      }
      var control = form.querySelector('[data-entity-field="' + field.key + '"]');
      if (!control) return;
      if (field.type === "checkbox") output[field.key] = !!control.checked;
      else if (field.type === "number") {
        var numericValue = Number(control.value || 0);
        if (field.min != null) numericValue = Math.max(Number(field.min), numericValue);
        if (field.max != null) numericValue = Math.min(Number(field.max), numericValue);
        output[field.key] = numericValue;
      }
      else if (field.type === "lines" || field.type === "images") output[field.key] = splitLines(control.value);
      else if (field.type === "json") output[field.key] = JSON.parse(control.value || "{}");
      else output[field.key] = control.value.trim();
    });
    return output;
  }

  function commitEntityForm() {
    var form = byId("cms-entity-form");
    var schema = schemas[state.activeId];
    if (!form || !schema || !Array.isArray(state.data)) return;
    var index = Number(form.getAttribute("data-entity-index"));
    state.data[index] = readFields(form, schema, state.data[index]);
    if (state.activeId === "projects") state.data[index].stage = window.SmartTech.projectStages.selected(state.data[index]);
  }

  function readObjectForm(form) {
    var output = Object.assign({}, state.data || {});
    form.querySelectorAll("[data-entity-field]").forEach(function (control) {
      var key = control.getAttribute("data-entity-field");
      var type = control.getAttribute("data-field-type") || control.type;
      if (type === "json") output[key] = JSON.parse(control.value || "{}");
      else if (type === "images") output[key] = splitLines(control.value);
      else output[key] = control.value.trim();
    });
    return output;
  }

  function savePayload(payload) {
    setStatus("Փոփոխությունները պահպանվում են Supabase-ում...");
    return requestJson("/api/admin/cms/" + encodeURIComponent(state.activeId), { method: "PUT", body: payload })
      .then(function (response) {
        state.data = response.data != null ? response.data : payload;
        setStatus((state.meta.label || state.activeId) + " բաժինը պահպանված է։ Փոփոխությունը հասանելի է կայքում։");
        renderEditor();
      })
      .catch(function (error) { setStatus(error.message, true); });
  }

  function renderGallery(container) {
    var target = container.querySelector('[data-field-type="images"]');
    var grid = container.querySelector('.cms-gallery-grid');
    if (!target || !grid) return;
    var urls = splitLines(target.value);
    grid.innerHTML = urls.length ? urls.map(function (url, index) {
      return '<div class="cms-gallery-card"><img src="' + escapeHtml(url) + '" alt="Նկար ' + (index + 1) + '"><span>' + (index === 0 ? 'Գլխավոր նկար' : 'Նկար ' + (index + 1)) + '</span><div class="cms-gallery-actions">' +
        '<label class="cms-image-upload">Փոխարինել<input type="file" accept="image/jpeg,image/png,image/webp" data-cms-upload="' + escapeHtml(target.getAttribute('data-entity-field')) + '" data-replace-index="' + index + '"></label>' +
        (index ? '<button type="button" data-gallery-first="' + index + '">Դարձնել գլխավոր</button>' : '') +
        '<button type="button" data-gallery-remove="' + index + '">Հեռացնել ցանկից</button></div></div>';
    }).join('') : '<p class="cms-gallery-empty">Նկարներ դեռ չկան։ Ավելացրեք առաջին նկարը։</p>';
    grid.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.hidden = true;
        var message = document.createElement('p');
        message.textContent = 'Նկարը հասանելի չէ։ Փոխարինեք այն։';
        img.after(message);
      });
    });
    grid.querySelectorAll('[data-cms-upload]').forEach(function (input) {
      input.addEventListener('change', function () { uploadIntoField(input); });
    });
    grid.querySelectorAll('button').forEach(function (button) {
      button.addEventListener('click', function () {
        var current = splitLines(target.value);
        var remove = button.hasAttribute('data-gallery-remove');
        var index = Number(button.getAttribute(remove ? 'data-gallery-remove' : 'data-gallery-first'));
        var selected = current.splice(index, 1)[0];
        if (!remove) current.unshift(selected);
        target.value = current.join('\n');
        renderGallery(container);
      });
    });
  }

  function uploadIntoField(input) {
    var file = input.files && input.files[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) return setStatus("Նկարը պետք է լինի մինչև 7MB։", true);
    var field = input.getAttribute("data-cms-upload");
    var schema = schemas[state.activeId] || { folder: "general" };
    setStatus("Նկարը բեռնվում է Supabase Storage...");
    input.disabled = true;
    fileToDataUrl(file).then(function (dataUrl) {
      return requestJson("/api/admin/media/images", { method: "POST", body: { folder: schema.folder, title: file.name, file: { name: file.name, mime: file.type, data: dataUrl } } });
    }).then(function (payload) {
      var target = input.closest(".cms-image-field").querySelector('[data-entity-field="' + field + '"]');
      if (!target || !payload.asset) return;
      if (target.getAttribute("data-field-type") === "images") {
        var images = splitLines(target.value);
        if (input.hasAttribute('data-replace-index')) images[Number(input.getAttribute('data-replace-index'))] = payload.asset.url;
        else if (images.indexOf(payload.asset.url) < 0) images.push(payload.asset.url);
        target.value = images.join("\n");
        renderGallery(input.closest('.cms-image-field'));
      } else {
        target.value = payload.asset.url;
        var preview = input.closest(".cms-image-field").querySelector(".cms-image-preview");
        if (preview) preview.src = payload.asset.url;
      }
      setStatus("Նկարը բեռնված է։ Սեղմեք պահպանել՝ այն գրառմանը կապելու համար։");
    }).catch(function (error) { setStatus(error.message, true); }).finally(function () { input.disabled = false; input.value = ''; });
  }

  function bindEditorEvents() {
    var panel = byId("cms-editor-panel");
    if (!panel) return;

    panel.querySelectorAll("button[data-entity-index]").forEach(function (button) {
      button.addEventListener("click", function () {
        try { commitEntityForm(); } catch (error) { return setStatus("JSON սխալ՝ " + error.message, true); }
        state.entityIndex = Number(button.getAttribute("data-entity-index"));
        renderEditor();
      });
    });

    var languageTabs = panel.querySelectorAll("[data-cms-language]");
    function selectLanguage(button) {
      state.language = button.getAttribute("data-cms-language");
      languageTabs.forEach(function (tab) {
        var active = tab === button;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      panel.querySelectorAll("[data-cms-language-panel]").forEach(function (section) {
        section.hidden = section.getAttribute("data-cms-language-panel") !== state.language;
      });
    }
    languageTabs.forEach(function (button, index) {
      button.addEventListener("click", function () { selectLanguage(button); });
      button.addEventListener("keydown", function (event) {
        var next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : -1;
        if (next < 0) return;
        event.preventDefault();
        selectLanguage(languageTabs[next]);
        languageTabs[next].focus();
      });
    });

    var add = panel.querySelector("[data-add-entity]");
    if (add) add.addEventListener("click", function () {
      try { commitEntityForm(); } catch (error) { return setStatus("JSON սխալ՝ " + error.message, true); }
      var schema = schemas[state.activeId];
      if (!Array.isArray(state.data)) state.data = [];
      var item = JSON.parse(JSON.stringify(schema.defaults));
      if (Object.prototype.hasOwnProperty.call(item, "id")) item.id = "new-" + Date.now();
      state.data.push(item);
      state.entityIndex = state.data.length - 1;
      renderEditor();
    });

    var remove = panel.querySelector("[data-delete-entity]");
    if (remove) remove.addEventListener("click", function () {
      if (!window.confirm("Ջնջե՞լ այս գրառումը։ Փոփոխությունը վերջնական կլինի պահպանելուց հետո։")) return;
      state.data.splice(state.entityIndex, 1);
      state.entityIndex = Math.max(0, state.entityIndex - 1);
      renderEditor();
      setStatus("Գրառումը հանված է։ Սեղմեք պահպանել՝ փոփոխությունը հաստատելու համար։");
    });

    var saveEmpty = panel.querySelector("[data-save-empty]");
    if (saveEmpty) saveEmpty.addEventListener("click", function () { savePayload([]); });

    panel.querySelectorAll("[data-cms-upload]").forEach(function (input) {
      input.addEventListener("change", function () { uploadIntoField(input); });
    });
    panel.querySelectorAll('.cms-gallery-field').forEach(renderGallery);

    var entityForm = byId("cms-entity-form");
    if (entityForm && state.activeId === "projects") {
      var statusControl = entityForm.querySelector('[data-entity-field="status"]');
      var stageControl = entityForm.querySelector('[data-entity-field="stage"]');
      function syncCompletedStage() {
        stageControl.disabled = statusControl.value === "completed";
        if (stageControl.disabled) stageControl.value = "handover";
      }
      statusControl.addEventListener("change", syncCompletedStage);
      syncCompletedStage();
    }
    if (entityForm) entityForm.addEventListener("invalid", function (event) {
      var section = event.target.closest("[data-cms-language-panel]");
      if (section && section.hidden) selectLanguage(panel.querySelector('[data-cms-language="' + section.getAttribute("data-cms-language-panel") + '"]'));
    }, true);
    if (entityForm) entityForm.addEventListener("submit", function (event) {
      event.preventDefault();
      try { commitEntityForm(); } catch (error) { return setStatus("JSON սխալ՝ " + error.message, true); }
      savePayload(state.data);
    });

    var objectForm = byId("cms-object-form");
    if (objectForm) objectForm.addEventListener("submit", function (event) {
      event.preventDefault();
      try { savePayload(readObjectForm(objectForm)); } catch (error) { setStatus("JSON սխալ՝ " + error.message, true); }
    });

    var simpleForm = byId("cms-simple-list-form");
    if (simpleForm) simpleForm.addEventListener("submit", function (event) { event.preventDefault(); savePayload(splitLines(simpleForm.querySelector("[data-simple-list]").value)); });

    var jsonForm = byId("cms-json-form");
    if (jsonForm) jsonForm.addEventListener("submit", function (event) {
      event.preventDefault();
      try { savePayload(JSON.parse(jsonForm.querySelector(".cms-json-editor").value || "{}")); } catch (error) { setStatus("JSON սխալ՝ " + error.message, true); }
    });

    var format = panel.querySelector("[data-cms-format]");
    if (format) format.addEventListener("click", function () {
      var textarea = panel.querySelector(".cms-json-editor");
      try { textarea.value = prettyJson(JSON.parse(textarea.value || "{}")); setStatus("JSON ձևաչափը կարգավորված է։"); } catch (error) { setStatus("JSON սխալ՝ " + error.message, true); }
    });

    panel.querySelectorAll("[data-cms-reset]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!window.confirm("Վերականգնե՞լ այս բաժնի նախնական տվյալները։")) return;
        requestJson("/api/admin/cms/" + encodeURIComponent(state.activeId), { method: "DELETE" })
          .then(function () { return loadCollection(state.activeId); })
          .then(function () { setStatus("Բաժինը վերականգնված է։"); })
          .catch(function (error) { setStatus(error.message, true); });
      });
    });
  }

  function loadCollection(id) {
    state.activeId = id;
    state.entityIndex = 0;
    renderCollectionNav();
    return Promise.all([
      requestJson("/api/admin/cms/" + encodeURIComponent(id)),
      id === "projects" ? requestJson("/api/admin/cms/locales").catch(function () { return { data: {} }; }) : Promise.resolve(null)
    ]).then(function (results) {
      if (state.activeId !== id) return;
      var payload = results[0];
      if (results[1]) state.locales = results[1].data || {};
      state.meta = payload.meta || { label: id, description: "" };
      state.data = payload.data != null ? payload.data : (state.meta.kind === "array" ? [] : {});
      renderEditor();
    });
  }

  function loadCollections() {
    return requestJson("/api/admin/cms").then(function (payload) {
      state.collections = (payload.collections || []).filter(function (item) { return item && item.id; });
      renderCollectionNav();
      var preferred = state.collections.some(function (item) { return item.id === state.activeId; }) ? state.activeId : ((state.collections[0] && state.collections[0].id) || "contacts");
      return loadCollection(preferred);
    });
  }

  function bindNav() {
    var nav = byId("cms-collection-nav");
    if (!nav) return;
    nav.addEventListener("click", function (event) {
      var button = event.target.closest("[data-cms-collection]");
      if (!button) return;
      if (typeof window.adminSwitchWorkspace === "function") window.adminSwitchWorkspace("cms");
      var id = button.getAttribute("data-cms-collection");
      if (!id || id === state.activeId) return;
      loadCollection(id).catch(function (error) { setStatus(error.message, true); });
    });
  }

  function openCmsWorkspace() {
    if (!state.collections.length) loadCollections().catch(function (error) { setStatus(error.message, true); });
  }

  window.SmartTechAdminCms = {
    init: function () { if (!state.initialized) { state.initialized = true; bindNav(); } },
    open: openCmsWorkspace,
    reload: loadCollections
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", window.SmartTechAdminCms.init);
  else window.SmartTechAdminCms.init();
})(window);
