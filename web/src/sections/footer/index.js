(function (site) {
  site.sections.footer = function footer() {
    var e = site.utils.escapeHtml;
    var company = site.content.company;
    var contacts = site.content.contacts;
    var nav = site.i18n.get("nav");
    var logoMarkup = company.logo ? '<img src="' + e(company.logo) + '" alt="Smart Tech logo">' : "";
    var emails = contacts.emails && contacts.emails.length ? contacts.emails : [contacts.email];
    var emailLines = emails.map(function (email) {
      return "<span>" + e(email) + "</span>";
    }).join("");

    return '' +
      '<div class="container footer-inner">' +
        '<div>' +
          '<a class="footer-brand notranslate" href="' + e(site.utils.pageUrl("home")) + '" translate="no">' +
            logoMarkup +
            '<span class="notranslate" translate="no">' + e(company.name) + '</span>' +
          '</a>' +
          '<p>' + e(site.i18n.get("footer.description", company.description)) + '</p>' +
        '</div>' +
        '<div class="footer-links">' +
          '<a href="' + e(site.utils.pageUrl("services")) + '">' + e(nav.services) + '</a>' +
          '<a href="' + e(site.utils.pageUrl("projects")) + '">' + e(nav.projects) + '</a>' +
          '<a href="' + e(site.utils.pageUrl("request")) + '">' + e(nav.request || site.i18n.get("common.proposal", "Request")) + '</a>' +
          '<a href="' + e(site.utils.pageUrl("partners")) + '">' + e(nav.partners) + '</a>' +
          '<a href="' + e(site.utils.pageUrl("team")) + '">' + e(nav.team) + '</a>' +
          '<a href="' + e(site.utils.pageUrl("contact")) + '">' + e(nav.contact) + '</a>' +
        '</div>' +
        '<div class="footer-meta">' +
          emailLines +
          '<span id="footer-year"></span>' +
        '</div>' +
      '</div>';
  };
})(window.SmartTech);
