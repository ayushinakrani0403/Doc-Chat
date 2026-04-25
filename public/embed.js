// (function () {
//   "use strict";

//   // ── Read config from the script tag ────────────────────────────────────────
//   var scriptTag =
//     document.currentScript ||
//     document.querySelector("script[data-workspace]");

//   if (!scriptTag) return;

//   var WORKSPACE  = scriptTag.getAttribute("data-workspace") || "";
//   var COLOR      = scriptTag.getAttribute("data-color")     || "#6366F1";
//   var POSITION   = scriptTag.getAttribute("data-position")  || "bottom-right";
//   var WELCOME    = scriptTag.getAttribute("data-welcome")   || "Hi! How can I help you today?";
//   var API_URL    = (scriptTag.getAttribute("data-api-url")  || scriptTag.src.replace("/embed.js", "")) + "/api/chat";

//   if (!WORKSPACE) {
//     console.warn("[DocChat] data-workspace is required.");
//     return;
//   }

//   // ── Session ID (persists per browser tab) ──────────────────────────────────
//   var SESSION_ID = "dc-" + WORKSPACE + "-" + Math.random().toString(36).slice(2);

//   // ── Position styles ────────────────────────────────────────────────────────
//   var posStyles = {
//     "bottom-right":  { bottom: "24px", right: "24px",  left: "auto"  },
//     "bottom-left":   { bottom: "24px", left: "24px",   right: "auto" },
//     "bottom-center": { bottom: "24px", left: "50%",    right: "auto", transform: "translateX(-50%)" },
//   };
//   var pos = posStyles[POSITION] || posStyles["bottom-right"];

//   // ── Inject styles ──────────────────────────────────────────────────────────
//   var style = document.createElement("style");
//   style.textContent = [
//     "#dc-root *, #dc-root *::before, #dc-root *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }",
//     "#dc-root { position: fixed; z-index: 2147483647; " + objToCss(pos) + " }",
//     "#dc-bubble { width: 56px; height: 56px; border-radius: 50%; background: " + COLOR + "; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.18); transition: transform 0.2s, box-shadow 0.2s; margin-left: auto; }",
//     "#dc-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,0.22); }",
//     "#dc-panel { width: 360px; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 12px 48px rgba(0,0,0,0.16); display: none; flex-direction: column; background: #fff; margin-bottom: 12px; }",
//     "#dc-panel.dc-open { display: flex; }",
//     "#dc-header { background: " + COLOR + "; padding: 13px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }",
//     "#dc-header-ava { width: 30px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }",
//     "#dc-header-name { color: #fff; font-size: 14px; font-weight: 600; }",
//     "#dc-header-status { color: rgba(255,255,255,0.75); font-size: 11px; margin-top: 1px; }",
//     "#dc-header-close { margin-left: auto; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }",
//     "#dc-header-close:hover { background: rgba(255,255,255,0.25); }",
//     "#dc-messages { flex: 1; overflow-y: auto; padding: 14px 12px; display: flex; flex-direction: column; gap: 8px; min-height: 280px; max-height: 380px; background: #fff; }",
//     ".dc-msg { max-width: 82%; padding: 9px 12px; font-size: 13px; line-height: 1.5; word-break: break-word; }",
//     ".dc-msg-bot { background: #F1F5F9; color: #0F172A; border-radius: 10px 10px 10px 2px; align-self: flex-start; }",
//     ".dc-msg-user { background: " + COLOR + "; color: #fff; border-radius: 10px 10px 2px 10px; align-self: flex-end; }",
//     ".dc-typing { display: flex; align-items: center; gap: 4px; padding: 10px 12px; background: #F1F5F9; border-radius: 10px 10px 10px 2px; align-self: flex-start; width: fit-content; }",
//     ".dc-dot { width: 6px; height: 6px; border-radius: 50%; background: #94A3B8; animation: dc-bounce 0.9s infinite; }",
//     ".dc-dot:nth-child(2) { animation-delay: 0.15s; }",
//     ".dc-dot:nth-child(3) { animation-delay: 0.3s; }",
//     "@keyframes dc-bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }",
//     "#dc-footer { border-top: 1px solid #E2E8F0; padding: 10px; display: flex; gap: 8px; background: #fff; flex-shrink: 0; }",
//     "#dc-input { flex: 1; border: 1px solid #E2E8F0; border-radius: 10px; padding: 9px 13px; font-size: 13px; outline: none; resize: none; transition: border-color 0.15s; line-height: 1.4; max-height: 100px; overflow-y: auto; }",
//     "#dc-input:focus { border-color: " + COLOR + "; box-shadow: 0 0 0 3px " + hexToRgba(COLOR, 0.1) + "; }",
//     "#dc-send { width: 36px; height: 36px; background: " + COLOR + "; border: none; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: opacity 0.15s; align-self: flex-end; }",
//     "#dc-send:disabled { opacity: 0.45; cursor: not-allowed; }",
//     "#dc-branding { text-align: center; padding: 5px; font-size: 10px; color: #94A3B8; background: #fff; border-top: 1px solid #F8FAFC; flex-shrink: 0; }",
//     "#dc-branding a { color: #94A3B8; text-decoration: none; }",
//     "#dc-branding a:hover { color: #475569; }",
//     "@keyframes dc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }",
//     ".dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: dc-spin 0.7s linear infinite; }",
//   ].join("\n");
//   document.head.appendChild(style);

