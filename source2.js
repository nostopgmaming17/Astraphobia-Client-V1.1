(function () {
  'use strict';

  let autoChatInterval = null;
  let isAutoChatting = false;
  function startAutoChat(message, intervalSeconds) {
    if (autoChatInterval) {
      clearInterval(autoChatInterval);
    }
    isAutoChatting = true;
    autoChatInterval = setInterval(() => {
      typeAndSendMessage(message);
    }, intervalSeconds * 1000);
  }
  function stopAutoChat() {
    if (autoChatInterval) {
      clearInterval(autoChatInterval);
      autoChatInterval = null;
    }
    isAutoChatting = false;
  }
  function typeAndSendMessage(message) {
    const chatInputElement = document.querySelector(".chat-input input") || document.querySelector("input[placeholder*=\"chat\" i]") || document.querySelector("input[type=\"text\"]");
    if (!chatInputElement) {
      console.warn("Chat input not found - skipping auto chat");
      return;
    }
    chatInputElement.focus();
    chatInputElement.value = "";
    let charIndex = 0;
    const typeCharacter = () => {
      if (charIndex >= message.length) {
        const sendButtonElement = document.querySelector(".chat-input button") || document.querySelector("button[aria-label*=\"send\" i]") || document.querySelector("button");
        if (sendButtonElement) {
          sendButtonElement.click();
        } else {
          chatInputElement.dispatchEvent(new Event("change", {
            bubbles: true
          }));
          chatInputElement.dispatchEvent(new Event("input", {
            bubbles: true
          }));
          setTimeout(() => {
            chatInputElement.value = "";
            chatInputElement.blur();
          }, 100);
        }
        return;
      }
      chatInputElement.value += message[charIndex];
      chatInputElement.dispatchEvent(new InputEvent("input", {
        bubbles: true
      }));
      charIndex++;
      setTimeout(typeCharacter, 25);
    };
    typeCharacter();
  }
  let isPatched = false;
  function enableSpecialCharacters(buttonElement) {
    if (isPatched) {
      return;
    }
    function unescapeString(inputString) {
      if (typeof inputString !== "string") {
        return inputString;
      }
      return inputString.replace(/\\(\\|n|r|t|b|f|v|\d{1,3}|x([\da-fA-F]{2})|u([\da-fA-F]{4})|u\{(0*[\da-fA-F]{1,6})\})/g, (match, fullEscape, hex2, hex4, hex6) => {
        switch (fullEscape) {
          case "\\":
            return "\\";
          case "n":
            return "\n";
          case "r":
            return "\r";
          case "t":
            return "\t";
          case "b":
            return "\b";
          case "f":
            return "\f";
          case "v":
            return " ";
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
            return String.fromCharCode(Number.parseInt(fullEscape, 8) || 0);
          default:
            if (hex2 != null) {
              return String.fromCharCode(Number.parseInt(hex2, 16) || 0);
            }
            if (hex4 != null) {
              return String.fromCharCode(Number.parseInt(hex4, 16) || 0);
            }
            if (hex6 != null) {
              const codePoint = Number.parseInt(hex6, 16) || 0;
              if (codePoint > 1114111) {
                return match;
              } else {
                return String.fromCodePoint(codePoint);
              }
            }
            return fullEscape;
        }
      });
    }
    const packetLengthLimits = {
      spawn: 22,
      createTribe: 5,
      chat: 100
    };
    const originalEncode = TextEncoder.prototype.encode;
    TextEncoder.prototype.encode = function (...args) {
      try {
        const packetRegexes = [/^(\x14{3}\d+\|6\|)(.+)$/gm, /^(\x14{3}\d+\|8\|)(.+)$/gm, /^(\x14{3}\d+\|14\|)(.+)$/gm, /^(\x13{3})(.+)$/gm];
        for (let i = 0; i < packetRegexes.length; i++) {
          const packetMatch = packetRegexes[i].exec(args);
          if (packetMatch && packetMatch.length === 3) {
            const maxLength = [packetLengthLimits.spawn, packetLengthLimits.spawn, packetLengthLimits.createTribe, packetLengthLimits.chat][i];
            args = packetMatch + unescapeString(packetMatch).substr(0, maxLength);
            break;
          }
        }
      } catch {}
      return Reflect.apply(originalEncode, this, args);
    };
    const inputLengthObserver = new MutationObserver(() => {
      document.querySelector(".play-game .el-input__inner")?.setAttribute("maxlength", "80");
      document.querySelector(".new-tribe .el-input__inner")?.setAttribute("maxlength", "20");
      document.querySelector(".chat-input input")?.setAttribute("maxLength", "1000");
    });
    inputLengthObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    isPatched = true;
    if (buttonElement) {
      buttonElement.textContent = "Special Characters Active";
      buttonElement.disabled = true;
      buttonElement.style.opacity = "0.6";
      buttonElement.style.cursor = "not-allowed";
    }
    showToast("✅ Special Characters enabled! (One-time use)");
  }
  let autoSpinInterval = null;
  let angleIndex = 0;
  const spinAngles =;
  const spinRadius = 300;
  function getGameCanvas() {
    return document.querySelector("#gameCanvas") || document.querySelector("canvas") || document.querySelector("#canvas-container canvas");
  }
  function startAutoSpin() {
    if (autoSpinInterval) {
      return;
    }
    const gameCanvas = getGameCanvas();
    if (!gameCanvas) {
      showToast("Game canvas not found!");
      return;
    }
    autoSpinInterval = setInterval(() => {
      const angleDegrees = spinAngles[angleIndex];
      const angleRadians = Math.PI * 2 * angleDegrees / 360;
      const xOffset = Math.round(spinRadius * Math.sin(angleRadians));
      const yOffset = Math.round(spinRadius * Math.cos(angleRadians));
      gameCanvas.dispatchEvent(new MouseEvent("pointermove", {
        clientX: window.innerWidth / 2 + xOffset,
        clientY: window.innerHeight / 2 + yOffset,
        bubbles: true
      }));
      angleIndex = (angleIndex + 1) % spinAngles.length;
    }, 15);
  }
  function stopAutoSpin() {
    if (autoSpinInterval) {
      clearInterval(autoSpinInterval);
      autoSpinInterval = null;
    }
  }
  let gameInstance;
  let simpleGameState;
  let sceneInstance;
  let isZoomPatchActive = false;
  let areBoostListenersActive = false;
  const createPacket = (token, packetId, data = "") => {
    if (!token) {
      return null;
    }
    const encodeXOR = ((payload, key) => {
      const encoder = new TextEncoder();
      const encodedPayload = encoder.encode(payload);
      const encodedKey = encoder.encode(key);
      const resultArray = new Uint8Array(encodedPayload.length);
      for (let i = 0; i < encodedPayload.length; i++) {
        resultArray[i] = encodedPayload[i] ^ encodedKey[i % encodedKey.length];
      }
      return btoa(String.fromCharCode(...resultArray));
    })(String.fromCharCode(packetId).repeat(3) + data, token);
    const encodedData = new TextEncoder().encode(encodeXOR);
    const packetLength = 1 + encodedData.byteLength + 1;
    const packetBuffer = new ArrayBuffer(packetLength);
    const packetView = new DataView(packetBuffer);
    packetView.setUint8(0, 25);
    new Uint8Array(packetBuffer).set(encodedData, 1);
    packetView.setUint8(packetLength - 1, packetId);
    return packetBuffer;
  };
  const animalBoostConfig = {
    93: {
      hasSec: true,
      secLoadTime: 750
    },
    107: {
      hasSec: true,
      secLoadTime: 750,
      hasScaling: true
    },
    default: {
      hasSec: false,
      secLoadTime: 500,
      hasScaling: false
    }
  };
  const sendBoostPacket = (packetId, data = "") => {
    if (gameInstance && data && gameObjectRefs.socketManager) {
      gameInstance[gameObjectRefs.socketManager].sendBytePacket(createPacket(data.token, packetId, data));
    }
  };
  const handleBoost = value => {
    const PACKET_ID_BOOST = 1;
    const PACKET_ID_SEC_BOOST = 4;
    const PACKET_ID_SCALED_BOOST = 5;
    try {
      const currentAnimalConfig = {
        ...animalBoostConfig.default,
        ...(animalBoostConfig[sceneInstance?.myAnimals?.visibleFishLevel] || {})
      };
      if (value < (sceneInstance?.myAnimals?._standing ? 40 : 100)) {
        return sendBoostPacket(PACKET_ID_BOOST);
      }
      if (sceneInstance?.myAnimals?._standing) {
        return sendBoostPacket(PACKET_ID_SCALED_BOOST, value);
      }
      if (currentAnimalConfig.hasScaling) {
        return sendBoostPacket(PACKET_ID_SCALED_BOOST, value);
      }
      if (currentAnimalConfig.hasSec) {
        return sendBoostPacket(PACKET_ID_SEC_BOOST, value);
      }
      return sendBoostPacket(PACKET_ID_BOOST);
    } catch {}
  };
  const getAllPropertyNames = obj => {
    return [...Object.getOwnPropertyNames(Object.getPrototypeOf(obj)), ...Object.getOwnPropertyNames(obj)];
  };
  const gameObjectRefs = {};
  let lastToastTimestamp = 0;
  function showToast(message) {
    const toastElement = document.createElement("div");
    toastElement.style.cssText = "position: fixed; top: 20px; right: 20px; background: rgba(0, 0, 0, 0.8); color: white; padding: 10px 15px; border-radius: 5px; z-index: 10001; font-size: 14px; opacity: 0; transition: opacity 0.3s; pointer-events: none;";
    toastElement.textContent = message;
    document.body.appendChild(toastElement);
    setTimeout(() => {
      toastElement.style.opacity = "1";
    }, 10);
    setTimeout(() => {
      toastElement.style.opacity = "0";
      setTimeout(() => toastElement.remove(), 300);
    }, 3000);
  }
  const initializeHooks = () => {
    const reflectAPI = {};
    for (const prop of Object.getOwnPropertyNames(Reflect)) {
      reflectAPI[prop] = Reflect[prop];
    }
    const OriginalProxy = Proxy;
    const originalFunctionMap = new WeakMap();
    originalFunctionMap.set = originalFunctionMap.set;
    originalFunctionMap.get = originalFunctionMap.get;
    originalFunctionMap.has = originalFunctionMap.has;
    const proxyInstanceSet = new WeakSet();
    proxyInstanceSet.add = proxyInstanceSet.add;
    proxyInstanceSet.has = proxyInstanceSet.has;
    proxyInstanceSet.delete = proxyInstanceSet.delete;
    const lookupGetter = Object.prototype.__lookupGetter__;
    const proxyFunction = (object, property, handler) => {
      const proxy = new OriginalProxy(object[property], handler);
      originalFunctionMap.set(proxy, object[property]);
      object[property] = proxy;
    };
    proxyFunction(Function.prototype, "toString", {
      apply(target, thisArg, args) {
        return reflectAPI.apply(target, originalFunctionMap.get(thisArg) || thisArg, args);
      }
    });
    proxyFunction(window, "Proxy", {
      construct(target, args) {
        const newProxy = reflectAPI.construct(target, args);
        proxyInstanceSet.add(newProxy);
        return newProxy;
      }
    });
    proxyFunction(OriginalProxy, "revocable", {
      apply(target, thisArg, args) {
        const result = reflectAPI.apply(target, thisArg, args);
        proxyInstanceSet.add(result.proxy);
        return result;
      }
    });
    let loadMessageTimestamp = 0;
    proxyFunction(Function.prototype, "bind", {
      apply(target, thisArg, args) {
        if (proxyInstanceSet.has(args)) {
          return reflectAPI.apply(target, thisArg, args);
        }
        try {
          try {
            if (lookupGetter.call(args, "aboveBgPlatformsContainer") != null) {
              return reflectAPI.apply(target, thisArg, args);
            }
          } catch {}
          if (args && args.aboveBgPlatformsContainer != null) {
            sceneInstance = args;
            gameInstance = args.game;
            const scenePropNames = getAllPropertyNames(sceneInstance);
            const obfuscatedPropNames = scenePropNames.filter(prop => prop.startsWith("_0x"));
            gameObjectRefs.setFlash = Object.getOwnPropertyNames(sceneInstance.__proto__.__proto__).filter(prop => prop.startsWith("_0x")).find(prop => sceneInstance[prop] instanceof Function) || gameObjectRefs.setFlash;
            gameObjectRefs.terrainManager = obfuscatedPropNames.find(prop => typeof sceneInstance[prop]?.shadow !== "undefined") || gameObjectRefs.terrainManager;
            gameObjectRefs.entityManager = obfuscatedPropNames.find(prop => typeof sceneInstance[prop]?.entitiesList !== "undefined") || gameObjectRefs.entityManager;
            gameObjectRefs.entityManagerProps = {};
            const entityManagerPropNames = getAllPropertyNames(sceneInstance[gameObjectRefs.entityManager]);
            const findAnimalListInterval = setInterval(() => {
              gameObjectRefs.entityManagerProps.animalsList = entityManagerPropNames.filter(prop => prop.startsWith("_0x")).find(prop => typeof sceneInstance?.[gameObjectRefs.entityManager]?.[prop]?. !== "undefined") || gameObjectRefs.entityManagerProps.animalsList;
              if (typeof gameObjectRefs.entityManagerProps.animalsList !== "undefined") {
                clearInterval(findAnimalListInterval);
              }
            }, 1000);
            gameObjectRefs.socketManager = getAllPropertyNames(gameInstance).find(prop => typeof gameInstance[prop]?.sendBytePacket !== "undefined") || gameObjectRefs.socketManager;
            try {
              simpleGameState = document.getElementById("app")._vnode.appContext.config.globalProperties.$simpleState.states.find(state => state._storeMeta.id === "game");
            } catch {}
            if (loadMessageTimestamp < Date.now() - 3000) {
              showToast("✅ Astraphobia client loaded in game");
              loadMessageTimestamp = Date.now();
            }
            disableZoomLimit();
            setupBoostListeners();
          }
        } catch {}
        return reflectAPI.apply(target, thisArg, args);
      }
    });
  };
  const disableZoomLimit = () => {
    if (isZoomPatchActive) {
      return;
    }
    setInterval(() => {
      try {
        gameInstance.viewport.clampZoom({
          minWidth: 0,
          maxWidth: 10000000
        });
        gameInstance.viewport.plugins.plugins.clamp = null;
        gameInstance.viewport.plugins.plugins["clamp-zoom"] = null;
      } catch {}
    }, 300);
    isZoomPatchActive = true;
  };
  const setupBoostListeners = () => {
    if (areBoostListenersActive) {
      return;
    }
    function performThresherBoost() {
      try {
        handleBoost(1);
        setTimeout(() => {
          handleBoost(5000);
        }, 50);
        setTimeout(() => {
          handleBoost(5000);
        }, 100);
        setTimeout(() => {
          handleBoost(5000);
        }, 150);
      } catch {}
    }
    function createControlOverlay() {
      try {
        document.getElementById("ctrl-overlay").remove();
      } catch {}
      const overlayElement = document.createElement("div");
      const gameContainer = document.querySelector("div.game");
      if (gameContainer) {
        gameContainer.insertBefore(overlayElement, gameContainer.children);
      }
      overlayElement.outerHTML = "<div id=\"ctrl-overlay\" style=\"width: 100%;height: 100%;position: absolute;display: block;z-index:10000;pointer-events:none;\"></div>";
      document.getElementById("ctrl-overlay").addEventListener("contextmenu", event => event.preventDefault());
    }
    createControlOverlay();
    window.addEventListener("click", event => {
      try {
        if (!sceneInstance?.myAnimals?.) {
          return;
        }
        const currentAnimalLevel = sceneInstance.myAnimals.visibleFishLevel;
        const currentAnimalConfig = {
          ...animalBoostConfig.default,
          ...animalBoostConfig[currentAnimalLevel]
        };
        if (event.ctrlKey) {
          if (event.shiftKey && currentAnimalLevel === 107) {
            performThresherBoost();
            return;
          } else if (event.shiftKey && currentAnimalLevel !== 101 && sceneInstance.myAnimals._standing) {
            handleBoost(Math.floor(Math.random() * 1647483648) + 500000000);
            return;
          } else {
            if (currentAnimalLevel === 93 && currentAnimalConfig.hasSec) {
              handleBoost(1000);
              return;
            }
            let inputManager = Object.getOwnPropertyNames(gameInstance).map(key => gameInstance[key]).find(prop => prop.keys instanceof Array);
            if (inputManager) {
              inputManager.pointerDown = true;
              inputManager.pressElapsed = Infinity;
              inputManager.setPointerDown(false);
            }
          }
        } else if (event.altKey) {
          handleBoost(sceneInstance?.myAnimals?._standing ? 41 : Math.floor(currentAnimalConfig.secLoadTime / 2));
        }
      } catch {}
    }, false);
    window.addEventListener("keyup", event => {
      try {
        if (!event.ctrlKey && !event.altKey) {
          document.getElementById("ctrl-overlay").style.pointerEvents = "none";
        }
      } catch {}
    }, false);
    window.addEventListener("focus", () => {
      try {
        document.getElementById("ctrl-overlay").style.pointerEvents = "none";
      } catch {}
    });
    areBoostListenersActive = true;
  };
  function createUpdateHistoryPanel() {
    const styleElement = document.createElement("style");
    styleElement.textContent = "\n      #update-history {\n        position: fixed;\n        bottom: 20px;\n        left: 20px;\n        background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);\n        color: #e0e0e0;\n        padding: 14px;\n        border-radius: 12px;\n        font-size: 13px;\n        z-index: 9999;\n        max-width: 220px;\n        max-height: 250px;\n        overflow-y: auto;\n        font-family: 'Segoe UI', sans-serif;\n        cursor: move;\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);\n        border: 1px solid #333;\n        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n      }\n      #update-history:hover {\n        transform: translateY(-2px);\n        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);\n      }\n      #update-history ul {\n        margin: 0;\n        padding-left: 15px;\n      }\n      #update-history li {\n        margin-bottom: 5px;\n        line-height: 1.3;\n      }\n      #update-history h3 {\n        margin: 0 0 10px 0;\n        font-size: 14px;\n        color: #ff4d4d;\n        position: relative;\n        padding-right: 25px;\n        text-shadow: 0 0 8px rgba(255,77,77,0.3);\n        font-weight: 700;\n      }\n      #update-history button.min-btn {\n        background: none;\n        border: none;\n        color: #ff4d4d;\n        font-size: 18px;\n        cursor: pointer;\n        position: absolute;\n        top: 50%;\n        right: 5px;\n        transform: translateY(-50%);\n        z-index: 1;\n        transition: color 0.2s ease;\n      }\n      #update-history button.min-btn:hover {\n        color: #ff6666;\n      }\n    ";
    document.head.appendChild(styleElement);
    const panelElement = document.createElement("div");
    panelElement.id = "update-history";
    panelElement.innerHTML = "\n      <h3>Update History <button class=\"min-btn\" id=\"minHist\">−</button></h3>\n      <div id=\"historyContent\">\n        <ul>\n          <li>v1.0 - Initial release with auto chat, auto-spin, special character bypass, and thresher super boost, no-zoom limit is automatically enabled.</li>\n          <li>Plans for v1.1-Custom Background for Astraphobia Client & built in ad-blocker & Goblin aimbot line (next update)</li>\n        </ul>\n      </div>\n    ";
    document.body.appendChild(panelElement);
    const minimizeButton = panelElement.querySelector("#minHist");
    const contentElement = panelElement.querySelector("#historyContent");
    let isMinimized = false;
    minimizeButton.onclick = event => {
      event.stopPropagation();
      isMinimized = !isMinimized;
      contentElement.style.display = isMinimized ? "none" : "block";
      panelElement.style.height = isMinimized ? "50px" : "auto";
      minimizeButton.textContent = isMinimized ? "+" : "−";
    };
    let offsetX;
    let offsetY;
    let isMouseDown = false;
    let isDragging = false;
    panelElement.addEventListener("mousedown", event => {
      if (["BUTTON", "INPUT", "TEXTAREA", "A"].includes(event.target.tagName)) {
        return;
      }
      isMouseDown = true;
      isDragging = false;
      offsetX = event.clientX - panelElement.getBoundingClientRect().left;
      offsetY = event.clientY - panelElement.getBoundingClientRect().top;
      panelElement.style.transition = "none";
      const onDragMove = moveEvent => {
        const deltaX = moveEvent.clientX - event.clientX;
        const deltaY = moveEvent.clientY - event.clientY;
        if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
          isDragging = true;
        }
        if (isMouseDown) {
          panelElement.style.left = moveEvent.clientX - offsetX + "px";
          panelElement.style.top = moveEvent.clientY - offsetY + "px";
          panelElement.style.bottom = "auto";
          panelElement.style.right = "auto";
        }
      };
      const onDragEnd = () => {
        isMouseDown = false;
        panelElement.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
        document.removeEventListener("mousemove", onDragMove);
        document.removeEventListener("mouseup", onDragEnd);
      };
      document.addEventListener("mousemove", onDragMove);
      document.addEventListener("mouseup", onDragEnd);
    });
    panelElement.addEventListener("click", event => {
      if (isDragging) {
        event.stopImmediatePropagation();
      }
    });
  }
  function createToolsPanel() {
    const styleElement = document.createElement("style");
    styleElement.textContent = "\n      #deep-tools-panel {\n        font-family: 'Segoe UI', sans-serif;\n        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);\n        border: 1px solid #333;\n        background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);\n      }\n      #deep-tools-panel:hover {\n        transform: translateY(-2px);\n        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);\n      }\n      #deep-tools-panel textarea {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 6px;\n        padding: 8px;\n        transition: border-color 0.2s;\n        font-size: 13px;\n      }\n      #deep-tools-panel textarea:focus {\n        outline: none;\n        border-color: #ff4d4d;\n        box-shadow: 0 0 0 2px rgba(255,77,77,0.3);\n      }\n      #deep-tools-panel input[type=\"number\"] {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 4px;\n        padding: 4px;\n        width: 60px;\n        text-align: center;\n      }\n      #deep-tools-panel button {\n        background: linear-gradient(to bottom, #222, #111);\n        color: #ff4d4d;\n        border: 1px solid #444;\n        border-radius: 6px;\n        padding: 8px 0;\n        font-weight: 600;\n        font-size: 13px;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        letter-spacing: 0.5px;\n      }\n      #deep-tools-panel button:hover:not(:disabled) {\n        background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);\n        border-color: #ff4d4d;\n        transform: translateY(-1px);\n        box-shadow: 0 4px 8px rgba(255,77,77,0.3);\n      }\n      #deep-tools-panel button:active:not(:disabled) {\n        transform: translateY(0);\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n      }\n      #deep-tools-panel button:disabled {\n        opacity: 0.5;\n        cursor: not-allowed;\n        transform: none;\n        box-shadow: none;\n      }\n      #deep-tools-panel button.min-btn {\n        background: none;\n        border: none;\n        color: #ff4d4d;\n        font-size: 18px;\n        cursor: pointer;\n        position: absolute;\n        top: 50%;\n        right: 5px;\n        transform: translateY(-50%);\n        z-index: 1;\n        transition: color 0.2s ease;\n      }\n      #deep-tools-panel button.min-btn:hover {\n        color: #ff6666;\n      }\n      #deep-tools-panel .credits {\n        margin-top: 10px;\n        font-size: 10px;\n        color: #777;\n        line-height: 1.3;\n      }\n      #deep-tools-panel .auto-chat-controls {\n        display: flex;\n        gap: 5px;\n        margin-bottom: 8px;\n        align-items: center;\n        justify-content: center;\n      }\n      #aim-overlay, #ctrl-overlay {\n        z-index: 10000 !important;\n      }\n      div.game {\n        position: relative;\n      }\n      /* Ad Removal */\n      div.sidebar.left > div.ad-block {\n        opacity: 0 !important;\n        pointer-events: none !important;\n        display: none !important;\n      }\n      div.sidebar.left > a {\n        display: none !important;\n      }\n      div.sidebar.left {\n        max-width: 30vw;\n        width: 21rem;\n        bottom: 0 !important;\n      }\n    ";
    document.head.appendChild(styleElement);
    const panelElement = document.createElement("div");
    panelElement.id = "deep-tools-panel";
    panelElement.style.position = "fixed";
    panelElement.style.bottom = "20px";
    panelElement.style.right = "20px";
    panelElement.style.color = "#e0e0e0";
    panelElement.style.padding = "14px";
    panelElement.style.borderRadius = "12px";
    panelElement.style.fontSize = "14px";
    panelElement.style.zIndex = "99999";
    panelElement.style.userSelect = "none";
    panelElement.style.width = "220px";
    panelElement.style.textAlign = "center";
    panelElement.style.cursor = "move";
    panelElement.style.overflow = "hidden";
    panelElement.innerHTML = "\n      <div style=\"font-weight:700; margin-bottom:10px; color:#ff4d4d; text-shadow: 0 0 8px rgba(255,77,77,0.3); position: relative; height: 40px; line-height: 40px;\">\n        ASTRAPHOBIA CLIENT\n        <button class=\"min-btn\" id=\"minPanel\">−</button>\n      </div>\n      <div id=\"panelContent\">\n        <textarea id=\"chatMsg\" placeholder=\"Type message...\" style=\"width:100%; height:45px; margin-bottom:10px; resize:none;\"></textarea>\n        <button id=\"sendBtn\" style=\"width:100%; margin-bottom:8px;\">Send Typed Chat</button>\n        <div class=\"auto-chat-controls\">\n          <input type=\"number\" id=\"delayInput\" min=\"1\" max=\"300\" value=\"10\" style=\"margin-right:5px;\">\n          <span style=\"font-size:12px;\">sec</span>\n        </div>\n        <button id=\"autoChatBtn\" style=\"width:100%; margin-bottom:8px;\">Enable Auto Chat</button>\n        <button id=\"patchBtn\" style=\"width:100%; margin-bottom:8px;\">Enable Special Characters (in chat/clan/name)</button>\n        <button id=\"spinBtn\" style=\"width:100%; margin-bottom:8px;\">Enable Auto Spin</button>\n        <button id=\"thresherBtn\" style=\"width:100%; margin-bottom:8px;\">Enable Thresher Super Boost (controls:ctrl + shift and click) (minumum required 2 boost)</button>\n        <div class=\"credits\">\n          Coder: Astraphobia<br>\n          Owner: Astraphobia<br>\n          Designer: Astraphobia<br>\n          Tester: Astraphobia\n        </div>\n      </div>\n    ";
    document.body.appendChild(panelElement);
    const minimizeButton = panelElement.querySelector("#minPanel");
    const contentElement = panelElement.querySelector("#panelContent");
    let isMinimized = false;
    minimizeButton.onclick = event => {
      event.stopPropagation();
      isMinimized = !isMinimized;
      contentElement.style.display = isMinimized ? "none" : "block";
      panelElement.style.height = isMinimized ? "50px" : "auto";
      minimizeButton.textContent = isMinimized ? "+" : "−";
    };
    panelElement.querySelector("#sendBtn").onclick = () => {
      const chatMessage = panelElement.querySelector("#chatMsg").value;
      if (chatMessage) {
        typeAndSendMessage(chatMessage);
      }
    };
    const patchButton = panelElement.querySelector("#patchBtn");
    patchButton.onclick = () => enableSpecialCharacters(patchButton);
    const autoSpinButton = panelElement.querySelector("#spinBtn");
    autoSpinButton.onclick = () => {
      if (!autoSpinInterval) {
        startAutoSpin();
        autoSpinButton.textContent = "Disable Auto Spin";
        autoSpinButton.style.color = "#4dff4d";
      } else {
        stopAutoSpin();
        autoSpinButton.textContent = "Enable Auto Spin";
        autoSpinButton.style.color = "#ff4d4d";
      }
    };
    const autoChatButton = panelElement.querySelector("#autoChatBtn");
    autoChatButton.onclick = () => {
      const autoChatMessage = panelElement.querySelector("#chatMsg").value;
      const delayInputElement = panelElement.querySelector("#delayInput");
      const delaySeconds = parseInt(delayInputElement.value) || 10;
      if (!autoChatMessage) {
        showToast("⚠️ Enter a message first!");
        return;
      }
      if (isAutoChatting) {
        stopAutoChat();
        autoChatButton.textContent = "Enable Auto Chat";
        autoChatButton.style.color = "#ff4d4d";
      } else {
        startAutoChat(autoChatMessage, delaySeconds);
        autoChatButton.textContent = "Disable Auto Chat";
        autoChatButton.style.color = "#4dff4d";
      }
    };
    const thresherBoostButton = panelElement.querySelector("#thresherBtn");
    thresherBoostButton.onclick = () => {
      if (isZoomPatchActive) {
        showToast("Thresher Super Boost is already active!");
        return;
      }
      initializeHooks();
      thresherBoostButton.textContent = "Thresher Super Boost Active";
      thresherBoostButton.style.color = "#4dff4d";
      thresherBoostButton.disabled = true;
    };
    let offsetX;
    let offsetY;
    let isMouseDown = false;
    let isDragging = false;
    panelElement.addEventListener("mousedown", event => {
      if (event.target.tagName === "BUTTON" || event.target.tagName === "TEXTAREA" || event.target.tagName === "INPUT" || event.target.classList.contains("credits")) {
        return;
      }
      isMouseDown = true;
      isDragging = false;
      offsetX = event.clientX - panelElement.getBoundingClientRect().left;
      offsetY = event.clientY - panelElement.getBoundingClientRect().top;
      panelElement.style.transition = "none";
      const onDragMove = moveEvent => {
        const deltaX = moveEvent.clientX - event.clientX;
        const deltaY = moveEvent.clientY - event.clientY;
        if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
          isDragging = true;
        }
        if (isMouseDown) {
          panelElement.style.left = moveEvent.clientX - offsetX + "px";
          panelElement.style.top = moveEvent.clientY - offsetY + "px";
          panelElement.style.bottom = "auto";
          panelElement.style.right = "auto";
        }
      };
      const onDragEnd = () => {
        isMouseDown = false;
        panelElement.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
        document.removeEventListener("mousemove", onDragMove);
        document.removeEventListener("mouseup", onDragEnd);
      };
      document.addEventListener("mousemove", onDragMove);
      document.addEventListener("mouseup", onDragEnd);
    });
    panelElement.addEventListener("click", event => {
      if (isDragging) {
        event.stopImmediatePropagation();
      }
    });
  }
  if (document.body) {
    createToolsPanel();
    createUpdateHistoryPanel();
  } else {
    const bodyObserver = new MutationObserver(() => {
      if (document.body) {
        createToolsPanel();
        createUpdateHistoryPanel();
        bodyObserver.disconnect();
      }
    });
    bodyObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  window.addEventListener("load", () => {
    setTimeout(() => {
      initializeHooks();
    }, 1000);
  });
})();
