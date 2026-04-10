/* ═══════════════════════════════════════════════
   SCRIPT.JS
   1. Terminal typewriter
   2. Sticky nav — scroll class + active link
   3. Mobile nav toggle
   4. Project card injection
   5. Scroll reveal
   6. Contact form validation
═══════════════════════════════════════════════ */

/* ─── 1. TERMINAL TYPEWRITER ─── */
(function initTerminal() {
  const lines = [
    { el: document.getElementById("typed-line-1"), cursor: document.getElementById("cursor-1"), text: "whoami" },
    { el: document.getElementById("typed-line-2"), cursor: document.getElementById("cursor-2"), text: "cat about.txt" },
  ];
  const output  = document.getElementById("terminal-output");
  const line2El = document.getElementById("line-2");

  const CHAR_DELAY  = 75;   // ms per character
  const LINE_PAUSE  = 600;  // pause after line finishes before next starts
  const OUTPUT_WAIT = 400;  // pause after last line before showing output

  function typeText(lineObj, onDone) {
    const { el, cursor, text } = lineObj;
    let i = 0;
    cursor.classList.remove("hidden");

    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        cursor.classList.add("hidden");
        setTimeout(onDone, LINE_PAUSE);
      }
    }, CHAR_DELAY + Math.random() * 30); // subtle jitter for realism
  }

  // Sequence: type line 1 → show line 2 → type line 2 → show output
  typeText(lines[0], () => {
    line2El.hidden = false;
    typeText(lines[1], () => {
      setTimeout(() => {
        output.hidden = false;
      }, OUTPUT_WAIT);
    });
  });
})();


/* ─── 2. STICKY NAV — SCROLL CLASS + ACTIVE LINK ─── */
(function initNav() {
  const nav      = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");

  // Add .scrolled border when page is not at top
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
    highlightActiveLink();
  }

  // Mark the nav link whose section is currently in view
  function highlightActiveLink() {
    let current = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) - 16;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      const matches = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", matches);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ─── 3. MOBILE NAV TOGGLE ─── */
(function initMobileNav() {
  const toggle   = document.querySelector(".nav-toggle");
  const linkList = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    linkList.classList.toggle("open", !expanded);
  });

  // Close menu when a link is clicked
  linkList.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      linkList.classList.remove("open");
    });
  });

  // Close menu on outside click
  document.addEventListener("click", e => {
    if (!toggle.contains(e.target) && !linkList.contains(e.target)) {
      toggle.setAttribute("aria-expanded", "false");
      linkList.classList.remove("open");
    }
  });
})();


/* ─── 4. PROJECT CARD INJECTION ─── */
(function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid || typeof PROJECTS === "undefined") return;

  // External link SVG icon (reused per card)
  const linkIcon = `
    <svg class="card-link-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>`;

  const fragment = document.createDocumentFragment();

  PROJECTS.forEach(project => {
    const card = document.createElement("a");
    card.className = "project-card reveal";
    card.href = project.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `${project.repo} — view on GitHub`);

    const tags = project.tags
      .map(t => `<span class="tag">${escapeHTML(t)}</span>`)
      .join("");

    card.innerHTML = `
      <div class="card-header">
        <span class="card-repo">${escapeHTML(project.repo)}</span>
        ${linkIcon}
      </div>
      <p class="card-desc">${escapeHTML(project.description)}</p>
      <div class="card-tags">${tags}</div>`;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
})();


/* ─── 5. SCROLL REVEAL ─── */
(function initReveal() {
  // Also mark static elements (about, skills, contact children) as reveal targets
  const staticTargets = document.querySelectorAll(
    ".about-grid, .about-text, .about-card, .skills-groups, .skill-group, .contact-form, .contact-links"
  );
  staticTargets.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  // Observe all .reveal elements (includes dynamically added project cards)
  function observeAll() {
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  }

  // Cards are injected synchronously above, so this runs after
  observeAll();
})();


/* ─── 6. CONTACT FORM VALIDATION ─── */
(function initContactForm() {
  const form   = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  function getField(id) { return form.querySelector(`#${id}`); }
  function getError(id) { return getField(id).parentElement.querySelector(".field-error"); }

  function validate(field) {
    const val = field.value.trim();
    let message = "";

    if (field.required && !val) {
      message = "This field is required.";
    } else if (field.type === "email" && val) {
      // Simple RFC-ish check without being pedantic
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        message = "Please enter a valid email address.";
      }
    }

    const errorEl = field.parentElement.querySelector(".field-error");
    errorEl.textContent = message;
    field.classList.toggle("invalid", !!message);
    return !message;
  }

  // Validate on blur for each field (don't yell before they've touched it)
  ["name", "email", "message"].forEach(id => {
    getField(id).addEventListener("blur", e => validate(e.target));
    getField(id).addEventListener("input", e => {
      if (e.target.classList.contains("invalid")) validate(e.target);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const fields  = ["name", "email", "message"].map(id => getField(id));
    const allValid = fields.map(validate).every(Boolean);
    if (!allValid) return;

    // Simulate async send (replace with your actual endpoint / EmailJS / etc.)
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "sending...";
    status.textContent = "";
    status.className = "form-status";

    setTimeout(() => {
      // SUCCESS path — swap this block for a real fetch() call
      form.reset();
      fields.forEach(f => f.classList.remove("invalid"));
      status.textContent = "✓ Message sent! I'll get back to you soon.";
      status.className = "form-status";
      btn.disabled = false;
      btn.textContent = "send message";
    }, 1200);
  });
})();


/* ─── UTILITY ─── */
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