//   // ── Build DOM ──────────────────────────────────────────────────────────────
//   var root = document.createElement("div");
//   root.id = "dc-root";

//   // Panel
//   var panel = document.createElement("div");
//   panel.id = "dc-panel";

//   // Header
//   var header = document.createElement("div");
//   header.id = "dc-header";
//   header.innerHTML = [
//     '<div id="dc-header-ava">',
//       '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',
//     '</div>',
//     '<div>',
//       '<div id="dc-header-name">AI Assistant</div>',
//       '<div id="dc-header-status">Powered by DocChat · online</div>',
//     '</div>',
//     '<button id="dc-header-close" aria-label="Close chat">',
//       '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
//     '</button>',
//   ].join("");

//   // Messages
//   var msgsEl = document.createElement("div");
//   msgsEl.id = "dc-messages";

//   // Footer
//   var footer = document.createElement("div");
//   footer.id = "dc-footer";

//   var inputEl = document.createElement("textarea");
//   inputEl.id = "dc-input";
//   inputEl.placeholder = "Ask anything…";
//   inputEl.rows = 1;

//   var sendBtn = document.createElement("button");
//   sendBtn.id = "dc-send";
//   sendBtn.setAttribute("aria-label", "Send");
//   sendBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

//   footer.appendChild(inputEl);
//   footer.appendChild(sendBtn);

//   // Branding
//   var branding = document.createElement("div");
//   branding.id = "dc-branding";
//   branding.innerHTML = 'Powered by <a href="https://docchat.app" target="_blank" rel="noopener">DocChat</a>';

//   panel.appendChild(header);
//   panel.appendChild(msgsEl);
//   panel.appendChild(footer);
//   panel.appendChild(branding);

//   // Bubble
//   var bubble = document.createElement("button");
//   bubble.id = "dc-bubble";
//   bubble.setAttribute("aria-label", "Open chat");
//   bubble.innerHTML = [
//     '<svg id="dc-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
//       '<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>',
//     '</svg>',
//     '<svg id="dc-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="display:none">',
//       '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
//     '</svg>',
//   ].join("");

//   root.appendChild(panel);
//   root.appendChild(bubble);
//   document.body.appendChild(root);

//   // ── State ──────────────────────────────────────────────────────────────────
//   var isOpen      = false;
//   var isStreaming = false;
//   var initiated   = false;

//   // ── Toggle panel ──────────────────────────────────────────────────────────
//   function openPanel() {
//     isOpen = true;
//     panel.classList.add("dc-open");
//     document.getElementById("dc-icon-open").style.display  = "none";
//     document.getElementById("dc-icon-close").style.display = "block";
//     bubble.setAttribute("aria-label", "Close chat");
//     if (!initiated) {
//       initiated = true;
//       appendMessage("bot", WELCOME);
//     }
//     setTimeout(function () { inputEl.focus(); }, 100);
//   }

//   function closePanel() {
//     isOpen = false;
//     panel.classList.remove("dc-open");
//     document.getElementById("dc-icon-open").style.display  = "block";
//     document.getElementById("dc-icon-close").style.display = "none";
//     bubble.setAttribute("aria-label", "Open chat");
//   }

//   bubble.addEventListener("click", function () {
//     isOpen ? closePanel() : openPanel();
//   });

//   document.getElementById("dc-header-close").addEventListener("click", closePanel);

//   // ── Append message bubble ─────────────────────────────────────────────────
//   function appendMessage(role, text) {
//     var div = document.createElement("div");
//     div.className = "dc-msg dc-msg-" + role;
//     div.textContent = text;
//     msgsEl.appendChild(div);
//     msgsEl.scrollTop = msgsEl.scrollHeight;
//     return div;
//   }

