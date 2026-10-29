/* Website Sales Factory — shared site behaviour (no dependencies, no secrets). */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  /* Mobile navigation (disclosure pattern) */
  var toggle = document.querySelector(".nav-toggle");
  var panel = toggle && document.getElementById(toggle.getAttribute("aria-controls"));
  function setOpen(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    var label = toggle.querySelector(".nav-toggle__label");
    if (label) label.textContent = open ? "Close" : "Menu";
  }
  if (toggle && panel) {
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 56.01rem)").addEventListener("change", function (mq) { if (mq.matches) setOpen(false); });
  }

  /* Reveal on scroll (restrained) */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* WhatsApp enquiry form: composes a message and opens wa.me (no backend). */
  document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form__status");
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.value.trim() !== "";
        field.setAttribute("aria-invalid", String(!ok));
        if (!ok && valid) { field.focus(); valid = false; }
      });
      if (!valid) { if (status) status.textContent = "Please fill in the required fields."; return; }
      var lines = [form.getAttribute("data-intro") || "Hello, I'd like to make an enquiry."];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (!field.name || !field.value.trim()) return;
        var label = form.querySelector('label[for="' + field.id + '"]');
        lines.push((label ? label.textContent.replace("*", "").trim() : field.name) + ": " + field.value.trim());
      });
      var number = form.getAttribute("data-whatsapp");
      var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(lines.join("\n"));
      if (status) status.textContent = "Opening WhatsApp with your message…";
      window.open(url, "_blank", "noopener");
    });
  });

  /* Current year */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* ==========================================================================
   Eagle Veterinary Services — Interactive Pet Care & Booking Selector
   Authentic High-Resolution Pet Photography & Seamless WhatsApp Booking
   ========================================================================== */

