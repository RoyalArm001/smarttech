(function (site) {
  function chatLiveAnimationHtml(extraClass) {
    return '' +
      '<div class="chat-live-animation' + (extraClass ? ' ' + extraClass : '') + '" aria-hidden="true">' +
        '<div class="chat-live-canvas">' +
          '<div class="chat-live-bg-layer">' +
            '<div class="chat-live-blob chat-live-bg-blob"><div class="chat-live-gradient-strip"></div></div>' +
          '</div>' +
          '<div class="chat-live-fg-layer">' +
            '<div class="chat-live-blob chat-live-fg-blob"><div class="chat-live-gradient-strip"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  site.sections.chatLiveAnimation = chatLiveAnimationHtml;

  function chatPageCopy() {
    return site.i18n.pickLanguageDictionary({
      hy: {
        title: "Smart Tech AI",
        input: "Գրեք հարցը...",
        send: "Ուղարկել",
        typing: "Գրում է...",
        survey: "Նախագծի բրիֆ"
      },
      en: {
        title: "Smart Tech AI",
        input: "Ask your question...",
        send: "Send",
        typing: "Typing...",
        survey: "Project brief"
      },
      ru: {
        title: "Smart Tech AI",
        input: "Напишите вопрос...",
        send: "Отправить",
        typing: "Печатает...",
        survey: "Бриф проекта"
      }
    });
  }

  site.sections.chatPage = function chatPage() {
    var e = site.utils.escapeHtml;
    var copy = chatPageCopy();
    return "" +
      '<div class="chat-page-shell" data-chat-page>' +
        '<div class="chat-page-user-badge" data-chat-page-user-badge hidden>' +
          '<span class="chat-page-user-badge-avatar" data-chat-page-user-avatar aria-hidden="true"></span>' +
          '<span class="chat-page-user-badge-name" data-chat-page-user-name></span>' +
        "</div>" +
        '<div class="chat-page-profile-layer" data-chat-page-profile hidden>' +
          '<div class="chat-page-profile-backdrop" data-chat-page-profile-backdrop aria-hidden="true"></div>' +
          '<aside class="chat-page-profile-panel" data-chat-page-profile-panel role="dialog" aria-modal="true" aria-labelledby="chat-page-profile-title">' +
            '<div class="chat-page-profile-panel-glow" aria-hidden="true"></div>' +
            '<div class="chat-page-profile-panel-inner">' +
              '<div class="chat-page-profile-head">' +
                '<p class="chat-page-profile-eyebrow" data-chat-page-profile-eyebrow></p>' +
                '<h2 class="chat-page-profile-title" id="chat-page-profile-title" data-chat-page-profile-title></h2>' +
                '<p class="chat-page-profile-lead" data-chat-page-profile-lead></p>' +
              "</div>" +
              '<form class="chat-page-profile-form" data-chat-page-profile-form novalidate>' +
                '<div class="chat-page-profile-grid">' +
                  '<label class="chat-page-profile-field">' +
                    '<span data-chat-page-profile-label-first></span>' +
                    '<input type="text" name="firstName" data-chat-page-profile-first autocomplete="given-name" maxlength="80" required>' +
                  "</label>" +
                  '<label class="chat-page-profile-field">' +
                    '<span data-chat-page-profile-label-last></span>' +
                    '<input type="text" name="lastName" data-chat-page-profile-last autocomplete="family-name" maxlength="80" required>' +
                  "</label>" +
                  '<label class="chat-page-profile-field">' +
                    '<span data-chat-page-profile-label-email></span>' +
                    '<input type="email" name="email" data-chat-page-profile-email autocomplete="email" maxlength="120" required>' +
                  "</label>" +
                  '<label class="chat-page-profile-field">' +
                    '<span data-chat-page-profile-label-phone></span>' +
                    '<input type="tel" name="phone" data-chat-page-profile-phone autocomplete="tel" maxlength="40" required>' +
                  "</label>" +
                "</div>" +
                '<div class="chat-page-profile-purpose">' +
                  '<span class="chat-page-profile-purpose-label" data-chat-page-profile-purpose-label></span>' +
                  '<div class="chat-page-profile-purpose-options" data-chat-page-profile-purpose-options role="group"></div>' +
                  '<input type="text" class="chat-page-profile-purpose-custom" name="purposeCustom" data-chat-page-profile-purpose-custom maxlength="160" hidden>' +
                "</div>" +
                '<p class="chat-page-profile-error" data-chat-page-profile-error hidden></p>' +
                '<button class="chat-page-profile-submit" type="submit" data-chat-page-profile-submit></button>' +
              "</form>" +
            "</div>" +
          "</aside>" +
        "</div>" +
        '<div class="chat-page-ambient" aria-hidden="true">' +
          '<div class="chat-ambient-field">' +
            '<div class="chat-ambient-mesh"></div>' +
            '<div class="chat-ambient-blob chat-ambient-blob-a"></div>' +
            '<div class="chat-ambient-blob chat-ambient-blob-b"></div>' +
            '<div class="chat-ambient-blob chat-ambient-blob-c"></div>' +
          "</div>" +
        "</div>" +
        '<div class="chat-page-scroll">' +
          '<div class="chat-page-messages" data-chat-page-messages aria-live="polite">' +
            '<div class="chat-page-welcome">' +
              '<h1>' + e(copy.title) + "</h1>" +
            "</div>" +
            '<div class="chat-page-message chat-page-message-bot chat-page-message-intro" data-chat-page-intro></div>' +
          "</div>" +
        "</div>" +
        '<div class="chat-page-bottom">' +
          '<div class="chat-page-survey-options" data-chat-page-survey-options hidden></div>' +
          '<div class="chat-page-chips" data-chat-page-quick role="group"></div>' +
          '<form class="chat-page-form" data-chat-page-form>' +
            '<div class="chat-page-composer">' +
              '<button class="chat-page-composer-addon" type="button" data-chat-page-intent="survey" aria-label="' + e(copy.survey) + '">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
              "</button>" +
              '<input class="chat-page-input" data-chat-page-input type="text" autocomplete="off" maxlength="700" placeholder="' + e(copy.input) + '" aria-label="' + e(copy.input) + '">' +
              '<button class="chat-page-send" data-chat-page-send type="submit" aria-label="' + e(copy.send) + '">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              "</button>" +
            "</div>" +
          "</form>" +
          '<p class="chat-page-status" data-chat-page-status data-typing-label="' + e(copy.typing) + '"></p>' +
          '<p class="chat-page-limit" data-chat-page-limit aria-live="polite"></p>' +
        "</div>" +
      "</div>";
  };
})(window.SmartTech);
