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
      return page === "profile" ? "/login" : "/" + page;
    }
  }

  var requestSubmitStorageKey = "smarttech.request.guard";
  var requestSubmitMinGapMs = 2 * 60 * 1000;
  var requestSubmitMaxHour = 5;
  var requestSubmitMaxDay = 12;
  var contactSubmitLockKey = "smarttech.contact.submit.lock";
  var contactSubmitCooldownMs = 2 * 60 * 60 * 1000;

  function readRequestSubmitGuard() {
    try {
      var raw = window.localStorage.getItem(requestSubmitStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function writeRequestSubmitGuard(data) {
    try {
      window.localStorage.setItem(requestSubmitStorageKey, JSON.stringify(data || {}));
    } catch (error) {
      return;
    }
  }

  function requestSubmitFingerprint(payload) {
    var raw = [
      payload && payload.source,
      payload && payload.contact,
      payload && payload.summary
    ].join("|").slice(0, 480);
    var hash = 0;
    for (var i = 0; i < raw.length; i += 1) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return String(hash);
  }

  function requestSubmitCheck(payload) {
    var now = Date.now();
    var guard = readRequestSubmitGuard();
    var timestamps = Array.isArray(guard.timestamps) ? guard.timestamps : [];
    timestamps = timestamps.filter(function (value) {
      return now - Number(value) < 24 * 60 * 60 * 1000;
    });
    var hourTimestamps = timestamps.filter(function (value) {
      return now - Number(value) < 60 * 60 * 1000;
    });
    var fingerprint = requestSubmitFingerprint(payload);

    if (guard.lastFingerprint && guard.lastFingerprint === fingerprint && guard.lastSubmitAt && now - guard.lastSubmitAt < 24 * 60 * 60 * 1000) {
      return { allowed: false, reason: "duplicate" };
    }
    if (timestamps.length && now - timestamps[timestamps.length - 1] < requestSubmitMinGapMs) {
      return { allowed: false, reason: "cooldown" };
    }
    if (hourTimestamps.length >= requestSubmitMaxHour) {
      return { allowed: false, reason: "hourly" };
    }
    if (timestamps.length >= requestSubmitMaxDay) {
      return { allowed: false, reason: "daily" };
    }
    return { allowed: true, fingerprint: fingerprint };
  }

  function recordRequestSubmit(payload) {
    var now = Date.now();
    var guard = readRequestSubmitGuard();
    var timestamps = Array.isArray(guard.timestamps) ? guard.timestamps : [];
    timestamps = timestamps.filter(function (value) {
      return now - Number(value) < 24 * 60 * 60 * 1000;
    });
    timestamps.push(now);
    guard.timestamps = timestamps;
    guard.lastSubmitAt = now;
    guard.lastFingerprint = requestSubmitFingerprint(payload);
    writeRequestSubmitGuard(guard);
  }

  function readContactSubmitLock() {
    try {
      var raw = window.localStorage.getItem(contactSubmitLockKey);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.lockedUntil) return null;
      if (Date.now() >= Number(data.lockedUntil)) {
        window.localStorage.removeItem(contactSubmitLockKey);
        return null;
      }
      return data;
    } catch (error) {
      return null;
    }
  }

  function getContactSubmitLockState() {
    var lock = readContactSubmitLock();
    if (!lock) {
      return { locked: false, remainingMs: 0, unlockAt: 0 };
    }
    var unlockAt = Number(lock.lockedUntil);
    var remainingMs = Math.max(0, unlockAt - Date.now());
    if (!remainingMs) {
      window.localStorage.removeItem(contactSubmitLockKey);
      return { locked: false, remainingMs: 0, unlockAt: 0 };
    }
    return { locked: true, remainingMs: remainingMs, unlockAt: unlockAt };
  }

  function setContactSubmitLock() {
    var now = Date.now();
    try {
      window.localStorage.setItem(contactSubmitLockKey, JSON.stringify({
        submittedAt: now,
        lockedUntil: now + contactSubmitCooldownMs
      }));
    } catch (error) {
      return;
    }
  }

  function formatContactCooldown(remainingMs, language) {
    var totalMinutes = Math.max(1, Math.ceil(Number(remainingMs || 0) / 60000));
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    var lang = String(language || "hy").toLowerCase();

    if (lang === "en") {
      if (hours && minutes) return hours + " h " + minutes + " min";
      if (hours) return hours + " h";
      return minutes + " min";
    }
    if (lang === "ru") {
      if (hours && minutes) return hours + " ч " + minutes + " мин";
      if (hours) return hours + " ч";
      return minutes + " мин";
    }
    if (hours && minutes) return hours + " ժ " + minutes + " ր";
    if (hours) return hours + " ժ";
    return minutes + " ր";
  }

  function showSubmitSuccessCelebration(anchor) {
    if (!anchor || !anchor.parentNode) return;

    var host = anchor.closest("form, .auto-chat-message-brief, .chat-page-message-brief, .contact-form") || anchor.parentNode;
    if (!host) return;

    if (window.getComputedStyle(host).position === "static") {
      host.style.position = "relative";
    }

    var burst = document.createElement("div");
    burst.className = "submit-success-burst";
    burst.setAttribute("aria-hidden", "true");

    var check = document.createElement("div");
    check.className = "submit-success-check";
    check.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    burst.appendChild(check);

    var colors = ["#0aa896", "#14b8a6", "#22d3ee", "#34d399", "#f59e0b", "#fb7185"];
    for (var i = 0; i < 18; i += 1) {
      var particle = document.createElement("span");
      particle.className = "submit-success-particle";
      particle.style.setProperty("--burst-angle", String(i * 20) + "deg");
      particle.style.setProperty("--burst-color", colors[i % colors.length]);
      burst.appendChild(particle);
    }

    host.appendChild(burst);
    window.requestAnimationFrame(function () {
      burst.classList.add("is-active");
    });
    window.setTimeout(function () {
      if (burst.parentNode) burst.parentNode.removeChild(burst);
    }, 1900);
  }

  site.utils.escapeHtml = escapeHtml;
  site.utils.imageLoadingAttrs = imageLoadingAttrs;
  site.utils.phoneDisplay = phoneDisplay;
  site.utils.telHref = telHref;
  site.utils.mailTo = mailTo;
  site.utils.pageUrl = pageUrl;
  site.utils.requestSubmitCheck = requestSubmitCheck;
  site.utils.recordRequestSubmit = recordRequestSubmit;
  site.utils.getContactSubmitLockState = getContactSubmitLockState;
  site.utils.setContactSubmitLock = setContactSubmitLock;
  site.utils.formatContactCooldown = formatContactCooldown;
  site.utils.showSubmitSuccessCelebration = showSubmitSuccessCelebration;
})(window.SmartTech);
