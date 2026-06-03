(function () {
  "use strict";

  // Sample editable fields (proof-of-concept). In the full version these are
  // loaded from the content API (Cloudflare D1/KV) and saved back.
  var FIELDS = [
    { id: "hero.lead", label: "Hero — նկարագրություն", value: "Նախագծում, տեղադրում և սպասարկում ենք անվտանգ, կայուն և խելացի համակարգեր։" },
    { id: "home.servicesTitle", label: "Գլխավոր — ծառայությունների վերնագիր", value: "Սկսեք այն համակարգից, որը հիմա կարևոր է ձեր օբյեկտի համար" },
    { id: "about.title", label: "Մեր մասին — վերնագիր", value: "Մեր մասին" },
    { id: "contact.title", label: "Կապ — վերնագիր", value: "Քննարկենք ձեր օբյեկտի անվտանգությունը" }
  ];

  var TARGETS = ["en", "ru"];

  var els = {
    nav: document.getElementById("nav"),
    viewTitle: document.getElementById("viewTitle"),
    viewSubtitle: document.getElementById("viewSubtitle"),
    apiStatus: document.getElementById("apiStatus"),
    fieldSelect: document.getElementById("fieldSelect"),
    sourceText: document.getElementById("sourceText"),
    translateBtn: document.getElementById("translateBtn"),
    saveBtn: document.getElementById("saveBtn"),
    editorHint: document.getElementById("editorHint"),
    transList: document.getElementById("transList"),
    toast: document.getElementById("toast"),
    dropzone: document.getElementById("dropzone"),
    imageInput: document.getElementById("imageInput")
  };

  var VIEW_META = {
    content: { title: "Բովանդակություն", subtitle: "Գրիր միայն հայերեն — մյուս լեզուները լրացվում են ինքնաշխատ։" },
    images: { title: "Նկարներ", subtitle: "Վերբեռնիր և փոխարինիր նկարները՝ ավտո-օպտիմիզացիայով։" },
    settings: { title: "Կարգավորումներ", subtitle: "CMS-ի և թարգմանության շարժիչի կարգավորումներ։" }
  };

  // In-memory draft store keyed by field id.
  var drafts = {};

  function transArea(lang) {
    return els.transList.querySelector('.trans-area[data-lang="' + lang + '"]');
  }
  function transCard(lang) {
    return els.transList.querySelector('.trans-card[data-lang="' + lang + '"]');
  }

  function showToast(message, kind) {
    els.toast.textContent = message;
    els.toast.className = "toast is-show" + (kind ? " is-" + kind : "");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function () {
      els.toast.className = "toast";
    }, 3200);
  }

  function setHint(message, kind) {
    els.editorHint.textContent = message || "";
    els.editorHint.className = "hint" + (kind ? " is-" + kind : "");
  }

  function setBusy(busy) {
    els.translateBtn.disabled = busy;
    els.translateBtn.querySelector(".btn-spinner").hidden = !busy;
    els.translateBtn.querySelector(".btn-label").textContent = busy ? "Թարգմանվում է…" : "⟳ Ավտո-թարգմանել";
  }

  function loadField(id) {
    var field = FIELDS.filter(function (f) { return f.id === id; })[0];
    if (!field) return;
    var draft = drafts[id] || {};
    els.sourceText.value = draft.hy != null ? draft.hy : field.value;
    TARGETS.forEach(function (lang) {
      var area = transArea(lang);
      area.value = draft[lang] || "";
      transCard(lang).classList.toggle("is-filled", Boolean(draft[lang]));
    });
    setHint("");
  }

  function collectDraft() {
    var id = els.fieldSelect.value;
    var draft = { hy: els.sourceText.value.trim() };
    TARGETS.forEach(function (lang) { draft[lang] = transArea(lang).value.trim(); });
    drafts[id] = draft;
    return draft;
  }

  async function checkApi() {
    // A HEAD/OPTIONS probe to see whether the function + key are configured.
    try {
      var res = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: "փորձ", targets: ["en"] })
      });
      if (res.ok) {
        els.apiStatus.className = "status-pill is-ok";
        els.apiStatus.innerHTML = '<span class="status-dot"></span> Թարգմանիչը պատրաստ է';
      } else if (res.status === 503) {
        els.apiStatus.className = "status-pill is-off";
        els.apiStatus.innerHTML = '<span class="status-dot"></span> GEMINI_API_KEY բացակայում է';
      } else {
        els.apiStatus.className = "status-pill";
        els.apiStatus.innerHTML = '<span class="status-dot"></span> Կարգավիճակ՝ ' + res.status;
      }
    } catch (error) {
      els.apiStatus.className = "status-pill is-off";
      els.apiStatus.innerHTML = '<span class="status-dot"></span> Function-ը հասանելի չէ (local)';
    }
  }

  async function translate() {
    var text = els.sourceText.value.trim();
    if (!text) {
      setHint("Նախ գրիր հայերեն տեքստը։", "error");
      return;
    }
    setBusy(true);
    setHint("");
    try {
      var res = await fetch("/api/translate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: text, targets: TARGETS })
      });
      var data = await res.json();
      if (!res.ok) {
        setHint(data && data.error ? data.error : "Թարգմանությունը ձախողվեց։", "error");
        showToast("Թարգմանությունը ձախողվեց", "error");
        return;
      }
      var translations = (data && data.translations) || {};
      var filled = 0;
      TARGETS.forEach(function (lang) {
        if (translations[lang]) {
          transArea(lang).value = translations[lang];
          transCard(lang).classList.add("is-filled");
          filled++;
        }
      });
      setHint(filled + " լեզու թարգմանվեց։ Ստուգիր և պահպանիր։", "ok");
      showToast("✓ Թարգմանված է", "ok");
    } catch (error) {
      setHint("Ցանցի սխալ։ Փորձիր կրկին։", "error");
      showToast("Ցանցի սխալ", "error");
    } finally {
      setBusy(false);
    }
  }

  function save() {
    var draft = collectDraft();
    if (!draft.hy) {
      setHint("Չկա պահպանելու բան։", "error");
      return;
    }
    // POC: persist locally. Full version POSTs to /api/content (D1/KV).
    try {
      window.localStorage.setItem("smarttech.admin.drafts", JSON.stringify(drafts));
    } catch (e) {}
    showToast("💾 Պահպանված է (սևագիր)", "ok");
    setHint("Պահպանված է լոկալ։ Իրական պահպանումը՝ D1/KV-ով հաջորդ քայլում։", "ok");
  }

  function switchView(view) {
    Array.prototype.forEach.call(els.nav.querySelectorAll(".nav-item"), function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-view") === view);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".view"), function (sec) {
      sec.classList.toggle("is-active", sec.id === "view-" + view);
    });
    var meta = VIEW_META[view] || VIEW_META.content;
    els.viewTitle.textContent = meta.title;
    els.viewSubtitle.textContent = meta.subtitle;
  }

  function initFields() {
    els.fieldSelect.innerHTML = FIELDS.map(function (f) {
      return '<option value="' + f.id + '">' + f.label + "</option>";
    }).join("");
    loadField(FIELDS[0].id);
  }

  function bind() {
    els.nav.addEventListener("click", function (e) {
      var btn = e.target.closest(".nav-item");
      if (btn) switchView(btn.getAttribute("data-view"));
    });
    els.fieldSelect.addEventListener("change", function () {
      collectDraft.lastId && collectDraft();
      loadField(els.fieldSelect.value);
    });
    // Save current edits into draft before switching fields.
    els.fieldSelect.addEventListener("focus", collectDraft);
    els.translateBtn.addEventListener("click", translate);
    els.saveBtn.addEventListener("click", save);

    // Drag & drop (UI only in POC).
    if (els.dropzone) {
      els.dropzone.addEventListener("click", function () { els.imageInput.click(); });
      ["dragover", "dragenter"].forEach(function (evt) {
        els.dropzone.addEventListener(evt, function (e) { e.preventDefault(); els.dropzone.classList.add("is-drag"); });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        els.dropzone.addEventListener(evt, function (e) { e.preventDefault(); els.dropzone.classList.remove("is-drag"); });
      });
      els.dropzone.addEventListener("drop", function (e) {
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) showToast("Ստացվեց՝ " + file.name + " (upload-ը՝ հաջորդ քայլում)", "ok");
      });
      els.imageInput.addEventListener("change", function () {
        if (els.imageInput.files[0]) showToast("Ընտրվեց՝ " + els.imageInput.files[0].name, "ok");
      });
    }
  }

  function restoreDrafts() {
    try {
      var saved = window.localStorage.getItem("smarttech.admin.drafts");
      if (saved) drafts = JSON.parse(saved) || {};
    } catch (e) {}
  }

  restoreDrafts();
  initFields();
  bind();
  checkApi();
})();