//   // ── Typing indicator ──────────────────────────────────────────────────────
//   var typingEl = null;
//   function showTyping() {
//     typingEl = document.createElement("div");
//     typingEl.className = "dc-typing";
//     typingEl.innerHTML = '<div class="dc-dot"></div><div class="dc-dot"></div><div class="dc-dot"></div>';
//     msgsEl.appendChild(typingEl);
//     msgsEl.scrollTop = msgsEl.scrollHeight;
//   }
//   function hideTyping() {
//     if (typingEl) { typingEl.remove(); typingEl = null; }
//   }

//   // ── Set streaming state ───────────────────────────────────────────────────
//   function setStreaming(val) {
//     isStreaming = val;
//     sendBtn.disabled = val;
//     inputEl.disabled = val;
//     if (val) {
//       sendBtn.innerHTML = '<div class="dc-spinner"></div>';
//     } else {
//       sendBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
//     }
//   }

//   // ── Send message ──────────────────────────────────────────────────────────
//   function sendMessage() {
//     var text = inputEl.value.trim();
//     if (!text || isStreaming) return;

//     appendMessage("user", text);
//     inputEl.value = "";
//     inputEl.style.height = "auto";
//     showTyping();
//     setStreaming(true);

//     fetch(API_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ slug: WORKSPACE, message: text, sessionId: SESSION_ID }),
//     })
//     .then(function (res) {
//       // if (!res.ok) throw new Error("API error " + res.status);

//       // ✅ NEW
//       if (!res.ok) {
//         return res.json().then(function(data) {
//           hideTyping();
//           if (res.status === 429) {
//             appendMessage("bot", "Monthly message limit reached. Please upgrade to Pro at your dashboard.");
//           } else {
//             appendMessage("bot", data.error || "Sorry, something went wrong. Please try again.");
//           }
//           setStreaming(false);
//         }).catch(function() {
//           hideTyping();
//           appendMessage("bot", "Sorry, something went wrong. Please try again.");
//           setStreaming(false);
//         });
//       }

//       hideTyping();
//       var botDiv = appendMessage("bot", "");
//       var accumulated = "";
//       var reader = res.body.getReader();
//       var decoder = new TextDecoder();

//       function read() {
//         reader.read().then(function (result) {
//           if (result.done) { setStreaming(false); return; }

//           var chunk = decoder.decode(result.value, { stream: true });
//           var lines = chunk.split("\n");

//           for (var i = 0; i < lines.length; i++) {
//             var line = lines[i].trim();
//             if (!line.startsWith("data: ")) continue;
//             var data = line.slice(6);
//             if (data === "[DONE]") { setStreaming(false); return; }

//             try {
//               var parsed = JSON.parse(data);
//               if (parsed.text) {
//                 accumulated += parsed.text;
//                 botDiv.textContent = accumulated;
//                 msgsEl.scrollTop = msgsEl.scrollHeight;
//               }
//               if (parsed.error) {
//                 botDiv.textContent = "Sorry, I couldn't get a response. Please try again.";
//                 setStreaming(false);
//                 return;
//               }
//             } catch (e) { /* skip */ }
//           }

//           read(); // recurse
//         }).catch(function () {
//           hideTyping();
//           setStreaming(false);
//         });
//       }

//       read();
//     })
//     .catch(function () {
//       hideTyping();
//       appendMessage("bot", "Sorry, I couldn't connect. Please try again.");
//       setStreaming(false);
//     });
//   }

//   // ── Input events ──────────────────────────────────────────────────────────
//   sendBtn.addEventListener("click", sendMessage);

//   inputEl.addEventListener("keydown", function (e) {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   });

//   // Auto-resize textarea
//   inputEl.addEventListener("input", function () {
//     this.style.height = "auto";
//     this.style.height = Math.min(this.scrollHeight, 100) + "px";
//   });

//   // ── Helpers ───────────────────────────────────────────────────────────────
//   function objToCss(obj) {
//     return Object.keys(obj).map(function (k) {
//       return k + ": " + obj[k] + ";";
//     }).join(" ");
//   }

//   function hexToRgba(hex, alpha) {
//     var r = parseInt(hex.slice(1, 3), 16);
//     var g = parseInt(hex.slice(3, 5), 16);
//     var b = parseInt(hex.slice(5, 7), 16);
//     return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
//   }

// })();

