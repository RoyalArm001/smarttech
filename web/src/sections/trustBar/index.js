(function (site) {
  site.sections.trustBar = function trustBar() {
    var e = site.utils.escapeHtml;
    var language = site.i18n.language || "hy";
    var copyByLanguage = {
      hy: {
        aria: "Smart Tech վստահության ցուցանիշներ",
        method: "Smart Tech method",
        noteTitle: "Մեկ թիմ։ Մեկ պատասխանատվություն։",
        noteText: "Նախագծումից մինչև սպասարկում՝ հստակ շղթայով։",
        noteMeta: "անվտանգություն • էլեկտրամոնտաժ • ավտոմատացում",
        items: [
          {
            value: "100+",
            label: "իրականացված լուծումներ",
            detail: "բիզնես, բնակելի և արտադրական օբյեկտների համար"
          },
          {
            value: "13",
            label: "ծառայության ուղղություն",
            detail: "տեսահսկումից մինչև BMS և էլեկտրամոնտաժ"
          },
          {
            value: "24/7",
            label: "սպասարկման պատրաստություն",
            detail: "ստուգում, կարգաբերում և հետագա աջակցություն"
          }
        ]
      },
      en: {
        aria: "Smart Tech trust indicators",
        method: "Smart Tech method",
        noteTitle: "One team. One responsibility.",
        noteText: "From design to support in one clear workflow.",
        noteMeta: "security • electrical works • automation",
        items: [
          {
            value: "100+",
            label: "delivered solutions",
            detail: "for commercial, residential and industrial sites"
          },
          {
            value: "13",
            label: "service directions",
            detail: "from CCTV to BMS and electrical installation"
          },
          {
            value: "24/7",
            label: "support readiness",
            detail: "inspection, tuning and ongoing technical care"
          }
        ]
      },
      ru: {
        aria: "Показатели доверия Smart Tech",
        method: "Метод Smart Tech",
        noteTitle: "Одна команда. Одна ответственность.",
        noteText: "От проекта до обслуживания в единой цепочке.",
        noteMeta: "безопасность • электромонтаж • автоматизация",
        items: [
          {
            value: "100+",
            label: "внедренных решений",
            detail: "для бизнеса, жилых и производственных объектов"
          },
          {
            value: "13",
            label: "направлений сервиса",
            detail: "от видеонаблюдения до BMS и электромонтажа"
          },
          {
            value: "24/7",
            label: "готовность поддержки",
            detail: "проверка, настройка и дальнейшее сопровождение"
          }
        ]
      },
      be: {
        aria: "Паказчыкі даверу Smart Tech",
        method: "Метад Smart Tech",
        noteTitle: "Адна каманда. Адна адказнасць.",
        noteText: "Ад праекта да падтрымкі ў адзінай сістэме.",
        noteMeta: "бяспека • электрамантаж • аўтаматызацыя",
        items: [
          {
            value: "100+",
            label: "рэалізаваных рашэнняў",
            detail: "для бізнесу, жылых і вытворчых аб'ектаў"
          },
          {
            value: "13",
            label: "кірункаў сэрвісу",
            detail: "ад відэаназірання да BMS і электрамантажу"
          },
          {
            value: "24/7",
            label: "гатоўнасць падтрымкі",
            detail: "праверка, наладка і далейшае суправаджэнне"
          }
        ]
      },
      fr: {
        aria: "Indicateurs de confiance Smart Tech",
        method: "Méthode Smart Tech",
        noteTitle: "Une équipe. Une responsabilité.",
        noteText: "De la conception au support dans un flux clair.",
        noteMeta: "sécurité • électricité • automatisation",
        items: [
          {
            value: "100+",
            label: "solutions livrées",
            detail: "pour sites professionnels, résidentiels et industriels"
          },
          {
            value: "13",
            label: "domaines de service",
            detail: "de la vidéosurveillance au BMS et aux travaux électriques"
          },
          {
            value: "24/7",
            label: "support disponible",
            detail: "contrôle, réglage et accompagnement technique continu"
          }
        ]
      }
    };
    var copy = site.i18n.pickLanguageDictionary(copyByLanguage, language);
    if (copy.items && copy.items[1]) {
      copy.items[1].value = String((site.content.services || []).length);
    }
    var stats = copy.items.map(function (item, index) {
      return '' +
        '<div class="trust-item reveal trust-item-' + (index + 1) + '">' +
          '<span class="trust-kicker">' + e(String(index + 1).padStart(2, "0")) + '</span>' +
          '<strong>' + e(item.value) + '</strong>' +
          '<span>' + e(item.label) + '</span>' +
        '</div>';
    }).join("");

    return '' +
      '<section class="trust-band" aria-label="' + e(copy.aria) + '">' +
        '<div class="container trust-grid">' +
          stats +
          '<div class="trust-note reveal">' +
            '<span class="trust-note-kicker">' + e(copy.method) + '</span>' +
            '<strong>' + e(copy.noteTitle) + '</strong>' +
            '<span>' + e(copy.noteText) + '</span>' +
          '</div>' +
        '</div>' +
      '</section>';
  };
})(window.SmartTech);
