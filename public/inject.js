(() => {
  const chatContainerId = "bp-web-widget";
  const chatInstances = {};

  function getContainerId(chatId) {
    return chatId ? `${chatId}-container` : chatContainerId;
  }

  function getFrameId(chatId) {
    return chatId || "bp-widget";
  }

  function createElement(tag, parentSelector, attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element[key] = value;
    });
    const parentElement = document.querySelector(parentSelector);
    if (!parentElement) {
      throw new Error(`No element corresponds to ${parentSelector}`);
    }
    parentElement.appendChild(element);
    return element;
  }

  function generateChatKey(clientId) {
    const chatKey = `bp-chat-key-${clientId}`;
    let encryptionKey = localStorage.getItem(chatKey);
    if (!encryptionKey) {
      encryptionKey = Array.from(Array(32))
        .map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 62)))
        .join("");
      localStorage.setItem(chatKey, encryptionKey);
    }
    return encodeURIComponent(JSON.stringify({ config: { ...clientId, encryptionKey } }));
  }

  function generateFrameSrc(hostUrl, clientId) {
    const encodedOptions = generateChatKey(clientId);
    const encodedTitle = encodeURIComponent(clientId.botConversationDescription || clientId.botName || "Chatbot");
    return `${hostUrl}/index.html?options=${encodedOptions}`;
  }

  function createChatInstance(chatId, instance) {
    const chatElement = { iframeWindow: getFrame(chatId)?.contentWindow };
    if (chatInstances[chatId]) {
      Object.assign(chatInstances[chatId], chatElement);
    } else {
      chatInstances[chatId] = createProxy(chatId, chatElement);
    }
  }

  function getChatInstance(chatId) {
    return chatInstances[chatId] || createProxy(chatId, {});
  }

  function createProxy(chatId, instance) {
    return new Proxy(instance, {
      get(target, property) {
        if (target[property]) {
          return target[property];
        }
        if (property === "iframeWindow") {
          return () => {
            console.warn(`No webchat with id ${chatId} has been initialized. \n Please use window.botpressWebChat.init first.`);
          };
        }
        if (property === "eventListener") {
          return { handler: () => {}, topics: [] };
        }
      },
      set(target, property, value) {
        target[property] = value;
        return true;
      },
    });
  }

  function getChatInstanceById(chatId) {
    return chatInstances[chatId];
  }

  function getFrame(containerId, frameId) {
    return document.querySelector(`#${containerId} #${frameId}`);
  }

  window.addEventListener("message", function ({ data: event }) {
    if (!event || typeof event.type !== "string" || typeof event.chatId !== "string") {
      return;
    }

    const { type, value, chatId } = event;

    if (type === "UI.RESIZE") {
      const width = typeof value === "number" ? value + "px" : value;
      const chatFrame = getFrame(getContainerId(chatId), getFrameId(chatId));
      chatFrame.style.width = width;
    }

    if (type === "UI.SET-CLASS") {
      const chatFrame = getFrame(getContainerId(chatId), getFrameId(chatId));
      chatFrame.setAttribute("class", value);
    }

    const chatInstance = getChatInstance(chatId);
    if (chatInstance.eventListener?.topics?.some(topic => topic === "*" || topic === type)) {
      chatInstance.eventListener.handler(event);
    }
  });

  window.botpressWebChat = {
    init: function (config, parentElementId) {
      parentElementId = parentElementId || "body";
      config.chatId = config.chatId || chatContainerId;
      const hostUrl = config.hostUrl || "";
      createElement("link", "head", { rel: "stylesheet", href: `${hostUrl}/inject.css` });
      const frameSrc = generateFrameSrc(hostUrl, config);
      const containerId = getContainerId(config.chatId);
      const frameId = getFrameId(config.chatId);
      createElement("div", parentElementId, { id: containerId, innerHTML: `<iframe id="${frameId}" title="${encodeURIComponent(config.botConversationDescription || config.botName || "Chatbot")}" frameborder="0" src="${frameSrc}" class="bp-widget-web"/>` });
      createChatInstance(config.chatId);
    },
    configure: function (payload, chatId) {
      getChatInstanceById(chatId).iframeWindow.postMessage({ action: "configure", payload }, "*");
    },
    sendEvent: function (payload, chatId) {
      getChatInstanceById(chatId).iframeWindow.postMessage({ action: "event", payload }, "*");
    },
    mergeConfig: function (payload, chatId) {
      getChatInstanceById(chatId).iframeWindow.postMessage({ action: "mergeConfig", payload }, "*");
    },
    sendPayload: function (payload, chatId) {
      getChatInstanceById(chatId).iframeWindow.postMessage({ action: "sendPayload", payload }, "*");
    },
    onEvent: function (handler, topics = [], chatId) {
      if (typeof handler !== "function") {
        throw new Error("EventHandler is not a function, please provide a function");
      }
      if (!Array.isArray(topics)) {
        throw new Error("Topics should be an array of supported event types");
      }
      const eventListener = { handler, topics };
      if (chatInstances[chatId]) {
        Object.assign(chatInstances[chatId].eventListener, eventListener);
      } else {
        chatInstances[chatId] = createProxy(chatId, { eventListener });
      }
    },
  };
})();
