(function () {
  "use strict";

  // ── Read config from the script tag ────────────────────────────────────────
  var scriptTag =
    document.currentScript ||
    document.querySelector("script[data-workspace]");

  if (!scriptTag) return;

  var WORKSPACE  = scriptTag.getAttribute("data-workspace") || "";
  var COLOR      = scriptTag.getAttribute("data-color")     || "#6366F1";
  var POSITION   = scriptTag.getAttribute("data-position")  || "bottom-right";
  var WELCOME    = scriptTag.getAttribute("data-welcome")   || "Hi! How can I help you today?";
  var API_URL    = (scriptTag.getAttribute("data-api-url")  || scriptTag.src.replace("/embed.js", "")) + "/api/chat";

  if (!WORKSPACE) {
    console.warn("[DocChat] data-workspace is required.");
    return;
  }

  // ── Session ID (persists per browser tab) ──────────────────────────────────
  var SESSION_ID = "dc-" + WORKSPACE + "-" + Math.random().toString(36).slice(2);

  // ── Position styles ────────────────────────────────────────────────────────
  var posStyles = {
    "bottom-right":  { bottom: "24px", right: "24px",  left: "auto"  },
    "bottom-left":   { bottom: "24px", left: "24px",   right: "auto" },
    "bottom-center": { bottom: "24px", left: "50%",    right: "auto", transform: "translateX(-50%)" },
  };
  var pos = posStyles[POSITION] || posStyles["bottom-right"];

  // ── Inject styles ──────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    "#dc-root *, #dc-root *::before, #dc-root *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }",
    "#dc-root { position: fixed; z-index: 2147483647; " + objToCss(pos) + " }",
    "#dc-bubble { width: 56px; height: 56px; border-radius: 50%; background: " + COLOR + "; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.18); transition: transform 0.2s, box-shadow 0.2s; margin-left: auto; }",
    "#dc-bubble:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(0,0,0,0.22); }",
    "#dc-panel { width: 360px; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 12px 48px rgba(0,0,0,0.16); display: none; flex-direction: column; background: #fff; margin-bottom: 12px; }",
    "#dc-panel.dc-open { display: flex; }",
    "#dc-header { background: " + COLOR + "; padding: 13px 16px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }",
    "#dc-header-ava { width: 30px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }",
    "#dc-header-name { color: #fff; font-size: 14px; font-weight: 600; }",
    "#dc-header-status { color: rgba(255,255,255,0.75); font-size: 11px; margin-top: 1px; }",
    "#dc-header-close { margin-left: auto; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }",
    "#dc-header-close:hover { background: rgba(255,255,255,0.25); }",
    "#dc-messages { flex: 1; overflow-y: auto; padding: 14px 12px; display: flex; flex-direction: column; gap: 8px; min-height: 280px; max-height: 380px; background: #fff; }",
    ".dc-msg { max-width: 82%; padding: 9px 12px; font-size: 13px; line-height: 1.5; word-break: break-word; }",
    ".dc-msg-bot { background: #F1F5F9; color: #0F172A; border-radius: 10px 10px 10px 2px; align-self: flex-start; }",
    ".dc-msg-user { background: " + COLOR + "; color: #fff; border-radius: 10px 10px 2px 10px; align-self: flex-end; }",
    ".dc-typing { display: flex; align-items: center; gap: 4px; padding: 10px 12px; background: #F1F5F9; border-radius: 10px 10px 10px 2px; align-self: flex-start; width: fit-content; }",
    ".dc-dot { width: 6px; height: 6px; border-radius: 50%; background: #94A3B8; animation: dc-bounce 0.9s infinite; }",
    ".dc-dot:nth-child(2) { animation-delay: 0.15s; }",
    ".dc-dot:nth-child(3) { animation-delay: 0.3s; }",
    "@keyframes dc-bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }",
    "#dc-footer { border-top: 1px solid #E2E8F0; padding: 10px; display: flex; gap: 8px; background: #fff; flex-shrink: 0; }",
    "#dc-input { flex: 1; border: 1px solid #E2E8F0; border-radius: 10px; padding: 9px 13px; font-size: 13px; outline: none; resize: none; transition: border-color 0.15s; line-height: 1.4; max-height: 100px; overflow-y: auto; }",
    "#dc-input:focus { border-color: " + COLOR + "; box-shadow: 0 0 0 3px " + hexToRgba(COLOR, 0.1) + "; }",
    "#dc-send { width: 36px; height: 36px; background: " + COLOR + "; border: none; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: opacity 0.15s; align-self: flex-end; }",
    "#dc-send:disabled { opacity: 0.45; cursor: not-allowed; }",
    "#dc-branding { text-align: center; padding: 5px; font-size: 10px; color: #94A3B8; background: #fff; border-top: 1px solid #F8FAFC; flex-shrink: 0; }",
    "#dc-branding a { color: #94A3B8; text-decoration: none; }",
    "#dc-branding a:hover { color: #475569; }",
    "@keyframes dc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }",
    ".dc-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: dc-spin 0.7s linear infinite; }",
  ].join("\n");
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
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>',
    '</div>',
    '<div>',
      '<div id="dc-header-name">AI Assistant</div>',
      '<div id="dc-header-status">Powered by DocChat · online</div>',
    '</div>',
    '<button id="dc-header-close" aria-label="Close chat">',
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    '</button>',
  ].join("");

  // Messages
  var msgsEl = document.createElement("div");
  msgsEl.id = "dc-messages";

  // Footer
  var footer = document.createElement("div");
  footer.id = "dc-footer";

  var inputEl = document.createElement("textarea");
  inputEl.id = "dc-input";
  inputEl.placeholder = "Ask anything…";
  inputEl.rows = 1;

  var sendBtn = document.createElement("button");
  sendBtn.id = "dc-send";
  sendBtn.setAttribute("aria-label", "Send");
  sendBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  footer.appendChild(inputEl);
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
  bubble.innerHTML = [
    '<svg id="dc-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">',
      '<path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>',
    '</svg>',
    '<svg id="dc-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" style="display:none">',
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    '</svg>',
  ].join("");

  root.appendChild(panel);
  root.appendChild(bubble);
  document.body.appendChild(root);

  // ── State ──────────────────────────────────────────────────────────────────
  var isOpen      = false;
  var isStreaming = false;
  var initiated   = false;

  // ── Toggle panel ──────────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.classList.add("dc-open");
    document.getElementById("dc-icon-open").style.display  = "none";
    document.getElementById("dc-icon-close").style.display = "block";
    bubble.setAttribute("aria-label", "Close chat");
    if (!initiated) {
      initiated = true;
      appendMessage("bot", WELCOME);
    }
    setTimeout(function () { inputEl.focus(); }, 100);
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove("dc-open");
    document.getElementById("dc-icon-open").style.display  = "block";
    document.getElementById("dc-icon-close").style.display = "none";
    bubble.setAttribute("aria-label", "Open chat");
  }

  bubble.addEventListener("click", function () {
    isOpen ? closePanel() : openPanel();
  });

  document.getElementById("dc-header-close").addEventListener("click", closePanel);

  // ── Append message bubble ─────────────────────────────────────────────────
  function appendMessage(role, text) {
    var div = document.createElement("div");
    div.className = "dc-msg dc-msg-" + role;
    div.textContent = text;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  // ── Typing indicator ──────────────────────────────────────────────────────
  var typingEl = null;
  function showTyping() {
    typingEl = document.createElement("div");
    typingEl.className = "dc-typing";
    typingEl.innerHTML = '<div class="dc-dot"></div><div class="dc-dot"></div><div class="dc-dot"></div>';
    msgsEl.appendChild(typingEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  function hideTyping() {
    if (typingEl) { typingEl.remove(); typingEl = null; }
  }

  // ── Set streaming state ───────────────────────────────────────────────────
  function setStreaming(val) {
    isStreaming = val;
    sendBtn.disabled = val;
    inputEl.disabled = val;
    if (val) {
      sendBtn.innerHTML = '<div class="dc-spinner"></div>';
    } else {
      sendBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    }
  }

  // ── Send message ──────────────────────────────────────────────────────────
  function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || isStreaming) return;

    appendMessage("user", text);
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
      // if (!res.ok) throw new Error("API error " + res.status);

      // ✅ NEW
      if (!res.ok) {
        return res.json().then(function(data) {
          hideTyping();
          if (res.status === 429) {
            appendMessage("bot", "Monthly message limit reached. Please upgrade to Pro at your dashboard.");
          } else {
            appendMessage("bot", data.error || "Sorry, something went wrong. Please try again.");
          }
          setStreaming(false);
        }).catch(function() {
          hideTyping();
          appendMessage("bot", "Sorry, something went wrong. Please try again.");
          setStreaming(false);
        });
      }

      hideTyping();
      var botDiv = appendMessage("bot", "");
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
                botDiv.textContent = accumulated;
                msgsEl.scrollTop = msgsEl.scrollHeight;
              }
              if (parsed.error) {
                botDiv.textContent = "Sorry, I couldn't get a response. Please try again.";
                setStreaming(false);
                return;
              }
            } catch (e) { /* skip */ }
          }

          read(); // recurse
        }).catch(function () {
          hideTyping();
          setStreaming(false);
        });
      }

      read();
    })
    .catch(function () {
      hideTyping();
      appendMessage("bot", "Sorry, I couldn't connect. Please try again.");
      setStreaming(false);
    });
  }

  // ── Input events ──────────────────────────────────────────────────────────
  sendBtn.addEventListener("click", sendMessage);

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  inputEl.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  function objToCss(obj) {
    return Object.keys(obj).map(function (k) {
      return k + ": " + obj[k] + ";";
    }).join(" ");
  }

  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

})();