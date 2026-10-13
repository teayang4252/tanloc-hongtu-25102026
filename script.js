/**
 * Green Love - UI/UX Pro Max Luxury Editorial Wedding Invitation
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const initializers = [
    initGuestPersonalization,
    loadSavedConfig,
    initAudioPlayer,
    initCountdown,
    initWishesSection,
    initGiftModal,
    initPhotoLightbox,
    initScrollAnimations,
    init3DPhotoTilt,
    initAmbientAtmosphere,
    initHeroDoves,
    initCinematicAutoScroll
  ];

  // Facebook/Zalo WebView có thể thiếu một API trình duyệt. Một hiệu ứng lỗi
  // không được phép làm dừng toàn bộ phần còn lại của thiệp.
  initializers.forEach(initializer => {
    try {
      initializer();
    } catch (error) {
      console.warn(`Không thể khởi tạo ${initializer.name}:`, error);
    }
  });
});

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const DEFAULT_GROOM_SCHEDULE = {
  solarDate: '25.10.2026',
  solarDayNumber: '25',
  lunarDate: '16 tháng 09 năm Bính Ngọ',
  countdownTarget: '2026-10-25T09:00:00+07:00',
  event1Title: 'LỄ TÂN HÔN',
  event1Time: '09:00',
  event1DayVal: 'CHỦ NHẬT',
  event1Venue: 'Tại tư gia nhà trai',
  event1Address: '16/4 Điện Biên Phủ · TDP 5 Cũ (Thôn 3 Mới) · Đắk Lắk',
  event1MapLink: 'https://www.google.com/maps/search/?api=1&query=16%2F4+%C4%90i%E1%BB%87n+Bi%C3%AAn+Ph%E1%BB%A7%2C+Kr%C3%B4ng+Kmar%2C+Kr%C3%B4ng+B%C3%B4ng%2C+%C4%90%E1%BA%AFk+L%E1%BA%AFk',
  event2Title: 'TIỆC CƯỚI CHUNG VUI',
  event2Time: '11:00',
  event2DayVal: 'CHỦ NHẬT',
  event2Venue: 'Nhà Cộng Đồng',
  event2Address: 'Thôn 5 · TT. Krông Kmar Cũ (Thôn 3 Mới) · Đắk Lắk',
  event2MapLink: 'https://www.google.com/maps/search/?api=1&query=Nh%C3%A0+C%E1%BB%99ng+%C4%90%E1%BB%93ng%2C+Kr%C3%B4ng+Kmar%2C+Kr%C3%B4ng+B%C3%B4ng%2C+%C4%90%E1%BA%AFk+L%E1%BA%AFk'
};

const DEFAULT_BRIDE_SCHEDULE = {
  solarDate: '24.10.2026',
  solarDayNumber: '24',
  lunarDate: '15 tháng 09 năm Bính Ngọ',
  countdownTarget: '2026-10-24T11:00:00+07:00',
  event2Title: 'TIỆC CƯỚI NHÀ GÁI',
  event2Time: '11:00',
  event2DayVal: 'THỨ BẢY',
  event2Venue: 'Nhà hàng Quang Long',
  event2Address: '29 Nguyễn Huệ · Krông Bông · Đắk Lắk',
  event2MapLink: 'https://maps.app.goo.gl/aJm6BMmdJeqJbcic8?g_st=ic'
};

function getInvitationSide() {
  if (window._guestInvitationSide === 'gai') return 'bride';
  if (window._guestInvitationSide === 'trai') return 'groom';

  const path = (window.location.pathname || '').toLowerCase();
  if (/^\/1(?:\/|$)/.test(path)) return 'bride';
  if (/^\/2(?:\/|$)/.test(path)) return 'groom';

  const search = window.location.search || '';
  const sideMatch = search.match(/[?&](?:side|nha)=([^&]+)/i);
  let side = '';
  if (sideMatch) {
    try { side = decodeURIComponent(sideMatch[1].replace(/\+/g, ' ')); } catch (_) { side = sideMatch[1]; }
  }

  if (!side && /(?:_|-)nhagai(?:\/|$)/.test(path)) side = 'gai';
  if (!side && /(?:_|-)nhatrai(?:\/|$)/.test(path)) side = 'trai';

  side = side.toLowerCase();
  if (['gai', 'bride', 'nhagai', 'nha-gai'].includes(side)) return 'bride';
  if (['trai', 'groom', 'nhatrai', 'nha-trai'].includes(side)) return 'groom';
  return 'groom';
}

function getEffectiveWeddingConfig(storedConfig) {
  const stored = storedConfig || {};
  if (getInvitationSide() !== 'bride') {
    return { ...DEFAULT_GROOM_SCHEDULE, ...stored };
  }

  const bride = {
    solarDate: stored.brideSolarDate || DEFAULT_BRIDE_SCHEDULE.solarDate,
    solarDayNumber: stored.brideSolarDayNumber || DEFAULT_BRIDE_SCHEDULE.solarDayNumber,
    lunarDate: stored.brideLunarDate || DEFAULT_BRIDE_SCHEDULE.lunarDate,
    countdownTarget: stored.brideCountdownTarget || DEFAULT_BRIDE_SCHEDULE.countdownTarget,
    event2Title: stored.brideEventTitle || DEFAULT_BRIDE_SCHEDULE.event2Title,
    event2Time: stored.brideEventTime || DEFAULT_BRIDE_SCHEDULE.event2Time,
    event2DayVal: stored.brideEventDayVal || DEFAULT_BRIDE_SCHEDULE.event2DayVal,
    event2Venue: stored.brideEventVenue || DEFAULT_BRIDE_SCHEDULE.event2Venue,
    event2Address: stored.brideEventAddress || DEFAULT_BRIDE_SCHEDULE.event2Address,
    event2MapLink: stored.brideEventMapLink || DEFAULT_BRIDE_SCHEDULE.event2MapLink
  };

  return { ...DEFAULT_GROOM_SCHEDULE, ...stored, ...bride };
}

function parseWeddingDateTime(dateText, timeText) {
  const match = String(dateText || '').match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (!match) return null;
  const day = match[1].padStart(2, '0');
  const month = match[2].padStart(2, '0');
  const time = /^\d{2}:\d{2}$/.test(timeText || '') ? timeText : '11:00';
  const value = new Date(`${match[3]}-${month}-${day}T${time}:00+07:00`).getTime();
  return Number.isNaN(value) ? null : value;
}

function parseCountdownTarget(value, fallbackDate, fallbackTime) {
  let normalized = String(value || '').trim();
  if (normalized && !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized)) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) normalized += ':00';
    normalized += '+07:00';
  }
  const parsed = new Date(normalized).getTime();
  return Number.isNaN(parsed) ? parseWeddingDateTime(fallbackDate, fallbackTime) : parsed;
}

/* ==========================================================================
   0. Dynamic Config Sync from Admin Panel (localStorage)
   ========================================================================== */
