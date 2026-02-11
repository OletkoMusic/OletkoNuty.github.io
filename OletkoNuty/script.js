// ===== BAZA NUT (możesz rozszerzać!) =====
const utworyDatabase = {
    saksofon: [
        { 
            id: 1, 
            tytul: "Cicha noc", 
            pdf: "nuty/saksofon/cicha-noc.pdf",
            dataDodania: "2024-01-15",
            popularnosc: 150
        },
        { 
            id: 2, 
            tytul: "Sto lat", 
            pdf: "nuty/saksofon/sto-lat.pdf",
            dataDodania: "2024-01-20",
            popularnosc: 89
        },
        { 
            id: 3, 
            tytul: "Wlazł kotek na płotek", 
            pdf: "nuty/saksofon/wlazl-kotek.pdf",
            dataDodania: "2024-02-01",
            popularnosc: 210
        },
        { 
            id: 4, 
            tytul: "Yesterday", 
            pdf: "nuty/saksofon/yesterday.pdf",
            dataDodania: "2024-02-10",
            popularnosc: 75
        }
    ],
    fortepian: [
        { 
            id: 1, 
            tytul: "Cicha noc", 
            pdf: "nuty/fortepian/cicha-noc.pdf",
            dataDodania: "2024-01-15",
            popularnosc: 180
        },
        { 
            id: 2, 
            tytul: "Sto lat", 
            pdf: "nuty/fortepian/sto-lat.pdf",
            dataDodania: "2024-01-18",
            popularnosc: 95
        },
        { 
            id: 3, 
            tytul: "Dla Elizy", 
            pdf: "nuty/fortepian/dla-elizy.pdf",
            dataDodania: "2024-01-25",
            popularnosc: 320
        },
        { 
            id: 4, 
            tytul: "Nocturne Op.9 No.2", 
            pdf: "nuty/fortepian/nocturne.pdf",
            dataDodania: "2024-02-05",
            popularnosc: 156
        }
    ]
};

// ===== STAN APLIKACJI =====
let currentInstrument = 'saksofon';

// ===== INICJALIZACJA =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 Strona z nutami załadowana!');
    
    // Ustaw aktywny instrument
    setActiveInstrument(currentInstrument);
    
    // Załaduj dostępne nuty
    loadSheetMusic(currentInstrument);
    
    // Dodaj event listenery
    setupEventListeners();
});

// ===== EVENT LISTENERY =====
function setupEventListeners() {
    // Przycisk wyszukiwania
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', () => searchMusic());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMusic();
    });
    
    // Przyciski instrumentów
    document.querySelectorAll('.instrument-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const instrument = btn.dataset.instrument;
            switchInstrument(instrument);
        });
    });
}

// ===== ZMIANA INSTRUMENTU =====
function switchInstrument(instrument) {
    currentInstrument = instrument;
    setActiveInstrument(instrument);
    loadSheetMusic(instrument);
    
    // Wyczyść wyniki wyszukiwania
    clearResults();
    
    // Wyczyść pole wyszukiwania
    document.getElementById('searchInput').value = '';
}

function setActiveInstrument(instrument) {
    document.querySelectorAll('.instrument-btn').forEach(btn => {
        if (btn.dataset.instrument === instrument) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ===== WYSZUKIWANIE =====
function searchMusic() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (!searchTerm) {
        alert('Wpisz tytuł utworu!');
        return;
    }
    
    // Pokaż loading
    showLoading();
    
    // Symulacja opóźnienia (fajny efekt)
    setTimeout(() => {
        const wyniki = utworyDatabase[currentInstrument].filter(utwor => 
            utwor.tytul.toLowerCase().includes(searchTerm)
        );
        
        displayResults(wyniki, searchTerm);
    }, 500);
}

function displayResults(wyniki, searchTerm) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (wyniki.length > 0) {
        let html = `<h3 style="margin-bottom: 20px;">🔍 Znaleziono ${wyniki.length} utworów:</h3>`;
        
        wyniki.forEach(utwor => {
            html += `
                <div class="result-item">
                    <div class="result-title">
                        <span style="font-size: 1.5em;">🎵</span>
                        ${utwor.tytul}
                        <span style="font-size: 0.8em; color: rgba(255,255,255,0.5);">
                            (dodano: ${utwor.dataDodania})
                        </span>
                    </div>
                    <a href="${utwor.pdf}" class="download-btn" download>
                        ⬇️ Pobierz PDF
                    </a>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
    } else {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="note-icon">😕</div>
                <h3>Nie ma jeszcze nut do "${searchTerm}"</h3>
                <p style="margin-top: 20px; color: var(--text-secondary);">
                    Ale już pracujemy nad tym utworem! 🎵<br>
                    Sprawdź inne dostępne nuty poniżej.
                </p>
            </div>
        `;
    }
}

// ===== ŁADOWANIE LISTY DOSTĘPNYCH NUT =====
function loadSheetMusic(instrument) {
    const gridContainer = document.getElementById('sheetMusicGrid');
    const instrumentNazwa = instrument === 'saksofon' ? 'Saksofon' : 'Fortepian';
    
    let html = '';
    
    // Sortuj według popularności
    const sortedUtwory = [...utworyDatabase[instrument]].sort((a, b) => b.popularnosc - a.popularnosc);
    
    sortedUtwory.forEach(utwor => {
        html += `
            <div class="sheet-card" onclick="window.location.href='${utwor.pdf}'">
                <h3>${utwor.tytul}</h3>
                <p style="color: var(--text-secondary); margin-bottom: 10px;">
                    👁️ ${utwor.popularnosc} pobrań
                </p>
                <span class="instrument-badge">${instrumentNazwa}</span>
            </div>
        `;
    });
    
    gridContainer.innerHTML = html;
}

// ===== POMOCNICZE FUNKCJE =====
function clearResults() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <div class="note-icon">🎯</div>
            <h3>Wpisz tytuł w wyszukiwarkę</h3>
            <p style="margin-top: 20px; color: var(--text-secondary);">
                Znajdź nuty które Cię interesują!
            </p>
        </div>
    `;
}

function showLoading() {
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state loading">
            <div class="note-icon">⏳</div>
            <h3>Szukam nut...</h3>
        </div>
    `;
}

// ===== EKSPORT (dla GitHub Pages) =====
// Możesz dodać więcej funkcji:
// - Licznik pobrań
// - Polecane utwory
// - Historia wyszukiwania

console.log('🚀 Aplikacja gotowa!');