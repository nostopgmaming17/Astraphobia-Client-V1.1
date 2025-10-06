(function () {
  'use strict';

  function f(p) {
    let vLS = "";
    for (let vLN0 = 0; vLN0 < p; vLN0++) {
      const v = Math.floor(Math.random() * 1048575 + 65536);
      vLS += String.fromCodePoint(v);
    }
    return vLS;
  }
  function f2(p2, p3) {
    const v2 = document.querySelector(p2);
    if (!v2) {
      return false;
    }
    v2.focus();
    v2.value = "";
    let vLN02 = 0;
    const vF = () => {
      if (vLN02 >= p3.length) {
        v2.dispatchEvent(new Event("change", {
          bubbles: true
        }));
        v2.dispatchEvent(new Event("input", {
          bubbles: true
        }));
        setTimeout(() => {}, 100);
        return;
      }
      v2.value += p3[vLN02];
      v2.dispatchEvent(new InputEvent("input", {
        bubbles: true
      }));
      vLN02++;
      setTimeout(vF, 25);
    };
    vF();
    return true;
  }
  let v3 = new WeakMap();
  function f3(p4, p5, p6) {
    const v4 = p4[p5];
    const v5 = new Proxy(v4, p6);
    v3.set(v5, v4);
    p4[p5] = v5;
  }
  function f4() {
    const vA = ["div.ad-block", "a[href*=\"ad\"]", "iframe[src*=\"ads\"], iframe[src*=\"googlead\"]", ".advertisement", "[class*=\"ads\"], [class*=\"ad-\"]", "[id*=\"ad\"], [id*=\"banner\"]", ".sidebar.left > a", ".sidebar.left > div:not(.sidebar-content)", "div.sidebar.left > div:has(> iframe)", "div.sidebar.left > div:has(> a[href*=\"doubleclick\"]"];
    const vF2 = () => {
      vA.forEach(p7 => {
        document.querySelectorAll(p7).forEach(p8 => {
          p8.style.display = "none !important";
          p8.style.opacity = "0 !important";
          p8.style.pointerEvents = "none !important";
          p8.style.visibility = "hidden !important";
          p8.removeAttribute("src");
          p8.remove();
        });
      });
      const v6 = document.querySelector("div.sidebar.left");
      if (v6) {
        v6.style.maxWidth = "30vw";
        v6.style.width = "21rem";
        v6.style.bottom = "0 !important";
        v6.style.overflow = "hidden";
      }
    };
    vF2();
    const v7 = new MutationObserver(vF2);
    v7.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    setInterval(vF2, 5000);
    f14("🛡️ Built-in Ad Blocker activated!");
  }
  let v8 = null;
  let v9 = false;
  function f5(p9, p10) {
    if (v8) {
      clearInterval(v8);
    }
    v9 = true;
    v8 = setInterval(() => {
      f7(p9);
    }, p10 * 1000);
  }
  function f6() {
    if (v8) {
      clearInterval(v8);
      v8 = null;
    }
    v9 = false;
  }
  function f7(p11) {
    const v10 = document.querySelector(".chat-input input") || document.querySelector("input[placeholder*=\"chat\" i]") || document.querySelector("input[type=\"text\"]");
    if (!v10) {
      console.warn("Chat input not found - skipping auto chat");
      return;
    }
    v10.focus();
    v10.value = "";
    let vLN03 = 0;
    const vF3 = () => {
      if (vLN03 >= p11.length) {
        const v11 = document.querySelector(".chat-input button") || document.querySelector("button[aria-label*=\"send\" i]") || document.querySelector("button");
        if (v11) {
          v11.click();
        } else {
          v10.dispatchEvent(new Event("change", {
            bubbles: true
          }));
          v10.dispatchEvent(new Event("input", {
            bubbles: true
          }));
          setTimeout(() => {
            v10.value = "";
            v10.blur();
          }, 100);
        }
        return;
      }
      v10.value += p11[vLN03];
      v10.dispatchEvent(new InputEvent("input", {
        bubbles: true
      }));
      vLN03++;
      setTimeout(vF3, 25);
    };
    vF3();
  }
  let v12 = false;
  function f8(p12) {
    if (v12) {
      return;
    }
    function f9(p13) {
      if (typeof p13 !== "string") {
        return p13;
      }
      return p13.replace(/\\(\\|n|r|t|b|f|v|\d{1,3}|x([\da-fA-F]{2})|u([\da-fA-F]{4})|u\{(0*[\da-fA-F]{1,6})\})/g, (p14, p15, p16, p17, p18) => {
        switch (p15[0]) {
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
            return "";
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
            return String.fromCharCode(Number.parseInt(p15, 8) || 0);
          default:
            if (p16 != null) {
              return String.fromCharCode(Number.parseInt(p16, 16) || 0);
            }
            if (p17 != null) {
              return String.fromCharCode(Number.parseInt(p17, 16) || 0);
            }
            if (p18 != null) {
              const v13 = Number.parseInt(p18, 16) || 0;
              if (v13 > 1114111) {
                return p14;
              } else {
                return String.fromCodePoint(v13);
              }
            }
            return p15;
        }
      });
    }
    const vO = {
      spawn: 22,
      createTribe: 5,
      chat: 100
    };
    const v14 = TextEncoder.prototype.encode;
    TextEncoder.prototype.encode = function (..._0x3a69f0) {
      try {
        const vA2 = [/^(\x14{3}\d+\|6\|)(.+)$/gm, /^(\x14{3}\d+\|8\|)(.+)$/gm, /^(\x14{3}\d+\|14\|)(.+)$/gm, /^(\x13{3}[01])(.+)$/gm];
        for (let vLN04 = 0; vLN04 < vA2.length; vLN04++) {
          const v15 = vA2[vLN04].exec(_0x3a69f0[0]);
          if (v15 && v15.length === 3) {
            const v16 = [vO.spawn, vO.spawn, vO.createTribe, vO.chat][vLN04];
            _0x3a69f0[0] = v15[1] + f9(v15[2]).substr(0, v16);
            break;
          }
        }
      } catch {}
      return Reflect.apply(v14, this, _0x3a69f0);
    };
    const v17 = new MutationObserver(() => {
      document.querySelector(".play-game .el-input__inner")?.setAttribute("maxlength", "80");
      document.querySelector(".new-tribe .el-input__inner")?.setAttribute("maxlength", "20");
      document.querySelector(".chat-input input")?.setAttribute("maxLength", "1000");
    });
    v17.observe(document.body, {
      childList: true,
      subtree: true
    });
    v12 = true;
    if (p12) {
      p12.textContent = "Special Characters Active";
      p12.disabled = true;
      p12.style.opacity = "0.6";
      p12.style.cursor = "not-allowed";
    }
    f14("✅ Special Characters enabled! (One-time use)");
  }
  let v18 = null;
  let vLN05 = 0;
  const vA3 = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  const vLN300 = 300;
  function f10() {
    return document.querySelector("#gameCanvas") || document.querySelector("canvas") || document.querySelector("#canvas-container canvas");
  }
  function f11() {
    if (v18) {
      return;
    }
    const vF10 = f10();
    if (!vF10) {
      f14("Game canvas not found!");
      return;
    }
    v18 = setInterval(() => {
      const v19 = vA3[vLN05];
      const v20 = Math.PI * 2 * v19 / 360;
      const v21 = Math.round(vLN300 * Math.sin(v20));
      const v22 = Math.round(vLN300 * Math.cos(v20));
      vF10.dispatchEvent(new MouseEvent("pointermove", {
        clientX: window.innerWidth / 2 + v21,
        clientY: window.innerHeight / 2 + v22,
        bubbles: true
      }));
      vLN05 = (vLN05 + 1) % vA3.length;
    }, 15);
  }
  function f12() {
    if (v18) {
      clearInterval(v18);
      v18 = null;
    }
  }
  function f13() {
    if (v18) {
      f12();
    } else {
      f11();
    }
  }
  let v23;
  let v24;
  let v25;
  let v26 = false;
  let v27 = false;
  const vF4 = (p19, p20, p21 = "") => {
    if (!p19) {
      return null;
    }
    const vF5 = ((p22, p23) => {
      const v28 = new TextEncoder();
      const v29 = v28.encode(p22);
      const v30 = v28.encode(p23);
      const v31 = new Uint8Array(v29["leng" + "the".slice(0, 2)]);
      for (let vLN06 = 0; vLN06 < v29.length; vLN06++) {
        v31[vLN06] = v29[vLN06] ^ v30[vLN06 % v30["" + "L".toLowerCase() + "eng" + "the".slice(0, 2)]];
      }
      return btoa(String.fromCharCode(...v31));
    })(String.fromCharCode(p20).repeat(3) + p21, p19);
    const v32 = new TextEncoder().encode(vF5);
    const v33 = 1 + v32.byteLength + 1;
    const v34 = new ArrayBuffer(v33);
    const v35 = new DataView(v34);
    v35.setUint8(0, 25);
    new Uint8Array(v34)["setter".slice(0, 9 / 27 * 9)](v32, 1);
    v35.setUint8(v33 - 1, p20);
    return v34;
  };
  const vO2 = {
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
  const vF6 = (p24, p25 = "") => {
    if (v23 && v24 && vO4.socketManager) {
      v23[vO4.socketManager].sendBytePacket(vF4(v24.token, p24, p25));
    }
  };
  const vF7 = p26 => {
    const vLN1 = 1;
    const vLN4 = 4;
    const vLN5 = 5;
    try {
      const vO3 = {
        ...vO2.default,
        ...(vO2[v25?.myAnimals?.[0]?.visibleFishLevel] || {})
      };
      if (p26 < (v25?.myAnimals?.[0]?._standing ? 40 : 100)) {
        return vF6(vLN1);
      }
      if (v25?.myAnimals?.[0]?._standing) {
        return vF6(vLN5, p26);
      }
      if (vO3.hasScaling) {
        return vF6(vLN5, p26);
      }
      if (vO3.hasSec) {
        return vF6(vLN4, p26);
      }
      return vF6(vLN1);
    } catch {}
  };
  const vF8 = p27 => {
    return [...Object.getOwnPropertyNames(Object.getPrototypeOf(p27)), ...Object.getOwnPropertyNames(p27)];
  };
  const vO4 = {};
  let vLN07 = 0;
  function f14(p28) {
    const v36 = document.createElement("div");
    v36.style.cssText = "position: fixed; top: 20px; right: 20px; background: rgba(0, 0, 0, 0.8); color: white; padding: 10px 15px; border-radius: 5px; z-index: 10001; font-size: 14px; opacity: 0; transition: opacity 0.3s; pointer-events: none;";
    v36.textContent = p28;
    document.body.appendChild(v36);
    setTimeout(() => {
      v36.style.opacity = "1";
    }, 10);
    setTimeout(() => {
      v36.style.opacity = "0";
      setTimeout(() => v36.remove(), 300);
    }, 3000);
  }
  const vF9 = () => {
    const vO5 = {};
    for (const v37 of Object.getOwnPropertyNames(Reflect)) {
      vO5[v37] = Reflect[v37];
    }
    const vProxy = Proxy;
    const v38 = Object.prototype.__lookupGetter__;
    const vF11 = (p29, p30, p31) => {
      const v39 = new vProxy(p29[p30], p31);
      v3.set(v39, p29[p30]);
      p29[p30] = v39;
    };
    vF11(Function.prototype, "toString", {
      apply(p32, p33, p34) {
        return vO5.apply(p32, v3.get(p33) || p33, p34);
      }
    });
    vF11(window, "Proxy", {
      construct(p35, p36) {
        const v40 = vO5.construct(p35, p36);
        return v40;
      }
    });
    vF11(vProxy, "revocable", {
      apply(p37, p38, p39) {
        const v41 = vO5.apply(p37, p38, p39);
        return v41;
      }
    });
    let vLN08 = 0;
    vF11(Function.prototype, "bind", {
      apply(p40, p41, p42) {
        try {
          try {
            if (v38.call(p42[0], "aboveBgPlatformsContainer") != null) {
              return vO5.apply(p40, p41, p42);
            }
          } catch {}
          if (p42[0] && p42[0].aboveBgPlatformsContainer != null) {
            v25 = p42[0];
            v23 = p42[0].game;
            const vVF8 = vF8(v25);
            const v42 = vVF8.filter(p43 => p43.startsWith("_0x"));
            vO4.setFlash = Object.getOwnPropertyNames(v25.__proto__.__proto__).filter(p44 => p44.startsWith("_0x")).find(p45 => v25[p45] instanceof Function) || vO4.setFlash;
            vO4.terrainManager = v42.find(p46 => typeof v25[p46]?.shadow !== "undefined") || vO4.terrainManager;
            vO4.entityManager = v42.find(p47 => typeof v25[p47]?.entitiesList !== "undefined") || vO4.entityManager;
            vO4.entityManagerProps = {};
            const vVF82 = vF8(v25[vO4.entityManager]);
            const vSetInterval = setInterval(() => {
              vO4.entityManagerProps.animalsList = vVF82.filter(p48 => p48.startsWith("_0x")).find(p49 => typeof v25?.[vO4.entityManager]?.[p49]?.[0] !== "undefined") || vO4.entityManagerProps.animalsList;
              if (typeof vO4.entityManagerProps.animalsList !== "undefined") {
                clearInterval(vSetInterval);
              }
            }, 1000);
            vO4.socketManager = vF8(v23).find(p50 => typeof v23[p50]?.sendBytePacket !== "undefined") || vO4.socketManager;
            try {
              v24 = document.getElementById("app")._vnode.appContext.config.globalProperties.$simpleState.states.find(p51 => p51._storeMeta.id === "game");
            } catch {}
            let v43;
            try {
              clearInterval(v43);
            } catch {}
            v43 = setInterval(() => {
              try {
                if (!v25?.myAnimals?.[0]) {
                  return;
                }
                const v44 = v25.myAnimals[0];
                if (v44.fadingTrail) {
                  const v45 = Object.getPrototypeOf(v44.fadingTrail);
                  f3(v45, "enable", {
                    apply() {}
                  });
                }
                if (v44.bubblesEmitter) {
                  const v46 = Object.getPrototypeOf(v44.bubblesEmitter);
                  Object.defineProperty(v46, "emit", {
                    set: () => {}
                  });
                }
                clearInterval(v43);
              } catch {}
            }, 200);
            if (vLN08 < Date.now() - 3000) {
              f14("✅ Astraphobia client loaded in game");
              vLN08 = Date.now();
            }
            vF12();
            vF13();
          }
        } catch {}
        return vO5.apply(p40, p41, p42);
      }
    });
  };
  const vF12 = () => {
    if (v26) {
      return;
    }
    setInterval(() => {
      try {
        v23.viewport.clampZoom({
          minWidth: 0,
          maxWidth: 10000000
        });
        v23.viewport.plugins.plugins.clamp = null;
        v23.viewport.plugins.plugins["clamp-zoom"] = null;
      } catch {}
    }, 300);
    v26 = true;
  };
  const vF13 = () => {
    if (v27) {
      return;
    }
    function f15() {
      try {
        vF7(1);
        setTimeout(() => {
          vF7(5000);
        }, 50);
        setTimeout(() => {
          vF7(5000);
        }, 100);
        setTimeout(() => {
          vF7(5000);
        }, 150);
      } catch {}
    }
    function f16() {
      try {
        document.getElementById("ctrl-overlay").remove();
      } catch {}
      const v47 = document.createElement("div");
      const v48 = document.querySelector("div.game");
      if (v48) {
        v48.insertBefore(v47, v48.children[0]);
      }
      v47.outerHTML = "<div id=\"ctrl-overlay\" style=\"width: 100%;height: 100%;position: absolute;display: block;z-index:10000;pointer-events:none;\"></div>";
      document.getElementById("ctrl-overlay").addEventListener("contextmenu", p52 => p52.preventDefault());
    }
    f16();
    window.addEventListener("click", p53 => {
      try {
        if (!v25?.myAnimals?.[0]) {
          return;
        }
        const v49 = v25.myAnimals[0].visibleFishLevel;
        const vO6 = {
          ...vO2.default,
          ...vO2[v49]
        };
        if (p53.ctrlKey) {
          if (p53.shiftKey && v49 === 107) {
            f15();
            return;
          } else if (p53.shiftKey && v49 !== 101 && v25.myAnimals[0]._standing) {
            vF7(Math.floor(Math.random() * 1647483648) + 500000000);
            return;
          } else {
            if (v49 === 93 && vO6.hasSec) {
              vF7(1000);
              return;
            }
            let v50 = Object.getOwnPropertyNames(v23).map(p54 => v23[p54]).find(p55 => p55.keys instanceof Array);
            if (v50) {
              v50.pointerDown = true;
              v50.pressElapsed = Infinity;
              v50.setPointerDown(false);
            }
          }
        } else if (p53.altKey) {
          vF7(v25?.myAnimals?.[0]?._standing ? 41 : Math.floor(vO6.secLoadTime / 2));
        }
      } catch {}
    }, false);
    window.addEventListener("keyup", p56 => {
      try {
        if (!p56.ctrlKey && !p56.altKey) {
          document.getElementById("ctrl-overlay").style.pointerEvents = "none";
        }
      } catch {}
    }, false);
    window.addEventListener("focus", () => {
      try {
        document.getElementById("ctrl-overlay").style.pointerEvents = "none";
      } catch {}
    });
    v27 = true;
  };
  function f17() {
    const v51 = document.createElement("style");
    v51.textContent = "\n      #update-history {\n        position: fixed;\n        bottom: 20px;\n        left: 20px;\n        background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);\n        color: #e0e0e0;\n        padding: 14px;\n        border-radius: 12px;\n        font-size: 13px;\n        z-index: 9999;\n        max-width: 220px;\n        max-height: 250px;\n        overflow-y: auto;\n        font-family: 'Segoe UI', sans-serif;\n        cursor: move;\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);\n        border: 1px solid #333;\n        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n      }\n      #update-history:hover {\n        transform: translateY(-2px);\n        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);\n      }\n      #update-history ul {\n        margin: 0;\n        padding-left: 15px;\n      }\n      #update-history li {\n        margin-bottom: 5px;\n        line-height: 1.3;\n      }\n      #update-history h3 {\n        margin: 0 0 10px 0;\n        font-size: 14px;\n        color: #ff4d4d;\n        position: relative;\n        padding-right: 25px;\n        text-shadow: 0 0 8px rgba(255,77,77,0.3);\n        font-weight: 700;\n      }\n      #update-history button.min-btn {\n        background: none;\n        border: none;\n        color: #ff4d4d;\n        font-size: 18px;\n        cursor: pointer;\n        position: absolute;\n        top: 30%;\n        right: 5px;\n        transform: translateY(-50%);\n        z-index: 1;\n        transition: color 0.2s ease;\n        width: 20px;\n        height: 20px;\n        line-height: 20px;\n      }\n      #update-history button.min-btn:hover {\n        color: #ff6666;\n      }\n    ";
    document.head.appendChild(v51);
    const v52 = document.createElement("div");
    v52.id = "update-history";
    v52.innerHTML = "\n      <h3>Update History <button class=\"min-btn\" id=\"minHist\">−</button></h3>\n      <div id=\"historyContent\">\n        <ul>\n          <li>v1.1 - Added built-in ad blocker, removed boost trail, spoofing for username, keybind selector for auto spin, added settings GUI, added shift keybind to toogle all panels.</li>\n          <li>v1.0 - Initial release with auto chat, auto-spin, special character bypass, and thresher super boost, no-zoom limit is automatically enabled.</li>\n        </ul>\n      </div>\n    ";
    document.body.appendChild(v52);
    const v53 = v52.querySelector("#minHist");
    const v54 = v52.querySelector("#historyContent");
    let v55 = false;
    v53.onclick = p57 => {
      p57.stopPropagation();
      v55 = !v55;
      v54.style.display = v55 ? "none" : "block";
      v52.style.height = v55 ? "50px" : "auto";
      v53.textContent = v55 ? "+" : "−";
    };
    let v56;
    let v57;
    let v58 = false;
    let v59 = false;
    v52.addEventListener("mousedown", p58 => {
      if (["BUTTON", "INPUT", "TEXTAREA", "A"].includes(p58.target.tagName)) {
        return;
      }
      v58 = true;
      v59 = false;
      v56 = p58.clientX - v52.getBoundingClientRect().left;
      v57 = p58.clientY - v52.getBoundingClientRect().top;
      v52.style.transition = "none";
      const vF14 = p59 => {
        const v60 = p59.clientX - p58.clientX;
        const v61 = p59.clientY - p58.clientY;
        if (!v59 && (Math.abs(v60) > 5 || Math.abs(v61) > 5)) {
          v59 = true;
        }
        if (v58) {
          v52.style.left = p59.clientX - v56 + "px";
          v52.style.top = p59.clientY - v57 + "px";
          v52.style.bottom = "auto";
          v52.style.right = "auto";
        }
      };
      const vF15 = () => {
        v58 = false;
        v52.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
        document.removeEventListener("mousemove", vF14);
        document.removeEventListener("mouseup", vF15);
      };
      document.addEventListener("mousemove", vF14);
      document.addEventListener("mouseup", vF15);
    });
    v52.addEventListener("click", p60 => {
      if (v59) {
        p60.stopImmediatePropagation();
      }
    });
    return v52;
  }
  function f18() {
    const v62 = document.createElement("style");
    v62.textContent = "\n      #deep-tools-panel {\n        font-family: 'Segoe UI', sans-serif;\n        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);\n        border: 1px solid #333;\n        background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);\n      }\n      #deep-tools-panel:hover {\n        transform: translateY(-2px);\n        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);\n      }\n      #deep-tools-panel textarea {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 6px;\n        padding: 8px;\n        transition: border-color 0.2s;\n        font-size: 13px;\n      }\n      #deep-tools-panel textarea:focus {\n        outline: none;\n        border-color: #ff4d4d;\n        box-shadow: 0 0 0 2px rgba(255,77,77,0.3);\n      }\n      #deep-tools-panel input[type=\"number\"] {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 4px;\n        padding: 4px;\n        width: 60px;\n        text-align: center;\n      }\n      #deep-tools-panel button {\n        background: linear-gradient(to bottom, #222, #111);\n        color: #ff4d4d;\n        border: 1px solid #444;\n        border-radius: 6px;\n        padding: 8px 0;\n        font-weight: 600;\n        font-size: 13px;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        letter-spacing: 0.5px;\n      }\n      #deep-tools-panel button:hover:not(:disabled) {\n        background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);\n        border-color: #ff4d4d;\n        transform: translateY(-1px);\n        box-shadow: 0 4px 8px rgba(255,77,77,0.3);\n      }\n      #deep-tools-panel button:active:not(:disabled) {\n        transform: translateY(0);\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n      }\n      #deep-tools-panel button:disabled {\n        opacity: 0.5;\n        cursor: not-allowed;\n        transform: none;\n        box-shadow: none;\n      }\n      #deep-tools-panel button.min-btn {\n        background: none;\n        border: none;\n        color: #ff4d4d;\n        font-size: 18px;\n        cursor: pointer;\n        position: absolute;\n        top: 30%;\n        right: 5px;\n        transform: translateY(-50%);\n        z-index: 1;\n        transition: color 0.2s ease;\n        width: 20px;\n        height: 20px;\n        line-height: 20px;\n      }\n      #deep-tools-panel button.min-btn:hover {\n        color: #ff6666;\n      }\n      #deep-tools-panel .credits {\n        margin-top: 10px;\n        font-size: 10px;\n        color: #777;\n        line-height: 1.3;\n      }\n      #deep-tools-panel .auto-chat-controls {\n        display: flex;\n        gap: 5px;\n        margin-bottom: 8px;\n        align-items: center;\n        justify-content: center;\n      }\n      #deep-tools-panel .spin-keybind {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        margin-bottom: 8px;\n        font-size: 12px;\n      }\n      #deep-tools-panel .spin-keybind label {\n        color: #eee;\n      }\n      #deep-tools-panel #spinKeyInput {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 4px;\n        padding: 4px;\n        width: 50px;\n        text-align: center;\n      }\n      #aim-overlay, #ctrl-overlay {\n        z-index: 10000 !important;\n      }\n      div.game {\n        position: relative;\n      }\n      /* Ad Removal */\n      div.sidebar.left > div.ad-block {\n        opacity: 0 !important;\n        pointer-events: none !important;\n        display: none !important;\n      }\n      div.sidebar.left > a {\n        display: none !important;\n      }\n      div.sidebar.left {\n        max-width: 30vw;\n        width: 21rem;\n        bottom: 0 !important;\n      }\n    ";
    document.head.appendChild(v62);
    const v63 = document.createElement("div");
    v63.id = "deep-tools-panel";
    v63.style.position = "fixed";
    v63.style.bottom = "20px";
    v63.style.right = "20px";
    v63.style.color = "#e0e0e0";
    v63.style.padding = "14px";
    v63.style.borderRadius = "12px";
    v63.style.fontSize = "14px";
    v63.style.zIndex = "99999";
    v63.style.userSelect = "none";
    v63.style.width = "220px";
    v63.style.textAlign = "center";
    v63.style.cursor = "move";
    v63.style.overflow = "hidden";
    v63.innerHTML = "\n      <div style=\"font-weight:700; margin-bottom:10px; color:#ff4d4d; text-shadow: 0 0 8px rgba(255,77,77,0.3); position: relative; height: 40px; line-height: 40px; padding-right: 25px;\">\n        ASTRAPHOBIA CLIENT\n        <button class=\"min-btn\" id=\"minPanel\">−</button>\n      </div>\n      <div id=\"panelContent\">\n        <textarea id=\"chatMsg\" placeholder=\"Type message...\" style=\"width:100%; height:45px; margin-bottom:10px; resize:none;\"></textarea>\n        <button id=\"sendBtn\" style=\"width:100%; margin-bottom:8px;\">Send Typed Chat</button>\n        <div class=\"auto-chat-controls\">\n          <input type=\"number\" id=\"delayInput\" min=\"1\" max=\"300\" value=\"10\" style=\"margin-right:5px;\">\n          <span style=\"font-size:12px;\">sec</span>\n        </div>\n        <button id=\"autoChatBtn\" style=\"width:100%; margin-bottom:8px;\">Enable Auto Chat</button>\n        <button id=\"patchBtn\" style=\"width:100%; margin-bottom:8px;\">Enable Special Characters(in chat/clan/name)</button>\n        <button id=\"spoofBtn\" style=\"width:100%; margin-bottom:8px;\">Spoof Username:Random Unicode Name(ban decrease)</button>\n        <button id=\"spinBtn\" style=\"width:100%; margin-bottom:8px;\">Enable Auto Spin</button>\n        <div class=\"spin-keybind\">\n          <label for=\"spinKeyInput\">Keybind:</label>\n          <input type=\"text\" id=\"spinKeyInput\" placeholder=\"Press key...\" readonly>\n        </div>\n        <div class=\"credits\">\n          Coder: Astraphobia<br>\n          Owner: Astraphobia<br>\n          Designer: Astraphobia<br>\n          Tester: Astraphobia\n        </div>\n      </div>\n    ";
    document.body.appendChild(v63);
    const v64 = v63.querySelector("#minPanel");
    const v65 = v63.querySelector("#panelContent");
    let v66 = false;
    v64.onclick = p61 => {
      p61.stopPropagation();
      v66 = !v66;
      v65.style.display = v66 ? "none" : "block";
      v63.style.height = v66 ? "50px" : "auto";
      v64.textContent = v66 ? "+" : "−";
    };
    v63.querySelector("#sendBtn").onclick = () => {
      const v67 = v63.querySelector("#chatMsg").value;
      if (v67) {
        f7(v67);
      }
    };
    const v68 = v63.querySelector("#patchBtn");
    v68.onclick = () => f8(v68);
    const v69 = v63.querySelector("#spoofBtn");
    v69.onclick = () => {
      const vF16 = f(8);
      if (f2(".play-game .el-input__inner", vF16)) {
        f14("Spoofed name!");
      } else if (f2(".new-tribe .el-input__inner", vF16)) {
        f14("Spoofed tribe name!");
      } else {
        f14("No name input found! Enable special characters first.");
      }
    };
    const v70 = v63.querySelector("#spinBtn");
    v70.onclick = () => {
      f13();
      if (v18) {
        v70.textContent = "Disable Auto Spin";
        v70.style.color = "#4dff4d";
      } else {
        v70.textContent = "Enable Auto Spin";
        v70.style.color = "#ff4d4d";
      }
    };
    const v71 = v63.querySelector("#spinKeyInput");
    let v72 = null;
    v71.addEventListener("keydown", p62 => {
      p62.preventDefault();
      v72 = p62.code || p62.key;
      v71.value = v72.replace("Key", "").toLowerCase();
    });
    document.addEventListener("keydown", p63 => {
      if (v72 && p63.code === v72 && !p63.target.matches("input, textarea, button")) {
        p63.preventDefault();
        f13();
        if (v18) {
          v70.textContent = "Disable Auto Spin";
          v70.style.color = "#4dff4d";
        } else {
          v70.textContent = "Enable Auto Spin";
          v70.style.color = "#ff4d4d";
        }
      }
    });
    const v73 = v63.querySelector("#autoChatBtn");
    v73.onclick = () => {
      const v74 = v63.querySelector("#chatMsg").value;
      const v75 = v63.querySelector("#delayInput");
      const v76 = parseInt(v75.value) || 10;
      if (!v74) {
        f14("⚠️ Enter a message first!");
        return;
      }
      if (v9) {
        f6();
        v73.textContent = "Enable Auto Chat";
        v73.style.color = "#ff4d4d";
      } else {
        f5(v74, v76);
        v73.textContent = "Disable Auto Chat";
        v73.style.color = "#4dff4d";
      }
    };
    let v77;
    let v78;
    let v79 = false;
    let v80 = false;
    v63.addEventListener("mousedown", p64 => {
      if (p64.target.tagName === "BUTTON" || p64.target.tagName === "TEXTAREA" || p64.target.tagName === "INPUT" || p64.target.classList.contains("credits")) {
        return;
      }
      v79 = true;
      v80 = false;
      v77 = p64.clientX - v63.getBoundingClientRect().left;
      v78 = p64.clientY - v63.getBoundingClientRect().top;
      v63.style.transition = "none";
      const vF17 = p65 => {
        const v81 = p65.clientX - p64.clientX;
        const v82 = p65.clientY - p64.clientY;
        if (!v80 && (Math.abs(v81) > 5 || Math.abs(v82) > 5)) {
          v80 = true;
        }
        if (v79) {
          v63.style.left = p65.clientX - v77 + "px";
          v63.style.top = p65.clientY - v78 + "px";
          v63.style.bottom = "auto";
          v63.style.right = "auto";
        }
      };
      const vF18 = () => {
        v79 = false;
        v63.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
        document.removeEventListener("mousemove", vF17);
        document.removeEventListener("mouseup", vF18);
      };
      document.addEventListener("mousemove", vF17);
      document.addEventListener("mouseup", vF18);
    });
    v63.addEventListener("click", p66 => {
      if (v80) {
        p66.stopImmediatePropagation();
      }
    });
    return v63;
  }
  function f19() {
    const v83 = document.createElement("style");
    v83.textContent = "\n      #plus-panel {\n        font-family: 'Segoe UI', sans-serif;\n        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);\n        border: 1px solid #333;\n        background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);\n      }\n      #plus-panel:hover {\n        transform: translateY(-2px);\n        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);\n      }\n      #plus-panel textarea {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 6px;\n        padding: 8px;\n        transition: border-color 0.2s;\n        font-size: 13px;\n      }\n      #plus-panel textarea:focus {\n        outline: none;\n        border-color: #ff4d4d;\n        box-shadow: 0 0 0 2px rgba(255,77,77,0.3);\n      }\n      #plus-panel input[type=\"number\"] {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 4px;\n        padding: 4px;\n        width: 60px;\n        text-align: center;\n      }\n      #plus-panel button {\n        background: linear-gradient(to bottom, #222, #111);\n        color: #ff4d4d;\n        border: 1px solid #444;\n        border-radius: 6px;\n        padding: 8px 0;\n        font-weight: 600;\n        font-size: 13px;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        letter-spacing: 0.5px;\n        width: 100%;\n        margin-bottom: 8px;\n      }\n      #plus-panel button:hover:not(:disabled) {\n        background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);\n        border-color: #ff4d4d;\n        transform: translateY(-1px);\n        box-shadow: 0 4px 8px rgba(255,77,77,0.3);\n      }\n      #plus-panel button:active:not(:disabled) {\n        transform: translateY(0);\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n      }\n      #plus-panel button:disabled {\n        opacity: 0.5;\n        cursor: not-allowed;\n        transform: none;\n        box-shadow: none;\n      }\n      #plus-panel button.min-btn {\n        background: none;\n        border: none;\n        color: #ff4d4d;\n        font-size: 18px;\n        cursor: pointer;\n        position: absolute;\n        top: 30%;\n        right: 5px;\n        transform: translateY(-50%);\n        z-index: 1;\n        transition: color 0.2s ease;\n        width: 20px;\n        height: 20px;\n        line-height: 20px;\n      }\n      #plus-panel button.min-btn:hover {\n        color: #ff6666;\n      }\n    ";
    document.head.appendChild(v83);
    const v84 = document.createElement("div");
    v84.id = "plus-panel";
    v84.style.position = "fixed";
    v84.style.top = "20px";
    v84.style.right = "20px";
    v84.style.color = "#e0e0e0";
    v84.style.padding = "14px";
    v84.style.borderRadius = "12px";
    v84.style.fontSize = "14px";
    v84.style.zIndex = "99999";
    v84.style.userSelect = "none";
    v84.style.width = "220px";
    v84.style.textAlign = "center";
    v84.style.cursor = "move";
    v84.style.overflow = "hidden";
    v84.innerHTML = "\n      <div style=\"font-weight:700; margin-bottom:10px; color:#ff4d4d; text-shadow: 0 0 8px rgba(255,77,77,0.3); position: relative; height: 40px; line-height: 40px; padding-right: 25px;\">\n        ASTRAPHOBIA CLIENT\n        <button class=\"min-btn\" id=\"minPlus\">−</button>\n      </div>\n      <div id=\"plusContent\">\n        <button id=\"thresherBtn\">Enable Thresher Super Boost(ctrl + shift and click)(minumum required 2 boost)</button>\n      </div>\n    ";
    document.body.appendChild(v84);
    const v85 = v84.querySelector("#minPlus");
    const v86 = v84.querySelector("#plusContent");
    let v87 = false;
    v85.onclick = p67 => {
      p67.stopPropagation();
      v87 = !v87;
      v86.style.display = v87 ? "none" : "block";
      v84.style.height = v87 ? "50px" : "auto";
      v85.textContent = v87 ? "+" : "−";
    };
    const v88 = v84.querySelector("#thresherBtn");
    v88.onclick = () => {
      if (v27) {
        f14("Thresher Super Boost is already active!");
        return;
      }
      vF9();
      v88.textContent = "Thresher Super Boost Active";
      v88.style.color = "#4dff4d";
      v88.disabled = true;
    };
    let v89;
    let v90;
    let v91 = false;
    let v92 = false;
    v84.addEventListener("mousedown", p68 => {
      if (p68.target.tagName === "BUTTON" || p68.target.tagName === "TEXTAREA" || p68.target.tagName === "INPUT" || p68.target.classList.contains("credits")) {
        return;
      }
      v91 = true;
      v92 = false;
      v89 = p68.clientX - v84.getBoundingClientRect().left;
      v90 = p68.clientY - v84.getBoundingClientRect().top;
      v84.style.transition = "none";
      const vF19 = p69 => {
        const v93 = p69.clientX - p68.clientX;
        const v94 = p69.clientY - p68.clientY;
        if (!v92 && (Math.abs(v93) > 5 || Math.abs(v94) > 5)) {
          v92 = true;
        }
        if (v91) {
          v84.style.left = p69.clientX - v89 + "px";
          v84.style.top = p69.clientY - v90 + "px";
          v84.style.bottom = "auto";
          v84.style.right = "auto";
        }
      };
      const vF20 = () => {
        v91 = false;
        v84.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
        document.removeEventListener("mousemove", vF19);
        document.removeEventListener("mouseup", vF20);
      };
      document.addEventListener("mousemove", vF19);
      document.addEventListener("mouseup", vF20);
    });
    v84.addEventListener("click", p70 => {
      if (v92) {
        p70.stopImmediatePropagation();
      }
    });
    return v84;
  }
  function f20() {
    const v95 = document.createElement("style");
    v95.textContent = "\n      #settings-panel {\n        font-family: 'Segoe UI', sans-serif;\n        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);\n        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);\n        border: 1px solid #333;\n        background: linear-gradient(to bottom, #0f0f0f, #1a1a1a);\n        position: fixed;\n        top: 20px;\n        left: 20px;\n        color: #e0e0e0;\n        padding: 14px;\n        border-radius: 12px;\n        font-size: 14px;\n        z-index: 99999;\n        user-select: none;\n        width: 220px;\n        text-align: center;\n        cursor: move;\n        overflow: hidden;\n      }\n      #settings-panel:hover {\n        transform: translateY(-2px);\n        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);\n      }\n      #settings-panel button {\n        background: linear-gradient(to bottom, #222, #111);\n        color: #ff4d4d;\n        border: 1px solid #444;\n        border-radius: 6px;\n        padding: 8px 0;\n        font-weight: 600;\n        font-size: 13px;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        letter-spacing: 0.5px;\n        width: 100%;\n        margin-bottom: 8px;\n      }\n      #settings-panel button:hover:not(:disabled) {\n        background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);\n        border-color: #ff4d4d;\n        transform: translateY(-1px);\n        box-shadow: 0 4px 8px rgba(255,77,77,0.3);\n      }\n      #settings-panel button:active:not(:disabled) {\n        transform: translateY(0);\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n      }\n      #settings-panel button:disabled {\n        opacity: 0.5;\n        cursor: not-allowed;\n        transform: none;\n        box-shadow: none;\n      }\n      #settings-panel button.min-btn {\n        background: none;\n        border: none;\n        color: #ff4d4d;\n        font-size: 18px;\n        cursor: pointer;\n        position: absolute;\n        top: 30%;\n        right: 5px;\n        transform: translateY(-50%);\n        z-index: 1;\n        transition: color 0.2s ease;\n        width: 20px;\n        height: 20px;\n        line-height: 20px;\n      }\n      #settings-panel button.min-btn:hover {\n        color: #ff6666;\n      }\n      #settings-panel .keybind-set {\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        margin-bottom: 8px;\n        font-size: 12px;\n      }\n      #settings-panel .keybind-set label {\n        color: #eee;\n      }\n      #settings-panel #toggleKeyInput {\n        background: #1a1a1a;\n        border: 1px solid #333;\n        color: #eee;\n        border-radius: 4px;\n        padding: 4px;\n        width: 80px;\n        text-align: center;\n      }\n    ";
    document.head.appendChild(v95);
    const v96 = document.createElement("div");
    v96.id = "settings-panel";
    v96.innerHTML = "\n      <div style=\"font-weight:700; margin-bottom:10px; color:#ff4d4d; text-shadow: 0 0 8px rgba(255,77,77,0.3); position: relative; height: 40px; line-height: 40px; padding-right: 25px;\">\n        SETTINGS\n        <button class=\"min-btn\" id=\"minSettings\">−</button>\n      </div>\n      <div id=\"settingsContent\">\n        <div class=\"keybind-set\">\n          <label for=\"toggleKeyInput\">Toggle Client:</label>\n          <input type=\"text\" id=\"toggleKeyInput\" placeholder=\"Press key...\" readonly>\n        </div>\n      </div>\n    ";
    document.body.appendChild(v96);
    const v97 = v96.querySelector("#minSettings");
    const v98 = v96.querySelector("#settingsContent");
    let v99 = false;
    v97.onclick = p71 => {
      p71.stopPropagation();
      v99 = !v99;
      v98.style.display = v99 ? "none" : "block";
      v96.style.height = v99 ? "50px" : "auto";
      v97.textContent = v99 ? "+" : "−";
    };
    const v100 = v96.querySelector("#toggleKeyInput");
    v100.value = vLSShift;
    v100.addEventListener("keydown", p72 => {
      p72.preventDefault();
      vLSShift = p72.key;
      v100.value = vLSShift;
    });
    let v101;
    let v102;
    let v103 = false;
    let v104 = false;
    v96.addEventListener("mousedown", p73 => {
      if (p73.target.tagName === "BUTTON" || p73.target.tagName === "INPUT" || p73.target.classList.contains("credits")) {
        return;
      }
      v103 = true;
      v104 = false;
      v101 = p73.clientX - v96.getBoundingClientRect().left;
      v102 = p73.clientY - v96.getBoundingClientRect().top;
      v96.style.transition = "none";
      const vF21 = p74 => {
        const v105 = p74.clientX - p73.clientX;
        const v106 = p74.clientY - p73.clientY;
        if (!v104 && (Math.abs(v105) > 5 || Math.abs(v106) > 5)) {
          v104 = true;
        }
        if (v103) {
          v96.style.left = p74.clientX - v101 + "px";
          v96.style.top = p74.clientY - v102 + "px";
          v96.style.bottom = "auto";
          v96.style.right = "auto";
        }
      };
      const vF22 = () => {
        v103 = false;
        v96.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
        document.removeEventListener("mousemove", vF21);
        document.removeEventListener("mouseup", vF22);
      };
      document.addEventListener("mousemove", vF21);
      document.addEventListener("mouseup", vF22);
    });
    v96.addEventListener("click", p75 => {
      if (v104) {
        p75.stopImmediatePropagation();
      }
    });
    return v96;
  }
  let vLSShift = "Shift";
  function f21() {
    const v107 = document.getElementById("deep-tools-panel");
    const v108 = document.getElementById("update-history");
    const v109 = document.getElementById("settings-panel");
    const v110 = document.getElementById("plus-panel");
    const v111 = v107.style.display;
    const v112 = v111 === "none" ? "block" : "none";
    v107.style.display = v112;
    v108.style.display = v112;
    v109.style.display = v112;
    v110.style.display = v112;
  }
  document.addEventListener("keydown", p76 => {
    if (p76.key === vLSShift && !p76.repeat && !p76.target.matches("input, textarea, button")) {
      p76.preventDefault();
      f21();
    }
  });
  function f22() {
    const vF182 = f18();
    const vF172 = f17();
    const vF202 = f20();
    const vF192 = f19();
    f4();
    return {
      mainPanel: vF182,
      historyPanel: vF172,
      settingsPanel: vF202,
      plusPanel: vF192
    };
  }
  if (document.body) {
    f22();
  } else {
    const v113 = new MutationObserver(() => {
      if (document.body) {
        f22();
        v113.disconnect();
      }
    });
    v113.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  window.addEventListener("load", () => {
    setTimeout(() => {
      vF9();
      f4();
    }, 1000);
  });
})();
