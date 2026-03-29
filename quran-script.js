        // Use an IIFE or normal script without wrapping in a function to ensure immediate execution when parsed,
        // or ensure the initialization is called properly.
        console.log("Quran Page Script Parsed");
        document.addEventListener('DOMContentLoaded', function () {
            console.log("DOMContentLoaded Fired");
            const container = document.getElementById('surah-list');
            console.log("Container:", container);
            if (!container) return;

            // Give a tiny timeout to ensure surahs.js has attached window.surahs
            setTimeout(() => {
                console.log("Timeout triggered. window.surahs:", typeof window.surahs);
                if (typeof window.surahs === 'undefined') {
                    console.error("surahs is undefined!");
                    container.innerHTML = '<div class="col-12 text-center py-5 text-danger"><i class="fas fa-exclamation-triangle fa-2x mb-3"></i><p>فشل في تحميل السور. يرجى التأكد من اتصالك أو تحديث الصفحة.</p></div>';
                    return;
                }

                console.log("Initializing State");
                // Global State for Quran logic
                window.quranState = {
                    currentFilter: 'all',
                    searchQuery: '',
                    allSurahs: window.surahs
                };

                const filterBtns = document.querySelectorAll('#surahFilters button');
                const quickSearch = document.getElementById('quickSurahSearch');
                const audioPlayerContainer = document.getElementById('globalAudioPlayer');
                const mainAudio = document.getElementById('mainAudio');
                const closePlayerBtn = document.getElementById('closePlayerBtn');
                const playerSurahName = document.getElementById('playerSurahName');
                const playerSpinIcon = document.getElementById('playerSpinIcon');
                
                const readerModal = new bootstrap.Modal(document.getElementById('quranReaderModal'));
                const readerSurahName = document.getElementById('readerSurahName');
                const readerVerses = document.getElementById('readerVerses');
                const bismillahHeader = document.getElementById('bismillahHeader');
                let currentReadSurah = 1;

                function renderSurahs() {
                    container.innerHTML = '';
                    
                    let filtered = window.quranState.allSurahs.filter(surah => {
                        const matchesFilter = window.quranState.currentFilter === 'all' || surah.type === window.quranState.currentFilter;
                        const matchesSearch = surah.name.includes(window.quranState.searchQuery) || (surah.number.toString() === window.quranState.searchQuery);
                        return matchesFilter && matchesSearch;
                    });

                    if (filtered.length === 0) {
                         container.innerHTML = '<div class="col-12 text-center py-5 text-muted"><i class="fas fa-search-minus fa-2x mb-3"></i><p>لا توجد سور مطابقة لبحثك.</p></div>';
                         return;
                    }

                    let surahsHTML = '';
                    filtered.forEach(surah => {
                        // Fixing the inversion: Meccan = مكية, Medinan = مدنية
                        const typeText = surah.type === 'Meccan' ? 'مكية' : 'مدنية';
                        const typeClass = surah.type === 'Meccan' ? 'bg-success' : 'bg-primary';

                        surahsHTML += `
                            <div class="col-md-6 col-lg-4 fade-in-hidden surah-item">
                                <div class="card mb-3 content-card h-100" data-title="سورة ${surah.name}" 
                                     data-desc="سورة ${typeText}، عدد آياتها ${surah.verses}" data-url="quran.html#s${surah.number}" id="s${surah.number}">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h5 class="card-title mb-0">${surah.number}. ${surah.name}</h5>
                                            <span class="badge ${typeClass}">${typeText}</span>
                                        </div>
                                        <p class="card-text text-muted small">عدد الآيات: ${surah.verses}</p>
                                        <div class="d-flex gap-2 mb-2">
                                            <button class="btn btn-sm btn-primary flex-fill btn-read-surah" data-surah="${surah.number}">
                                                <i class="fas fa-book-open"></i> قراءة
                                            </button>
                                            <button class="btn btn-sm btn-outline-primary btn-play-surah" title="استماع" data-surah="${surah.number}" data-name="${surah.name}">
                                                <i class="fas fa-headphones"></i>
                                            </button>
                                        </div>
                                        <div class="d-flex gap-2 justify-content-between">
                                            <button class="btn btn-sm btn-outline-secondary btn-bookmark flex-fill" title="حفظ">
                                                <i class="fas fa-bookmark"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-secondary btn-share flex-fill" title="مشاركة">
                                                <i class="fas fa-share"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    container.innerHTML = surahsHTML;

                    // Attach Events to new buttons
                    console.log("Attaching Events");
                    attachSurahEvents();

                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('fade-in-visible');
                                observer.unobserve(entry.target);
                            }
                        });
                    });

                    document.querySelectorAll('#surah-list .surah-item').forEach(el => observer.observe(el));
                }

                console.log("Calling renderSurahs");
                // Initial Render
                try {
                    renderSurahs();
                    console.log("renderSurahs finished successfully");
                } catch (e) {
                    console.error("Error in renderSurahs:", e);
                }

                // Setup Filters
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        filterBtns.forEach(b => {
                            b.classList.remove('btn-primary', 'active');
                            b.classList.add('btn-outline-primary');
                        });
                        e.target.classList.remove('btn-outline-primary');
                        e.target.classList.add('btn-primary', 'active');
                        window.quranState.currentFilter = e.target.getAttribute('data-filter');
                        renderSurahs();
                    });
                });

                // Setup Quick Search
                if (quickSearch) {
                    quickSearch.addEventListener('input', (e) => {
                        window.quranState.searchQuery = e.target.value.trim();
                        renderSurahs();
                    });
                }

                function playSurah(number, name) {
                    const paddedNum = String(number).padStart(3, '0');
                    const src = `https://server8.mp3quran.net/afs/${paddedNum}.mp3`;
                    
                    mainAudio.src = src;
                    playerSurahName.innerText = 'سورة ' + name;
                    
                    audioPlayerContainer.style.transform = 'translateY(0)';
                    
                    mainAudio.play().catch(e => {
                         console.log("Audio play blocked, waiting for interaction");
                    });
                }

                if (closePlayerBtn) {
                    closePlayerBtn.addEventListener('click', () => {
                        mainAudio.pause();
                        audioPlayerContainer.style.transform = 'translateY(100%)';
                    });
                }

                if (mainAudio && playerSpinIcon) {
                    mainAudio.addEventListener('play', () => playerSpinIcon.style.animationPlayState = 'running');
                    mainAudio.addEventListener('pause', () => playerSpinIcon.style.animationPlayState = 'paused');
                }

                function openReader(surahNumber) {
                    currentReadSurah = surahNumber;
                    const surahData = window.quranState.allSurahs.find(s => s.number === surahNumber);
                    if (!surahData) return;

                    readerSurahName.innerText = 'سورة ' + surahData.name;
                    
                    if (surahNumber !== 1 && surahNumber !== 9) {
                        bismillahHeader.style.display = 'block';
                    } else {
                        bismillahHeader.style.display = 'none';
                    }

                    readerVerses.innerHTML = '<span class="text-muted"><i class="fas fa-spinner fa-spin me-2"></i>جاري جلب الآيات...</span>';
                    readerModal.show();

                    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.code === 200) {
                                let ayahHTML = data.data.ayahs.map(ayah => {
                                    let text = ayah.text;
                                    if (surahNumber !== 1 && surahNumber !== 9 && ayah.numberInSurah === 1) {
                                        text = text.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s?/, '');
                                        text = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s?/, '');
                                    }
                                    return `${text} <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span>`;
                                }).join(' ');
                                readerVerses.innerHTML = ayahHTML;
                            } else {
                                readerVerses.innerHTML = '<span class="text-danger">عذراً، لم نتمكن من جلب الآيات. الرجاء المحاولة لاحقاً.</span>';
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            readerVerses.innerHTML = '<span class="text-danger">حدث خطأ في الاتصال بالشبكة.</span>';
                        });
                }

                function attachSurahEvents() {
                    document.querySelectorAll('.btn-play-surah').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            const num = parseInt(btn.getAttribute('data-surah'));
                            const name = btn.getAttribute('data-name');
                            playSurah(num, name);
                        });
                    });

                    document.querySelectorAll('.btn-read-surah').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            const num = parseInt(btn.getAttribute('data-surah'));
                            openReader(num);
                        });
                    });
                }

                const modalPlayBtn = document.querySelector('.btn-play-modal');
                if(modalPlayBtn) {
                    modalPlayBtn.addEventListener('click', () => {
                       const surahData = window.quranState.allSurahs.find(s => s.number === currentReadSurah);
                       if(surahData) playSurah(surahData.number, surahData.name);
                    });
                }

                document.getElementById('prevSurahBtn')?.addEventListener('click', () => {
                    if (currentReadSurah > 1) openReader(currentReadSurah - 1);
                });
                document.getElementById('nextSurahBtn')?.addEventListener('click', () => {
                    if (currentReadSurah < 114) openReader(currentReadSurah + 1);
                });

                let currentFontSize = 1.5; // rem
                document.getElementById('increaseFontBtn')?.addEventListener('click', () => {
                    if(currentFontSize < 3.0) currentFontSize += 0.25;
                    readerVerses.style.fontSize = currentFontSize + 'rem';
                });
                document.getElementById('decreaseFontBtn')?.addEventListener('click', () => {
                    if(currentFontSize > 1.0) currentFontSize -= 0.25;
                    readerVerses.style.fontSize = currentFontSize + 'rem';
                });

                // Scroll to Top Logic
                const scrollToTopBtn = document.getElementById('scrollToTopBtn');
                if (scrollToTopBtn) {
                    window.addEventListener('scroll', () => {
                        if (window.scrollY > 300) {
                            scrollToTopBtn.style.display = 'block';
                        } else {
                            scrollToTopBtn.style.display = 'none';
                        }
                    });
                    scrollToTopBtn.addEventListener('click', () => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }

                // Coming Soon Toast Logic
                const comingSoonToastEl = document.getElementById('comingSoonToast');
                if (comingSoonToastEl) {
                    const comingSoonToast = new bootstrap.Toast(comingSoonToastEl);
                    document.querySelectorAll('a[href="#"], .btn-bookmark, .btn-share').forEach(el => {
                        el.addEventListener('click', (e) => {
                            const href = el.getAttribute('href');
                            if (href === '#' || el.classList.contains('btn-bookmark') || el.classList.contains('btn-share')) {
                                if (!el.classList.contains('dropdown-toggle') && !el.hasAttribute('data-bs-toggle') && !el.hasAttribute('data-bs-target') && !el.classList.contains('nav-link')) {
                                    e.preventDefault();
                                    comingSoonToast.show();
                                }
                            }
                        });
                    });
                }

            }, 50); // Small timeout to wait for surahs.js
        });
