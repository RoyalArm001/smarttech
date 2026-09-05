(function (window) {
  "use strict";
  var page = 0;
  var loading = false;
  var labels = { new: "Նոր", read: "Կարդացված", resolved: "Մշակված" };
  function byId(id) { return document.getElementById(id); }
  function el(tag, text, className) {
    var node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function load() {
    if (loading) return;
    loading = true;
    var list = byId("admin-messages-list");
    list.textContent = "Բեռնվում է…";
    byId("messages-prev").disabled = true;
    byId("messages-next").disabled = true;
    return window.adminRequestJson("/api/admin/messages?page=" + page).then(function (data) {
      list.replaceChildren();
      if (!data.messages.length) list.append(el("p", "Նամակներ դեռ չկան։"));
      data.messages.forEach(function (message) {
        var card = el("article", null, "admin-card admin-message");
        var head = el("div", null, "admin-card-head");
        head.append(el("h3", message.name));
        var select = el("select");
        select.setAttribute("aria-label", "Նամակի կարգավիճակ՝ " + message.name);
        Object.keys(labels).forEach(function (value) {
          var option = el("option", labels[value]);
          option.value = value;
          select.append(option);
        });
        select.value = message.status;
        select.addEventListener("change", function () {
          select.disabled = true;
          window.adminRequestJson("/api/admin/messages/" + encodeURIComponent(message.id), {
            method: "PATCH", body: { status: select.value }
          }).then(function (result) {
            message.status = result.message.status;
            window.adminSetStatus("Նամակի կարգավիճակը պահպանված է։");
          }).catch(function (error) {
            select.value = message.status;
            window.adminSetStatus(error.message, true);
          }).finally(function () { select.disabled = false; });
        });
        head.append(select);
        card.append(head, el("small", new Date(message.created_at).toLocaleString("hy-AM")));
        card.append(el("p", [message.phone, message.email].filter(Boolean).join(" · ")));
        card.append(el("p", message.message, "admin-message-body"));
        list.append(card);
      });
      byId("messages-page").textContent = (page + 1) + " / " + Math.max(1, Math.ceil(data.total / 25)) + " · " + data.total + " նամակ";
      byId("messages-prev").disabled = page === 0;
      byId("messages-next").disabled = (page + 1) * 25 >= data.total;
    }).catch(function (error) {
      list.textContent = "Նամակները չբեռնվեցին։ Սեղմեք «Թարմացնել»։";
      window.adminSetStatus(error.message, true);
    }).finally(function () { loading = false; });
  }
  byId("messages-refresh").addEventListener("click", load);
  byId("messages-prev").addEventListener("click", function () { if (!loading && page > 0) { page -= 1; load(); } });
  byId("messages-next").addEventListener("click", function () { if (!loading) { page += 1; load(); } });
  window.SmartTechMessages = { load: load };
})(window);
