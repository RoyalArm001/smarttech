(function (root) {
  var stages = [
    { id: "survey", labels: { hy: "Չափագրում և նախագիծ", en: "Survey and design", ru: "Замер и проект" } },
    { id: "supply", labels: { hy: "Մատակարարում", en: "Supply", ru: "Поставка" } },
    { id: "installation", labels: { hy: "Տեղադրում", en: "Installation", ru: "Монтаж" } },
    { id: "programming", labels: { hy: "Ծրագրավորում", en: "Programming", ru: "Программирование" } },
    { id: "handover", labels: { hy: "Հանձնում", en: "Handover", ru: "Сдача" } }
  ];
  function valid(value) { return stages.some(function (stage) { return stage.id === value; }); }
  function selected(project) {
    if (project.status === "completed") return "handover";
    return valid(project.stage) ? project.stage : "";
  }
  function label(project, language) {
    var stage = stages.find(function (entry) { return entry.id === selected(project); });
    return stage ? (stage.labels[language] || stage.labels.hy) : "";
  }
  function badgeStageId(project) {
    if (!project) return "";
    if (valid(project.stage)) return project.stage;
    if (project.status === "current") {
      var works = Array.isArray(project.works) ? project.works.join(" ") : "";
      var text = (works + " " + (project.title || "") + " " + (project.id || "")).toLowerCase();
      if (text.includes("ծրագրավ") || text.includes("programm") || text.includes("програм") || text.includes("only-one")) {
        return "programming";
      }
      return "installation";
    }
    return "";
  }
  function badgeStage(project, language) {
    var id = badgeStageId(project);
    var stage = stages.find(function (entry) { return entry.id === id; });
    return stage ? (stage.labels[language || "hy"] || stage.labels.hy) : "";
  }
  var api = { all: stages, valid: valid, selected: selected, label: label, badgeStageId: badgeStageId, badgeStage: badgeStage };
  root.SmartTech = root.SmartTech || {};
  root.SmartTech.content = root.SmartTech.content || {};
  root.SmartTech.sections = root.SmartTech.sections || {};
  root.SmartTech.utils = root.SmartTech.utils || {};
  root.SmartTech.projectStages = api;
  root.SmartTech.projectBadgeStage = badgeStage;

  if (typeof module === "object" && module.exports) { module.exports = api; return; }
  // Load optional web fonts without blocking the first page render.
  if (root.document && !root.document.getElementById("smarttech-web-fonts")) {
    var fonts = root.document.createElement("link");
    fonts.id = "smarttech-web-fonts";
    fonts.rel = "stylesheet";
    fonts.media = "print";
    fonts.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Noto+Sans+Armenian:wght@500;600;700&family=Outfit:wght@600;700;800&display=swap";
    fonts.onload = function () { fonts.media = "all"; };
    root.document.head.appendChild(fonts);
  }
})(typeof window !== "undefined" ? window : globalThis);