function loadSavedConfig() {
  window._weddingFxConfig = {
    petals: true,
    bokeh: true,
    sparkles: true,
    doves: true,
    confetti: true
  };

  try {
    const raw = localStorage.getItem('wedding_site_config');
    const storedConfig = raw ? JSON.parse(raw) : {};
    const cfg = getEffectiveWeddingConfig(storedConfig);
    const invitationSide = getInvitationSide();

    document.body.dataset.invitationSide = invitationSide;
    if (invitationSide === 'bride') {
      document.querySelectorAll('.groom-schedule-only').forEach(el => {
        el.hidden = true;
        el.style.display = 'none';
      });
      document.querySelectorAll('.schedule-audience-label').forEach(el => el.textContent = 'PHIÊN BẢN NHÀ GÁI');
    } else {
      document.querySelectorAll('.schedule-audience-label').forEach(el => el.textContent = 'PHIÊN BẢN NHÀ TRAI');
    }

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
    if (cfg.solarDayNumber) document.querySelectorAll('.date-badge-large, .sched-day-number').forEach(el => el.textContent = cfg.solarDayNumber);
    if (cfg.solarDate) {
      const dateParts = cfg.solarDate.split('.');
      if (dateParts.length === 3) {
        document.querySelectorAll('.sched-month').forEach(el => el.textContent = `THÁNG ${dateParts[1]}`);
        document.querySelectorAll('.sched-year').forEach(el => el.textContent = `NĂM ${dateParts[2]}`);
      }
    }
    if (cfg.lunarDate) {
      document.querySelectorAll('.schedule-lunar-date, .lunar-date-text').forEach(el => el.textContent = cfg.lunarDate);
      document.querySelectorAll('.sched-lunar-date').forEach(el => el.textContent = `(Nhằm ngày ${cfg.lunarDate})`);
    }

    window._customCountdownTarget = parseCountdownTarget(
      cfg.countdownTarget,
      cfg.solarDate,
      cfg.event2Time
    );
    window._activeWeddingSchedule = {
      title: invitationSide === 'bride' ? 'Tiệc Cưới Nhà Gái Tấn Lộc & Hồng Tú' : 'Lễ Cưới Tấn Lộc & Hồng Tú',
      details: 'Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi trong ngày cưới Tấn Lộc & Hồng Tú! ❤️',
      location: `${cfg.event2Venue}, ${cfg.event2Address}`,
      start: parseWeddingDateTime(cfg.solarDate, cfg.event2Time)
    };

    // Bank Details
    if (cfg.groomBank) document.querySelectorAll('.groom-bank-text').forEach(el => el.textContent = cfg.groomBank);
    if (cfg.groomAccount) document.querySelectorAll('.groom-acc-text').forEach(el => el.textContent = cfg.groomAccount);
    if (cfg.groomAccountHolder) document.querySelectorAll('.groom-holder-text').forEach(el => el.textContent = cfg.groomAccountHolder);
    if (cfg.groomAccount) document.querySelectorAll('.groom-copy-account').forEach(el => el.dataset.copy = cfg.groomAccount);

    if (cfg.brideBank) document.querySelectorAll('.bride-bank-text').forEach(el => el.textContent = cfg.brideBank);
    if (cfg.brideAccount) document.querySelectorAll('.bride-acc-text').forEach(el => el.textContent = cfg.brideAccount);
    if (cfg.brideAccountHolder) document.querySelectorAll('.bride-holder-text').forEach(el => el.textContent = cfg.brideAccountHolder);
    if (cfg.brideAccount) document.querySelectorAll('.bride-copy-account').forEach(el => el.dataset.copy = cfg.brideAccount);

    updateGiftQrCode('groom-qr-code', cfg.groomBank, cfg.groomAccount, cfg.groomAccountHolder, 'Mung cuoi Tan Loc');
    updateGiftQrCode('bride-qr-code', cfg.brideBank, cfg.brideAccount, cfg.brideAccountHolder, 'Mung cuoi Hong Tu');

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

  // Luôn ưu tiên phát nhạc. Trình duyệt di động vẫn có thể bắt buộc một lần
  // chạm đầu tiên; các listener bên dưới sẽ phát ngay khi thao tác đó xảy ra.
  audio.autoplay = true;
  audio.loop = true;
  audio.playsInline = true;
  let userPaused = false;

  function syncPlaybackUi(playing) {
    musicBtn.classList.toggle('playing', playing);
    musicBtn.classList.toggle('paused', !playing);
    musicBtn.setAttribute('aria-pressed', String(playing));
    musicBtn.setAttribute('aria-label', playing ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền');
    if (promptPill) promptPill.classList.toggle('hidden', playing);
  }

  function playMusic(force = false) {
    if (userPaused && !force) return null;
    audio.volume = 0.82;
    audio.muted = false;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        syncPlaybackUi(true);
        removeGestureFallbacks();
      }).catch(() => {
        // Autoplay policy: unmuted playback requires first user gesture
        syncPlaybackUi(false);
      });
    }
    return playPromise;
  }

  function pauseMusic() {
    audio.pause();
    syncPlaybackUi(false);
  }

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audio.paused && !audio.ended) {
      userPaused = true;
      pauseMusic();
      showToast('Đã tạm dừng nhạc ♫');
    } else {
      userPaused = false;
      playMusic(true);
      showToast('Đang phát: Em Đồng Ý (I Do) ♫');
    }
  });

  if (promptPill) {
    promptPill.addEventListener('click', (e) => {
      e.stopPropagation();
      userPaused = false;
      playMusic(true);
      showToast('Đang phát: Em Đồng Ý (I Do) ♫');
    });
  }

  // 1. Immediate Autoplay Attempt (fires on initial link click)
  try { audio.load(); } catch (e) {}
  syncPlaybackUi(false);
  playMusic();
  window.addEventListener('load', () => { if (audio.paused) playMusic(); }, { once: true });
  window.addEventListener('pageshow', () => { if (audio.paused) playMusic(); });
  audio.addEventListener('canplay', () => { if (audio.paused) playMusic(); }, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audio.paused) playMusic();
  });

  // 2. First real in-page gesture or scroll intent unlocks audio.
  // Some mobile browsers reject the initial touchstart of a swipe, so retry on
  // touchmove/scroll as well instead of requiring a separate tap.
  const gestureEvents = [
    'pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'click', 'keydown'
  ];
  const scrollIntentEvents = ['touchmove', 'wheel', 'scroll'];

  function handleFirstGesture(event) {
    // These controls call playMusic themselves. Skipping them here prevents
    // pointerdown from starting audio and the following click from pausing it.
    if (event.target instanceof Element && event.target.closest('#floating-music-btn, #audio-prompt-pill')) {
      return;
    }
    if (audio.paused) {
      playMusic(true);
    }
  }

  function removeGestureFallbacks() {
    gestureEvents.forEach(evt => {
      document.removeEventListener(evt, handleFirstGesture, true);
    });
    scrollIntentEvents.forEach(evt => {
      window.removeEventListener(evt, handleFirstGesture, true);
    });
  }

  gestureEvents.forEach(evt => {
    document.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
  });
  scrollIntentEvents.forEach(evt => {
    window.addEventListener(evt, handleFirstGesture, { capture: true, passive: true });
  });

  audio.addEventListener('playing', () => syncPlaybackUi(true));
  audio.addEventListener('pause', () => {
    syncPlaybackUi(false);
    // Khôi phục sau gián đoạn hệ thống/tab nếu khách chưa chủ động tắt nhạc.
    if (!userPaused && !document.hidden) {
      setTimeout(() => {
        if (audio.paused && !userPaused) playMusic();
      }, 350);
    }
  });
  audio.addEventListener('ended', () => playMusic());
  audio.addEventListener('error', () => syncPlaybackUi(false));
}

