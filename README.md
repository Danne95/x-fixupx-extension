# FixupX Link Copier

> A Chrome extension that adds a **"Copy link (fixup)"** option to X.com share menus — replacing `x.com` with `fixupx.com` for proper link previews everywhere.

**Version:** 1.0.0  
**Made by:** fromepicbrain

---

## What it does

When you click the **share icon** on any X.com post, you'll see a new option in the dropdown:

```
📋  Copy link
🔗  Copy link (fixup)   ← new!
```

Clicking **Copy link (fixup)** copies the post URL with the domain swapped:

```
https://x.com/user/status/123456789
       ↓
https://fixupx.com/user/status/123456789
```

[fixupx.com](https://fixupx.com) is a proxy service that fixes Twitter/X embed previews in Discord, Telegram, Slack, and other platforms.

---

## Installation

Since this extension isn't on the Chrome Web Store, you load it manually in **Developer Mode**.

### Step 1 — Download the extension

Download or clone this repository so you have the folder on your computer:

```
fixupx-extension/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

### Step 2 — Open Chrome Extensions

Go to:
```
chrome://extensions
```

Or: **Chrome menu (⋮)** → **Extensions** → **Manage Extensions**

### Step 3 — Enable Developer Mode

In the top-right corner of the Extensions page, toggle **Developer mode** ON.

### Step 4 — Load the extension

Click **"Load unpacked"** (top-left).

Navigate to and select the `fixupx-extension/` folder.

The extension will appear in your list with the **Fx** icon.

### Step 5 — Pin it (optional but recommended)

Click the **puzzle piece icon** (🧩) in the Chrome toolbar → click the **pin icon** next to *FixupX Link Copier* so it's always visible.

---

## Usage

1. Go to [x.com](https://x.com) and open any post
2. Click the **share icon** (↑) at the bottom of the post
3. Click **"Copy link (fixup)"**
4. A confirmation toast will appear — the fixup URL is now in your clipboard ✓

---

## Toggle On / Off

Click the **Fx** extension icon in your Chrome toolbar to open the popup.

Use the toggle switch to **enable or disable** the extension without uninstalling it. The state is saved across browser sessions.

---

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension config, permissions, content script registration |
| `content.js` | Injects the "Copy link (fixup)" item into X.com share menus |
| `popup.html` | Extension popup UI |
| `popup.js` | Popup logic — loads/saves toggle state, notifies content script |
| `icons/` | Extension icons in 4 sizes |

---

## Notes

- Works on both `x.com` and `twitter.com`
- The extension only runs on X.com — it requests no other permissions
- No data is collected or transmitted anywhere

---

*Made by fromepicbrain — v1.0.0*
