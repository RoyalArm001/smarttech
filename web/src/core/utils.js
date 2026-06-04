(function (site) {
  var htmlMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return htmlMap[char];
    });
  }

  function phoneDisplay(number) {
    var digits = String(number).replace(/\D/g, "");
    if (digits.length !== 11 || digits.indexOf("374") !== 0) {
      return number;
    }
    return "+374 " + digits.slice(3, 5) + " " + digits.slice(5, 8) + " " + digits.slice(8);
  }

  function telHref(number) {
    return "tel:" + String(number).replace(/[^\d+]/g, "");
  }

  function mailTo(email, subject, body) {
    var recipient = String(email || "").replace(/[\r\n\s]/g, "");
    return "mailto:" + recipient +
      "?subject=" + encodeURIComponent(subject || "") +
      "&body=" + encodeURIComponent(body || "");
  }

  function imageLoadingAttrs(options) {
    options = options || {};
    var attrs = [];
    if (options.loading) {
      attrs.push('loading="' + options.loading + '"');
    }
    if (options.fetchpriority) {
      attrs.push('fetchpriority="' + options.fetchpriority + '"');
    }
    if (options.decoding !== false) {
      attrs.push('decoding="async"');
    }
    if (options.width) {
      attrs.push('width="' + String(options.width) + '"');
    }
    if (options.height) {
      attrs.push('height="' + String(options.height) + '"');
    }
    if (options.sizes) {
      attrs.push('sizes="' + escapeHtml(options.sizes) + '"');
    }
    if (options.className) {
      attrs.push('class="' + escapeHtml(options.className) + '"');
    }
    return attrs.join(" ");
  }

  function pageUrl(page, id) {
    if (window.location.protocol === "file:") {
      if (page === "home") return "#home";
      return id ? "#" + page + "/" + encodeURIComponent(id) : "#" + page;
    } else {
      if (page === "home") return "/home";
      if (page === "service" || page === "project" || page === "member") {
        return id ? "/" + page + "?id=" + encodeURIComponent(id) : "/" + page;
      }
      return "/" + page;
    }
  }

  site.utils.escapeHtml = escapeHtml;
  site.utils.imageLoadingAttrs = imageLoadingAttrs;
  site.utils.phoneDisplay = phoneDisplay;
  site.utils.telHref = telHref;
  site.utils.mailTo = mailTo;
  site.utils.pageUrl = pageUrl;
})(window.SmartTech);
