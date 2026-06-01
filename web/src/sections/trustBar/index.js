(function (site) {
  site.sections.trustBar = function trustBar() {
    var e = site.utils.escapeHtml;
    var localizedStats = site.i18n.get("stats", site.content.company.stats);
    var statsSource = Array.isArray(localizedStats) ? localizedStats : site.content.company.stats;

    var labelsByLanguage = {
      hy: { visits: "\u0531\u0575\u0581\u0565\u056c\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580", projects: "\u0546\u0561\u056d\u0561\u0563\u056e\u0565\u0580" },
      ru: { visits: "\u041f\u043e\u0441\u0435\u0449\u0435\u043d\u0438\u044f", projects: "\u041f\u0440\u043e\u0435\u043a\u0442\u044b" },
      en: { visits: "Visits", projects: "Projects" },
      be: { visits: "Наведванні", projects: "Праекты" },
      fr: { visits: "Visites", projects: "Projets" },
      ka: { visits: "ვიზიტები", projects: "პროექტები" }
    };
    var language = site.i18n.language || "hy";
    var metricLabels = labelsByLanguage[language] || labelsByLanguage.hy;

    var statsConfig = [
      {
        key: "visits",
        value: "0",
        label: metricLabels.visits,
        dynamic: true
      },
      {
        key: "projects",
        value: String((site.content.projects || []).length || 0),
        label: metricLabels.projects,
        dynamic: true
      },
      {
        key: "services",
        value: statsSource[2] && statsSource[2].value != null ? statsSource[2].value : String((site.content.services || []).length || 0),
        label: statsSource[2] && statsSource[2].label ? statsSource[2].label : "Services",
        dynamic: false
      }
    ];

    var stats = statsConfig.map(function (stat) {
      var itemAttr = stat.dynamic ? ' data-metric-item="' + e(stat.key) + '"' : "";
      var valueAttr = stat.dynamic ? " data-metric-value" : "";
      return '' +
        '<div class="trust-item reveal"' + itemAttr + '>' +
          '<strong' + valueAttr + ">" + e(stat.value) + '</strong>' +
          '<span>' + e(stat.label) + '</span>' +
        '</div>';
    }).join("");

    return '' +
      '<section class="trust-band" aria-label="Smart Tech թվեր">' +
        '<div class="container trust-grid">' +
          stats +
          '<div class="trust-note reveal">' +
            '<strong>' + e(site.i18n.get("trust.title")) + '</strong>' +
            '<span>' + e(site.i18n.get("trust.text")) + '</span>' +
          '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
