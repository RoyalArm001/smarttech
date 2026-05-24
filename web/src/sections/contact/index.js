(function (site) {
  site.sections.contact = function contact() {
    var e = site.utils.escapeHtml;
    var contacts = site.content.contacts;
    var labels = site.i18n.get("contact.labels");
    var mapUrl = "https://maps.google.com/?ll=" + contacts.map.lat + "," + contacts.map.lng;
    var phoneLabels = [labels.office, labels.main, labels.store, labels.powder];
    var emails = contacts.emails && contacts.emails.length ? contacts.emails : [contacts.email];

    var phoneLinks = contacts.phones.map(function (phone, index) {
      return '' +
        '<a class="contact-line" href="' + e(site.utils.telHref(phone.number)) + '">' +
          '<span>' + e(phoneLabels[index] || phone.label) + '</span>' +
          '<strong>' + e(site.utils.phoneDisplay(phone.number)) + '</strong>' +
        '</a>';
    }).join("");

    var socialLinks = contacts.socials.map(function (social) {
      return '<a href="' + e(social.href) + '" target="_blank" rel="noreferrer">' + e(social.label) + '</a>';
    }).join("");

    var emailLinks = emails.map(function (email, index) {
      var title = index === 0 ? "Email" : "Email " + (index + 1);
      return '' +
        '<a class="contact-line" href="mailto:' + e(email) + '">' +
          '<span>' + e(title) + '</span><strong>' + e(email) + '</strong>' +
        '</a>';
    }).join("");

    return '' +
      site.sections.pageHero({
        eyebrow: site.i18n.get("contact.eyebrow"),
        eyebrowKey: "contact.eyebrow",
        title: site.i18n.get("contact.title"),
        titleKey: "contact.title",
        text: site.i18n.get("contact.text"),
        textKey: "contact.text",
        image: site.content.company.assetBase + "/images/message.avif",
        tone: "contact"
      }) +
      '<section id="contact" class="section contact-section">' +
        '<div class="container contact-grid">' +
          '<div class="contact-copy reveal">' +
            '<div class="contact-lines">' +
              phoneLinks +
              emailLinks +
              '<a class="contact-line" href="' + e(mapUrl) + '" target="_blank" rel="noreferrer">' +
                '<span>' + e(labels.address) + '</span><strong>' + e(contacts.addressHy) + '</strong>' +
              '</a>' +
            '</div>' +
            '<div class="social-row">' + socialLinks + '</div>' +
          '</div>' +
          '<form class="contact-form reveal" id="contact-form" action="/api/contact" method="post">' +
            '<label>' + e(labels.name) + '<input name="name" autocomplete="name" required></label>' +
            '<label>' + e(labels.phone) + '<input name="phone" autocomplete="tel" required></label>' +
            '<label>Email<input name="email" type="email" autocomplete="email"></label>' +
            '<label>' + e(labels.message) + '<textarea name="message" rows="5" required></textarea></label>' +
            '<button class="button button-primary" type="submit">' + e(labels.send) + '</button>' +
            '<p class="form-status" id="form-status" aria-live="polite"></p>' +
          '</form>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
