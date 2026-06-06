(function (site) {
  function socialIcon(type) {
    var icons = {
      facebook: '<path d="M14.4 8.35h2.4V4.18A31 31 0 0 0 13.3 4c-3.46 0-5.84 2.18-5.84 6.18v3.68H3.64v4.66h3.82V30h4.69V18.52h3.67l.58-4.66h-4.25v-3.22c0-1.35.36-2.29 2.25-2.29Z" fill="currentColor"/>',
      instagram: '<path d="M16 6.45c3.1 0 3.46.01 4.68.07 1.13.05 1.75.24 2.16.4.54.21.93.46 1.34.87.4.4.66.79.86 1.33.16.41.35 1.03.4 2.16.06 1.22.07 1.58.07 4.68s-.01 3.46-.07 4.68c-.05 1.13-.24 1.75-.4 2.16-.2.54-.46.93-.86 1.34-.41.4-.8.66-1.34.86-.41.16-1.03.35-2.16.4-1.22.06-1.58.07-4.68.07s-3.46-.01-4.68-.07c-1.13-.05-1.75-.24-2.16-.4a3.6 3.6 0 0 1-1.34-.86 3.6 3.6 0 0 1-.86-1.34c-.16-.41-.35-1.03-.4-2.16-.06-1.22-.07-1.58-.07-4.68s.01-3.46.07-4.68c.05-1.13.24-1.75.4-2.16.2-.54.46-.93.86-1.33.41-.41.8-.66 1.34-.87.41-.16 1.03-.35 2.16-.4 1.22-.06 1.58-.07 4.68-.07Zm0-2.08c-3.15 0-3.55.01-4.78.07-1.24.06-2.08.25-2.82.54a5.7 5.7 0 0 0-2.06 1.34 5.7 5.7 0 0 0-1.34 2.06c-.29.74-.48 1.58-.54 2.82-.06 1.24-.07 1.64-.07 4.8s.01 3.55.07 4.78c.06 1.24.25 2.08.54 2.82a5.7 5.7 0 0 0 1.34 2.06A5.7 5.7 0 0 0 8.4 27c.74.29 1.58.48 2.82.54 1.23.06 1.63.07 4.78.07s3.55-.01 4.78-.07c1.24-.06 2.08-.25 2.82-.54a5.7 5.7 0 0 0 2.06-1.34A5.7 5.7 0 0 0 27 23.6c.29-.74.48-1.58.54-2.82.06-1.23.07-1.63.07-4.78s-.01-3.55-.07-4.8c-.06-1.24-.25-2.08-.54-2.82a5.7 5.7 0 0 0-1.34-2.06A5.7 5.7 0 0 0 23.6 4.98c-.74-.29-1.58-.48-2.82-.54-1.23-.06-1.63-.07-4.78-.07Z" fill="currentColor"/><path d="M16 10.02A5.98 5.98 0 1 0 16 22a5.98 5.98 0 0 0 0-11.98Zm0 9.85a3.87 3.87 0 1 1 0-7.74 3.87 3.87 0 0 1 0 7.74ZM23.61 9.8a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" fill="currentColor"/>',
      mail: '<path d="M4.8 7.5h22.4c1 0 1.8.8 1.8 1.8v13.4c0 1-.8 1.8-1.8 1.8H4.8c-1 0-1.8-.8-1.8-1.8V9.3c0-1 .8-1.8 1.8-1.8Zm1.24 2.5 9.96 7.1L25.96 10H6.04Zm20.46 2.1-9.8 6.98a1.2 1.2 0 0 1-1.4 0L5.5 12.1V22h21V12.1Z" fill="currentColor"/>',
      eye: '<path d="M16 6.8c6.8 0 11.7 6.3 12.4 7.25.45.59.45 1.4 0 1.98-.7.96-5.6 7.17-12.4 7.17S4.3 16.99 3.6 16.03a1.64 1.64 0 0 1 0-1.98C4.3 13.1 9.2 6.8 16 6.8Zm0 3.1a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2Zm0 2.35a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Z" fill="currentColor"/>'
    };
    return '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">' + (icons[type] || icons.mail) + '</svg>';
  }

  function socialType(item) {
    var text = String((item && item.label) || "") + " " + String((item && item.href) || "");
    text = text.toLowerCase();
    if (text.indexOf("facebook") >= 0 || text.indexOf("fb.") >= 0) return "facebook";
    if (text.indexOf("instagram") >= 0) return "instagram";
    return "";
  }

  site.sections.footer = function footer() {
    var e = site.utils.escapeHtml;
    var company = site.content.company;
    var contacts = site.content.contacts;
    var nav = site.i18n.get("nav");
    var language = site.i18n.language || "hy";
    var footerLabels = {
      hy: { views: "Դիտումներ", socials: "Սոցիալական հղումներ", mail: "Գրել նամակ", info: "Տեղեկատվություն", assistant: "AI օգնական" },
      en: { views: "Views", socials: "Social links", mail: "Send email", info: "Info", assistant: "AI assistant" },
      ru: { views: "Просмотры", socials: "Социальные ссылки", mail: "Написать на почту", info: "Инфо", assistant: "AI-ассистент" }
    };
    var infoLabels = {
      hy: { help: "Օգնություն", faq: "FAQ", terms: "Պայմաններ", privacy: "Գաղտնիություն", disclaimer: "Նշում" },
      en: { help: "Help", faq: "FAQ", terms: "Terms", privacy: "Privacy", disclaimer: "Disclaimer" },
      ru: { help: "Помощь", faq: "FAQ", terms: "Условия", privacy: "Конфиденциальность", disclaimer: "Примечание" }
    };
    var footerCopy = footerLabels[language] || footerLabels.en;
    var infoCopy = infoLabels[language] || infoLabels.en;
    var logoSrc = company.logo || "/img/smart-tech.png";
    var quickLinks = [
      { href: site.utils.pageUrl("services"), label: nav.services },
      { href: site.utils.pageUrl("projects"), label: nav.projects },
      { href: site.utils.pageUrl("request"), label: nav.request || site.i18n.get("common.proposal", "Request") },
      { href: site.utils.pageUrl("team"), label: nav.team },
      { href: site.utils.pageUrl("contact"), label: nav.contact },
      { href: site.utils.pageUrl("partners"), label: nav.partners },
      { href: site.utils.pageUrl("chat"), label: footerCopy.assistant }
    ];
    var infoLinks = [
      { href: site.utils.pageUrl("help"), label: infoCopy.help },
      { href: site.utils.pageUrl("faq"), label: infoCopy.faq },
      { href: site.utils.pageUrl("terms"), label: infoCopy.terms },
      { href: site.utils.pageUrl("privacy"), label: infoCopy.privacy },
      { href: site.utils.pageUrl("disclaimer"), label: infoCopy.disclaimer }
    ];
    var quickLinksMarkup = quickLinks.map(function (link) {
      return '<a href="' + e(link.href) + '">' + e(link.label) + '</a>';
    }).join("");
    var infoLinksMarkup = infoLinks.map(function (link) {
      return '<a href="' + e(link.href) + '">' + e(link.label) + '</a>';
    }).join("");
    var socialItems = (contacts.socials || []).filter(function (item) {
      var type = socialType(item);
      return type === "facebook" || type === "instagram";
    }).slice(0, 2);
    socialItems.push({ label: footerCopy.mail, href: "mailto:" + (contacts.email || "info@smarttechllc.am"), type: "mail" });

    var socialLinks = socialItems.map(function (item) {
      var type = item.type || socialType(item) || "mail";
      var external = /^mailto:/i.test(item.href) ? "" : ' target="_blank" rel="noreferrer"';
      return '' +
        '<a class="footer-social footer-social-' + e(type) + '" href="' + e(item.href) + '"' + external + ' aria-label="' + e(item.label) + '">' +
          socialIcon(type) +
        '</a>';
    }).join("");

    return '' +
      '<div class="container footer-inner">' +
        '<div class="footer-bottom">' +
          '<a class="footer-bottom-brand notranslate" href="' + e(site.utils.pageUrl("home")) + '" translate="no">' +
            '<img src="' + e(logoSrc) + '" alt="Smart Tech logo" loading="lazy">' +
            '<span><strong>' + e(company.name) + '</strong><small id="footer-year"></small></span>' +
          '</a>' +
          '<nav class="footer-link-groups" aria-label="Footer navigation">' +
            '<div class="footer-link-set footer-link-set-main">' + quickLinksMarkup + '</div>' +
            '<div class="footer-link-set footer-link-set-info" aria-label="' + e(footerCopy.info) + '">' + infoLinksMarkup + '</div>' +
          '</nav>' +
          '<div class="footer-views" data-metric-item="visits">' +
            socialIcon("eye") +
            '<span><strong data-metric-value>0</strong><small>' + e(footerCopy.views) + '</small></span>' +
          '</div>' +
          '<div class="footer-socials" aria-label="' + e(footerCopy.socials) + '">' + socialLinks + '</div>' +
        '</div>' +
      '</div>';
  };
})(window.SmartTech);
