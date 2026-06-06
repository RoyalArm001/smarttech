(function (site) {
  function chatPageCopy() {
    return site.i18n.pickLanguageDictionary({
      hy: {
        eyebrow: "AI օգնական",
        title: "Smart Tech AI օգնական",
        text: "Առանձին էջ՝ մեր AI օգնականի հետ հանգիստ զրուցելու համար։ Հարցրեք տեսահսկման, ցանցերի, հրդեհային համակարգերի, էլեկտրամոնտաժի, ավտոմատացման կամ ձեր նախագծի մասին։",
        intro: "Բարև։ Ես Smart Tech-ի AI օգնականն եմ։ Գրեք ձեր հարցը կամ ընտրեք արագ հարցերից մեկը։",
        quickLabel: "Արագ հարցեր",
        input: "Գրեք ձեր հարցը...",
        send: "Ուղարկել",
        typing: "Գրում է...",
        status: "Պատասխանում է հայերեն, անգլերեն և ռուսերեն",
        questions: [
          "Ի՞նչ ծառայություններ եք մատուցում",
          "Տեսահսկման համակարգի համար ինչ է պետք",
          "Ինչպե՞ս ստանալ գնային առաջարկ",
          "Որքա՞ն ժամանակ է տևում տեղադրումը",
          "Ուզում եմ կապվել մասնագետի հետ"
        ]
      },
      en: {
        eyebrow: "AI assistant",
        title: "Smart Tech AI assistant",
        text: "A dedicated page for a focused conversation with our AI assistant. Ask about CCTV, networks, fire systems, electrical works, automation or your project.",
        intro: "Hi. I am Smart Tech's AI assistant. Type your question or choose one of the quick questions.",
        quickLabel: "Quick questions",
        input: "Type your question...",
        send: "Send",
        typing: "Typing...",
        status: "Replies in Armenian, English and Russian",
        questions: [
          "What services do you provide?",
          "What is needed for CCTV installation?",
          "How can I get a price offer?",
          "How long does installation take?",
          "I want to contact a specialist"
        ]
      },
      ru: {
        eyebrow: "AI-ассистент",
        title: "AI-ассистент Smart Tech",
        text: "Отдельная страница для удобного общения с AI-ассистентом. Задайте вопрос о видеонаблюдении, сетях, пожарных системах, электромонтаже, автоматизации или вашем проекте.",
        intro: "Здравствуйте. Я AI-ассистент Smart Tech. Напишите вопрос или выберите быстрый вопрос.",
        quickLabel: "Быстрые вопросы",
        input: "Напишите вопрос...",
        send: "Отправить",
        typing: "Печатает...",
        status: "Отвечает на армянском, английском и русском",
        questions: [
          "Какие услуги вы предоставляете?",
          "Что нужно для установки видеонаблюдения?",
          "Как получить ценовое предложение?",
          "Сколько времени занимает монтаж?",
          "Хочу связаться со специалистом"
        ]
      }
    });
  }

  site.sections.chatPage = function chatPage() {
    var e = site.utils.escapeHtml;
    var copy = chatPageCopy();
    var quickQuestions = copy.questions.map(function (question) {
      return '<button class="chat-page-quick-btn" type="button" data-chat-page-question="' + e(question) + '">' + e(question) + "</button>";
    }).join("");

    return "" +
      '<section class="chat-page-intro">' +
        '<div class="container chat-page-intro-inner">' +
          '<div class="chat-page-intro-copy reveal">' +
            '<span class="eyebrow">' + e(copy.eyebrow) + "</span>" +
            '<h1>' + e(copy.title) + "</h1>" +
          "</div>" +
          '<div class="chat-page-intro-status reveal" aria-hidden="true">' +
            '<span></span><span></span><span></span>' +
          "</div>" +
        "</div>" +
      "</section>" +
      '<section class="section chat-page-section">' +
        '<div class="container">' +
          '<div class="chat-page" data-chat-page>' +
            '<div class="chat-page-window">' +
              '<div class="chat-page-top">' +
                '<div class="chat-page-agent">' +
                  '<span class="chat-page-agent-mark" aria-hidden="true"><span></span></span>' +
                  '<div>' +
                  '<span class="eyebrow">' + e(copy.eyebrow) + "</span>" +
                    '<p>' + e(copy.status) + "</p>" +
                  "</div>" +
                "</div>" +
              "</div>" +
              '<div class="chat-page-messages" data-chat-page-messages aria-live="polite">' +
                '<div class="chat-page-message chat-page-message-bot">' + e(copy.intro) + "</div>" +
              "</div>" +
              '<div class="chat-page-quick-wrap">' +
                '<p class="chat-page-quick-label">' + e(copy.quickLabel) + "</p>" +
                '<div class="chat-page-quick" data-chat-page-quick role="group">' + quickQuestions + "</div>" +
              "</div>" +
              '<form class="chat-page-form" data-chat-page-form>' +
                '<input class="chat-page-input" data-chat-page-input type="text" autocomplete="off" maxlength="700" placeholder="' + e(copy.input) + '" aria-label="' + e(copy.input) + '">' +
                '<button class="chat-page-send" data-chat-page-send type="submit">' + e(copy.send) + "</button>" +
              "</form>" +
              '<p class="chat-page-status" data-chat-page-status data-typing-label="' + e(copy.typing) + '"></p>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>";
  };
})(window.SmartTech);
