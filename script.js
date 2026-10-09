/**
 * Green Love - UI/UX Pro Max Luxury Editorial Wedding Invitation
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  loadSavedConfig();
  initAudioPlayer();
  initCountdown();
  initGuestPersonalization();
  initWishesSection();
  initGiftModal();
  initPhotoLightbox();
  initScrollAnimations();
  init3DPhotoTilt();
  initAmbientAtmosphere();
  initHeroDoves();
  initCinematicAutoScroll();
});

/* ==========================================================================
   0. Dynamic Config Sync from Admin Panel (localStorage)
   ========================================================================== */
function loadSavedConfig() {
  try {
    const raw = localStorage.getItem('wedding_site_config');
    if (!raw) return;
    const cfg = JSON.parse(raw);

    // Couple Names
    if (cfg.groomName) {
      document.querySelectorAll('.groom-name-line').forEach(el => el.textContent = cfg.groomName.toUpperCase());
    }
    if (cfg.groomNickname) {
      document.querySelectorAll('.groom-nickname-text').forEach(el => el.textContent = cfg.groomNickname);
    }
    if (cfg.groomRole) {
      document.querySelectorAll('.groom-role-text').forEach(el => el.textContent = `(${cfg.groomRole})`);
    }

    if (cfg.brideName) {
      document.querySelectorAll('.bride-name-line').forEach(el => el.textContent = cfg.brideName.toUpperCase());
    }
    if (cfg.brideNickname) {
      document.querySelectorAll('.bride-nickname-text').forEach(el => el.textContent = cfg.brideNickname);
    }
    if (cfg.brideRole) {
      document.querySelectorAll('.bride-role-text').forEach(el => el.textContent = `(${cfg.brideRole})`);
    }

    // Parents & Addresses
    if (cfg.groomDad) document.querySelectorAll('.groom-dad-text').forEach(el => el.textContent = `ÔNG. ${cfg.groomDad.toUpperCase()}`);
    if (cfg.groomMom) document.querySelectorAll('.groom-mom-text').forEach(el => el.textContent = `BÀ. ${cfg.groomMom.toUpperCase()}`);
    if (cfg.groomAddress) document.querySelectorAll('.groom-address-text').forEach(el => el.innerHTML = cfg.groomAddress.replace(/\n/g, '<br>'));

    if (cfg.brideDad) document.querySelectorAll('.bride-dad-text').forEach(el => el.textContent = `ÔNG. ${cfg.brideDad.toUpperCase()}`);
    if (cfg.brideMom) document.querySelectorAll('.bride-mom-text').forEach(el => el.textContent = `BÀ. ${cfg.brideMom.toUpperCase()}`);
    if (cfg.brideAddress) document.querySelectorAll('.bride-address-text').forEach(el => el.innerHTML = cfg.brideAddress.replace(/\n/g, '<br>'));

    // Schedule / Events
    if (cfg.event1Title) document.querySelectorAll('.event1-title-text').forEach(el => el.textContent = cfg.event1Title);
    if (cfg.event1Time) document.querySelectorAll('.event1-time-val').forEach(el => el.textContent = cfg.event1Time);
    if (cfg.event1DayVal) document.querySelectorAll('.event1-day-val').forEach(el => el.textContent = cfg.event1DayVal);
    if (cfg.event1Venue) document.querySelectorAll('.event1-venue-name').forEach(el => el.textContent = cfg.event1Venue);
    if (cfg.event1Address) document.querySelectorAll('.event1-venue-address').forEach(el => el.textContent = cfg.event1Address);
    if (cfg.event1MapLink) document.querySelectorAll('.event1-map-link').forEach(el => el.href = cfg.event1MapLink);

    if (cfg.event2Title) document.querySelectorAll('.event2-title-text').forEach(el => el.textContent = cfg.event2Title);
    if (cfg.event2Time) document.querySelectorAll('.event2-time-val').forEach(el => el.textContent = cfg.event2Time);
    if (cfg.event2DayVal) document.querySelectorAll('.event2-day-val').forEach(el => el.textContent = cfg.event2DayVal);
    if (cfg.event2Venue) document.querySelectorAll('.event2-venue-name').forEach(el => el.textContent = cfg.event2Venue);
    if (cfg.event2Address) document.querySelectorAll('.event2-venue-address').forEach(el => el.textContent = cfg.event2Address);
    if (cfg.event2MapLink) document.querySelectorAll('.event2-map-link').forEach(el => el.href = cfg.event2MapLink);

    // Dates
    if (cfg.solarDate) document.querySelectorAll('.solar-date-text').forEach(el => el.textContent = cfg.solarDate);
    if (cfg.solarDayNumber) document.querySelectorAll('.date-badge-large').forEach(el => el.textContent = cfg.solarDayNumber);
    if (cfg.lunarDate) document.querySelectorAll('.schedule-lunar-date, .lunar-date-text').forEach(el => el.textContent = cfg.lunarDate);

    // Bank Details
    if (cfg.groomBank) document.querySelectorAll('.groom-bank-text').forEach(el => el.textContent = cfg.groomBank);
    if (cfg.groomAccount) document.querySelectorAll('.groom-acc-text').forEach(el => el.textContent = cfg.groomAccount);
    if (cfg.groomAccountHolder) document.querySelectorAll('.groom-holder-text').forEach(el => el.textContent = cfg.groomAccountHolder);

    if (cfg.brideBank) document.querySelectorAll('.bride-bank-text').forEach(el => el.textContent = cfg.brideBank);
    if (cfg.brideAccount) document.querySelectorAll('.bride-acc-text').forEach(el => el.textContent = cfg.brideAccount);
    if (cfg.brideAccountHolder) document.querySelectorAll('.bride-holder-text').forEach(el => el.textContent = cfg.brideAccountHolder);

    // Quotes
    if (cfg.quote) document.querySelectorAll('.wedding-quote p').forEach(el => el.textContent = cfg.quote);
    if (cfg.thankYouMessage) document.querySelectorAll('.thankyou-desc').forEach(el => el.textContent = cfg.thankYouMessage);

    // Visual Effects Configuration (Always default to TRUE so effects never get lost)
    const fx = cfg.fx || {};
    window._weddingFxConfig = {
      petals: fx.petals !== false,
      bokeh: fx.bokeh !== false,
      sparkles: fx.sparkles !== false,
      doves: fx.doves !== false,
      confetti: fx.confetti !== false
    };

    if (window._weddingFxConfig.sparkles === false) {
      document.querySelectorAll('.sparkle-twinkle').forEach(el => el.style.display = 'none');
    } else {
      document.querySelectorAll('.sparkle-twinkle').forEach(el => el.style.display = '');
    }
    if (window._weddingFxConfig.doves === false) {
      const dovesEl = document.getElementById('hero-doves-overlay');
      if (dovesEl) dovesEl.style.display = 'none';
    } else {
      const dovesEl = document.getElementById('hero-doves-overlay');
      if (dovesEl && dovesEl.style.display === 'none') dovesEl.style.display = '';
    }
  } catch (err) {
    console.warn('Wedding config loader warning:', err);
  }
}

