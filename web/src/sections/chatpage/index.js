(function (site) {
  function chatPageCopy() {
    var dictionaries = {
      hy: {
        eyebrow: "AI օգնական",
        title: "Smart Tech AI օգնական",
        text: "Առանձին էջ՝ մեր AI օգնականի հետ ազատ զրուցելու համար։ Տվեք ձեր հարցը անվտանգության, ցանցերի, էլեկտրամոնտաժի, ավտոմատացման կամ նախագծի մասին։",
        empty: "Գրեք ձեր հարցը ստորև։"
      },
      en: {
        eyebrow: "AI assistant",
        title: "Smart Tech AI assistant",
        text: "A dedicated page to chat freely with our AI assistant. Ask about security, networks, electrical works, automation or your project.",
        empty: "Type your question below."
      },
      ru: {
        eyebrow: "AI-ассистент",
        title: "AI-ассистент Smart Tech",
        text: "Отдельная страница для свободного общения с нашим AI-ассистентом. Спросите о безопасности, сетях, электромонтаже, автоматизации или проекте.",
        empty: "Напишите свой вопрос ниже."
      }
    };
    return site.i18n.pickLanguageDictionary(dictionaries);
  }

  site.sections.chatPage = function chatPage() {
    var e = site.utils.escapeHtml;
    var copy = chatPageCopy();

    return "" +
      site.sections.pageHero({
        eyebrow: copy.eyebrow,
        title: copy.title,
        text: copy.text,
        image: site.content.company.heroImages[0],
        tone: "contact"
      }) +
      '<section class="section chat-page-section">' +
        '<div class="container">' +
          '<div class="chat-page" data-chat-page>' +
            '<div class="chat-page-window">' +
              '<div class="chat-page-messages" data-chat-page-messages aria-live="polite"></div>' +
              '<div class="chat-page-quick" data-chat-page-quick role="group"></div>' +
              '<form class="chat-page-form" data-chat-page-form>' +
                '<input class="chat-page-input" data-chat-page-input type="text" autocomplete="off">' +
                '<button class="chat-page-send" data-chat-page-send type="submit"></button>' +
              "</form>" +
              '<p class="chat-page-status" data-chat-page-status></p>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
