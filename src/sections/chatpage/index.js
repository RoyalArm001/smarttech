(function (site) {
  function chatPageCopy() {
    return site.i18n.pickLanguageDictionary({
      hy: {
        eyebrow: "AI օգնական",
        title: "Smart Tech AI",
        text: "Առանձին էջ՝ արագ հավաքել նախագծի բրիֆը։ Ընտրեք պատասխանները կամ գրեք ձեր տարբերակը, AI-ն ask-ը կպատրաստի, դուք կուղարկեք։",
        intro: "Բարև։ Սեղմեք «Նախագծի բրիֆ» կամ գրեք ինչ է պետք։ Հարցերին արագ կպատասխանեք կոճակներով, վերջում հավաքված հայտը կուղարկեք։",
        quickLabel: "Արագ հարցեր",
        input: "Գրեք ձեր հարցը...",
        send: "Ուղարկել",
        typing: "Գրում է...",
        status: "Պատասխանում է հայերեն, անգլերեն և ռուսերեն",
        questions: [
          "Նախագծի բրիֆ",
          "Տեսահսկում եմ ուզում",
          "Ինչպե՞ս ստանալ գնային առաջարկ",
          "Որքա՞ն ժամանակ է տևում տեղադրումը",
          "Ուզում եմ կապվել մասնագետի հետ"
        ]
      },
      en: {
        eyebrow: "AI assistant",
        title: "Smart Tech AI",
        text: "A dedicated page to assemble a project brief quickly. Pick answers or type your own, Smart Tech AI prepares the request for you.",
        intro: "Hi. Tap Project brief or describe what you need. Answer with quick buttons, then submit the assembled request.",
        quickLabel: "Quick questions",
        input: "Type your question...",
        send: "Send",
        typing: "Typing...",
        status: "Replies in Armenian, English and Russian",
        questions: [
          "Project brief",
          "I need CCTV",
          "How can I get a price offer?",
          "How long does installation take?",
          "I want to contact a specialist"
        ]
      },
      ru: {
        eyebrow: "AI-ассистент",
        title: "Smart Tech AI",
        text: "Отдельная страница для быстрого сбора брифа проекта. Выбирайте ответы кнопками или пишите свой вариант, Smart Tech AI подготовит заявку.",
        intro: "Здравствуйте. Нажмите «Бриф проекта» или опишите задачу. Ответьте кнопками и отправьте собранную заявку.",
        quickLabel: "Быстрые вопросы",
        input: "Напишите вопрос...",
        send: "Отправить",
        typing: "Печатает...",
        status: "Отвечает на армянском, английском и русском",
        questions: [
          "Бриф проекта",
          "Нужно видеонаблюдение",
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
      var isSurvey = /բրիֆ|brief|бриф/i.test(question);
      if (isSurvey) {
        return '<button class="chat-page-quick-btn chat-page-quick-btn-primary" type="button" data-chat-page-intent="survey">' + e(question) + "</button>";
      }
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
              '<div class="chat-page-survey-options" data-chat-page-survey-options hidden></div>' +
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