/* ==========================================================================
   1. Background Music & Audio Controller
   ========================================================================== */
function initAudioPlayer() {
  const audio = document.getElementById('bgm-audio');
  const musicBtn = document.getElementById('floating-music-btn');
  const promptPill = document.getElementById('audio-prompt-pill');
  if (!audio || !musicBtn) return;

  let isPlaying = false;
  let audioCtx = null;

  // Web Audio Context unlocker (crucial for iOS Safari & Android Chrome)
  function unlockAudioContext() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) {}
  }

  function playMusic() {
    unlockAudioContext();
    audio.volume = 1.0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('paused');
        if (promptPill) {
          promptPill.classList.add('hidden');
        }
        removeGestureFallbacks();
      }).catch((err) => {
        // Autoplay policy: unmuted playback requires first user gesture
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('paused');
        if (promptPill) {
          promptPill.classList.remove('hidden');
        }
      });
    }
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.classList.add('paused');
  }

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseMusic();
      showToast('Đã tạm dừng nhạc ♫');
    } else {
      playMusic();
      showToast('Đang phát: Em Đồng Ý (I Do) ♫');
    }
  });

  if (promptPill) {
    promptPill.addEventListener('click', (e) => {
      e.stopPropagation();
      playMusic();
      showToast('Đang phát: Em Đồng Ý (I Do) ♫');
    });
  }

  // 1. Immediate Autoplay Attempt (fires on initial link click)
  try { audio.load(); } catch (e) {}
  playMusic();
  window.addEventListener('load', () => { if (!isPlaying) playMusic(); }, { once: true });
  document.addEventListener('DOMContentLoaded', () => { if (!isPlaying) playMusic(); }, { once: true });
  window.addEventListener('pageshow', () => { if (!isPlaying) playMusic(); });
  window.addEventListener('focus', () => { if (!isPlaying) playMusic(); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !isPlaying) playMusic();
  });

  // 2. Gesture Fallback: ANY touch, tap, scroll or key anywhere on screen triggers music
  const gestureEvents = [
    'pointerdown', 'pointerup',
    'touchstart', 'touchend',
    'click', 'mousedown', 'mouseup',
    'keydown', 'wheel'
  ];

  function handleFirstGesture() {
    if (!isPlaying) {
      playMusic();
    }
  }

  function removeGestureFallbacks() {
    gestureEvents.forEach(evt => {
      window.removeEventListener(evt, handleFirstGesture, true);
      document.removeEventListener(evt, handleFirstGesture, true);
    });
  }

  gestureEvents.forEach(evt => {
    window.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
    document.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
  });
}

/* ==========================================================================
   2. Live Countdown Timer
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');
  if (!daysEl) return;

  // Wedding Ceremony: 25 Oct 2026 09:00:00 (or custom from admin)
  const targetDate = window._customCountdownTarget || new Date('2026-10-25T09:00:00+07:00').getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. Guest Personalization Engine (Supports slug + accented name & guest map)
   ========================================================================== */
let currentGuest = {
  name: '',
  side: 'Hai bên',
  hasCustomName: false
};

