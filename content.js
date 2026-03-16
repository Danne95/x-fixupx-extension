// FixupX Link Copier - Content Script
// Made by fromepicbrain

let isEnabled = true;

// Load enabled state from storage
chrome.storage.sync.get(['enabled'], (result) => {
  isEnabled = result.enabled !== undefined ? result.enabled : true;
});

// Listen for toggle messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE') {
    isEnabled = message.enabled;
  }
});

// ─── Utility ──────────────────────────────────────────────────────────────────

function toFixupUrl(href) {
  try {
    const u = new URL(href);
    if (!u.pathname.includes('/status/')) return null;
    return 'https://fixupx.com' + u.pathname + u.search + u.hash;
  } catch (e) {
    return null;
  }
}

function findPostLink(container) {
  if (!container) return null;
  const anchor = container.querySelector('a[href*="/status/"]');
  if (!anchor) return null;
  return toFixupUrl(anchor.href);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  });
}

function showCopiedToast() {
  const existing = document.getElementById('fixupx-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'fixupx-toast';
  toast.textContent = '✓ Fixup link copied!';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: #1d9bf0;
    color: #fff;
    padding: 10px 20px;
    border-radius: 999px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 14px;
    font-weight: 600;
    z-index: 99999;
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    pointer-events: none;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ─── Menu Item Injection ───────────────────────────────────────────────────────

function createFixupMenuItem(referenceItem) {
  const item = document.createElement('div');

  item.setAttribute('role', 'menuitem');
  item.setAttribute('tabindex', '0');
  item.setAttribute('data-testid', 'fixupx-copy-link');
  item.className = referenceItem.className;
  item.style.cssText = referenceItem.style.cssText;

  item.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:0 4px;">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="flex-shrink:0;">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
      <span style="font-size:15px;font-weight:400;letter-spacing:0.01em;">Copy link (fixup)</span>
    </div>
  `;

  item.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Try walking up from the clicked element first
    let article = e.target.closest('article[role="article"]');

    // X.com often portals the menu outside the article in the DOM,
    // so fall back to finding the article nearest to the open menu
    if (!article) {
      const all = document.querySelectorAll('article[role="article"]');

      // Check for an article with an expanded share button
      for (const a of all) {
        if (a.querySelector('[aria-expanded="true"]')) {
          article = a;
          break;
        }
      }

      // Last resort: find article closest in vertical position to the open menu
      if (!article) {
        const menu = document.querySelector('[role="menu"]');
        if (menu) {
          const menuTop = menu.getBoundingClientRect().top;
          let minDist = Infinity;
          for (const a of all) {
            const dist = Math.abs(a.getBoundingClientRect().top - menuTop);
            if (dist < minDist) { minDist = dist; article = a; }
          }
        }
      }
    }

    const url = findPostLink(article);
    if (url) {
      copyToClipboard(url);
      showCopiedToast();
    }

    document.body.click();
  });

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });

  return item;
}

function injectIntoMenu(menu) {
  if (!isEnabled) return;
  if (menu.querySelector('[data-testid="fixupx-copy-link"]')) return;

  const allItems = menu.querySelectorAll('[role="menuitem"]');
  let copyLinkItem = null;

  for (const item of allItems) {
    const text = item.textContent?.trim().toLowerCase();
    if (text === 'copy link' || text?.includes('copy link')) {
      copyLinkItem = item;
      break;
    }
  }

  if (!copyLinkItem) return;

  const fixupItem = createFixupMenuItem(copyLinkItem);
  copyLinkItem.insertAdjacentElement('afterend', fixupItem);
}

// ─── MutationObserver ─────────────────────────────────────────────────────────

const observer = new MutationObserver((mutations) => {
  if (!isEnabled) return;

  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== 1) continue;

      if (node.getAttribute?.('role') === 'menu') {
        injectIntoMenu(node);
        continue;
      }

      const menus = node.querySelectorAll?.('[role="menu"]');
      if (menus?.length) {
        menus.forEach(injectIntoMenu);
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });