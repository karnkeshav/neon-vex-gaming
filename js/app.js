document.addEventListener('DOMContentLoaded', () => {

  // Mandatory Image Resolver Helper Function
  async function resolveImage(imgEl) {
    if (!imgEl || imgEl.dataset.r4lResolving || imgEl.dataset.r4lResolved || (imgEl.getAttribute('src') || '').trim()) return;
    imgEl.dataset.r4lResolving = '1';
    const cache = window.__r4lImgCache = window.__r4lImgCache || new Map();
    const entity = imgEl.dataset.entity;
    const query = imgEl.dataset.query || imgEl.alt || 'placeholder';
    const w = imgEl.dataset.w || 600, h = imgEl.dataset.h || 400;
    const cacheKey = (entity ? 'e:' + entity : 'q:' + query) + '@' + w + 'x' + h;

    if (cache.has(cacheKey)) {
      imgEl.src = cache.get(cacheKey);
      imgEl.dataset.r4lResolved = '1';
      delete imgEl.dataset.r4lResolving;
      return;
    }

    const getSeed = (s) => {
      let hash = 5381;
      const str = String(s || 'image');
      for (let i = 0; i < str.length; i++) { hash = ((hash << 5) + hash) + str.charCodeAt(i); hash |= 0; }
      return Math.abs(hash);
    };

    const seed = getSeed(entity || query);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=${w}&height=${h}&seed=${seed}&nologo=true`;

    if (entity) {
      try {
        const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(entity)}`);
        if (r.ok) {
          const j = await r.json();
          const src = (j.originalimage && j.originalimage.source) || (j.thumbnail && j.thumbnail.source);
          if (src) {
            cache.set(cacheKey, src);
            imgEl.src = src;
            imgEl.dataset.r4lResolved = '1';
            delete imgEl.dataset.r4lResolving;
            return;
          }
        }
      } catch (e) {}
    }

    try {
      const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=1&mature=false`);
      const j = await r.json();
      const hit = j.results && j.results[0];
      if (hit && (hit.url || hit.thumbnail)) {
        const src = hit.url || hit.thumbnail;
        cache.set(cacheKey, src);
        imgEl.src = src;
        imgEl.dataset.r4lResolved = '1';
        delete imgEl.dataset.r4lResolving;
        return;
      }
    } catch (e) {}

    cache.set(cacheKey, pollinationsUrl);
    imgEl.src = pollinationsUrl;
    imgEl.dataset.r4lResolved = '1';
    delete imgEl.dataset.r4lResolving;
  }
  window.resolveImage = window.resolveImage || resolveImage;

  // --- Sample Games Data ---
  const gamesData = [
    {
      id: 'game-1',
      title: 'ಸೈಬರ್ ವಾರ್ಫೇರ್ 2077',
      category: 'action',
      rating: '⭐ 4.9',
      players: '24K ಪ್ಲೇಯರ್ಸ್',
      desc: 'ಹೈಟೆಕ್ ಭವಿಷ್ಯದ ಆಕ್ಷನ್ ಶೂಟಿಂಗ್ ಗೇಮ್. ನೈಜ ಗ್ರಾಫಿಕ್ಸ್ ಮತ್ತು ಆನ್‌ಲೈನ್ ಮಲ್ಟಿಪ್ಲೇಯರ್ ಬೆಂಬಲ.',
      query: 'cyberpunk futuristic warrior battle neon city gaming wallpaper',
      entity: 'Cyberpunk'
    },
    {
      id: 'game-2',
      title: 'ವಿಜಯನಗರದ ದಂತಕಥೆ',
      category: 'rpg',
      rating: '⭐ 4.8',
      players: '18K ಪ್ಲೇಯರ್ಸ್',
      desc: 'ಭಾರತೀಯ ಪುರಾಣ ಮತ್ತು ಸಾಹಸದ ರೋಮಾಂಚಕಾರಿ ಆರ್‍ಪಿಜಿ ಕಥೆ. ರಾಜಧಾನಿ ಉಳಿಸಲು ಹೋರಾಡಿ.',
      query: 'fantasy warrior medieval kingdom indian art epic game hero',
    },
    {
      id: 'game-3',
      title: 'ಸ್ಪೀಡ್ ರೇಸರ್ಸ್ ಬೆಂಗಳೂರು',
      category: 'racing',
      rating: '⭐ 4.7',
      players: '15K ಪ್ಲೇಯರ್ಸ್',
      desc: 'ಸೂಪರ್ ಕಾರ್‌ಗಳೊಂದಿಗೆ ಬೆಂಗಳೂರಿನ ರಸ್ತೆಗಳಲ್ಲಿ ಹೈ-ಸ್ಪೀಡ್ ರೇಸಿಂಗ್ ಅನುಭವಿಸಿ.',
      query: 'neon sports racing car night drive cyber city speed',
      entity: 'Racing game'
    },
    {
      id: 'game-4',
      title: 'ಸಾಮ್ರಾಜ್ಯಗಳ ಕಾಳಗ',
      category: 'strategy',
      rating: '⭐ 4.6',
      players: '12K ಪ್ಲೇಯರ್ಸ್',
      desc: 'ನಿಮ್ಮ ಸ್ವಂತ ಸೇನೆಯನ್ನು ನಿರ್ಮಿಸಿ, ಕೌಶಲ್ಯಯುತ ತಂತ್ರಗಳೊಂದಿಗೆ ಎದುರಾಳಿಗಳನ್ನು ಸೋಲಿಸಿ.',
      query: 'medieval strategy battle simulator high fantasy army RTS',
    },
    {
      id: 'game-5',
      title: 'ಶ್ಯಾಡೋ ನಿಂಜಾ: ರೈಸಿಂಗ್',
      category: 'action',
      rating: '⭐ 4.9',
      players: '30K ಪ್ಲೇಯರ್ಸ್',
      desc: 'ರಹಸ್ಯ ಮಿಷನ್‌ಗಳು ಮತ್ತು ತೀವ್ರ ಕತ್ತಿ ಕಾಳಗಗಳೊಂದಿಗೆ ಶಕ್ತಿಯುತ ನಿಂಜಾ ಆಗಿ.',
      query: 'dark ninja warrior glowing katana blade stealth action game',
    },
    {
      id: 'game-6',
      title: 'ಗ್ಯಾಲಕ್ಸಿ ಡಿಫೆಂಡರ್ಸ್',
      category: 'strategy',
      rating: '⭐ 4.5',
      players: '9K ಪ್ಲೇಯರ್ಸ್',
      desc: 'ಬಹ್ಯಾಕಾಶ ಯುದ್ಧದಲ್ಲಿ ಶತ್ರು ಏಲಿಯನ್‌ಗಳಿಂದ ನಿಮ್ಮ ಗ್ರಹವನ್ನು ರಕ್ಷಿಸಿ.',
      query: 'sci-fi spaceship armada deep space galaxy combat war',
    }
  ];

  // --- Sample Tournaments Data ---
  const tournamentsData = [
    {
      id: 't-1',
      title: 'ಬೆಂಗಳೂರು ಸೈಬರ್ ಚಾಂಪಿಯನ್‌ಷಿಪ್ 2025',
      date: 'ಅಕ್ಟೋಬರ್ 28, 2025',
      prize: '₹ 1,50,000',
      slots: '128 ಸ್ಕ್ವಾಡ್‌ಗಳು',
      mode: '4v4 ಸ್ಕ್ವಾಡ್ ಶೂಟರ್',
      query: 'esports arena tournament stage glowing lights crowd banner'
    },
    {
      id: 't-2',
      title: 'ಕರ್ನಾಟಕ ಬೆಟಲ್ ರಾಯಲ್ ಕಪ್',
      date: 'ನವೆಂಬರ್ 05, 2025',
      prize: '₹ 75,000',
      slots: '64 ಪ್ಲೇಯರ್‌ಗಳು',
      mode: 'ಸೋಲೋ ಕಾಳಗ',
      query: 'gaming competition trophies neon lights dark background'
    },
    {
      id: 't-3',
      title: 'ಮೈಸೂರು ಇ-ಸ್ಪೋರ್ಟ್ಸ್ ಲೀಗ್ (Rally)',
      date: 'ನವೆಂಬರ್ 12, 2025',
      prize: '₹ 50,000',
      slots: '32 ರೇಸರ್‌ಗಳು',
      mode: 'ಸಮಯದ ರೇಸಿಂಗ್',
      query: 'sim racing esports tournament setup steering wheel monitor'
    }
  ];

  // --- Sample Leaderboard Data ---
  const leaderboardData = {
    weekly: [
      { rank: 1, name: 'ರಾಕೇಶ್ "ವೈಪರ್" ಗೌಡ', clan: 'ಬೆಂಗಳೂರು ಬುಲ್ಸ್', wins: 42, xp: '15,420' },
      { rank: 2, name: 'ಅನನ್ಯ "ಆರಾ" ಹೆಗಡೆ', clan: 'ಮೈಸೂರು ವಾರಿಯರ್ಸ್', wins: 38, xp: '14,890' },
      { rank: 3, name: 'ಪ್ರೇಮ್ "ಆಲ್ಫಾ" ಕುಮಾರ್', clan: 'ಡೆಕ್ಕನ್ ಕಿಂಗ್ಸ್', wins: 35, xp: '13,750' },
      { rank: 4, name: 'ತೇಜಸ್ "ಫ್ಯಾಂಟಮ್" ರಾವ್', clan: 'ಸೈಬರ್ ಸ್ಪಾರ್ಟಾನ್ಸ್', wins: 30, xp: '12,100' },
      { rank: 5, name: 'ವಿಕಾಸ್ "ಸ್ಟಾರ್ಮ್" ಶರ್ಮಾ', clan: 'ಕೋಸ್ಟಲ್ ನೈಟ್ಸ್', wins: 28, xp: '11,400' }
    ],
    monthly: [
      { rank: 1, name: 'ಅನನ್ಯ "ಆರಾ" ಹೆಗಡೆ', clan: 'ಮೈಸೂರು ವಾರಿಯರ್ಸ್', wins: 140, xp: '58,200' },
      { rank: 2, name: 'ರಾಕೇಶ್ "ವೈಪರ್" ಗೌಡ', clan: 'ಬೆಂಗಳೂರು ಬುಲ್ಸ್', wins: 132, xp: '54,100' },
      { rank: 3, name: 'ಸಂಜಯ್ "ನೆಮೆಸಿಸ್" ಪಾಟೀಲ್', clan: 'ಹುಬ್ಬಳ್ಳಿ ಹಂಟರ್ಸ್', wins: 110, xp: '48,900' }
    ],
    alltime: [
      { rank: 1, name: 'ರಾಕೇಶ್ "ವೈಪರ್" ಗೌಡ', clan: 'ಬೆಂಗಳೂರು ಬುಲ್ಸ್', wins: 520, xp: '210,000' },
      { rank: 2, name: 'ಪ್ರೇಮ್ "ಆಲ್ಫಾ" ಕುಮಾರ್', clan: 'ಡೆಕ್ಕನ್ ಕಿಂಗ್ಸ್', wins: 480, xp: '195,000' }
    ]
  };

  // --- Sample Stream Data ---
  const streamsData = [
    {
      id: 's-1',
      title: 'ರಾಕೇಶ್ ಗೌಡ - ಸೈಬರ್ ವಾರ್ಫೇರ್ ಫೈನಲ್ ಪಂದ್ಯಾವಳಿ',
      streamer: 'Viper_Gamer (ರಾಕೇಶ್)',
      viewers: '4.2k ವೀಕ್ಷಕರು',
      query: 'Indian young male gamer wearing headset streaming video game in neon room'
    },
    {
      id: 's-2',
      title: 'ವಿಜಯನಗರ ಆರ್‍ಪಿಜಿ ಸೋಲೋ ರಾಂಕ್ ಪುಷ್!',
      streamer: 'Aura_Hegde (ಅನನ್ಯ)',
      viewers: '2.8k ವೀಕ್ಷಕರು',
      query: 'Indian young female gamer wearing headphones streaming on PC with neon backdrop'
    }
  ];

  // --- State Management ---
  let favorites = JSON.parse(localStorage.getItem('nv_favorites') || '[]');
  let userPoints = parseInt(localStorage.getItem('nv_points') || '250', 10);

  // --- Toast Helper ---
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // --- Render Functions ---
  function updateFavCount() {
    document.getElementById('favCount').textContent = favorites.length;
  }

  function renderGames(filter = 'all') {
    const grid = document.getElementById('gamesGrid');
    grid.innerHTML = '';

    const filtered = filter === 'all' ? gamesData : gamesData.filter(g => g.category === filter);

    filtered.forEach(game => {
      const isFav = favorites.includes(game.id);
      const card = document.createElement('div');
      card.className = 'card game-card';
      card.innerHTML = `
        <div class="game-img-wrapper">
          <img data-query="${game.query}" ${game.entity ? `data-entity="${game.entity}"` : ''} alt="${game.title}" loading="lazy"
               onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='https://placehold.co/600x400/1e293b/ffffff?text='+encodeURIComponent(/^[\x20-\x7E]*$/.test(this.alt||'')?this.alt:'Game');}else{this.onerror=null;}">
          <span class="game-tag">${game.category.toUpperCase()}</span>
          <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${game.id}">
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="game-info">
          <h3 class="game-title">${game.title}</h3>
          <div class="game-meta">
            <span>${game.rating}</span>
            <span>👥 ${game.players}</span>
          </div>
          <p class="game-desc">${game.desc}</p>
          <button class="btn btn-block play-now-btn" data-title="${game.title}">🎮 ಪ್ಲೇ ಮಾಡಿ</button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Resolve images right after insertion
    grid.querySelectorAll('img[data-query]:not([src])').forEach(resolveImage);
  }

  function renderTournaments() {
    const grid = document.getElementById('tournamentsGrid');
    grid.innerHTML = '';

    tournamentsData.forEach(t => {
      const card = document.createElement('div');
      card.className = 'card tourn-card';
      card.innerHTML = `
        <div class="tourn-date">📅 ${t.date}</div>
        <h3>${t.title}</h3>
        <div class="tourn-prize">ಬಹುಮಾನ: ${t.prize}</div>
        <div class="tourn-meta">
          <div><span>ಲಭ್ಯವಿರುವ ಸ್ಥಾನ:</span> <strong>${t.slots}</strong></div>
          <div><span>ಮೋಡ್:</span> <strong>${t.mode}</strong></div>
        </div>
        <button class="btn btn-block join-tourn-btn" data-id="${t.id}" data-title="${t.title}">ನೋಂದಾಯಿಸಿ (Register)</button>
      `;
      grid.appendChild(card);
    });
  }

  function renderLeaderboard(type = 'weekly') {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    const list = leaderboardData[type] || leaderboardData.weekly;

    list.forEach(row => {
      const tr = document.createElement('tr');
      const rankClass = row.rank === 1 ? 'rank-1' : row.rank === 2 ? 'rank-2' : row.rank === 3 ? 'rank-3' : '';
      const avatarSeed = encodeURIComponent(row.name);

      tr.innerHTML = `
        <td><span class="rank-badge ${rankClass}">${row.rank}</span></td>
        <td>
          <div class="player-cell">
            <img class="player-avatar" src="https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}" alt="${row.name}">
            <strong>${row.name}</strong>
          </div>
        </td>
        <td>${row.clan}</td>
        <td>${row.wins} HP</td>
        <td><strong style="color:var(--accent-2);">${row.xp} XP</strong></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderStreams() {
    const grid = document.getElementById('streamsGrid');
    grid.innerHTML = '';

    streamsData.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card stream-card';
      card.innerHTML = `
        <div class="stream-thumbnail">
          <img data-query="${s.query}" alt="${s.title}" loading="lazy"
               onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='https://placehold.co/600x400/1e293b/ffffff?text='+encodeURIComponent(/^[\x20-\x7E]*$/.test(this.alt||'')?this.alt:'Stream');}else{this.onerror=null;}">
          <span class="live-tag">🔴 LIVE</span>
          <span class="stream-viewers">👁️ ${s.viewers}</span>
        </div>
        <div class="stream-body">
          <h3>${s.title}</h3>
          <p style="color:var(--text-2); font-size:14px; margin-top:4px;">ಸ್ಟ್ರೀಮರ್: <strong>${s.streamer}</strong></p>
          <button class="btn btn-ghost btn-sm watch-stream-btn" style="margin-top:16px;" data-title="${s.title}">📺 ಸ್ಟ್ರೀಮ್ ನೋಡಿ</button>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('img[data-query]:not([src])').forEach(resolveImage);
  }

  function renderFavoritesList() {
    const container = document.getElementById('favsList');
    container.innerHTML = '';

    if (favorites.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-2); padding:20px;">ಯಾವುದೇ ಫೇವರೆಟ್ ಗೇಮ್ ಸೇರಿಸಲಾಗಿಲ್ಲ.</p>`;
      return;
    }

    const favGames = gamesData.filter(g => favorites.includes(g.id));
    favGames.forEach(g => {
      const item = document.createElement('div');
      item.className = 'fav-item';
      item.innerHTML = `
        <div>
          <strong>${g.title}</strong>
          <div style="font-size:12px; color:var(--text-3);">${g.category}</div>
        </div>
        <button class="btn btn-ghost btn-sm remove-fav-btn" data-id="${g.id}">❌ ತೆಗೆದುಹಾಕಿ</button>
      `;
      container.appendChild(item);
    });
  }

  // --- Event Listeners & Interaction ---

  // Navigation Mobile Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Filter Bar Buttons
  document.getElementById('gameFilters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      renderGames(e.target.dataset.filter);
    }
  });

  // Favorite Toggle inside Games Grid
  document.getElementById('gamesGrid').addEventListener('click', (e) => {
    const favBtn = e.target.closest('.fav-btn');
    if (favBtn) {
      const id = favBtn.dataset.id;
      if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        showToast('ಗೇಮ್ ಫೇವರೆಟ್‌ಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ');
      } else {
        favorites.push(id);
        showToast('❤️ ಗೇಮ್ ಫೇವರೆಟ್‌ಗೆ ಸೇರಿಸಲಾಗಿದೆ!');
      }
      localStorage.setItem('nv_favorites', JSON.stringify(favorites));
      updateFavCount();
      renderGames(document.querySelector('.filter-btn.active').dataset.filter);
    }

    const playBtn = e.target.closest('.play-now-btn');
    if (playBtn) {
      showToast(`🎮 "${playBtn.dataset.title}" ಲೋಡ್ ಆಗುತ್ತಿದೆ... ಪ್ರಾರಂಭಿಸಿ!`);
    }
  });

  // Tournaments Registration Modal logic
  const tournModal = document.getElementById('tournamentModal');
  document.getElementById('tournamentsGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('.join-tourn-btn');
    if (btn) {
      document.getElementById('modalTitle').textContent = `${btn.dataset.title} - ನೋಂದಣಿ`;
      document.getElementById('modalTournId').value = btn.dataset.id;
      tournModal.classList.add('open');
    }
  });

  document.getElementById('modalClose').addEventListener('click', () => {
    tournModal.classList.remove('open');
  });

  document.getElementById('tournForm').addEventListener('submit', (e) => {
    e.preventDefault();
    tournModal.classList.remove('open');
    showToast('🎉 ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ನಿಮ್ಮ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.');
    e.target.reset();
  });

  // Leaderboard Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLeaderboard(btn.dataset.tab);
    });
  });

  // Favorites Modal Logic
  const favsModal = document.getElementById('favsModal');
  document.getElementById('favsModalBtn').addEventListener('click', () => {
    renderFavoritesList();
    favsModal.classList.add('open');
  });
  document.getElementById('favsModalClose').addEventListener('click', () => {
    favsModal.classList.remove('open');
  });

  document.getElementById('favsList').addEventListener('click', (e) => {
    const remBtn = e.target.closest('.remove-fav-btn');
    if (remBtn) {
      const id = remBtn.dataset.id;
      favorites = favorites.filter(f => f !== id);
      localStorage.setItem('nv_favorites', JSON.stringify(favorites));
      updateFavCount();
      renderFavoritesList();
      renderGames(document.querySelector('.filter-btn.active').dataset.filter);
      showToast('ಫೇವರೆಟ್‌ಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ');
    }
  });

  // Stream Lightbox Modal Logic
  const streamModal = document.getElementById('streamModal');
  document.getElementById('streamsGrid').addEventListener('click', (e) => {
    const watchBtn = e.target.closest('.watch-stream-btn');
    if (watchBtn) {
      document.getElementById('streamTitle').textContent = watchBtn.dataset.title;
      streamModal.classList.add('open');
    }
  });
  document.getElementById('streamModalClose').addEventListener('click', () => {
    streamModal.classList.remove('open');
  });

  // Claim Daily Bonus
  document.getElementById('claimDailyBtn').addEventListener('click', () => {
    const lastClaim = localStorage.getItem('nv_last_claim');
    const today = new Date().toDateString();

    if (lastClaim === today) {
      showToast('⚠️ ನೀವು ಇಂದಿನ ಬೋನಸ್ ಅನ್ನು ಈಗಾಗಲೇ ಪಡೆದುಕೊಂಡಿದ್ದೀರಿ!');
    } else {
      userPoints += 50;
      localStorage.setItem('nv_points', userPoints);
      localStorage.setItem('nv_last_claim', today);
      document.getElementById('userPoints').textContent = userPoints;
      showToast('🎁 +50 NV-Coins ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!');
    }
  });

  // Close Modals on Outer Click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('open');
    }
  });

  // Initialize Data
  updateFavCount();
  document.getElementById('userPoints').textContent = userPoints;
  renderGames();
  renderTournaments();
  renderLeaderboard();
  renderStreams();
});