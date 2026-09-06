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
  root.SmartTech = root.SmartTech || {};
  root.SmartTech.content = root.SmartTech.content || {};
  root.SmartTech.sections = root.SmartTech.sections || {};
  root.SmartTech.utils = root.SmartTech.utils || {};
  root.SmartTech.projectStages = api;

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