function getVietQrBankId(bankName) {
  const normalized = String(bankName || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '');
  const aliases = {
    mb: 'MB', mbbank: 'MB', nganhangquandoi: 'MB',
    vcb: 'VCB', vietcombank: 'VCB',
    tcb: 'TCB', techcombank: 'TCB',
    acb: 'ACB', vpbank: 'VPB', vpb: 'VPB',
    bidv: 'BIDV', vietinbank: 'ICB', icb: 'ICB',
    agribank: 'VBA', vba: 'VBA',
    sacombank: 'STB', stb: 'STB',
    tpbank: 'TPB', tpb: 'TPB',
    vib: 'VIB', shb: 'SHB', hdbank: 'HDB', hdb: 'HDB',
    ocb: 'OCB', msb: 'MSB', seabank: 'SEAB',
    eximbank: 'EIB', eib: 'EIB', lpbank: 'LPB', lpb: 'LPB'
  };
  return aliases[normalized] || String(bankName || '').trim().replace(/\s+/g, '');
}

function updateGiftQrCode(elementId, bank, account, holder, message) {
  const image = document.getElementById(elementId);
  const bankId = getVietQrBankId(bank);
  if (!image || !bankId || !account) return;

  const cleanAccount = String(account).replace(/\s+/g, '');
  const path = `${encodeURIComponent(bankId)}-${encodeURIComponent(cleanAccount)}-compact2.png`;
  const query = [
    'amount=0',
    `addInfo=${encodeURIComponent(message)}`,
    `accountName=${encodeURIComponent(String(holder || '').trim())}`
  ].join('&');
  image.src = `https://img.vietqr.io/image/${path}?${query}`;
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

function applyGuestPersonalization(guestName, guestSide) {
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

    document.title = `${cleanName} | Thiệp cưới Tấn Lộc & Hồng Tú`;

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
  if (cleanSide === 'trai' || cleanSide === 'groom' || cleanSide === 'nhatrai') {
    currentGuest.side = 'Nhà trai';
    if (greetingSide) greetingSide.textContent = 'Khách quý của Nhà Trai';
  } else if (cleanSide === 'gai' || cleanSide === 'bride' || cleanSide === 'nhagai') {
    currentGuest.side = 'Nhà gái';
    if (greetingSide) greetingSide.textContent = 'Khách quý của Nhà Gái';
  } else {
    currentGuest.side = 'Hai bên';
    if (greetingSide) greetingSide.textContent = 'Khách quý của Hai Bên Gia Đình';
  }
}

async function loadSharedGuest(slug, fallbackName, fallbackSide, explicitName, explicitSide) {
  if (!slug || typeof window.fetch !== 'function') return;
  try {
    const response = await fetch(`/api/guests?slug=${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) return;
    const payload = await response.json();
    if (!payload || !payload.ok || !payload.guest) return;

    const resolvedName = explicitName ? fallbackName : (payload.guest.name || fallbackName);
    const resolvedSide = explicitSide ? fallbackSide : (payload.guest.side || fallbackSide);

    if (!explicitSide && ['trai', 'gai'].includes(resolvedSide)) {
      const previousSide = getInvitationSide();
      window._guestInvitationSide = resolvedSide;
      if (getInvitationSide() !== previousSide) loadSavedConfig();
    }

    applyGuestPersonalization(resolvedName, resolvedSide);
  } catch (error) {
    console.info('Thiệp đang dùng tên khách từ đường dẫn:', error.message);
  }
}

function initGuestPersonalization() {
  const urlParams = new URLSearchParams(window.location.search);

  // 0. Clean path-based slug (e.g. /Em-Tu-Ton without query parameters)
  const pathSegments = window.location.pathname
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);
  const routeCode = pathSegments.length === 2 && ['1', '2'].includes(pathSegments[0])
    ? pathSegments[0]
    : '';
  const routeSide = routeCode === '1' ? 'gai' : routeCode === '2' ? 'trai' : '';
  let pathSlug = routeCode ? pathSegments[1] : (pathSegments.length === 1 ? pathSegments[0] : '');
  if (pathSlug && !pathSlug.includes('.') && !['admin', 'index'].includes(pathSlug.toLowerCase())) {
    try { pathSlug = decodeURIComponent(pathSlug); } catch (_) {}
  } else {
    pathSlug = '';
  }

  // 1. Explicit parameters remain supported for old links.
  const explicitName = urlParams.get('name') || urlParams.get('ten') || '';
  const explicitSide = urlParams.get('side') || urlParams.get('nha') || routeSide;
  let guestName = explicitName;
  let guestSide = explicitSide;

  // 2. Slug parameter (e.g. ?to=banhien_nhatrai)
  const toParam = pathSlug || urlParams.get('to') || urlParams.get('guest') || urlParams.get('khach') || '';

  // 3. Resolve slug from the current browser cache when available.
  if (toParam) {
    try {
      const guestMap = JSON.parse(localStorage.getItem('wedding_guest_map') || '{}');
      const routeKey = routeCode ? `${routeCode}/${toParam}` : toParam;
      const found = guestMap[routeKey] || guestMap[routeKey.toLowerCase()] || guestMap[toParam] || guestMap[toParam.toLowerCase()];
      if (found) {
        if (!guestName) guestName = found.name;
        if (!guestSide) guestSide = found.side;
      }
    } catch (_) {}

    // Immediate readable fallback while the shared guest record is loading.
    if (!guestName) {
      const rawSlug = toParam.replace(/_nhatrai|_nhagai|-nhatrai|-nhagai/gi, '').replace(/[-_]+/g, ' ').trim();
      guestName = rawSlug.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    if (!guestSide) {
      if (/_nhatrai|-nhatrai/i.test(toParam)) guestSide = 'trai';
      else if (/_nhagai|-nhagai/i.test(toParam)) guestSide = 'gai';
    }
  }

  if (guestName && /_nhatrai|_nhagai|-nhatrai|-nhagai/i.test(guestName)) {
    guestName = guestName.replace(/_nhatrai|_nhagai|-nhatrai|-nhagai/gi, '').replace(/_/g, ' ');
  }

  // Set the invitation side before loadSavedConfig() applies venue, date and map data.
  // This is especially important for clean links such as /Em-Tu-Ton, which carry
  // the side in the locally/shared saved guest record instead of the URL itself.
  const normalizedGuestSide = String(guestSide || '').trim().toLowerCase();
  if (normalizedGuestSide === 'trai' || normalizedGuestSide === 'gai') {
    window._guestInvitationSide = normalizedGuestSide;
  }

  applyGuestPersonalization(guestName, guestSide);

  // The shared record restores Vietnamese accents and invitation side on the
  // recipient's device while keeping the public URL as short as /Em-Tu-Ton.
  if (pathSlug) {
    const sharedSlug = routeCode ? `${routeCode}-${pathSlug}` : pathSlug;
    loadSharedGuest(sharedSlug, guestName, guestSide, Boolean(explicitName), Boolean(explicitSide));
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
let wishesCache = [];

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

function saveLocalWishes(wishes) {
  try {
    localStorage.setItem('wedding_wishes_list', JSON.stringify(wishes));
  } catch (error) {
    console.warn('Không thể lưu sổ lưu bút cục bộ:', error);
  }
}

async function loadSharedWishes() {
  const response = await fetch('/api/wishes', {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });
  if (!response.ok) throw new Error(`Guestbook unavailable (${response.status})`);

  const payload = await response.json();
  if (!payload.ok || !Array.isArray(payload.wishes)) throw new Error('Invalid guestbook response');
  wishesCache = payload.wishes;
  saveLocalWishes(wishesCache);
  renderLiveWishes();
}

async function addWish(wish) {
  try {
    const response = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(wish)
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.ok || !payload.wish) {
      throw new Error(payload.message || `Guestbook unavailable (${response.status})`);
    }
    wishesCache.unshift(payload.wish);
    saveLocalWishes(wishesCache);
    return { shared: true, wish: payload.wish };
  } catch (error) {
    console.warn('Đang dùng sổ lưu bút cục bộ:', error);
    const localWish = { ...wish, id: `local-${Date.now()}`, createdAt: new Date().toISOString() };
    wishesCache.unshift(localWish);
    saveLocalWishes(wishesCache);
    return { shared: false, wish: localWish };
  }
}

// Global helper to wipe wishes clean
window.clearAllWishes = function() {
  wishesCache = [];
  saveLocalWishes(wishesCache);
  renderLiveWishes();
};

function renderLiveWishes() {
  const stream = document.getElementById('live-wishes-stream');
  const countBadge = document.getElementById('wishes-count-badge');
  const modalList = document.getElementById('wishes-list');
  const wishes = wishesCache;

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
          <span class="live-wish-time">${escapeHtml(formatWishTime(w.createdAt) || w.time || 'Vừa xong')}</span>
        </div>
        <div class="live-wish-text">${escapeHtml(w.text)}</div>
      </div>
    `;
  }).join('');

  if (stream) stream.innerHTML = html;
  if (modalList) modalList.innerHTML = html;
}

function formatWishTime(createdAt) {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(date);
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

  wishesCache = getStoredWishes();
  renderLiveWishes();
  loadSharedWishes().catch(error => {
    console.info('Sổ lưu bút dùng dữ liệu cục bộ:', error.message);
  });

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
    form.addEventListener('submit', async (e) => {
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

      const submitBtn = document.getElementById('btn-submit-wish');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
      }

      // Add to shared store, with a local fallback when the database is offline.
      const saveResult = await addWish({
        name: guestName,
        text: wishText,
        side: currentGuest.side,
        attendance: attendance
      });

      // Save submission to RSVP record
      try {
        const storedRsvp = JSON.parse(localStorage.getItem('wedding_rsvp_list') || '[]');
        storedRsvp.push({
          name: guestName,
          side: currentGuest.side,
          attendance: attendance,
          wishes: wishText,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('wedding_rsvp_list', JSON.stringify(storedRsvp));
      } catch (error) {
        console.warn('Không thể lưu RSVP cục bộ:', error);
      }

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

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
      }
      showToast(saveResult.shared
        ? `Cảm ơn ${guestName}, lời chúc đã được lưu! ❤️`
        : 'Đã lưu lời chúc trên thiết bị này. Cơ sở dữ liệu chung đang ngoại tuyến.');
      renderLiveWishes();
    });
  }
}

