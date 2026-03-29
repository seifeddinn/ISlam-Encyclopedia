/**
 * Recitations & Quranic Sciences Academy Script
 * Connects to mp3quran.net API v3
 */

document.addEventListener('DOMContentLoaded', function () {
    
    // --- API Endpoints ---
    const API_RECITERS = 'https://www.mp3quran.net/api/v3/reciters?language=ar';
    const API_SUWAR = 'https://www.mp3quran.net/api/v3/suwar?language=ar';

    // --- DOM Elements ---
    const recitersListEl = document.getElementById('recitersList');
    const searchReciterInput = document.getElementById('searchReciter');
    const surahGridEl = document.getElementById('surahGrid');
    
    // Player Elements
    const audioPlayer = document.getElementById('mainAudioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressBarContainer');
    const timeCurrentEl = document.getElementById('timeCurrent');
    const timeTotalEl = document.getElementById('timeTotal');
    
    const currentSurahNameEl = document.getElementById('currentSurahName');
    const currentReciterNameEl = document.getElementById('currentReciterName');
    const currentRiwayaEl = document.getElementById('currentRiwaya');

    // --- State Variables ---
    let allReciters = [];
    let allSuwar = [];
    let currentServer = '';
    let availableSurahsArray = []; // Array of Surah IDs for current reciter
    let currentPlayingSurahId = null;
    let isPlaying = false;

    // --- Initialization ---
    init();

    async function init() {
        try {
            // Fetch Surahs Names First
            const suwarResponse = await fetch(API_SUWAR);
            const suwarData = await suwarResponse.json();
            allSuwar = suwarData.suwar;

            // Fetch Reciters
            const recitersResponse = await fetch(API_RECITERS);
            const recitersData = await recitersResponse.json();
            allReciters = recitersData.reciters;
            
            // Initial render of all available reciters from API
            renderReciters(allReciters);

        } catch (error) {
            recitersListEl.innerHTML = `<div class="p-4 text-danger text-center"><i class="fas fa-exclamation-triangle fa-2x mb-2"></i><br>فشل في تحميل البيانات من الخادم. يرجى التحقق من اتصال الإنترنت.</div>`;
            console.error("API Fetch Error:", error);
        }
    }

    // --- Render Reciters List ---
    function renderReciters(reciters) {
        recitersListEl.innerHTML = '';
        if (reciters.length === 0) {
            recitersListEl.innerHTML = `<div class="p-4 text-muted text-center">لا يوجد نتائج للبحث.</div>`;
            return;
        }

        reciters.forEach(reciter => {
            // Some reciters have multiple moshafs (riwayas). We'll take the first one by default.
            if(reciter.moshaf && reciter.moshaf.length > 0) {
                const moshaf = reciter.moshaf[0];
                
                const div = document.createElement('div');
                div.className = 'reciter-item';
                div.innerHTML = `
                    <div class="flex-grow-1">
                        <div class="fw-bold text-dark">${reciter.name}</div>
                        <div class="small text-muted">${moshaf.name}</div>
                    </div>
                    <i class="fas fa-play-circle fs-5"></i>
                `;

                div.addEventListener('click', () => {
                    // Remove active from all
                    document.querySelectorAll('.reciter-item').forEach(el => el.classList.remove('active'));
                    div.classList.add('active');
                    
                    selectReciter(reciter, moshaf);
                });

                recitersListEl.appendChild(div);
            }
        });
    }

    // --- Search Logic ---
    searchReciterInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query === '') {
            renderReciters(allReciters.slice(0, 100));
        } else {
            const filtered = allReciters.filter(r => r.name.toLowerCase().includes(query));
            renderReciters(filtered);
        }
    });

    // --- Select Reciter ---
    function selectReciter(reciter, moshaf) {
        currentServer = moshaf.server;
        
        // The API provides surah list as comma separated string "1,2,3...114"
        const surahListStr = moshaf.surah_list;
        availableSurahsArray = surahListStr.split(',').map(s => parseInt(s));

        currentReciterNameEl.textContent = "القارئ: " + reciter.name;
        currentRiwayaEl.textContent = moshaf.name;
        currentRiwayaEl.classList.remove('d-none');
        
        // Reset player UI
        currentSurahNameEl.textContent = "الرجاء اختيار سورة";
        audioPlayer.pause();
        audioPlayer.src = '';
        playIcon.className = 'fas fa-play';
        progressBar.style.width = '0%';
        timeCurrentEl.textContent = '00:00';
        timeTotalEl.textContent = '00:00';
        isPlaying = false;
        currentPlayingSurahId = null;

        renderSurahGrid();
    }

    // --- Render Surah Grid ---
    function renderSurahGrid() {
        surahGridEl.innerHTML = '';
        
        // Only render surahs available for this reciter
        availableSurahsArray.forEach(surahId => {
            const surahObj = allSuwar.find(s => s.id === surahId);
            if (surahObj) {
                const btn = document.createElement('div');
                btn.className = 'surah-btn';
                btn.textContent = surahObj.name;
                
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.surah-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    playSurah(surahId, surahObj.name);
                });
                
                // Highlight if currently playing
                if (currentPlayingSurahId === surahId) {
                    btn.classList.add('active');
                }
                
                surahGridEl.appendChild(btn);
            }
        });
    }

    // --- Play Audio ---
    function playSurah(surahId, surahName) {
        currentPlayingSurahId = surahId;
        currentSurahNameEl.textContent = "سورة " + surahName;

        // API standard: surah ID must be 3 digits (e.g. 001 for Fatiha, 045, 114)
        const formattedSurahId = String(surahId).padStart(3, '0');
        const audioUrl = currentServer + formattedSurahId + '.mp3';

        audioPlayer.src = audioUrl;
        audioPlayer.play();
    }

    // --- Audio Player Controls ---
    playPauseBtn.addEventListener('click', () => {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) return; // No audio loaded

        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });

    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        playIcon.className = 'fas fa-play';
    });

    // Time Formatting
    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Progress Bar Updates
    audioPlayer.addEventListener('timeupdate', () => {
        const current = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        
        if (duration) {
            const progressPercent = (current / duration) * 100;
            progressBar.style.width = progressPercent + '%';
            
            timeCurrentEl.textContent = formatTime(current);
            timeTotalEl.textContent = formatTime(duration);
        }
    });

    // Click on progress bar to seek
    progressContainer.addEventListener('click', (e) => {
        if (!audioPlayer.duration) return;
        
        const rect = progressContainer.getBoundingClientRect();
        // Since it's RTL, calculating percentage might be tricky, but in LTR coordinates:
        let clickPositionX = e.clientX - rect.left;
        
        // RTL adjustment: 
        const isRtl = document.dir === 'rtl';
        if (isRtl) {
            clickPositionX = rect.right - e.clientX;
        }

        const percentage = clickPositionX / rect.width;
        audioPlayer.currentTime = percentage * audioPlayer.duration;
    });

    // Next / Prev surah
    function playAdjacentSurah(direction) {
        if (!availableSurahsArray.length || !currentPlayingSurahId) return;
        
        const currentIndex = availableSurahsArray.indexOf(currentPlayingSurahId);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + direction; // 1 for next, -1 for prev
        
        // Note: In Quran, next surah means ID + 1. 
        if (nextIndex >= 0 && nextIndex < availableSurahsArray.length) {
            const nextSurahId = availableSurahsArray[nextIndex];
            const surahObj = allSuwar.find(s => s.id === nextSurahId);
            if(surahObj) {
                // Update UI visually
                document.querySelectorAll('.surah-btn').forEach(b => b.classList.remove('active'));
                const btns = Array.from(document.querySelectorAll('.surah-btn'));
                const targetBtn = btns.find(b => b.textContent === surahObj.name);
                if(targetBtn) targetBtn.classList.add('active');

                playSurah(nextSurahId, surahObj.name);
            }
        }
    }

    nextBtn.addEventListener('click', () => playAdjacentSurah(1));   // Next Surah
    prevBtn.addEventListener('click', () => playAdjacentSurah(-1));  // Prev Surah

    // Auto-play next surah when ended
    audioPlayer.addEventListener('ended', () => {
        playAdjacentSurah(1);
    });

});