function initGuestPersonalization() {
  const urlParams = new URLSearchParams(window.location.search);

  // 0. Clean path-based slug (e.g. /Em-Tu-Ton or /Ban-Hien without ?to=)
  let pathSlug = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (pathSlug && !pathSlug.includes('.') && pathSlug.toLowerCase() !== 'admin' && pathSlug.toLowerCase() !== 'index') {
    try {
      pathSlug = decodeURIComponent(pathSlug);
    } catch (e) {}
  } else {
    pathSlug = '';
  }
  
  // 1. Explicit Vietnamese accented name parameter (e.g. ?name=Bạn+Hiển or ?ten=Bạn+Hiển)
  let guestName = urlParams.get('name') || urlParams.get('ten') || '';
  let guestSide = urlParams.get('side') || urlParams.get('nha') || '';

  // 2. Slug parameter (e.g. ?to=banhien_nhatrai)
  const toParam = pathSlug || urlParams.get('to') || urlParams.get('guest') || urlParams.get('khach') || '';

  // 3. Resolve slug from admin guest map dictionary if available
  if (toParam) {
    try {
      const guestMap = JSON.parse(localStorage.getItem('wedding_guest_map') || '{}');
      const found = guestMap[toParam] || guestMap[toParam.toLowerCase()];
      if (found) {
        if (!guestName) guestName = found.name;
        if (!guestSide) guestSide = found.side;
      }
    } catch (e) {}

    // Fallback: If still no guestName, decode toParam and Title-case
    if (!guestName) {
      const rawSlug = toParam.replace(/_nhatrai|_nhagai|-nhatrai|-nhagai/gi, '').replace(/[-_]+/g, ' ').trim();
      guestName = rawSlug.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    // Auto-detect side from slug format like banhien_nhatrai / banhien_nhagai
    if (!guestSide) {
      if (toParam.includes('_nhatrai') || toParam.includes('-nhatrai')) {
        guestSide = 'trai';
      } else if (toParam.includes('_nhagai') || toParam.includes('-nhagai')) {
        guestSide = 'gai';
      }
    }
  }

  // Graceful cleanup: If guestName still contains slug suffixes (e.g. opened ?to=banhien_nhatrai without &name=)
  if (guestName && (guestName.includes('_nhatrai') || guestName.includes('_nhagai') || guestName.includes('-nhatrai') || guestName.includes('-nhagai'))) {
    guestName = guestName.replace(/_nhatrai|_nhagai|-nhatrai|-nhagai/g, '').replace(/_/g, ' ');
  }

  const cleanName = guestName.trim();
  const cleanSide = guestSide.trim().toLowerCase();

  const heroName = document.getElementById('hero-guest-name');
  const greetingName = document.getElementById('guest-name-display');
  const greetingSide = document.getElementById('guest-side-display');
  const nameInputGroup = document.getElementById('guest-name-input-group');

  if (cleanName) {
    currentGuest.name = cleanName;
    currentGuest.hasCustomName = true;

    // Show hero personalized name with full accents
    if (heroName) {
      heroName.textContent = cleanName;
    }

    // Update Section 7 badge
    if (greetingName) {
      greetingName.textContent = cleanName;
    }

    // Hide manual input group since we already know the guest's name
    if (nameInputGroup) {
      nameInputGroup.style.display = 'none';
    }
  } else {
    currentGuest.name = '';
    currentGuest.hasCustomName = false;

    if (heroName) {
      heroName.textContent = 'Quý Khách & Gia đình';
    }

    if (greetingName) {
      greetingName.textContent = 'Quý Khách & Gia đình';
    }
    // Show input group for generic links
    if (nameInputGroup) {
      nameInputGroup.style.display = 'block';
    }
  }

  // Handle side of family
  if (greetingSide) {
    if (cleanSide === 'trai' || cleanSide === 'groom' || cleanSide === 'nhatrai') {
      currentGuest.side = 'Nhà trai';
      greetingSide.textContent = 'Khách quý của Nhà Trai';
    } else if (cleanSide === 'gai' || cleanSide === 'bride' || cleanSide === 'nhagai') {
      currentGuest.side = 'Nhà gái';
      greetingSide.textContent = 'Khách quý của Nhà Gái';
    } else {
      currentGuest.side = 'Hai bên';
      greetingSide.textContent = 'Khách quý của Hai Bên Gia Đình';
    }
  }
}

/* ==========================================================================
   4. Gift / Bank QR Modal
   ========================================================================== */
function initGiftModal() {
  const modal = document.getElementById('modal-gift');
  const openBtn = document.getElementById('btn-open-gift');
  const closeBtn = document.getElementById('btn-close-gift');
  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      if (window.setWeddingModalActive) window.setWeddingModalActive(true);
      launchConfetti();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.setWeddingModalActive) window.setWeddingModalActive(false);
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      if (window.setWeddingModalActive) window.setWeddingModalActive(false);
    }
  });

  // Tab switching
  const tabs = modal.querySelectorAll('.tab-option');
  const panes = modal.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      modal.querySelector(`#${target}`)?.classList.add('active');
    });
  });

  // Copy buttons
  const copyBtns = modal.querySelectorAll('.btn-copy-account');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy');
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`Đã sao chép số tài khoản: ${val}`);
        }).catch(() => {
          showToast(`Số tài khoản: ${val}`);
        });
      }
    });
  });
}

/* ==========================================================================
   4. Personalized Wishes & Live Guestbook Stream
   ========================================================================== */
const defaultWishesList = []; // Clean empty by default for real wedding guests

