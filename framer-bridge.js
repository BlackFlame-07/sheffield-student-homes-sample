/* Nordesthetics Fully Interactive Engine | Blackflame Agency */
(function() {
  'use strict';

  // 1. Restore settled styles on load
  function restoreSettled() {
    document.querySelectorAll('[data-settled-opacity]').forEach(function(el) {
      var op = el.getAttribute('data-settled-opacity');
      if (parseFloat(op) > 0) {
        el.style.opacity = op;
      }
    });
    document.querySelectorAll('[data-settled-transform]').forEach(function(el) {
      var tr = el.getAttribute('data-settled-transform');
      if (tr && tr !== 'none') {
        el.style.transform = tr;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreSettled);
  } else {
    restoreSettled();
  }

  // 2. IntersectionObserver for Entrance Animations
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.transition = 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.opacity = '1';
        el.style.transform = 'none';
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 100px 0px' });

  window.addEventListener('load', function() {
    // Reveal all unrevealed elements
    document.querySelectorAll('[data-framer-appear-id], [style*="opacity: 0"], [style*="opacity:0"]').forEach(function(el) {
      if (el.classList.contains('framer-kqsc3p') || el.classList.contains('framer-15eukk7') || el.getAttribute('data-framer-name') === 'Scrim' || el.getAttribute('data-framer-name') === 'Dropdowns') {
        return;
      }
      var cs = window.getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.2) {
        observer.observe(el);
      }
    });

    // 3. 60fps Infinite Ticker / Marquee Engine
    var tickers = document.querySelectorAll('[data-framer-name*="Ticker"], [data-framer-name*="Marquee"], [data-framer-name*="ticker"], [data-framer-name*="marquee"]');
    tickers.forEach(function(ticker) {
      var track = ticker.firstElementChild;
      if (!track) return;
      var currentX = 0;
      var speed = 0.75;
      track.style.display = 'flex';
      track.style.willChange = 'transform';
      
      if (track.children.length > 0 && !track.getAttribute('data-cloned')) {
        track.setAttribute('data-cloned', 'true');
        var originalChildren = Array.from(track.children);
        originalChildren.forEach(function(child) {
          track.appendChild(child.cloneNode(true));
        });
      }

      function step() {
        currentX -= speed;
        var halfWidth = track.scrollWidth / 2;
        if (Math.abs(currentX) >= halfWidth) {
          currentX = 0;
        }
        track.style.transform = 'translate3d(' + currentX + 'px, 0px, 0px)';
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });

    // 4. Smooth Anchor Scrolling for Internal Links
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      // If it's a consultation trigger, let the modal handler manage it
      var text = link.innerText.trim().toLowerCase();
      if (text.includes('consultation') || text.includes('request time') || text.includes('book with a specialist')) {
        return;
      }
      
      var targetId = href.slice(1);
      var targetEl = document.getElementById(targetId) || document.querySelector('[data-framer-name="' + targetId + '"]');
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // 5. Hero Carousel Controls
    var heroSlides = [
      { src: './assets/svs_clinic_wide_5k.jpg', pos: 'center center' },
      { src: './assets/ZAe2RSeRRvptuPbcksJup5EdVE_6a3cf915.webp', pos: 'center center' },
      { src: './assets/hkCLvVNbVvxFIG5ODVbe6sk_56529734.webp', pos: 'center center' }
    ];
    var currentHeroIdx = 0;
    var heroButtons = document.querySelectorAll('#hero [data-framer-name="Ghost"], .framer-59oil5 button');
    if (heroButtons.length >= 2) {
      var prevHeroBtn = heroButtons[0];
      var nextHeroBtn = heroButtons[1];
      
      function setHeroSlide(idx) {
        currentHeroIdx = (idx + heroSlides.length) % heroSlides.length;
        var heroImg = document.querySelector('#hero [data-framer-name*="Slide"] img, .framer-80y4h2 img');
        if (heroImg) {
          heroImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          heroImg.style.opacity = '0.3';
          setTimeout(function() {
            heroImg.src = heroSlides[currentHeroIdx].src;
            heroImg.style.objectPosition = heroSlides[currentHeroIdx].pos;
            heroImg.style.opacity = '1';
          }, 180);
        }
      }
      
      prevHeroBtn.addEventListener('click', function(e) {
        e.preventDefault();
        setHeroSlide(currentHeroIdx - 1);
      });
      nextHeroBtn.addEventListener('click', function(e) {
        e.preventDefault();
        setHeroSlide(currentHeroIdx + 1);
      });
    }

    // 6. Treatments Carousel Controls
    var tButtons = document.querySelectorAll('#treatments button');
    var tRow = document.querySelector('#treatments .framer-1ygtwjr, [data-framer-name="Treatments row"]');
    if (tButtons.length >= 2 && tRow) {
      var prevTBtn = tButtons[0];
      var nextTBtn = tButtons[1];
      
      prevTBtn.addEventListener('click', function(e) {
        e.preventDefault();
        tRow.scrollBy({ left: -380, behavior: 'smooth' });
      });
      nextTBtn.addEventListener('click', function(e) {
        e.preventDefault();
        tRow.scrollBy({ left: 380, behavior: 'smooth' });
      });
    }

    // 7. Reviews Carousel Controls (Stacked 4-Review Slideshow)
    var rButtons = document.querySelectorAll('#reviews button, .framer-t9hxwc button');
    var rSlides = document.querySelectorAll('#reviews [data-framer-name="Reviews row"] > div, .framer-t9hxwc .framer-1ykgbf5 > div');
    var currentRIdx = 0;

    function showReviewSlide(idx) {
      if (!rSlides.length) return;
      currentRIdx = (idx + rSlides.length) % rSlides.length;
      rSlides.forEach(function(s, i) {
        if (i === currentRIdx) {
          s.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          s.style.visibility = 'visible';
          s.style.opacity = '1';
          s.style.transform = 'none';
          s.style.pointerEvents = 'auto';
        } else {
          s.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          s.style.visibility = 'hidden';
          s.style.opacity = '0';
          s.style.transform = 'none';
          s.style.pointerEvents = 'none';
        }
      });
    }

    if (rButtons.length >= 2 && rSlides.length > 0) {
      var prevRBtn = rButtons[0];
      var nextRBtn = rButtons[1];
      
      prevRBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showReviewSlide(currentRIdx - 1);
      });
      nextRBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showReviewSlide(currentRIdx + 1);
      });
    }

        // 8. Specialists Doctor Tabs (100% Exact OG Aveline Studio Specialists)
    var specialistsData = [
      {
        name: 'Dr. Elena Varga',
        role: 'Cosmetic dentistry',
        photo: './assets/LhRdrbEme10eLb0FCf78WEGE_dr_varga.webp',
        alt: 'Dr. Elena Varga · Cosmetic dentistry',
        bio: 'Elena leads our cosmetic work, from whitening to full veneer cases. She plans every smile digitally first, so you can see the result before a single tooth is touched.',
        experience: '12 years',
        languages: 'English, Hungarian',
        inStudio: 'Mon, Wed, Fri',
        rating: '4.9',
        reviews: '312 reviews'
      },
      {
        name: 'Dr. Daniel Costa',
        role: 'Orthodontics',
        photo: './assets/i9YV55qg35geFijtWVbcSvyZI_dr_costa.webp',
        alt: 'Dr. Daniel Costa · Orthodontics',
        bio: 'Daniel has straightened more than 1,400 smiles with clear aligners and fixed braces. He is known for realistic timelines and very few surprise extra stages.',
        experience: '9 years',
        languages: 'English, Portuguese',
        inStudio: 'Tue, Thu, Sat',
        rating: '4.8',
        reviews: '268 reviews'
      },
      {
        name: 'Dr. Sofia Reyes',
        role: "Children's dentistry",
        photo: './assets/TjZGJmXA2itrXL8hlBEh6zV8PA_dr_reyes.webp',
        alt: "Dr. Sofia Reyes · Children's dentistry",
        bio: 'Sofia makes first visits fun and fear-free. Children see her from their first tooth through their teens, with parents in the room for every appointment.',
        experience: '7 years',
        languages: 'English, Spanish',
        inStudio: 'Mon, Tue, Thu',
        rating: '4.9',
        reviews: '204 reviews'
      },
      {
        name: 'Dr. Ryan Okafor',
        role: 'Implants & surgery',
        photo: './assets/guZzPzCD5moyy6x2UlwrIWlV1yI_dr_okafor.webp',
        alt: 'Dr. Ryan Okafor · Implants & surgery',
        bio: 'Ryan places implants with guided surgery, planned from a 3D scan of your jaw. Most patients return to work the next day with a temporary tooth in place.',
        experience: '15 years',
        languages: 'English, Yoruba',
        inStudio: 'Wed, Thu, Fri',
        rating: '5.0',
        reviews: '176 reviews'
      }
    ];

        var specButtons = document.querySelectorAll('#team [data-framer-name="List"] button, #team button, .framer-t9vo8c button');

    specButtons.forEach(function(btn, idx) {
      if (idx >= specialistsData.length) return;
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        specButtons.forEach(function(b) {
          b.classList.remove('framer-v-l7hn10');
          b.classList.add('framer-v-18yegsd');
          b.setAttribute('data-framer-name', 'Default');
          var thumb = b.querySelector('.doc-avatar-thumb');
          if (thumb) {
            thumb.style.borderColor = 'rgba(12, 26, 29, 0.12)';
            thumb.style.transform = 'scale(1)';
          }
        });
        btn.classList.remove('framer-v-18yegsd');
        btn.classList.add('framer-v-l7hn10');
        btn.setAttribute('data-framer-name', 'Active');
        var activeThumb = btn.querySelector('.doc-avatar-thumb');
        if (activeThumb) {
          activeThumb.style.borderColor = 'var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66)';
          activeThumb.style.transform = 'scale(1.08)';
        }

        var data = specialistsData[idx];
        if (!data) return;

        // Image swap with smooth opacity fade and scale-down spring effect
        var specImg = document.getElementById('specialist-main-img') || document.querySelector('#team img, .framer-t9vo8c img');
        if (specImg && data.photo) {
          specImg.style.transition = 'opacity 0.22s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          specImg.style.opacity = '0';
          specImg.style.transform = 'scale(1.03)';
          setTimeout(function() {
            specImg.src = data.photo;
            if (specImg.srcset) specImg.srcset = data.photo + ' 1000w';
            specImg.alt = data.alt || data.name;
            specImg.style.objectPosition = 'center 15%';
            specImg.style.opacity = '1';
            specImg.style.transform = 'none';
          }, 180);
        }

        // Details swap with smooth crossfade
        var detailPanel = document.querySelector('#team [data-framer-name="Detail"], .framer-t9vo8c [data-framer-name="Detail"]');
        var bioP = document.querySelector('#team .framer-1qbhr2a p, .framer-t9vo8c .framer-1qbhr2a p');
        var expP = document.querySelector('#team .framer-1glbhae p, .framer-t9vo8c .framer-1glbhae p');
        var langP = document.querySelector('#team .framer-12xqlve p, .framer-t9vo8c .framer-12xqlve p');
        var studioP = document.querySelector('#team .framer-1diyyku p, .framer-t9vo8c .framer-1diyyku p');
        var ratingP = document.querySelector('#team .framer-yk2ukh p, .framer-t9vo8c .framer-yk2ukh p');
        var reviewsP = document.querySelector('#team .framer-1yjeujl p, .framer-t9vo8c .framer-1yjeujl p');

        if (detailPanel || bioP) {
          if (detailPanel) {
            detailPanel.style.transition = 'opacity 0.2s ease';
            detailPanel.style.opacity = '0.3';
          }
          setTimeout(function() {
            if (bioP) bioP.textContent = data.bio;
            if (expP) expP.textContent = data.experience;
            if (langP) langP.textContent = data.languages;
            if (studioP) studioP.textContent = data.inStudio;
            if (ratingP) ratingP.textContent = data.rating;
            if (reviewsP) reviewsP.textContent = data.reviews;
            if (detailPanel) detailPanel.style.opacity = '1';
          }, 180);
        }
      });
    });

    // 9. FAQ Accordions
    document.querySelectorAll('.framer-CNui5, [data-framer-name="Question"]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var card = btn.closest('.framer-CNui5') || btn.parentElement;
        if (!card) return;
        e.preventDefault();
        var isOpen = card.classList.contains('framer-v-wtjozs');
        if (isOpen) {
          card.classList.remove('framer-v-wtjozs');
          card.classList.add('framer-v-1fsuiv0');
        } else {
          document.querySelectorAll('.framer-CNui5').forEach(function(c) {
            c.classList.remove('framer-v-wtjozs');
            c.classList.add('framer-v-1fsuiv0');
          });
          card.classList.remove('framer-v-1fsuiv0');
          card.classList.add('framer-v-wtjozs');
        }
      });
    });

    // 10. Wire Book Section & Treatments
    wireBookSection();

    // 11. Inject Official Booking Calendar & Modals
    injectModals();
  }); // Closes window.addEventListener('load')

  function wireBookSection() {
    var bookSec = document.getElementById('book');
    if (!bookSec) return;

    var optionCards = bookSec.querySelectorAll('[data-framer-name="Check-up & cleaning"], [data-framer-name="Whitening consultation"], [data-framer-name="Aligner consultation"], [data-framer-name="Implant consultation"], [data-framer-name="Emergency appointment"]');
    var yourVisitTitle = bookSec.querySelector('[data-framer-name="Your visit"] p, [data-framer-name="Your visit"]');

    var treatments = {
      'Check-up & cleaning': { name: 'Smile Assessment & Check-up', doctor: 'Dr. Elena Varga' },
      'Whitening consultation': { name: 'Teeth Whitening Consultation', doctor: 'Dr. Elena Varga' },
      'Aligner consultation': { name: 'Clear Aligner Assessment', doctor: 'Dr. Daniel Costa' },
      'Implant consultation': { name: 'Dental Implant Consultation', doctor: 'Dr. Ryan Okafor' },
      'Emergency appointment': { name: "Pediatric & Family Consultation", doctor: 'Dr. Sofia Reyes' }
    };

    optionCards.forEach(function(card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(e) {
        e.preventDefault();
        var fname = card.getAttribute('data-framer-name');
        var data = treatments[fname];
        if (!data) return;

        optionCards.forEach(function(c) {
          c.style.opacity = '0.65';
          c.style.transform = 'scale(0.98)';
        });
        card.style.opacity = '1';
        card.style.transform = 'scale(1.02)';

        if (yourVisitTitle) {
          var tElem = yourVisitTitle.querySelector('span[style*="font-weight: 600"], strong, span') || yourVisitTitle;
          tElem.textContent = data.name + ' with ' + data.doctor;
        }

        if (window.openNordCalendar) {
          window.openNordCalendar({ procedure: data.name, doctor: data.doctor });
        }
      });
    });

    var reqTimeBtn = bookSec.querySelector('[data-framer-name="Request"] a, [data-framer-name="Accent"]');
    if (reqTimeBtn) {
      reqTimeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (window.openNordCalendar) {
          window.openNordCalendar();
        }
      });
    }
  }

  // Inject High-End Modals for Consultation, Legal & Articles
  function injectModals() {
    var modalCss = document.createElement('style');
    modalCss.id = 'svs-modals-css';
    modalCss.textContent = `
      /* Backdrop with modern glass blur matching site */
      .svs-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(12, 26, 29, 0.45);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .svs-modal-backdrop.active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Modal Card - Pristine Scandinavian Medical Luxury */
      .svs-modal-card {
        background: #ffffff;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 24px;
        box-shadow: 0 32px 64px -16px rgba(12, 26, 29, 0.16), 0 0 0 1px rgba(12, 26, 29, 0.05);
        max-width: 680px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 32px;
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        font-family: "Geist", "Geist Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        transform: scale(0.96) translateY(12px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
      }
      .svs-modal-backdrop.active .svs-modal-card {
        transform: scale(1) translateY(0);
      }

      /* Close button matching tactile icon buttons */
      .svs-modal-close {
        position: absolute;
        top: 24px;
        right: 24px;
        background: var(--token-5eaf046f-639c-4d6e-8392-8b43de17a3e0, #f3f5f4);
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 10;
      }
      .svs-modal-close:hover {
        background: var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        transform: scale(1.05);
      }

      /* Mode Tabs - Segmented pill bar matching site controls */
      .svs-mode-tabs {
        display: flex;
        gap: 4px;
        margin: 18px 0 22px 0;
        background: var(--token-5eaf046f-639c-4d6e-8392-8b43de17a3e0, #f3f5f4);
        padding: 4px;
        border-radius: 12px;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
      }
      .svs-mode-btn {
        flex: 1;
        background: none;
        border: none;
        color: #303d42;
        font-family: "Geist", sans-serif;
        font-size: 12.5px;
        font-weight: 600;
        flex: 1;
        background: none;
        border: none;
        color: #303d42;
        font-family: "Geist", sans-serif;
        font-size: 12.5px;
        font-weight: 500;
        padding: 9px 12px;
        border-radius: 9px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .svs-mode-btn.active {
        background: #ffffff;
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        font-weight: 500;
        box-shadow: 0 1px 3px rgba(12, 26, 29, 0.08);
      }

      /* Clinician Select Row */
      .svs-doctor-select-row {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 8px;
        margin-bottom: 18px;
      }
      .svs-doc-pill {
        flex-shrink: 0;
        background: #ffffff;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 12px;
        color: #0c1a1d;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .svs-doc-pill:hover {
        border-color: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
      }
      .svs-doc-pill.active {
        background: var(--token-73fca08b-adbc-4a15-8607-f80129d82e18, #dcebeb);
        border-color: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        font-weight: 600;
      }
      .svs-doc-pill .doc-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgb(39, 163, 107);
      }

      /* Track / Consultation Grid */
      .svs-track-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 18px;
      }
      .svs-track-item {
        background: #ffffff;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 12px;
        padding: 12px;
        cursor: pointer;
        font-size: 11px;
        line-height: 1.35;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        text-align: left;
      }
      .svs-track-item:hover {
        border-color: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
      }
      .svs-track-item.active {
        border-color: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
        background: #f6faf9;
        box-shadow: 0 0 0 1px var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
      }
      .svs-track-title {
        font-weight: 600;
        font-size: 12px;
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        margin-bottom: 2px;
      }
      .svs-track-sub {
        color: #303d42;
        font-size: 10.5px;
      }

      /* Calendar Box */
      .svs-cal-box {
        background: var(--token-5eaf046f-639c-4d6e-8392-8b43de17a3e0, #f3f5f4);
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 16px;
        padding: 18px;
        margin-bottom: 18px;
      }
      .svs-cal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .svs-cal-title {
        font-size: 14.5px;
        font-weight: 600;
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        letter-spacing: -0.015em;
      }
      .svs-cal-nav {
        display: flex;
        gap: 6px;
      }
      .svs-cal-nav-btn {
        background: #ffffff;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        border-radius: 7px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;
        transition: all 0.15s;
      }
      .svs-cal-nav-btn:hover {
        background: #eaeeed;
      }
      .svs-cal-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        font-family: "Geist Mono", monospace;
        font-size: 11px;
        color: #303d42;
        font-weight: 500;
        text-transform: uppercase;
        margin-bottom: 8px;
      }
      .svs-cal-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
      }
      .svs-day-cell {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: "Geist Mono", monospace;
        font-size: 12px;
        font-weight: 500;
        border-radius: 8px;
        cursor: pointer;
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        position: relative;
        transition: all 0.15s;
        border: 1px solid transparent;
        background: transparent;
      }
      .svs-day-cell:hover:not(.disabled) {
        background: #ffffff;
        border-color: var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
      }
      .svs-day-cell.active {
        background: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66) !important;
        color: #ffffff !important;
        font-weight: 600 !important;
        border-color: #0e5a66 !important;
      }
      .svs-day-cell.has-slots::after {
        content: '';
        position: absolute;
        bottom: 3px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgb(39, 163, 107);
      }
      .svs-day-cell.active::after {
        background: #ffffff;
      }
      .svs-day-cell.disabled {
        opacity: 0.25;
        cursor: not-allowed;
      }

      /* Slots */
      .svs-slots-wrap {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
      }
      .svs-slots-title {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #303d42;
        margin-bottom: 8px;
        font-weight: 500;
      }
      .svs-slots-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .svs-slot-pill {
        background: #ffffff;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 8px;
        padding: 7px 12px;
        font-family: "Geist Mono", monospace;
        font-size: 11.5px;
        font-weight: 500;
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        cursor: pointer;
        transition: all 0.15s;
      }
      .svs-slot-pill:hover {
        border-color: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
        color: #0e5a66;
      }
      .svs-slot-pill.active {
        background: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66) !important;
        border-color: #0e5a66 !important;
        color: #ffffff !important;
        font-weight: 600 !important;
      }

      /* Form inputs */
      .svs-form-group {
        margin-bottom: 14px;
      }
      .svs-form-group label {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 500;
        color: #303d42;
        margin-bottom: 6px;
      }
      .svs-form-input, .svs-form-select, .svs-form-textarea {
        width: 100%;
        background: #ffffff;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 10px;
        padding: 11px 14px;
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        font-family: "Geist", sans-serif;
        font-size: 13px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .svs-form-input:focus, .svs-form-select:focus, .svs-form-textarea:focus {
        border-color: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
        box-shadow: 0 0 0 3px rgba(14, 90, 102, 0.12);
      }

      /* Submit button */
      .svs-submit-btn {
        width: 100%;
        background: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        color: #ffffff !important;
        font-weight: 600;
        font-family: "Geist", sans-serif;
        font-size: 14px;
        padding: 14px 20px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        transition: background 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.1s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 18px;
      }
      .svs-submit-btn span {
        color: inherit;
      }
      #nord-wa-confirm, #nord-wa-confirm *, #nord-wa-main-btn, #nord-wa-main-btn * {
        color: #ffffff !important;
      }
      #nord-add-gcal, #nord-add-gcal * {
        color: #0c1a1d !important;
      }
      .svs-submit-btn:not(#nord-wa-confirm):not(#nord-add-gcal) span, .svs-submit-btn:not(#nord-wa-confirm):not(#nord-add-gcal) {
        color: #ffffff !important;
      }
      .svs-submit-btn span, .svs-submit-btn * {
        color: #ffffff !important;
      }
      .svs-submit-btn:hover {
        background: var(--token-606fcb38-b578-4d5e-978a-fdb07a4101f9, #0e5a66);
        transform: translateY(-1px);
      }

      /* Success Card */
      .svs-success-card {
        background: #ffffff;
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 20px;
        padding: 28px;
        text-align: center;
      }
      .svs-voucher-box {
        background: var(--token-5eaf046f-639c-4d6e-8392-8b43de17a3e0, #f3f5f4);
        border: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
        border-radius: 14px;
        padding: 18px;
        margin: 18px 0;
        text-align: left;
        font-size: 13px;
        line-height: 1.6;
      }
      .svs-voucher-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--token-507be74f-8249-4cf5-a8ad-68025ec0e4d5, #eaeeed);
      }
      .svs-voucher-row:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      .svs-voucher-label {
        color: #303d42;
      }
      .svs-voucher-val {
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        font-weight: 600;
        font-family: "Geist Mono", monospace;
      }

      .svs-tab-btn {
        background: none;
        border: none;
        color: #303d42;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        padding: 8px 14px;
        border-radius: 8px;
        transition: all 0.2s;
      }
      .svs-tab-btn.active {
        color: var(--token-5c696cea-9b0e-49da-8923-0dc909c3e527, #0c1a1d);
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(12, 26, 29, 0.08);
      }
`;
    document.head.appendChild(modalCss);

    // Modal Markup
    var modalHtml = `
      <div id="nord-consultation-modal" class="svs-modal-backdrop">
        <div class="svs-modal-card">
          <button class="svs-modal-close" id="nord-close-consultation">&times;</button>
          
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #eaeeed;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <img src="./assets/svs_logo_navy.png" style="height: 24px; display: block;" alt="St Vincent Smile">
              <span style="font-family: 'Geist Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #0e5a66; background: #dcebeb; padding: 4px 10px; border-radius: 999px; font-weight: 500;">Finnieston, Glasgow G3 8LH</span>
            </div>
            <span style="font-size: 11.5px; color: #1f2d31; display: flex; align-items: center; gap: 6px; font-weight: 500;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: rgb(39, 163, 107); box-shadow: rgba(39, 163, 107, 0.25) 0px 0px 0px 3px; display: inline-block;"></span>
              Live Slots Available
            </span>
          </div>

          <h2 style="font-size: 24px; font-weight: 500; margin-bottom: 6px; letter-spacing: -0.03em; color: #0c1a1d; line-height: 1.25;">Book Appointment & Free 3D iTero Scan</h2>
          <p style="font-size: 13.5px; color: #1f2d31; line-height: 1.5; margin-bottom: 18px;">
            Schedule your free consultation with Dr. Umer (Diamond Apex Invisalign Provider) or our cosmetic & implant dental team in Glasgow.
          </p>

          <div class="svs-mode-tabs">
            <button class="svs-mode-btn active" id="mode-cal-btn">📅 Booking Calendar</button>
            <button class="svs-mode-btn" id="mode-calc-btn">💳 0% Finance Calculator</button>
            <button class="svs-mode-btn" id="mode-wa-btn">💬 WhatsApp Reception</button>
          </div>

          <!-- 1. CALENDAR VIEW -->
          <div id="view-calendar">
            <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #303d42; font-weight: 500; display: block; margin-bottom: 8px;">Select Clinician / Dentist</label>
            <div class="svs-doctor-select-row" id="nord-doc-selector">
              <div class="svs-doc-pill active" data-doctor="Dr. Elena Varga">
                <img src="./assets/LhRdrbEme10eLb0FCf78WEGE_dr_varga.webp" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; object-position: center 20%; flex-shrink: 0;" alt="Dr. Elena Varga" />
                <span class="doc-dot"></span>
                <span>Dr. Elena Varga (Cosmetic Dentistry)</span>
              </div>
              <div class="svs-doc-pill" data-doctor="Dr. Daniel Costa">
                <img src="./assets/i9YV55qg35geFijtWVbcSvyZI_dr_costa.webp" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; object-position: center 20%; flex-shrink: 0;" alt="Dr. Daniel Costa" />
                <span class="doc-dot"></span>
                <span>Dr. Daniel Costa (Orthodontics & Aligners)</span>
              </div>
              <div class="svs-doc-pill" data-doctor="Dr. Sofia Reyes">
                <img src="./assets/TjZGJmXA2itrXL8hlBEh6zV8PA_dr_reyes.webp" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; object-position: center 20%; flex-shrink: 0;" alt="Dr. Sofia Reyes" />
                <span class="doc-dot"></span>
                <span>Dr. Sofia Reyes (Pediatric & Family Care)</span>
              </div>
              <div class="svs-doc-pill" data-doctor="Dr. Ryan Okafor">
                <img src="./assets/guZzPzCD5moyy6x2UlwrIWlV1yI_dr_okafor.webp" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover; object-position: center 20%; flex-shrink: 0;" alt="Dr. Ryan Okafor" />
                <span class="doc-dot"></span>
                <span>Dr. Ryan Okafor (Implants & Guided Surgery)</span>
              </div>
            </div>

            <label style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #303d42; font-weight: 500; display: block; margin-bottom: 8px;">Appointment / Consultation Type</label>
            <div class="svs-track-grid" id="nord-track-selector">
              <div class="svs-track-item active" data-track="Free Invisalign 3D iTero Consultation">
                <div class="svs-track-title">✨ Free Invisalign Scan</div>
                <div class="svs-track-sub">Diamond Apex · 3D iTero</div>
              </div>
              <div class="svs-track-item" data-track="Dental Implants & All-on-4 Assessment">
                <div class="svs-track-title">🦷 Dental Implants</div>
                <div class="svs-track-sub">3D CBCT Guided Exam</div>
              </div>
              <div class="svs-track-item" data-track="Artisan Composite Bonding Assessment">
                <div class="svs-track-title">💎 Composite Bonding</div>
                <div class="svs-track-sub">Same-Day Smile Makeover</div>
              </div>
            </div>

            <div class="svs-cal-box">
              <div class="svs-cal-header">
                <div class="svs-cal-title" id="nord-cal-month-year">November 2026</div>
                <div class="svs-cal-nav">
                  <button class="svs-cal-nav-btn" id="nord-cal-prev">&lsaquo;</button>
                  <button class="svs-cal-nav-btn" id="nord-cal-next">&rsaquo;</button>
                </div>
              </div>
              <div class="svs-cal-weekdays">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div class="svs-cal-days" id="nord-cal-days-grid"></div>

              <div class="svs-slots-wrap">
                <div class="svs-slots-title">Available Glasgow Slots for <span id="nord-selected-date-label">Thu, Nov 12</span></div>
                <div class="svs-slots-grid" id="nord-slots-grid">
                  <div class="svs-slot-pill active" data-slot="09:15 AM">09:15 AM</div>
                  <div class="svs-slot-pill" data-slot="10:30 AM">10:30 AM</div>
                  <div class="svs-slot-pill" data-slot="11:45 AM">11:45 AM</div>
                  <div class="svs-slot-pill" data-slot="14:15 PM">02:15 PM</div>
                  <div class="svs-slot-pill" data-slot="16:00 PM">04:00 PM</div>
                  <div class="svs-slot-pill" data-slot="17:30 PM (Late Evening)">05:30 PM (Late Evening)</div>
                </div>
              </div>
            </div>

            <form id="nord-consultation-form">
              <div class="svs-form-group">
                <label>Primary Treatment</label>
                <select id="nord-procedure-select" class="svs-form-select">
                  <option value="Invisalign® Clear Aligners (Diamond Apex)">Invisalign® Clear Aligners (Diamond Apex)</option>
                  <option value="Dental Implants & All-on-4">Dental Implants & All-on-4</option>
                  <option value="Artisan Composite Bonding">Artisan Composite Bonding</option>
                  <option value="Porcelain Veneers & Smile Makeovers">Porcelain Veneers & Smile Makeovers</option>
                  <option value="Airflow Dental Hygiene & Polish">Airflow Dental Hygiene & Polish</option>
                  <option value="Emergency Dental Pain Relief">Emergency Dental Pain Relief</option>
                </select>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="svs-form-group">
                  <label>Full Name *</label>
                  <input type="text" required class="svs-form-input" id="nord-name" placeholder="e.g. Fiona Campbell">
                </div>
                <div class="svs-form-group">
                  <label>Email Address *</label>
                  <input type="email" required class="svs-form-input" id="nord-email" placeholder="fiona.c@example.co.uk">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div class="svs-form-group">
                  <label>Phone / WhatsApp *</label>
                  <input type="tel" required class="svs-form-input" id="nord-phone" placeholder="07700 900555">
                </div>
                <div class="svs-form-group">
                  <label>Payment / Registration Preference</label>
                  <select class="svs-form-select" id="svs-plan-pref">
                    <option value="0% Chrysalis Finance">0% Chrysalis Finance (Spread over 12-36 mo)</option>
                    <option value="Private Pay-as-you-go">Private Pay-as-you-go</option>
                    <option value="NHS Registration / General Care">NHS Registration / General Care</option>
                  </select>
                </div>
              </div>

              <div class="svs-form-group">
                <label>Dental Notes or Questions</label>
                <textarea class="svs-form-textarea" id="nord-notes" rows="2" placeholder="Tell our team about your smile goals, concerns, or previous dental work..."></textarea>
              </div>

              <button type="submit" class="svs-submit-btn">
                <span>Confirm Appointment & Lock Date</span>
                <span style="font-size: 16px;">&rarr;</span>
              </button>
              <p style="font-size: 11.5px; color: #303d42; text-align: center; margin-top: 10px;">
                🔒 100% Free Consultation · No Obligation · Instant SMS & Email Confirmation
              </p>
            </form>
          </div>

          <!-- 2. FINANCE CALCULATOR VIEW -->
          <div id="view-calculator" style="display: none;">
            <p style="font-size: 13.5px; color: #1f2d31; margin-bottom: 16px; line-height: 1.5;">
              St Vincent Smile partners with Chrysalis Finance to offer 0% APR monthly installments on all cosmetic treatments, Invisalign aligners, and dental implants.
            </p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
              <div style="background: #f3f5f4; border: 1px solid #eaeeed; border-radius: 14px; padding: 18px;">
                <div style="font-size: 11px; color: #303d42; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 4px;">Invisalign® Aligners</div>
                <div style="font-family: 'Geist Variable', sans-serif; font-size: 26px; font-weight: 500; color: #0c1a1d; letter-spacing: -0.03em;">From £69<span style="font-size: 13px; font-weight: 400; color: #303d42;"> / month</span></div>
                <div style="font-size: 11.5px; color: #0e5a66; margin-top: 4px; font-weight: 500;">0% APR · 36 Months</div>
                <div style="font-size: 11px; color: #303d42; margin-top: 2px;">Includes Free 3D iTero & Whitening</div>
              </div>
              <div style="background: #f3f5f4; border: 1px solid #eaeeed; border-radius: 14px; padding: 18px;">
                <div style="font-size: 11px; color: #303d42; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 4px;">Composite Bonding</div>
                <div style="font-family: 'Geist Variable', sans-serif; font-size: 26px; font-weight: 500; color: #0c1a1d; letter-spacing: -0.03em;">From £54<span style="font-size: 13px; font-weight: 400; color: #303d42;"> / month</span></div>
                <div style="font-size: 11.5px; color: #0e5a66; margin-top: 4px; font-weight: 500;">0% APR · 24 Months</div>
                <div style="font-size: 11px; color: #303d42; margin-top: 2px;">Same-Day Direct Resin Finish</div>
              </div>
            </div>

            <div style="background: #f3f5f4; border: 1px solid #eaeeed; border-radius: 16px; padding: 22px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                <span style="font-size: 13px; font-weight: 500; color: #0c1a1d;">Interactive Finance Estimator</span>
                <span style="font-size: 11.5px; color: #303d42;">Chrysalis Authorised Provider</span>
              </div>
              
              <div class="svs-form-group">
                <label>Estimated Treatment Cost</label>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <input type="range" id="calc-range-cost" min="1000" max="6000" step="250" value="2800" style="flex: 1; accent-color: #0e5a66; cursor: pointer;">
                  <span id="calc-cost-display" style="font-family: 'Geist Mono', monospace; font-size: 16px; font-weight: 600; color: #0c1a1d; min-width: 75px; text-align: right;">£2,800</span>
                </div>
              </div>

              <div class="svs-form-group">
                <label>Repayment Term</label>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="svs-slot-pill active" id="term-12" style="flex: 1; text-align: center; padding: 9px 0;">12 Months (0%)</button>
                  <button type="button" class="svs-slot-pill" id="term-24" style="flex: 1; text-align: center; padding: 9px 0;">24 Months (0%)</button>
                  <button type="button" class="svs-slot-pill" id="term-36" style="flex: 1; text-align: center; padding: 9px 0;">36 Months (0%)</button>
                </div>
              </div>

              <div style="background: #ffffff; border: 1px solid #eaeeed; border-radius: 12px; padding: 18px; text-align: center; margin-top: 16px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #303d42; margin-bottom: 4px; font-weight: 500;">Estimated Monthly Payment</div>
                <div id="calc-monthly-display" style="font-family: 'Geist Variable', sans-serif; font-size: 38px; font-weight: 500; color: #0c1a1d; letter-spacing: -0.04em;">£233.33</div>
                <div style="font-size: 11.5px; color: #303d42; margin-top: 4px;">Total Payable: <strong id="calc-total-display" style="color: #0c1a1d; font-family: 'Geist Mono', monospace;">£2,800.00</strong> · Interest: <strong style="color: #0e5a66;">£0.00 (0% APR)</strong></div>
              </div>
            </div>

            <button class="svs-submit-btn" id="calc-back-to-booking">
              <span>Return to Appointment Calendar</span>
              <span>&rarr;</span>
            </button>
          </div>

          <!-- 3. WHATSAPP RECEPTION VIEW -->
          <div id="view-whatsapp" style="display: none; text-align: center; padding: 16px 0;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #dcebeb; border: 1px solid #b9c4c6; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 28px;">
              💬
            </div>
            <h3 style="font-size: 20px; font-weight: 500; margin-bottom: 8px; color: #0c1a1d; letter-spacing: -0.02em;">Direct St Vincent Smile Reception</h3>
            <p style="font-size: 13.5px; color: #1f2d31; max-width: 440px; margin: 0 auto 20px; line-height: 1.5;">
              Chat directly with our Finnieston dental reception team for appointments, emergency slots, or quick questions. Average response within 10 minutes during clinic opening hours.
            </p>
            <div style="background: #f3f5f4; border: 1px solid #eaeeed; border-radius: 14px; padding: 18px; max-width: 380px; margin: 0 auto 24px; text-align: left; font-size: 13px;">
              <div style="color: #303d42; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; margin-bottom: 4px;">Direct WhatsApp Reception:</div>
              <div style="font-family: 'Geist Mono', monospace; font-size: 15px; font-weight: 600; color: #0c1a1d;">+44 7761 066850</div>
              <div style="color: #303d42; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; margin-top: 12px; margin-bottom: 4px;">Clinic Telephone:</div>
              <div style="font-family: 'Geist Mono', monospace; font-size: 15px; font-weight: 600; color: #0c1a1d;">0141 248 1183</div>
              <div style="color: #303d42; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; margin-top: 12px; margin-bottom: 4px;">Practice Address:</div>
              <div style="font-size: 13px; color: #0c1a1d;">23c St Vincent Crescent, Glasgow G3 8LH</div>
            </div>
            <a href="https://wa.me/447761066850" target="_blank" rel="noopener noreferrer" class="svs-submit-btn" id="nord-wa-main-btn" style="text-decoration: none; max-width: 380px; margin: 0 auto; background: #075E54 !important; color: #ffffff !important; font-weight: 600;">
              <span>Open WhatsApp Chat Now</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- SUCCESS VOUCHER VIEW -->
          <div id="nord-consultation-success" style="display: none;">
            <div class="svs-success-card">
              <div style="width: 52px; height: 52px; border-radius: 50%; background: #dcebeb; border: 1px solid #b9c4c6; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; font-size: 24px; color: #0e5a66; font-weight: bold;">
                ✓
              </div>
              <h3 style="font-size: 22px; font-weight: 500; margin-bottom: 4px; color: #0c1a1d; letter-spacing: -0.02em;">Appointment Confirmed</h3>
              <p style="font-size: 13.5px; color: #1f2d31; margin-bottom: 18px;">
                Your appointment at St Vincent Smile has been booked. A confirmation has been prepared for your records.
              </p>

              <div class="svs-voucher-box">
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Patient Name:</span>
                  <span class="svs-voucher-val" id="voucher-name">Fiona Campbell</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Treatment:</span>
                  <span class="svs-voucher-val" id="voucher-procedure">Invisalign® Clear Aligners</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Clinician:</span>
                  <span class="svs-voucher-val" id="voucher-doctor">Dr. Umer (Diamond Apex)</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Date & Time Slot:</span>
                  <span class="svs-voucher-val" id="voucher-slot">Thu, Nov 12 · 10:30 AM</span>
                </div>
                <div class="svs-voucher-row">
                  <span class="svs-voucher-label">Location:</span>
                  <span class="svs-voucher-val">23c St Vincent Crescent, Finnieston, Glasgow G3 8LH</span>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">
                <a id="nord-add-gcal" href="#" target="_blank" rel="noopener noreferrer" class="svs-submit-btn" style="margin-top: 0; font-size: 12px; font-weight: 600; text-decoration: none; background: #f3f5f4; color: #0c1a1d !important; border: 1px solid #eaeeed;">
                  📅 Add to Google Cal
                </a>
                <a id="nord-wa-confirm" href="https://wa.me/447761066850" target="_blank" rel="noopener noreferrer" class="svs-submit-btn" style="margin-top: 0; font-size: 12px; font-weight: 600; text-decoration: none; background: #075E54; color: #ffffff !important; font-weight: 600;">
                  💬 WhatsApp Reception
                </a>
              </div>

              <button class="svs-submit-btn" id="nord-success-done" style="margin-top: 14px; background: #0c1a1d; color: #ffffff !important;">
                Done
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Legal & Privacy Modal -->
      <div id="nord-legal-modal" class="svs-modal-backdrop">
        <div class="svs-modal-card">
          <button class="svs-modal-close" id="nord-close-legal">&times;</button>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <img src="./assets/svs_logo_navy.png" style="height: 24px; display: block;" alt="St Vincent Smile">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-family: 'Geist Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #0e5a66; background: #dcebeb; padding: 4px 10px; border-radius: 999px; font-weight: 500;">Scottish Healthcare & Clinical Governance</span>
          </div>
          
          <div class="svs-mode-tabs">
            <button class="svs-tab-btn active" data-tab="privacy">Privacy & UK GDPR</button>
            <button class="svs-tab-btn" data-tab="terms">Patient Charter</button>
            <button class="svs-tab-btn" data-tab="accessibility">Accessibility</button>
          </div>

          <div id="legal-content-privacy" class="svs-legal-tab-pane">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">UK Data Protection Act 2018 & Medical Privacy</h3>
            <p style="font-size: 13px; color: #1f2d31; line-height: 1.6; margin-bottom: 14px;">
              Saint Vincent Smile Centre Limited trading as St Vincent Smile (23c St Vincent Crescent, Finnieston, Glasgow G3 8LH) complies strictly with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018. All patient records, digital 3D iTero impressions, and CBCT radiographs are encrypted and stored in certified UK clinical systems.
            </p>
          </div>

          <div id="legal-content-terms" class="svs-legal-tab-pane" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">General Dental Council (GDC) & HIS Regulation</h3>
            <p style="font-size: 13px; color: #1f2d31; line-height: 1.6; margin-bottom: 14px;">
              All dental surgeons, therapists, and hygienists practicing at St Vincent Smile are fully registered with the General Dental Council (GDC). Our clinic operates under the clinical standards of Healthcare Improvement Scotland (HIS).
            </p>
            <p style="font-size: 13px; color: #1f2d31; line-height: 1.6; margin-bottom: 14px;">
              Finance Disclosure: Saint Vincent Smile Centre Limited is an Appointed Representative of Chrysalis Finance Limited, which is authorised and regulated by the Financial Conduct Authority (FCA).
            </p>
          </div>

          <div id="legal-content-accessibility" class="svs-legal-tab-pane" style="display: none;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Web Accessibility Standards (WCAG 2.1 AA)</h3>
            <p style="font-size: 13px; color: #1f2d31; line-height: 1.6; margin-bottom: 14px;">
              This digital clinic experience conforms with Level AA of the W3C Web Content Accessibility Guidelines 2.1. Designed with high color contrast, screen reader compatibility, and full keyboard navigation.
            </p>
          </div>
        </div>
      </div>
    `;

    var modalContainer = document.createElement('div');
    modalContainer.id = 'svs-modals-root';
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    var consultModal = document.getElementById('nord-consultation-modal');
    var legalModal = document.getElementById('nord-legal-modal');

    var calState = {
      doctor: 'Dr. Umer',
      track: 'Free Invisalign 3D iTero Consultation',
      procedure: 'Invisalign® Clear Aligners (Diamond Apex)',
      year: 2026,
      month: 10,
      selectedDay: 12,
      selectedSlot: '10:30 AM',
      name: '',
      email: '',
      phone: ''
    };

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function renderCalendar() {
      var monthYearLabel = document.getElementById('nord-cal-month-year');
      if (monthYearLabel) {
        monthYearLabel.textContent = monthNames[calState.month] + ' ' + calState.year;
      }

      var grid = document.getElementById('nord-cal-days-grid');
      if (!grid) return;
      grid.innerHTML = '';

      var firstDayIndex = new Date(calState.year, calState.month, 1).getDay();
      firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

      var totalDays = new Date(calState.year, calState.month + 1, 0).getDate();

      for (var i = 0; i < firstDayIndex; i++) {
        var blank = document.createElement('div');
        blank.className = 'svs-day-cell disabled';
        grid.appendChild(blank);
      }

      for (var day = 1; day <= totalDays; day++) {
        var cell = document.createElement('div');
        cell.className = 'svs-day-cell';
        cell.textContent = day;

        var cellDate = new Date(calState.year, calState.month, day);
        var dayOfWeek = cellDate.getDay();
        if (dayOfWeek !== 0) { // Monday to Saturday
          cell.classList.add('has-slots');
        } else {
          cell.classList.add('disabled');
        }

        if (day === calState.selectedDay) {
          cell.classList.add('active');
        }

        (function(d) {
          cell.addEventListener('click', function() {
            calState.selectedDay = d;
            renderCalendar();
            updateSelectedDateLabel();
          });
        })(day);

        grid.appendChild(cell);
      }

      updateSelectedDateLabel();
    }

    function updateSelectedDateLabel() {
      var lbl = document.getElementById('nord-selected-date-label');
      if (lbl) {
        var d = new Date(calState.year, calState.month, calState.selectedDay);
        var weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        lbl.textContent = weekdayNames[d.getDay()] + ', ' + monthNames[calState.month].slice(0,3) + ' ' + calState.selectedDay;
      }
    }

    document.getElementById('nord-cal-prev').addEventListener('click', function(e) {
      e.preventDefault();
      calState.month--;
      if (calState.month < 0) {
        calState.month = 11;
        calState.year--;
      }
      calState.selectedDay = 10;
      renderCalendar();
    });

    document.getElementById('nord-cal-next').addEventListener('click', function(e) {
      e.preventDefault();
      calState.month++;
      if (calState.month > 11) {
        calState.month = 0;
        calState.year++;
      }
      calState.selectedDay = 10;
      renderCalendar();
    });

    document.querySelectorAll('.svs-slot-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.svs-slot-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        calState.selectedSlot = pill.getAttribute('data-slot');
      });
    });

    document.querySelectorAll('.svs-doc-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        document.querySelectorAll('.svs-doc-pill').forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        calState.doctor = pill.getAttribute('data-doctor');
      });
    });

    document.querySelectorAll('.svs-track-item').forEach(function(item) {
      item.addEventListener('click', function() {
        document.querySelectorAll('.svs-track-item').forEach(function(it) { it.classList.remove('active'); });
        item.classList.add('active');
        calState.track = item.getAttribute('data-track');
      });
    });

    var vCal = document.getElementById('view-calendar');
    var vCalc = document.getElementById('view-calculator');
    var vWa = document.getElementById('view-whatsapp');
    var mCalBtn = document.getElementById('mode-cal-btn');
    var mCalcBtn = document.getElementById('mode-calc-btn');
    var mWaBtn = document.getElementById('mode-wa-btn');

    function switchMode(mode) {
      mCalBtn.classList.remove('active');
      mCalcBtn.classList.remove('active');
      mWaBtn.classList.remove('active');
      vCal.style.display = 'none';
      vCalc.style.display = 'none';
      vWa.style.display = 'none';

      if (mode === 'calculator') {
        mCalcBtn.classList.add('active');
        vCalc.style.display = 'block';
      } else if (mode === 'whatsapp') {
        mWaBtn.classList.add('active');
        vWa.style.display = 'block';
      } else {
        mCalBtn.classList.add('active');
        vCal.style.display = 'block';
      }
    }

    mCalBtn.addEventListener('click', function() { switchMode('calendar'); });
    mCalcBtn.addEventListener('click', function() { switchMode('calculator'); });
    mWaBtn.addEventListener('click', function() { switchMode('whatsapp'); });
    document.getElementById('calc-back-to-booking').addEventListener('click', function() { switchMode('calendar'); });

    function openConsultation(preset) {
      consultModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      var modeTabs = document.querySelector('.svs-mode-tabs');
      if (modeTabs) modeTabs.style.display = 'flex';
      switchMode('calendar');
      renderCalendar();

      document.getElementById('view-calendar').style.display = 'block';
      document.getElementById('nord-consultation-form').style.display = 'block';
      document.getElementById('nord-consultation-success').style.display = 'none';

      if (preset && preset.procedure) {
        var procSelect = document.getElementById('nord-procedure-select');
        for (var i = 0; i < procSelect.options.length; i++) {
          if (procSelect.options[i].value.toLowerCase().includes(preset.procedure.toLowerCase())) {
            procSelect.selectedIndex = i;
            calState.procedure = procSelect.options[i].value;
            break;
          }
        }
      }
      if (preset && preset.doctor) {
        document.querySelectorAll('.svs-doc-pill').forEach(function(pill) {
          if (pill.getAttribute('data-doctor').toLowerCase().includes(preset.doctor.toLowerCase())) {
            pill.click();
          }
        });
      }
    }
    window.openNordCalendar = openConsultation;

    function closeConsultation() {
      consultModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    document.getElementById('nord-close-consultation').addEventListener('click', closeConsultation);

    document.getElementById('nord-consultation-form').addEventListener('submit', function(e) {
      e.preventDefault();
      calState.name = document.getElementById('nord-name').value || 'Fiona Campbell';
      calState.email = document.getElementById('nord-email').value || 'fiona.c@example.co.uk';
      calState.phone = document.getElementById('nord-phone').value || '07700 900555';
      calState.procedure = document.getElementById('nord-procedure-select').value;

      var d = new Date(calState.year, calState.month, calState.selectedDay);
      var weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var fullDateStr = weekdayNames[d.getDay()] + ', ' + monthNames[calState.month] + ' ' + calState.selectedDay + ', ' + calState.year;

      document.getElementById('voucher-name').textContent = calState.name;
      document.getElementById('voucher-procedure').textContent = calState.procedure;
      document.getElementById('voucher-doctor').textContent = calState.doctor;
      document.getElementById('voucher-slot').textContent = fullDateStr + ' · ' + calState.selectedSlot;

      var gcalTitle = encodeURIComponent('St Vincent Smile Appointment: ' + calState.procedure + ' with ' + calState.doctor);
      var gcalDetails = encodeURIComponent('Appointment at St Vincent Smile Glasgow.\nPatient: ' + calState.name + '\nTreatment: ' + calState.procedure + '\nFormat: ' + calState.track + '\nContact: 0141 248 1183');
      var gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + gcalTitle + '&details=' + gcalDetails + '&location=' + encodeURIComponent('St Vincent Smile, 23c St Vincent Crescent, Finnieston, Glasgow G3 8LH');
      document.getElementById('nord-add-gcal').setAttribute('href', gcalUrl);

      var waMsg = encodeURIComponent('Hello St Vincent Smile Reception, I have booked a ' + calState.track + ' on ' + fullDateStr + ' at ' + calState.selectedSlot + ' with ' + calState.doctor + ' for ' + calState.procedure + '. Patient Name: ' + calState.name + '.');
      document.getElementById('nord-wa-confirm').setAttribute('href', 'https://wa.me/447761066850?text=' + waMsg);

      document.getElementById('view-calendar').style.display = 'none';
      var modeTabs = document.querySelector('.svs-mode-tabs');
      if (modeTabs) modeTabs.style.display = 'none';
      document.getElementById('nord-consultation-success').style.display = 'block';
    });

    document.getElementById('nord-success-done').addEventListener('click', closeConsultation);

    function openLegal(tabName) {
      legalModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      switchLegalTab(tabName || 'privacy');
    }

    function closeLegal() {
      legalModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function switchLegalTab(tab) {
      document.querySelectorAll('.svs-tab-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
      });
      document.querySelectorAll('.svs-legal-tab-pane').forEach(function(pane) {
        pane.style.display = pane.id === ('legal-content-' + tab) ? 'block' : 'none';
      });
    }

    document.getElementById('nord-close-legal').addEventListener('click', closeLegal);
    document.querySelectorAll('.svs-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        switchLegalTab(btn.getAttribute('data-tab'));
      });
    });

    document.addEventListener('click', function(e) {
      var btn = e.target.closest('a, button');
      if (!btn) return;
      if (btn.closest('#nord-consultation-modal') || btn.closest('#nord-legal-modal')) return;
      var text = btn.innerText.trim();
      var href = btn.getAttribute('href') || '';

      if (text.includes('Consultation') || text.includes('Request time') || text.includes('Book') || text.includes('Appointment') || text.includes('Live availability') || (href === '#contact' && !btn.closest('nav'))) {
        e.preventDefault();
        openConsultation();
        return;
      }

      if (href.includes('privacy') || text === 'Privacy') {
        e.preventDefault();
        openLegal('privacy');
        return;
      }
      if (href.includes('terms') || text === 'Terms') {
        e.preventDefault();
        openLegal('terms');
        return;
      }
      if (href.includes('accessibility') || text === 'Accessibility') {
        e.preventDefault();
        openLegal('accessibility');
        return;
      }
    });

    consultModal.addEventListener('click', function(e) {
      if (e.target === consultModal) closeConsultation();
    });
    legalModal.addEventListener('click', function(e) {
      if (e.target === legalModal) closeLegal();
    });

    var newsForm = document.querySelector('form[data-framer-name*="Newsletter"], form');
    if (newsForm) {
      newsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var subBtn = newsForm.querySelector('button[type="submit"], button');
        var input = newsForm.querySelector('input[type="email"]');
        if (subBtn) {
          subBtn.textContent = '✓ Subscribed';
          subBtn.style.background = '#10b981';
          subBtn.style.color = '#ffffff';
          if (input) input.value = '';
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeConsultation();
        closeLegal();
      }
    });

    // 12. Dynamic Hero Transparent Navbar (1:1 Original Aveline Studio Mechanics)
    (function initHeroNavbar() {
      var navContainer = document.querySelector('.framer-xz9jp0-container');
      var solidWrapper = document.querySelector('.framer-Fv60p');
      var bar = document.querySelector('.framer-1mwbh4g');
      var heroCard = document.querySelector('.framer-1jm03qa') || document.querySelector('[data-framer-name="Hero"]');
      var logoImg = document.querySelector('.framer-1hknmid img');
      var whiteLogoSrc = './assets/YRTy2NxOkfcVHGa80qEHJySIPaY_4eedcb44.svg';
      var darkLogoSrc = './assets/nCxPVkNYSQdYDt5mXEqXIlRVyKA_f3dd68ce.svg';

      function updateNavState() {
        var barHeight = bar ? bar.offsetHeight : 72;
        var inHero = false;

        if (heroCard) {
          var rect = heroCard.getBoundingClientRect();
          // Navbar is transparent while inside the hero card
          inHero = rect.bottom > barHeight;
        } else {
          inHero = window.scrollY < 650;
        }

        if (inHero) {
          document.body.classList.add('nav-in-hero');
          if (navContainer) navContainer.classList.add('nav-in-hero');
          if (bar) bar.classList.add('nav-in-hero');
          if (solidWrapper) solidWrapper.setAttribute('data-framer-name', 'Over');
          if (logoImg && logoImg.getAttribute('src') !== whiteLogoSrc) {
            logoImg.setAttribute('src', whiteLogoSrc);
          }
        } else {
          document.body.classList.remove('nav-in-hero');
          if (navContainer) navContainer.classList.remove('nav-in-hero');
          if (bar) bar.classList.remove('nav-in-hero');
          if (solidWrapper) solidWrapper.setAttribute('data-framer-name', 'Solid');
          if (logoImg && logoImg.getAttribute('src') !== darkLogoSrc) {
            logoImg.setAttribute('src', darkLogoSrc);
          }
        }
      }

      // Initial execution
      updateNavState();

      // Scroll and resize events with passive listeners
      window.addEventListener('scroll', updateNavState, { passive: true });
      window.addEventListener('resize', updateNavState, { passive: true });
      document.addEventListener('scroll', updateNavState, { passive: true });

      // Re-check after images/layout finish loading
      window.addEventListener('load', updateNavState);
    })();
  }
})();