/* ==========================================================================
   5. Calendar Integration (Google Calendar & .ics File)
   ========================================================================== */
function handleAddToCalendar() {
  const schedule = getActiveWeddingSchedule();
  const title = encodeURIComponent(schedule.title);
  const details = encodeURIComponent(schedule.details);
  const location = encodeURIComponent(schedule.location);
  const start = formatCalendarUtc(schedule.start);
  const end = formatCalendarUtc(schedule.start + (3 * 60 * 60 * 1000));
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIos) {
    downloadIcsFile();
  } else {
    window.open(gcalUrl, '_blank');
  }
  showToast('Đang thêm lịch cưới vào điện thoại 📅');
}

function getActiveWeddingSchedule() {
  return window._activeWeddingSchedule || {
    title: 'Lễ Cưới Tấn Lộc & Hồng Tú',
    details: 'Trân trọng kính mời bạn đến chung vui cùng gia đình chúng tôi trong ngày cưới Tấn Lộc & Hồng Tú! ❤️',
    location: 'Nhà Cộng Đồng, Thôn 5, TT. Krông Kmar Cũ (Thôn 3 Mới), Đắk Lắk',
    start: new Date('2026-10-25T11:00:00+07:00').getTime()
  };
}

function formatCalendarUtc(timestamp) {
  return new Date(timestamp).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function downloadIcsFile() {
  const schedule = getActiveWeddingSchedule();
  const start = formatCalendarUtc(schedule.start);
  const end = formatCalendarUtc(schedule.start + (3 * 60 * 60 * 1000));
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Green Love//Wedding Invitation//VI
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${schedule.title}
DESCRIPTION:${schedule.details}
LOCATION:${schedule.location}
DTSTART:${start}
DTEND:${end}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', getInvitationSide() === 'bride'
    ? 'tiec-cuoi-nha-gai-tan-loc-hong-tu.ics'
    : 'le-cuoi-nha-trai-tan-loc-hong-tu.ics');
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
  let transitionSerial = 0;
  let transitionTimer = null;
  const transitionClasses = [
    'is-leaving-next', 'is-leaving-prev',
    'is-entering-next', 'is-entering-prev'
  ];

  function closeLightbox() {
    lightbox.classList.remove('active');
    if (window.setWeddingModalActive) window.setWeddingModalActive(false);
  }

  function clearImageTransition() {
    if (transitionTimer) {
      clearTimeout(transitionTimer);
      transitionTimer = null;
    }
    lightboxImg.classList.remove(...transitionClasses);
  }

  function preloadAdjacentPhotos() {
    if (photoList.length < 2) return;
    const previous = (currentIndex - 1 + photoList.length) % photoList.length;
    const next = (currentIndex + 1) % photoList.length;
    [photoList[previous], photoList[next]].forEach(src => {
      const image = new Image();
      image.src = src;
    });
  }

  function showPhoto(index, direction = 0, immediate = false) {
    if (photoList.length === 0) return;
    if (index < 0) index = photoList.length - 1;
    if (index >= photoList.length) index = 0;
    currentIndex = index;
    const nextSource = photoList[currentIndex];
    const serial = ++transitionSerial;

    if (immediate || prefersReducedMotion() || !lightbox.classList.contains('active')) {
      clearImageTransition();
      lightboxImg.src = nextSource;
      preloadAdjacentPhotos();
      return;
    }

    const preloader = new Image();
    let ready = false;
    const swapImage = () => {
      if (ready || serial !== transitionSerial) return;
      ready = true;
      clearImageTransition();

      const leavingClass = direction < 0 ? 'is-leaving-prev' : 'is-leaving-next';
      const enteringClass = direction < 0 ? 'is-entering-prev' : 'is-entering-next';
      lightboxImg.classList.add(leavingClass);

      transitionTimer = setTimeout(() => {
        if (serial !== transitionSerial) return;
        lightboxImg.src = nextSource;
        lightboxImg.classList.remove(leavingClass);
        lightboxImg.classList.add(enteringClass);
        void lightboxImg.offsetWidth;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (serial === transitionSerial) lightboxImg.classList.remove(enteringClass);
          });
        });
        preloadAdjacentPhotos();
        transitionTimer = null;
      }, 160);
    };

    preloader.addEventListener('load', swapImage, { once: true });
    preloader.addEventListener('error', swapImage, { once: true });
    preloader.src = nextSource;
    if (preloader.complete) swapImage();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentIndex - 1, -1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPhoto(currentIndex + 1, 1);
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1, -1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1, 1);
  });
}