(function () {
  'use strict';

  var SERVICES = {
    'vaccination': {
      name: 'Puppy & Adult Dog Vaccinations (DHPPiL & Rabies)',
      label: 'Vaccinations & Deworming',
      price: '₦8,000',
      duration: 'Duration: ~25 mins · Health Passport Issued',
      image: 'assets/img/vet-vaccination.jpg',
      badge: '🛡️ Core Immunization & Deworming',
      desc: 'Essential preventive immunization covering Canine Distemper, Hepatitis, Parvovirus, Leptospirosis, and Rabies. Administered with broad-spectrum deworming and an official veterinary vaccination passport.',
      prep: 'Bring your pet\'s previous vaccination card or passport if previously vaccinated.'
    },
    'consultation': {
      name: 'Veterinary Clinical Consultation & Exam',
      label: 'Doctor Consultation',
      price: '₦10,000',
      duration: 'Duration: ~35 mins · Full Nose-to-Tail Check',
      image: 'assets/img/vet-hero.jpg',
      badge: '🩺 Experienced Attending Vet',
      desc: 'Comprehensive diagnostic evaluation including body temperature, heart & lung auscultation, lymph nodes, eyes, ears, oral health, and skin inspection with tailored clinical prescription.',
      prep: 'Please note down recent symptoms, dietary changes, and stool consistency before your visit.'
    },
    'boarding': {
      name: 'Supervised Pet Boarding & Daycare',
      label: 'Pet Boarding & Kenneling',
      price: '₦7,500',
      duration: 'Per Night · Daily Monitored Care & Exercise',
      image: 'assets/img/vet-boarding.jpg',
      badge: '🏡 Safe & Hygienic Indoor Suites',
      desc: 'Spacious, clean, shaded individual boarding kennels with vet-monitored feeding, continuous clean water, daily exercise routines, and on-site clinical surveillance while you travel.',
      prep: 'Boarding pets must have active vaccination records and be free of ticks/fleas upon intake.'
    },
    'grooming': {
      name: 'Therapeutic Medicated Grooming & Flea Dip',
      label: 'Grooming & Flea Dip',
      price: '₦12,000',
      duration: 'Duration: ~60 mins · Anti-Parasite Care',
      image: 'assets/img/vet-grooming.jpg',
      badge: '✨ Medicated Wash & Hygiene Trim',
      desc: 'Therapeutic antiseptic or antifungal bath, complete anti-tick and flea dipping, coat brushing, gentle ear canal cleansing, and precision sanitary nail trims.',
      prep: 'Highly recommended for itchy coats, dermatitis, or seasonal tick prevention in Lagos.'
    },
    'surgery': {
      name: 'Minor Surgery & Spaying / Neutering',
      label: 'Surgery & Sterilization',
      price: '₦45,000',
      duration: 'Procedure: ~90 mins · Monitored Recovery',
      image: 'assets/img/vet-surgery.jpg',
      badge: '🔬 Sterile Operating Theatre',
      desc: 'Safe, sterile elective spay/neuter surgery, wound debridement, or minor tumor excision performed with careful pre-anesthetic screening and dedicated post-operative recovery monitoring.',
      prep: 'Requires 8–12 hours strict fasting prior to surgery (water permitted up to 2 hours before).'
    }
  };

  var PET_TYPES = {
    'dog': {
      name: 'Dog / Canine (Puppy or Adult)',
      label: '🐕 Dog / Canine'
    },
    'cat': {
      name: 'Cat / Feline (Kitten or Adult)',
      label: '🐈 Cat / Feline'
    },
    'multiple': {
      name: 'Multiple Pets / Other Animals',
      label: '🐾 Multiple / Other'
    }
  };

  var SLOTS = [
    { id: 'today', label: 'Today (Immediate / Walk-in)' },
    { id: 'tomorrow', label: 'Tomorrow Morning' },
    { id: 'weekend', label: 'This Weekend (Sat)' },
    { id: 'nextweek', label: 'Next Week' }
  ];

  var state = {
    service: 'vaccination',
    petType: 'dog',
    slot: 'tomorrow'
  };

  var CLINIC_PHONE = '2347033613617';

  function buildWhatsAppLink() {
    var s = SERVICES[state.service] || SERVICES.vaccination;
    var p = PET_TYPES[state.petType] || PET_TYPES.dog;
    var slotObj = SLOTS.find(function(x) { return x.id === state.slot; }) || SLOTS[1];

    var msg = 'Hello Eagle Veterinary Services! I would like to book an appointment for:\n\n' +
      '🐾 Pet: ' + p.name + '\n' +
      '🩺 Service: ' + s.name + '\n' +
      '💵 Estimated Fee: ' + s.price + '\n' +
      '📅 Preferred Timing: ' + slotObj.label + '\n\n' +
      'Please confirm clinic availability at 124 Ogunlana Drive, Surulere.';

    return 'https://wa.me/' + CLINIC_PHONE + '?text=' + encodeURIComponent(msg);
  }

  function renderSelector() {
    var container = document.getElementById('pet-care-selector');
    if (!container) return;

    var s = SERVICES[state.service];
    var p = PET_TYPES[state.petType];
    var waUrl = buildWhatsAppLink();

    var serviceChips = Object.keys(SERVICES).map(function (key) {
      var item = SERVICES[key];
      var active = key === state.service ? ' active' : '';
      return '<button type="button" class="vet-chip' + active + '" data-service="' + key + '">' + item.label + '</button>';
    }).join('');

    var petChips = Object.keys(PET_TYPES).map(function (key) {
      var item = PET_TYPES[key];
      var active = key === state.petType ? ' active' : '';
      return '<button type="button" class="vet-chip' + active + '" data-pet="' + key + '">' + item.label + '</button>';
    }).join('');

    var slotChips = SLOTS.map(function (item) {
      var active = item.id === state.slot ? ' active' : '';
      return '<button type="button" class="vet-chip' + active + '" data-slot="' + item.id + '">' + item.label + '</button>';
    }).join('');

    container.innerHTML =
      '<div class="vet-interactive-container">' +
        '<div class="vet-interactive-header">' +
          '<div class="vet-interactive-eyebrow">Interactive Care Planner</div>' +
          '<h2>Select Your Pet\'s Care &amp; Book Instantly</h2>' +
          '<p>Pick your pet type and desired treatment below to view estimated fees, appointment preparation tips, and reserve directly with our veterinary team on Ogunlana Drive.</p>' +
        '</div>' +
        '<div class="vet-selector-box">' +
          '<!-- Left Column: Visual Preview -->' +
          '<div class="vet-preview-card">' +
            '<div class="vet-preview-media">' +
              '<img src="' + s.image + '" alt="' + s.name + '" class="vet-preview-img" id="vet-live-img">' +
              '<div class="vet-preview-badge" id="vet-live-badge">' + s.badge + '</div>' +
            '</div>' +
            '<div class="vet-preview-body">' +
              '<div class="vet-preview-title" id="vet-live-title">' + s.name + '</div>' +
              '<div class="vet-preview-duration" id="vet-live-duration">' + s.duration + '</div>' +
              '<p class="vet-preview-desc" id="vet-live-desc">' + s.desc + '</p>' +
              '<div class="vet-prep-guide">' +
                '<strong>Preparation Guide</strong>' +
                '<p id="vet-live-prep">' + s.prep + '</p>' +
              '</div>' +
              '<div class="vet-preview-footer">' +
                '<div class="vet-fee-block">' +
                  '<span class="vet-fee-label">Estimated Fee</span>' +
                  '<span class="vet-fee-amount" id="vet-live-price">' + s.price + '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<!-- Right Column: Interactive Controls -->' +
          '<div class="vet-controls-pane">' +
            '<div class="vet-control-group">' +
              '<div class="vet-control-title"><span>1. Select Pet Type</span></div>' +
              '<div class="vet-chip-grid" id="vet-pet-grid">' + petChips + '</div>' +
            '</div>' +
            '<div class="vet-control-group">' +
              '<div class="vet-control-title"><span>2. Select Treatment or Service</span></div>' +
              '<div class="vet-chip-grid" id="vet-service-grid">' + serviceChips + '</div>' +
            '</div>' +
            '<div class="vet-control-group">' +
              '<div class="vet-control-title"><span>3. Preferred Appointment Day</span></div>' +
              '<div class="vet-chip-grid" id="vet-slot-grid">' + slotChips + '</div>' +
            '</div>' +
            '<div style="margin-top: 1rem;">' +
              '<a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" class="vet-cta-btn" id="vet-wa-btn">' +
                '<span>Book This Visit on WhatsApp →</span>' +
              '</a>' +
              '<div class="vet-guarantee-note">' +
                '<span>📍 124 Ogunlana Drive, Surulere · Direct Response from Attending Vet</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    attachEvents(container);
  }

  function attachEvents(container) {
    var petButtons = container.querySelectorAll('[data-pet]');
    petButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.petType = this.getAttribute('data-pet');
        renderSelector();
      });
    });

    var serviceButtons = container.querySelectorAll('[data-service]');
    serviceButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.service = this.getAttribute('data-service');
        renderSelector();
      });
    });

    var slotButtons = container.querySelectorAll('[data-slot]');
    slotButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.slot = this.getAttribute('data-slot');
        renderSelector();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var existingSection = document.getElementById('pet-care-selector');
    if (!existingSection) {
      var section = document.createElement('section');
      section.id = 'pet-care-selector';
      section.className = 'vet-interactive-section';

      var servicesSection = document.getElementById('services');
      if (servicesSection && servicesSection.parentNode) {
        servicesSection.parentNode.insertBefore(section, servicesSection);
      } else {
        var main = document.querySelector('main') || document.body;
        main.appendChild(section);
      }
    }
    renderSelector();
  });
})();