(function () {
  "use strict";

  // ── Read config from the script tag ────────────────────────────────────────
  var scriptTag =
    document.currentScript ||
    document.querySelector("script[data-workspace]");

  if (!scriptTag) return;

  var WORKSPACE  = scriptTag.getAttribute("data-workspace") || "";
  var COLOR      = scriptTag.getAttribute("data-color")     || "#7C3AED";
  var POSITION   = scriptTag.getAttribute("data-position")  || "bottom-right";
  var WELCOME    = scriptTag.getAttribute("data-welcome")   || "Hi! How can I help you today?";
  var BOT_NAME   = scriptTag.getAttribute("data-name")      || "AI Assistant";
  var API_URL    = (scriptTag.getAttribute("data-api-url")  || scriptTag.src.replace("/embed.js", "")) + "/api/chat";

  if (!WORKSPACE) {
    console.warn("[DocChat] data-workspace is required.");
    return;
  }

  // ── Session ID ─────────────────────────────────────────────────────────────
  var SESSION_ID = "dc-" + WORKSPACE + "-" + Math.random().toString(36).slice(2);

  // ── Position styles ────────────────────────────────────────────────────────
  var posStyles = {
    "bottom-right":  { bottom: "28px", right: "28px",  left: "auto"  },
    "bottom-left":   { bottom: "28px", left: "28px",   right: "auto" },
    "bottom-center": { bottom: "28px", left: "50%",    right: "auto", transform: "translateX(-50%)" },
  };
  var pos = posStyles[POSITION] || posStyles["bottom-right"];

  // ── Color utilities ────────────────────────────────────────────────────────
  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return { r: r, g: g, b: b };
  }
  function hexToRgba(hex, alpha) {
    var c = hexToRgb(hex);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + alpha + ")";
  }
  function darken(hex, amount) {
    var c = hexToRgb(hex);
    return "rgb(" + Math.max(0, c.r - amount) + "," + Math.max(0, c.g - amount) + "," + Math.max(0, c.b - amount) + ")";
  }

  function objToCss(obj) {
    return Object.keys(obj).map(function (k) { return k + ": " + obj[k] + ";"; }).join(" ");
  }

  // ── Inject styles ──────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    #dc-root *, #dc-root *::before, #dc-root *::after {
      box-sizing: border-box; margin: 0; padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    #dc-root {
      position: fixed;
      z-index: 2147483647;
      ${objToCss(pos)}
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    /* ── Bubble ── */
    #dc-bubble {
      width: 58px; height: 58px;
      border-radius: 50%;
      background: ${COLOR};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 24px ${hexToRgba(COLOR, 0.45)}, 0 2px 8px rgba(0,0,0,0.12);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }
    #dc-bubble::before {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
      border-radius: 50%;
    }
    #dc-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 32px ${hexToRgba(COLOR, 0.55)}, 0 2px 12px rgba(0,0,0,0.15);
    }
    #dc-bubble:active { transform: scale(0.96); }

    /* ── Panel ── */
    #dc-panel {
      width: 380px;
      height: 580px;
      max-height: calc(100vh - 120px);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow:
        0 24px 64px rgba(0,0,0,0.14),
        0 8px 24px rgba(0,0,0,0.08),
        0 0 0 1px rgba(255,255,255,0.5) inset;
      display: none;
      flex-direction: column;
      background: #fff;
      margin-bottom: 14px;
      transform-origin: bottom right;
      transform: scale(0.92) translateY(8px);
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.25s ease;
      will-change: transform, opacity;
    }
    #dc-panel.dc-open {
      display: flex;
      animation: dc-panel-in 0.32s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
    }
    #dc-panel.dc-closing {
      animation: dc-panel-out 0.22s ease forwards;
    }
    @keyframes dc-panel-in {
      from { opacity: 0; transform: scale(0.88) translateY(16px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes dc-panel-out {
      from { opacity: 1; transform: scale(1) translateY(0); }
      to   { opacity: 0; transform: scale(0.92) translateY(8px); }
    }

    /* ── Header ── */
    #dc-header {
      background: ${COLOR};
      background: linear-gradient(135deg, ${COLOR} 0%, ${darken(COLOR, 20)} 100%);
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    #dc-header::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 140px; height: 140px;
      border-radius: 50%;
      background: rgba(255,255,255,0.07);
    }
    #dc-header::after {
      content: '';
      position: absolute;
      bottom: -50px; left: 20px;
      width: 100px; height: 100px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }

    #dc-header-ava {
      width: 38px; height: 38px;
      background: rgba(255,255,255,0.18);
      backdrop-filter: blur(8px);
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative; z-index: 1;
    }
    #dc-header-info { flex: 1; position: relative; z-index: 1; }
    #dc-header-name {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: -0.2px;
      line-height: 1.2;
    }
    #dc-header-status {
      display: flex;
      align-items: center;
      gap: 5px;
      color: rgba(255,255,255,0.8);
      font-size: 12px;
      margin-top: 2px;
      font-weight: 400;
    }
    #dc-status-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 0 2px rgba(74,222,128,0.3);
      animation: dc-pulse 2s infinite;
      flex-shrink: 0;
    }
    @keyframes dc-pulse {
      0%, 100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.3); }
      50%       { box-shadow: 0 0 0 4px rgba(74,222,128,0.15); }
    }

    #dc-header-close {
      position: relative; z-index: 1;
      margin-left: auto;
      background: rgba(255,255,255,0.15);
      border: none;
      color: #fff;
      width: 30px; height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    #dc-header-close:hover { background: rgba(255,255,255,0.28); }

    /* ── Messages ── */
    #dc-messages {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: #fff;
      scroll-behavior: smooth;
      min-height: 0;
    }
    #dc-messages::-webkit-scrollbar { width: 4px; }
    #dc-messages::-webkit-scrollbar-track { background: transparent; }
    #dc-messages::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }

    /* ── Markdown formatting inside bot messages ── */
    .dc-msg-bot { padding: 12px 15px; box-sizing: border-box; }
    .dc-msg-bot ol {
      list-style: decimal;
      margin: 6px 0 2px 0;
      padding-left: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }
    .dc-msg-bot ul {
      list-style: disc;
      margin: 6px 0 2px 0;
      padding-left: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }
    .dc-msg-bot ol > li,
    .dc-msg-bot ul > li {
      font-size: 13.5px;
      line-height: 1.55;
      color: #111827;
      padding-left: 2px;
      word-break: break-word;
    }
    .dc-msg-bot ol > li::before { content: none; }
    .dc-msg-bot ul > li {
      display: flex;
      align-items: baseline;
      gap: 8px;
      font-size: 13.5px;
      line-height: 1.5;
      color: #111827;
    }
    .dc-msg-bot ul > li::before {
      content: '';
      min-width: 6px; height: 6px;
      background: #7C3AED;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 5px;
    }
    .dc-msg-bot p {
      margin: 0 0 6px 0;
      font-size: 13.5px;
      line-height: 1.6;
      color: #374151;
    }
    .dc-msg-bot p:last-child { margin-bottom: 0; }
    .dc-msg-bot p:only-child { margin: 0; }
    .dc-msg-bot strong { font-weight: 600; color: #0F172A; }
    .dc-msg-bot em { font-style: italic; color: #4B5563; }
    .dc-msg-bot code {
      background: #F3F0FF; border: 1px solid #DDD6FE;
      border-radius: 4px; padding: 1px 6px;
      font-size: 12px; font-family: monospace; color: #6D28D9;
    }
    .dc-msg-bot pre {
      background: #0F172A; border-radius: 8px;
      padding: 12px; margin: 8px 0; overflow-x: auto;
    }
    .dc-msg-bot pre code {
      background: none; border: none; padding: 0;
      color: #E2E8F0; font-size: 12px; line-height: 1.6;
    }
    .dc-msg-bot h3 {
      font-size: 13px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.4px; color: #6B7280; margin: 8px 0 6px;
    }
    .dc-msg-bot hr { border: none; border-top: 1px solid #E5E7EB; margin: 8px 0; }

    /* Date separator */
    .dc-date-sep {
      text-align: center;
      font-size: 11px;
      color: #C4C9D4;
      font-weight: 500;
      letter-spacing: 0.4px;
      margin: 2px 0 6px;
    }

    /* Message rows */
    .dc-msg-row {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;
      animation: dc-msg-in 0.2s ease;
      width: 100%;
    }
    .dc-msg-row.dc-row-user { flex-direction: row-reverse; }
    .dc-msg-row.dc-row-bot  { flex-direction: row; }
    @keyframes dc-msg-in {
      from { opacity: 0; transform: translateY(5px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .dc-row-bot  { flex-direction: row; }
    .dc-row-user { flex-direction: row-reverse; }

    .dc-row-avatar-bot {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: ${COLOR};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      align-self: flex-start;
      margin-top: 2px;
    }
    .dc-row-avatar-user {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      align-self: flex-start;
      margin-top: 2px;
    }

    .dc-msg {
      flex: 1;
      min-width: 0;
      max-width: calc(100% - 44px);
      padding: 11px 15px;
      font-size: 14px;
      line-height: 1.58;
      word-break: break-word;
      word-wrap: break-word;
      overflow-wrap: break-word;
      position: relative;
    }
    .dc-msg-user {
      flex: none;
      max-width: calc(100% - 44px);
    }
    .dc-msg-bot {
      background: #F4F4F8;
      color: #111827;
      border-radius: 18px 18px 18px 5px;
      border: none;
      box-shadow: none;
    }
    .dc-msg-user {
      background: ${COLOR};
      color: #fff;
      border-radius: 18px 18px 5px 18px;
      box-shadow: 0 2px 10px ${hexToRgba(COLOR, 0.28)};
    }

    /* Typing indicator */
    .dc-typing-row {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;
      animation: dc-msg-in 0.2s ease;
    }
    .dc-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 13px 16px;
      background: #F4F4F8;
      border-radius: 18px 18px 18px 5px;
      border: none;
      box-shadow: none;
      width: fit-content;
    }
    .dc-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #ADADB8;
      animation: dc-bounce 1.1s infinite;
    }
    .dc-dot:nth-child(1) { animation-delay: 0s; }
    .dc-dot:nth-child(2) { animation-delay: 0.18s; }
    .dc-dot:nth-child(3) { animation-delay: 0.36s; }
    @keyframes dc-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30%            { transform: translateY(-5px); opacity: 1; }
    }

    /* ── Input area ── */
    #dc-footer {
      border-top: 1px solid #EFEFEF;
      padding: 12px 14px;
      display: flex;
      align-items: flex-end;
      gap: 10px;
      background: #fff;
      flex-shrink: 0;
    }

    #dc-input-wrap {
      flex: 1;
      display: flex;
      align-items: flex-end;
      background: #F3F4F6;
      border-radius: 14px;
      border: 1.5px solid transparent;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
      overflow: hidden;
    }
    #dc-input-wrap:focus-within {
      background: #fff;
      border-color: ${COLOR};
      box-shadow: 0 0 0 3px ${hexToRgba(COLOR, 0.12)};
    }

    #dc-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      resize: none;
      line-height: 1.45;
      max-height: 100px;
      overflow-y: auto;
      color: #111827;
      min-height: 40px;
    }
    #dc-input::placeholder { color: #9CA3AF; }
    #dc-input::-webkit-scrollbar { width: 3px; }
    #dc-input::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }

    #dc-send {
      width: 38px; height: 38px;
      background: ${COLOR};
      border: none;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 2px 8px ${hexToRgba(COLOR, 0.35)};
    }
    #dc-send:hover:not(:disabled) {
      transform: scale(1.06);
      box-shadow: 0 4px 14px ${hexToRgba(COLOR, 0.45)};
    }
    #dc-send:active:not(:disabled) { transform: scale(0.94); }
    #dc-send:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

    /* ── Branding ── */
    #dc-branding {
      text-align: center;
      padding: 7px;
      font-size: 11px;
      color: #C4C9D4;
      background: #fff;
      border-top: 1px solid #F3F4F6;
      flex-shrink: 0;
      letter-spacing: 0.1px;
    }
    #dc-branding a { color: #9CA3AF; text-decoration: none; font-weight: 500; transition: color 0.15s; }
    #dc-branding a:hover { color: ${COLOR}; }

    /* ── Spinner ── */
    @keyframes dc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .dc-spinner {
      width: 15px; height: 15px;
      border: 2px solid rgba(255,255,255,0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: dc-spin 0.65s linear infinite;
    }

    /* ── Unread badge ── */
    #dc-badge {
      position: absolute;
      top: -2px; right: -2px;
      width: 18px; height: 18px;
      background: #EF4444;
      border-radius: 50%;
      border: 2px solid #fff;
      font-size: 10px;
      font-weight: 700;
      color: #fff;
      display: none;
      align-items: center;
      justify-content: center;
      font-family: inherit;
    }
    #dc-badge.dc-show { display: flex; }
  `;
  document.head.appendChild(style);

  // ── Build DOM ──────────────────────────────────────────────────────────────
  var root = document.createElement("div");
  root.id = "dc-root";

  // Panel
  var panel = document.createElement("div");
  panel.id = "dc-panel";

  // Header
  var header = document.createElement("div");
  header.id = "dc-header";
  header.innerHTML = [
    '<div id="dc-header-ava">',
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
        '<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>',
      '</svg>',
    '</div>',
    '<div id="dc-header-info">',
      '<div id="dc-header-name">' + BOT_NAME + '</div>',
      '<div id="dc-header-status">',
        '<div id="dc-status-dot"></div>',
        'Powered by DocChat',
      '</div>',
    '</div>',
    '<button id="dc-header-close" aria-label="Close chat">',
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round">',
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      '</svg>',
    '</button>',
  ].join("");

  // Messages
  var msgsEl = document.createElement("div");
  msgsEl.id = "dc-messages";

  // Date separator
  var dateSep = document.createElement("div");
  dateSep.className = "dc-date-sep";
  dateSep.textContent = "Today";
  msgsEl.appendChild(dateSep);

  // Footer
  var footer = document.createElement("div");
  footer.id = "dc-footer";

  var inputWrap = document.createElement("div");
  inputWrap.id = "dc-input-wrap";

  var inputEl = document.createElement("textarea");
  inputEl.id = "dc-input";
  inputEl.placeholder = "Ask anything…";
  inputEl.rows = 1;
  inputEl.setAttribute("aria-label", "Message");

  inputWrap.appendChild(inputEl);

  var sendBtn = document.createElement("button");
  sendBtn.id = "dc-send";
  sendBtn.setAttribute("aria-label", "Send message");
  sendBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  footer.appendChild(inputWrap);
  footer.appendChild(sendBtn);

  // Branding
  var branding = document.createElement("div");
  branding.id = "dc-branding";
  branding.innerHTML = 'Powered by <a href="https://docchat.app" target="_blank" rel="noopener">DocChat</a>';

  panel.appendChild(header);
  panel.appendChild(msgsEl);
  panel.appendChild(footer);
  panel.appendChild(branding);

  // Bubble
  var bubble = document.createElement("button");
  bubble.id = "dc-bubble";
  bubble.setAttribute("aria-label", "Open chat");

  var badge = document.createElement("div");
  badge.id = "dc-badge";
  badge.textContent = "1";

  bubble.innerHTML = [
    '<svg id="dc-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
      '<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>',
    '</svg>',
    '<svg id="dc-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="display:none">',
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    '</svg>',
  ].join("");
  bubble.appendChild(badge);

  root.appendChild(panel);
  root.appendChild(bubble);
  document.body.appendChild(root);

  // ── State ──────────────────────────────────────────────────────────────────
  var isOpen      = false;
  var isStreaming = false;
  var initiated   = false;
  var unreadCount = 0;

  // ── Toggle panel ──────────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.classList.remove("dc-closing");
    panel.classList.add("dc-open");
    bubble.style.display = "none";
    bubble.setAttribute("aria-label", "Close chat");
    // clear badge
    unreadCount = 0;
    badge.classList.remove("dc-show");
    if (!initiated) {
      initiated = true;
      setTimeout(function() { appendBotMessage(WELCOME); }, 300);
    }
    setTimeout(function () { inputEl.focus(); }, 100);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.add("dc-closing");
    setTimeout(function() {
      panel.classList.remove("dc-open");
      panel.classList.remove("dc-closing");
      bubble.style.display = "flex";
    }, 220);
    bubble.setAttribute("aria-label", "Open chat");
  }

  bubble.addEventListener("click", function () {
    isOpen ? closePanel() : openPanel();
  });
  document.getElementById("dc-header-close").addEventListener("click", closePanel);

  // Show badge after 2s to attract attention
  setTimeout(function() {
    if (!isOpen && !initiated) {
      unreadCount = 1;
      badge.classList.add("dc-show");
    }
  }, 2000);

  // ── Markdown parser ───────────────────────────────────────────────────────
  function parseMarkdown(text) {
    function esc(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function inlineFormat(s) {
      s = esc(s);
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      return s;
    }

    // ── Step 1: normalise inline numbered lists into real lines ──────────────
    // Handles: "The teams are: 1. Foo 2. Bar 3. Baz" (numbers 2+ preceded by space/text)
    // Split on pattern: " 2. " " 3. " etc (NOT at start of string/line)
    text = text.replace(/([^\n])(\s+)(\d+)[.)]\s+/g, function(m, prev, sp, num) {
      return prev + '\n' + num + '. ';
    });

    // Split on bullet patterns inline "• Foo • Bar"
    text = text.replace(/([^\n])\s*[•·]\s+/g, '$1\n• ');

    var lines = text.split('\n');
    var html = '';
    var inOl = false, inUl = false;

    function closeList() {
      if (inOl) { html += '</ol>'; inOl = false; }
      if (inUl) { html += '</ul>'; inUl = false; }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      // Ordered list item: "1. text" or "1) text"
      var olMatch = line.match(/^(\d+)[.)]\.?\s+(.+)/);
      if (olMatch) {
        if (!inOl) { closeList(); html += '<ol>'; inOl = true; }
        html += '<li>' + inlineFormat(olMatch[2].trim()) + '</li>';
        continue;
      }

      // Unordered list: "- item" "* item" "• item"
      var ulMatch = line.match(/^[-*•·]\s+(.+)/);
      if (ulMatch) {
        if (!inUl) { closeList(); html += '<ul>'; inUl = true; }
        html += '<li>' + inlineFormat(ulMatch[1].trim()) + '</li>';
        continue;
      }

      closeList();

      // Heading ###
      if (/^###\s+/.test(line)) {
        html += '<h3>' + inlineFormat(line.replace(/^###\s+/, '')) + '</h3>';
        continue;
      }

      // Horizontal rule
      if (/^[-*_]{3,}$/.test(line)) {
        html += '<hr>';
        continue;
      }

      // Regular text — skip if it's a lead-in like "The teams are:"
      // that will be followed by a list (show as intro paragraph)
      html += '<p>' + inlineFormat(line) + '</p>';
    }

    closeList();
    return html;
  }

  // ── Append bot message ─────────────────────────────────────────────────────
  function makeBotAvatar() {
    var ava = document.createElement("div");
    ava.className = "dc-row-avatar";
    ava.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    return ava;
  }

  function appendBotMessage(text) {
    var row = document.createElement("div");
    row.className = "dc-msg-row dc-row-bot";
    var ava = document.createElement("div");
    ava.className = "dc-row-avatar-bot";
    ava.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    var div = document.createElement("div");
    div.className = "dc-msg dc-msg-bot";
    div.innerHTML = text ? parseMarkdown(text) : '';
    row.appendChild(ava);
    row.appendChild(div);
    msgsEl.appendChild(row);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  function appendUserMessage(text) {
    var row = document.createElement("div");
    row.className = "dc-msg-row dc-row-user";
    var ava = document.createElement("div");
    ava.className = "dc-row-avatar-user";
    ava.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    var div = document.createElement("div");
    div.className = "dc-msg dc-msg-user";
    div.textContent = text;
    row.appendChild(div);
    row.appendChild(ava);
    msgsEl.appendChild(row);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  // ── Typing indicator ──────────────────────────────────────────────────────
  var typingRow = null;
  function showTyping() {
    typingRow = document.createElement("div");
    typingRow.className = "dc-typing-row";
    var ava = document.createElement("div");
    ava.className = "dc-row-avatar-bot";
    ava.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
    typingRow.appendChild(ava);
    var dots = document.createElement("div");
    dots.className = "dc-typing";
    dots.innerHTML = '<div class="dc-dot"></div><div class="dc-dot"></div><div class="dc-dot"></div>';
    typingRow.appendChild(dots);
    msgsEl.appendChild(typingRow);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  function hideTyping() {
    if (typingRow) { typingRow.remove(); typingRow = null; }
  }

  // ── Streaming state ────────────────────────────────────────────────────────
  function setStreaming(val) {
    isStreaming = val;
    sendBtn.disabled = val;
    inputEl.disabled = val;
    sendBtn.innerHTML = val
      ? '<div class="dc-spinner"></div>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  }

  // ── Send message ──────────────────────────────────────────────────────────
  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || isStreaming) return;

    appendUserMessage(text);
    inputEl.value = "";
    inputEl.style.height = "auto";
    showTyping();
    setStreaming(true);

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: WORKSPACE, message: text, sessionId: SESSION_ID }),
    })
    .then(function (res) {
      if (!res.ok) {
        return res.json().then(function(data) {
          hideTyping();
          appendBotMessage(res.status === 429
            ? "Monthly message limit reached. Please upgrade to Pro."
            : (data.error || "Sorry, something went wrong. Please try again."));
          setStreaming(false);
        }).catch(function() {
          hideTyping();
          appendBotMessage("Sorry, something went wrong. Please try again.");
          setStreaming(false);
        });
      }

      hideTyping();
      var botDiv = appendBotMessage("");
      var accumulated = "";
      var reader = res.body.getReader();
      var decoder = new TextDecoder();

      function read() {
        reader.read().then(function (result) {
          if (result.done) { setStreaming(false); return; }
          var chunk = decoder.decode(result.value, { stream: true });
          var lines = chunk.split("\n");
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line.startsWith("data: ")) continue;
            var data = line.slice(6);
            if (data === "[DONE]") { setStreaming(false); return; }
            try {
              var parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                botDiv.innerHTML = parseMarkdown(accumulated);
                msgsEl.scrollTop = msgsEl.scrollHeight;
              }
              if (parsed.error) {
                botDiv.textContent = "Sorry, I couldn't get a response. Please try again.";
                setStreaming(false);
                return;
              }
            } catch (e) { /* skip */ }
          }
          read();
        }).catch(function () { hideTyping(); setStreaming(false); });
      }
      read();
    })
    .catch(function () {
      hideTyping();
      appendBotMessage("Sorry, I couldn't connect. Please try again.");
      setStreaming(false);
    });
  }

  // ── Input events ──────────────────────────────────────────────────────────
  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  inputEl.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
  });

})();