function getStoredWishes() {
  try {
    const stored = localStorage.getItem('wedding_wishes_list');
    if (!stored) return [];
    let list = JSON.parse(stored);
    if (!Array.isArray(list)) return [];
    // Auto-clean any legacy dummy wishes containing old demo text or names
    list = list.filter(w => {
      const txt = ((w.text || '') + ' ' + (w.name || '')).toLowerCase();
      return !txt.includes('anh đức') && 
             !txt.includes('lan ngọc') && 
             !txt.includes('nguyễn hoàng long') && 
             !txt.includes('phạm minh tuấn') &&
             !txt.includes('nguyễn văn a');
    });
    return list;
  } catch (e) {
    return [];
  }
}

function addWish(wish) {
  const current = getStoredWishes();
  current.unshift(wish);
  localStorage.setItem('wedding_wishes_list', JSON.stringify(current));
}

// Global helper to wipe wishes clean
window.clearAllWishes = function() {
  localStorage.setItem('wedding_wishes_list', JSON.stringify([]));
  renderLiveWishes();
};

function renderLiveWishes() {
  const stream = document.getElementById('live-wishes-stream');
  const countBadge = document.getElementById('wishes-count-badge');
  const modalList = document.getElementById('wishes-list');
  const wishes = getStoredWishes();

  if (countBadge) {
    countBadge.textContent = `${wishes.length} lời chúc`;
  }

  if (wishes.length === 0) {
    const emptyHtml = `
      <div class="wishes-empty-state">
        <div class="empty-icon">🕊️</div>
        <p class="empty-title">Chưa có lời chúc nào</p>
        <p class="empty-sub">Hãy là người đầu tiên gửi những lời chúc phúc tốt đẹp nhất đến <strong>Tấn Lộc & Hồng Tú</strong> nhé!</p>
      </div>
    `;
    if (stream) stream.innerHTML = emptyHtml;
    if (modalList) modalList.innerHTML = emptyHtml;
    return;
  }

  const html = wishes.map(w => {
    const parts = (w.name || 'Khách Quý').trim().split(/\s+/);
    const initials = parts.map(n => n[0]).slice(-2).join('').toUpperCase() || '♡';
    return `
      <div class="live-wish-card">
        <div class="live-wish-top">
          <div class="live-wish-author">
            <div class="author-avatar">${escapeHtml(initials)}</div>
            <strong class="author-name">${escapeHtml(w.name)}</strong>
          </div>
          <span class="live-wish-time">${escapeHtml(w.time || 'Vừa xong')}</span>
        </div>
        <div class="live-wish-text">${escapeHtml(w.text)}</div>
      </div>
    `;
  }).join('');

  if (stream) stream.innerHTML = html;
  if (modalList) modalList.innerHTML = html;
}

function initWishesSection() {
  const form = document.getElementById('wishes-submit-form');
  const successBlock = document.getElementById('wishes-success-block');
  const successName = document.getElementById('success-guest-name');
  const successGiftBtn = document.getElementById('btn-success-gift');
  const calendarBtn = document.getElementById('btn-add-calendar');
  const dockCalendarBtn = document.getElementById('btn-dock-calendar');
  const textarea = document.getElementById('wishes-message-input');
  const attendanceInput = document.getElementById('attendance-hidden-input');

  renderLiveWishes();

  // Quick Chips
  const chips = document.querySelectorAll('.quick-wish-chips .chip-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-chip');
      if (textarea) {
        if (!textarea.value.trim()) {
          textarea.value = text;
        } else {
          textarea.value += ' ' + text;
        }
        textarea.focus();
      }
    });
  });

  // Micro attendance pills
  const pills = document.querySelectorAll('.presence-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (attendanceInput) {
        attendanceInput.value = pill.getAttribute('data-attendance');
      }
    });
  });

  // Gift modal trigger from success block
  if (successGiftBtn) {
    successGiftBtn.addEventListener('click', () => {
      const giftModal = document.getElementById('modal-gift');
      if (giftModal) giftModal.classList.add('active');
    });
  }

  // Calendar triggers
  const addCalendarHandler = () => {
    handleAddToCalendar();
  };
  if (calendarBtn) calendarBtn.addEventListener('click', addCalendarHandler);
  if (dockCalendarBtn) dockCalendarBtn.addEventListener('click', addCalendarHandler);

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let guestName = currentGuest.hasCustomName ? currentGuest.name : '';
      if (!guestName) {
        const inputName = document.getElementById('wishes-guest-name');
        guestName = inputName ? inputName.value.trim() : '';
      }

      if (!guestName) {
        guestName = 'Khách Quý';
      }

      const wishText = textarea ? textarea.value.trim() : '';
      const attendance = attendanceInput ? attendanceInput.value : 'attending';

      if (!wishText) {
        showToast('Vui lòng nhập lời chúc của bạn');
        if (textarea) textarea.focus();
        return;
      }

      // Add to store
      addWish({
        name: guestName,
        text: wishText,
        time: 'Vừa xong',
        side: currentGuest.side,
        attendance: attendance
      });

      // Save submission to RSVP record
      const storedRsvp = JSON.parse(localStorage.getItem('wedding_rsvp_list') || '[]');
      storedRsvp.push({
        name: guestName,
        side: currentGuest.side,
        attendance: attendance,
        wishes: wishText,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('wedding_rsvp_list', JSON.stringify(storedRsvp));

      // Launch Confetti
      launchConfetti();

      // Show success view
      form.style.display = 'none';
      if (successBlock) {
        successBlock.style.display = 'block';
      }
      if (successName) {
        successName.textContent = guestName;
      }

      showToast(`Cảm ơn ${guestName} đã gửi lời chúc mừng! ❤️`);
      renderLiveWishes();
    });
  }
}