/* ==========================================================================
   7. 3D Tilt & Touch Tactile Feedback for Photos
   ========================================================================== */
function init3DPhotoTilt() {
  const canHover = typeof window.matchMedia === 'function' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
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

  const revealAll = () => animatedElements.forEach(el => el.classList.add('anim-in-view'));
  const reducedMotion = prefersReducedMotion();

  // Nội dung luôn phải đọc được trên WebView cũ hoặc khi người dùng tắt chuyển động.
  if (reducedMotion || typeof window.IntersectionObserver !== 'function') {
    revealAll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-in-view');
      } else if (entry.boundingClientRect.top > 0) {
        // Cho phép hiệu ứng chạy lại khi cuộn lên rồi quay xuống, nhưng không
        // làm các khối phía trên giật ngược trong lúc tiếp tục cuộn xuống.
        entry.target.classList.remove('anim-in-view');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -7% 0px'
  });

  animatedElements.forEach(el => {
    if (!el.closest('.hero-section, .quote-section')) observer.observe(el);
  });

  // Đợi trình duyệt vẽ trạng thái ban đầu rồi mới mở phần đầu trang. Điều này
  // làm hiệu ứng nhìn thấy được cả khi mở link từ Facebook in-app browser.
  const revealTop = () => {
    document.querySelectorAll('.hero-section [data-anim], .quote-section [data-anim]').forEach(el => {
      el.classList.add('anim-in-view');
    });
  };
  requestAnimationFrame(() => requestAnimationFrame(revealTop));
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
  if (prefersReducedMotion()) return;

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
      // Distribute the first frame across the viewport so the effect is visible
      // immediately instead of taking many seconds to fall in from above.
      y: Math.random() * height,
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
    ctx.shadowColor = 'rgba(111, 86, 49, 0.22)';
    ctx.shadowBlur = 3;
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
  if (prefersReducedMotion()) {
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
  if (prefersReducedMotion()) return;

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


