(() => {
  const e = "bp-web-widget",
    t = {};
  function n(t) {
    return t ? `${t}-container` : e;
  }
  function o(e) {
    return e || "bp-widget";
  }
  function i(e, t, n = {}) {
    const o = document.createElement(e);
    Object.entries(n).forEach(([e, t]) => (o[e] = t));
    const i = document.querySelector(t);
    if (!i) throw new Error(`No element correspond to ${t}`);
    return i.appendChild(o), o;
  }
  function r(e, t) {
    const n = `bp-chat-key-${t.clientId}`;
    let i = localStorage.getItem(n);
    i ||
      ((i = (function (e) {
        const t =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let n = "";
        for (let o = 0; o < e; o++)
          n += t.charAt(Math.floor(Math.random() * t.length));
        return n;
      })(32)),
      localStorage.setItem(n, i));
    const r = encodeURIComponent(
        JSON.stringify({
          config: Object.assign(Object.assign({}, t), { encryptionKey: i }),
        })
      ),
      a = encodeURIComponent(
        t.botConversationDescription || t.botName || "Chatbot"
      ),
      c = e + "/index.html?options=" + r;
    return `<iframe id="${o(
      t.chatId
    )}" title="${a}" frameborder="0" src="${c}" class="bp-widget-web"/>`;
  }
  function a(e, t) {
    return new Proxy(t, {
      get: (t, n) =>
        t[n]
          ? t[n]
          : "iframeWindow" === n
          ? () => {
              console.warn(
                `No webchat with id ${e} has been initialized. \n Please use window.botpressWebChat.init first.`
              );
            }
          : "eventListener" === n
          ? { handler: () => {}, types: [] }
          : void 0,
      set: (e, t, n) => ((e[t] = n), !0),
    });
  }
  function c(n) {
    return t[(n = n || e)];
  }
  function s(e, t) {
    return document.querySelector(`#${e} #${t}`);
  }
  window.addEventListener("message", function ({ data: e }) {
    if (
      !(function (e) {
        return e && "string" == typeof e.type && "string" == typeof e.chatId;
      })(e)
    )
      return;
    if ("UI.RESIZE" === e.type) {
      const t = "number" == typeof e.value ? e.value + "px" : e.value;
      s(n(e.chatId), o(e.chatId)).style.width = t;
    }
    if ("UI.SET-CLASS" === e.type) {
      s(n(e.chatId), o(e.chatId)).setAttribute("class", e.value);
    }
    const t = c(e.chatId);
    t &&
      t.eventListener?.topics?.some((t) => "*" === t || t === e.type) &&
      t.eventListener.handler(e);
  }),
    (window.botpressWebChat = {
      init: function (c, d) {
        (d = d || "body"), (c.chatId = c.chatId || e);
        const f = c.hostUrl || "";
        i("link", "head", { rel: "stylesheet", href: `${f}/inject.css` });
        const u = r(f, c),
          l = n(c.chatId),
          h = o(c.chatId);
        i("div", d, { id: l, innerHTML: u });
        const p = { iframeWindow: s(l, h).contentWindow };
        t[c.chatId]
          ? Object.assign(t[c.chatId], p)
          : (t[c.chatId] = a(c.chatId, p));
      },
      configure: function (e, t) {
        c(t).iframeWindow.postMessage({ action: "configure", payload: e }, "*");
      },
      sendEvent: function (e, t) {
        c(t).iframeWindow.postMessage({ action: "event", payload: e }, "*");
      },
      mergeConfig: function (e, t) {
        c(t).iframeWindow.postMessage(
          { action: "mergeConfig", payload: e },
          "*"
        );
      },
      sendPayload: function (e, t) {
        c(t).iframeWindow.postMessage(
          { action: "sendPayload", payload: e },
          "*"
        );
      },
      onEvent: function (n, o = [], i) {
        if ("function" != typeof n)
          throw new Error(
            "EventHandler is not a function, please provide a function"
          );
        if (!Array.isArray(o))
          throw new Error("Topics should be an array of supported event types");
        const r = { eventListener: { handler: n, topics: o } };
        t[(i = i || e)] ? Object.assign(t[i], r) : (t[i] = a(i, r));
      },
    });
})();
//# sourceMappingURL=inject.js.map