/* ==========================================================================
   5. Calendar Integration (Google Calendar & .ics File)
   ========================================================================== */
function handleAddToCalendar() {
  const title = encodeURIComponent('Lễ Cưới Tấn Lộc & Hồng Tú');
  const details = encodeURIComponent('Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi tại tiệc cưới Tấn Lộc & Hồng Tú! ❤️');
  const location = encodeURIComponent('Nhà Cộng Đồng, Thôn 5, TT. Krông Kmar Cũ (Thôn 3 Mới), Đắk Lắk');
  
  // Oct 25, 2026, 11:00 to 14:00 (GMT+7 -> 04:00 UTC to 07:00 UTC)
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261025T040000Z/20261025T070000Z&details=${details}&location=${location}`;

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIos) {
    downloadIcsFile();
  } else {
    window.open(gcalUrl, '_blank');
  }
  showToast('Đang thêm lịch cưới vào điện thoại 📅');
}

function downloadIcsFile() {
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Green Love//Wedding Invitation//VI
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Lễ Cưới Tấn Lộc & Hồng Tú
DESCRIPTION:Trân trọng kính mời bạn đến chung vui cùng gia đình Tấn Lộc & Hồng Tú!
LOCATION:Nhà Cộng Đồng, Thôn 5, TT. Krông Kmar Cũ (Thôn 3 Mới), Đắk Lắk
DTSTART:20261025T040000Z
DTEND:20261025T070000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'le-cuoi-tan-loc-hong-tu.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ==========================================================================
   6. Fullscreen Photo Lightbox
   ========================================================================== */
function initPhotoLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  if (!lightbox || !lightboxImg) return;

  // Collect all photos from gallery, hero, collage, and family bands
  const cards = document.querySelectorAll('.gallery-photo-card, .gallery-hero-card, .collage-item, .family-photo-wrapper, .hero-arch-frame');
  const photoList = [];

  cards.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    const url = img.getAttribute('data-full') || img.src;
    photoList.push(url);
    const photoIdx = photoList.length - 1;

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(photoIdx);
      lightbox.classList.add('active');
      if (window.setWeddingModalActive) window.setWeddingModalActive(true);
    });
  });

  let currentIndex = 0;

  function closeLightbox() {
    lightbox.classList.remove('active');
    if (window.setWeddingModalActive) window.setWeddingModalActive(false);
  }

  function showPhoto(index) {
    if (photoList.length === 0) return;
    if (index < 0) index = photoList.length - 1;
    if (index >= photoList.length) index = 0;
    currentIndex = index;
    lightboxImg.src = photoList[currentIndex];
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentIndex + 1);
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
}

/* ==========================================================================
   7. 3D Tilt & Touch Tactile Feedback for Photos
   ========================================================================== */
function init3DPhotoTilt() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cards = document.querySelectorAll('.hero-arch-frame, .gallery-photo-card, .gallery-hero-card, .collage-item, .family-photo-wrapper');
  
  cards.forEach(card => {
    let touchReleaseTimer = null;

    const activateTouchFeedback = () => {
      if (touchReleaseTimer) clearTimeout(touchReleaseTimer);
      card.classList.add('photo-touch-active');
    };

    const releaseTouchFeedback = (delay = 140) => {
      if (touchReleaseTimer) clearTimeout(touchReleaseTimer);
      touchReleaseTimer = setTimeout(() => {
        card.classList.remove('photo-touch-active');
        touchReleaseTimer = null;
      }, delay);
    };

    // Pointer Events cover touch, pen and hybrid devices consistently.
    if (window.PointerEvent) {
      card.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse') activateTouchFeedback();
      }, { passive: true });

      card.addEventListener('pointerup', (event) => {
        if (event.pointerType !== 'mouse') releaseTouchFeedback();
      }, { passive: true });

      card.addEventListener('pointercancel', () => releaseTouchFeedback(0), { passive: true });
      card.addEventListener('pointerleave', (event) => {
        if (event.pointerType !== 'mouse') releaseTouchFeedback(0);
      }, { passive: true });
    } else {
      // Fallback for older mobile Safari versions without Pointer Events.
      card.addEventListener('touchstart', activateTouchFeedback, { passive: true });
      card.addEventListener('touchend', () => releaseTouchFeedback(), { passive: true });
      card.addEventListener('touchcancel', () => releaseTouchFeedback(0), { passive: true });
    }

    // Desktop high-speed 3D tilt tracking
    if (canHover) {
      let rafId = null;
      card.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / rect.height) * 11;
          const rotateY = (x / rect.width) * 11;
          card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px) scale3d(1.025, 1.025, 1.025)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
        card.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    }
  });
}

/* ==========================================================================
   8. Bidirectional Scroll Animation Engine (Triggers on Scroll Down & Scroll Up)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-anim]');
  if (!animatedElements.length) return;

  // Immediately mark Hero & top visible elements as anim-in-view
  document.querySelectorAll('.hero-section [data-anim], .quote-section [data-anim]').forEach(el => {
    el.classList.add('anim-in-view');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Enters viewport: animate in smoothly and stay active
        entry.target.classList.add('anim-in-view');
      }
    });
  }, {
    threshold: 0.01,
    rootMargin: '120px 0px 120px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   9. Ambient Atmosphere Engine (Slow-Falling Rose Petals & Drifting Bokeh)
   ========================================================================== */
function initAmbientAtmosphere() {
  const canvas = document.getElementById('ambient-fx-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fxConfig = window._weddingFxConfig || {
    petals: true,
    bokeh: true,
    sparkles: true,
    confetti: true
  };

  if (!fxConfig.petals && !fxConfig.bokeh) {
    canvas.style.display = 'none';
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const isMobile = width < 768;

  // --- Bokeh Orbs Pool ---
  const bokehCount = fxConfig.bokeh ? (isMobile ? 14 : 22) : 0;
  const bokehList = [];

  for (let i = 0; i < bokehCount; i++) {
    bokehList.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * (isMobile ? 16 : 24) + 8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.25 + 0.12),
      baseAlpha: Math.random() * 0.22 + 0.14,
      pulseSpeed: Math.random() * 0.015 + 0.008,
      phase: Math.random() * Math.PI * 2
    });
  }

  // --- Falling White Rose Petals Pool ---
  const petalCount = fxConfig.petals ? (isMobile ? 14 : 20) : 0;
  const petals = [];
  const petalColors = [
    'rgba(255, 252, 246, 0.92)', // Ivory white
    'rgba(255, 240, 243, 0.86)', // Soft rose blush
    'rgba(253, 246, 227, 0.88)', // Pale champagne gold
    'rgba(250, 244, 238, 0.90)'  // Pale pearl
  ];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 7 + 9,
      vy: Math.random() * 0.55 + 0.42,
      swayAmp: Math.random() * 1.5 + 0.9,
      swayFreq: Math.random() * 0.018 + 0.01,
      swayPhase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.012,
      flip: Math.random() * Math.PI * 2,
      vFlip: Math.random() * 0.018 + 0.008,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(Math.cos(p.flip), 1);

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.4, p.size * 0.7, p.size * 0.6, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.4, 0, -p.size);
    ctx.fill();

    // Subtle gold spine line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 0.7);
    ctx.lineTo(0, p.size * 0.7);
    ctx.stroke();

    ctx.restore();
  }

  let animId;
  let isRunning = true;
  let t = 0;

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);
    t++;

    // 1. Render Bokeh Orbs
    const enableBokeh = !window._weddingFxConfig || window._weddingFxConfig.bokeh !== false;
    if (enableBokeh) {
      for (let i = 0; i < bokehList.length; i++) {
        const b = bokehList[i];
        b.x += b.vx;
        b.y += b.vy;
        b.phase += b.pulseSpeed;

        const alpha = b.baseAlpha + Math.sin(b.phase) * 0.08;
        const safeAlpha = Math.max(0.04, Math.min(0.38, alpha));

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `rgba(255, 248, 225, ${safeAlpha * 0.9})`);
        grad.addColorStop(0.5, `rgba(223, 193, 136, ${safeAlpha * 0.35})`);
        grad.addColorStop(1, 'rgba(223, 193, 136, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        if (b.y < -b.radius) {
          b.y = height + b.radius;
          b.x = Math.random() * width;
        }
        if (b.x < -b.radius) b.x = width + b.radius;
        if (b.x > width + b.radius) b.x = -b.radius;
      }
    }

    // 2. Render Falling Petals
    const enablePetals = !window._weddingFxConfig || window._weddingFxConfig.petals !== false;
    if (enablePetals) {
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.vy;
        p.x += Math.sin(t * p.swayFreq + p.swayPhase) * p.swayAmp;
        p.angle += p.vAngle;
        p.flip += p.vFlip;

        drawPetal(p);

        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;
      }
    }

    animId = requestAnimationFrame(render);
  }

  render();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animId);
    } else {
      if (!isRunning) {
        isRunning = true;
        render();
      }
    }
  });
}

/* ==========================================================================
   10. Interactive Wedding Confetti Cannon
   ========================================================================== */
function launchConfetti() {
  if (window._weddingFxConfig && window._weddingFxConfig.confetti === false) return;
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#D4AF37', '#C5A059', '#3F502B', '#546B38', '#FFFDF8', '#F5E6CC', '#E89292'];

  for (let i = 0; i < 75; i++) {
    const isHeart = Math.random() > 0.82;
    pieces.push({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 160,
      y: canvas.height * 0.75,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 11 + 6),
      size: isHeart ? (Math.random() * 5 + 6) : (Math.random() * 7 + 4),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8,
      isHeart: isHeart
    });
  }

  function drawMiniHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurve = size * 0.3;
    ctx.moveTo(0, topCurve);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurve);
    ctx.bezierCurveTo(-size / 2, (size + topCurve) / 2, 0, size, 0, size * 1.3);
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurve) / 2, size / 2, topCurve);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurve);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  let animationFrame;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32;
      p.vx *= 0.99;
      p.rotation += p.vrot;

      if (p.y < canvas.height + 25) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.isHeart) {
          drawMiniHeart(ctx, 0, 0, p.size, p.color);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
        }
        ctx.restore();
      }
    });

    if (active) {
      animationFrame = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  cancelAnimationFrame(animationFrame);
  loop();
}

/* ==========================================================================
   10. Toast Helper
   ========================================================================== */
let toastTimeout;
function showToast(msg) {
  let toast = document.getElementById('app-toast-alert');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast-alert';
    toast.className = 'app-toast-alert';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

/* ==========================================================================
   11. Hero White Doves Romantic Opening Animation (Continuous Romantic Flight)
   ========================================================================== */
let heroDovesTimer = null;
let heroDovesInterval = null;

function initHeroDoves() {
  const overlay = document.getElementById('hero-doves-overlay');
  if (!overlay) return;

  try {
    sessionStorage.removeItem('wedding_doves_played');
  } catch (e) {}

  // 1. Accessibility: respects prefers-reduced-motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery && motionQuery.matches) {
    overlay.style.display = 'none';
    return;
  }

  // 2. Admin Config toggle check (default strictly true)
  if (window._weddingFxConfig && window._weddingFxConfig.doves === false) {
    overlay.style.display = 'none';
    return;
  }

  // 3. Play animation on page load with slight 200ms delay
  setTimeout(() => {
    playHeroDovesAnimation();
  }, 200);

  // Check URL query param ?test_doves=1 from admin
  if (window.location.search.includes('test_doves=1')) {
    setTimeout(() => playHeroDovesAnimation(), 500);
  }

  // 4. Continuous Romantic Flight: Replay doves every 14s while hero is near viewport
  if (heroDovesInterval) clearInterval(heroDovesInterval);
  heroDovesInterval = setInterval(() => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (scrollY < 550 && (!window._weddingFxConfig || window._weddingFxConfig.doves !== false)) {
      playHeroDovesAnimation();
    }
  }, 14000);

  // 5. Scroll back to top: Replay doves when user scrolls back to the top
  let wasScrolledDown = false;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (scrollY > 450) {
      wasScrolledDown = true;
    } else if (scrollY < 80 && wasScrolledDown) {
      wasScrolledDown = false;
      playHeroDovesAnimation();
    }
  }, { passive: true });

  // 6. Interactive Replay: tap on arch photo to replay doves anytime!
  const archFrame = document.querySelector('.hero-arch-frame');
  if (archFrame) {
    archFrame.addEventListener('click', () => {
      playHeroDovesAnimation();
    });
  }
}

/**
 * Replays or triggers the white doves flight animation smoothly
 */
function playHeroDovesAnimation() {
  const overlay = document.getElementById('hero-doves-overlay');
  if (!overlay) return;

  // Ensure overlay is displayed
  overlay.style.display = 'block';

  // Reset CSS animations by reflow trick to restart keyframes smoothly
  const animatedItems = overlay.querySelectorAll('.dove-actor, .doves-heart-emblem, .doves-sparkle');
  animatedItems.forEach(el => {
    el.style.animation = 'none';
  });
  void overlay.offsetWidth; // Force DOM reflow
  animatedItems.forEach(el => {
    el.style.animation = '';
  });

  if (heroDovesTimer) clearTimeout(heroDovesTimer);
  heroDovesTimer = setTimeout(() => {
    overlay.style.display = 'none';
  }, 5800);
}

// Expose to window for admin preview or debugging
window.playHeroDovesAnimation = playHeroDovesAnimation;

/* ==========================================================================
   12. Cinematic Slow Auto-Scroll Engine (Smooth 60/120fps Delta-Time Scroller)
   - Tự động cuộn thật CHẬM & êm ái (~72px/s)
   - Tự dừng ngay lập tức khi khách chạm tay lướt lại
   - Thả tay là TỰ CUỘN LIỀN sau 50ms (không bị khựng hay chờ đợi)
   - Hoạt động mượt mà liên tục đến cuối trang
   ========================================================================== */
let isAutoScrollActive = false;
let autoScrollRafId = null;
let resumeScrollTimer = null;
let isTouchActive = false;
let userInteracting = false;
let modalOpenCount = 0;
let lastScrollFrameTime = null;
let accumulatedScrollY = 0;

// Tốc độ cuộn: ~72px mỗi giây (nhanh nhẹn, lôi cuốn, mượt mà 60/120fps)
const SCROLL_SPEED_PX_PER_SEC = 72;

function initCinematicAutoScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Đảm bảo không bị giật do CSS smooth scroll
  document.documentElement.style.scrollBehavior = 'auto';

  // 1. Khởi động tự động sau 3.2s (để khách ngắm bìa thiệp và chim bồ câu bay)
  setTimeout(() => {
    if (!userInteracting && !isTouchActive && modalOpenCount === 0) {
      startCinematicAutoScroll();
    }
  }, 3200);

  // 2. Nhận diện tương tác người dùng: "có thể lướt lại"
  function onUserTouchStart() {
    isTouchActive = true;
    userInteracting = true;
    stopCinematicAutoScroll();
    accumulatedScrollY = window.scrollY || window.pageYOffset || 0;
    if (resumeScrollTimer) clearTimeout(resumeScrollTimer);
  }

  function onUserTouchEnd() {
    isTouchActive = false;
    userInteracting = false;
    accumulatedScrollY = window.scrollY || window.pageYOffset || 0;
    // "thả thì nó phải tự cuộn liền" -> chỉ 50ms là tự cuộn tiếp!
    scheduleAutoScrollResume(50);
  }

  let wheelDebounceTimer = null;
  function onUserWheel() {
    userInteracting = true;
    stopCinematicAutoScroll();
    accumulatedScrollY = window.scrollY || window.pageYOffset || 0;
    if (resumeScrollTimer) clearTimeout(resumeScrollTimer);
    if (wheelDebounceTimer) clearTimeout(wheelDebounceTimer);
    wheelDebounceTimer = setTimeout(() => {
      userInteracting = false;
      scheduleAutoScrollResume(60);
    }, 70);
  }

  function onUserKeyDown(e) {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.code)) {
      userInteracting = true;
      stopCinematicAutoScroll();
      accumulatedScrollY = window.scrollY || window.pageYOffset || 0;
      if (resumeScrollTimer) clearTimeout(resumeScrollTimer);
      setTimeout(() => {
        userInteracting = false;
        scheduleAutoScrollResume(80);
      }, 100);
    }
  }

  window.addEventListener('touchstart', onUserTouchStart, { passive: true });
  window.addEventListener('touchmove', onUserTouchStart, { passive: true });
  window.addEventListener('touchend', onUserTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onUserTouchEnd, { passive: true });
  window.addEventListener('pointerdown', onUserTouchStart, { passive: true });
  window.addEventListener('pointerup', onUserTouchEnd, { passive: true });
  window.addEventListener('wheel', onUserWheel, { passive: true });
  window.addEventListener('keydown', onUserKeyDown, { passive: true });

  // Native scroll listener: theo dõi vị trí thực tế
  window.addEventListener('scroll', () => {
    const actualY = window.scrollY || window.pageYOffset || 0;
    if (!isAutoScrollActive) {
      accumulatedScrollY = actualY;
    } else {
      // Nếu ngón tay đang chạm màn hình (isTouchActive) thì mới dừng
      if (isTouchActive) {
        accumulatedScrollY = actualY;
        stopCinematicAutoScroll();
      } else {
        // Đã thả tay (inertial momentum hoặc cuộn tự động): đồng bộ tọa độ mượt mà
        accumulatedScrollY = actualY;
      }
    }
  }, { passive: true });

  // 3. Tab visibility check
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCinematicAutoScroll();
    } else {
      accumulatedScrollY = window.scrollY || window.pageYOffset || 0;
      if (!userInteracting && !isTouchActive && modalOpenCount === 0) {
        scheduleAutoScrollResume(500);
      }
    }
  });
}

function startCinematicAutoScroll() {
  if (isAutoScrollActive || userInteracting || isTouchActive || modalOpenCount > 0) return;

  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  ) - window.innerHeight;

  const currentScroll = window.scrollY || window.pageYOffset || 0;
  if (currentScroll >= maxScroll - 12) {
    return;
  }

  accumulatedScrollY = currentScroll;
  isAutoScrollActive = true;
  lastScrollFrameTime = null;
  autoScrollRafId = requestAnimationFrame(autoScrollStep);
}

function stopCinematicAutoScroll() {
  isAutoScrollActive = false;
  if (autoScrollRafId) {
    cancelAnimationFrame(autoScrollRafId);
    autoScrollRafId = null;
  }
}

function scheduleAutoScrollResume(delayMs = 50) {
  if (resumeScrollTimer) clearTimeout(resumeScrollTimer);
  resumeScrollTimer = setTimeout(() => {
    if (userInteracting || isTouchActive || modalOpenCount > 0) return;

    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;

    const currentScroll = window.scrollY || window.pageYOffset || 0;
    if (currentScroll < maxScroll - 20) {
      startCinematicAutoScroll();
    }
  }, delayMs);
}

function autoScrollStep(timestamp) {
  if (!isAutoScrollActive || userInteracting || isTouchActive || modalOpenCount > 0) {
    isAutoScrollActive = false;
    return;
  }

  if (!lastScrollFrameTime) lastScrollFrameTime = timestamp;
  const dt = (timestamp - lastScrollFrameTime) / 1000;
  lastScrollFrameTime = timestamp;

  const safeDt = Math.min(dt, 0.08);
  const distance = SCROLL_SPEED_PX_PER_SEC * safeDt;

  const maxScroll = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  ) - window.innerHeight;

  accumulatedScrollY += distance;

  if (accumulatedScrollY >= maxScroll - 6) {
    window.scrollTo(0, maxScroll);
    stopCinematicAutoScroll();
    return;
  }

  window.scrollTo(0, accumulatedScrollY);
  autoScrollRafId = requestAnimationFrame(autoScrollStep);
}

// Modal helper to pause auto-scroll when lightbox or QR modal is open
window.setWeddingModalActive = function(isActive) {
  if (isActive) {
    modalOpenCount++;
    stopCinematicAutoScroll();
  } else {
    modalOpenCount = Math.max(0, modalOpenCount - 1);
    if (modalOpenCount === 0) {
      scheduleAutoScrollResume(1800);
    }
  }
};


