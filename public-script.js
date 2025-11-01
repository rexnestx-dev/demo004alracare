// ===== GLOBAL VARIABLES =====
let currentService = null;
let isModalTransitioning = false;

// ===== SERVICE DETAILS DATA =====
const serviceDetails = {
    perawatan1: {
        title: "Perawatan Luka Modern",
        description: "Pilih jenis perawatan luka yang Anda butuhkan",
        type: "checkbox",
        options: [
            {
                id: "Perawatan Luka di Klinik",
                name: "1. Perawatan Luka di Klinik",
                price: "Rp 150.000",
                image: "./images/L_PERAWATANLIKADIKLINIK.webp",
            },
            {
                id: "Perawatan Luka Ke Rumah",
                name: "2. Perawatan Luka Ke Rumah di Area Pontianak",
                price: "Rp 200.000",
                image: "./images/L_PERAWATANLUKAKERUMAHPASIENDIAREAPONTIANAK_1.webp",
            },
            {
                id: "L_SENDALDIABETES",
                name: "3. Sendal Diabetes",
                price: "Rp 500.000",
                image: "./images/L_SENDALDIABETES.webp",
            }
        ]
    },
    perawatan2: {
        title: "Perawatan Kecantikan",
        description: "Pilih jenis perawatan kecantikan yang Anda butuhkan",
        type: "checkbox",
        options: [
            {
                id: "A_TAHILALAT(NEAVY)_1",
                name: "1. Tahi Lalat (Neavy)_1",
                price: "Rp 500.000",
                image: "./images/A_TAHILALAT(NEAVY).webp",
            },
            {
                id: "A_TAHILALAT(NEAVY)_2_7",
                name: "2. Tahi Lalat (Neavy)_2-7",
                price: "Rp 1.000.000",
                image: "./images/A_TAHILALAT(NEAVY).webp",
            },
            {
                id: "A_TAHILALAT(NEAVY)_8_SEWAJAH",
                name: "3. Tahi Lalat (Neavy)_8-SEWAJAH",
                price: "Rp 1.500.000",
                image: "./images/A_TAHILALAT(NEAVY).webp",
            },
            {
                id: "A_KUTIL(SKINTAG)_1_10",
                name: "4. Kutil (SKintag)_1-10",
                price: "Rp 500.000",
                image: "./images/A_KUTIL(SKINTAG).webp",
            },
            {
                id: "A_KUTIL(SKINTAG)_11_30",
                name: "5. Kutil (SKintag)_11-30",
                price: "Rp 1.000.000",
                image: "./images/A_KUTIL(SKINTAG).webp",
            },
            {
                id: "A_KUTIL(SKINTAG)_31_SEWAJAH",
                name: "6. Kutil (SKintag)_31-SEWAJAH",
                price: "Rp 1.500.000",
                image: "./images/A_KUTIL(SKINTAG).webp",
            },
            {
                id: "A_FLEKHITAM(MELASMA)",
                name: "7. Flek Hitam (Melasma)",
                price: "Rp 350.000",
                image: "./images/A_FLEKHITAM(MELASMA).webp",
            },
            {
                id: "A_FLEKBULE(FREACKLES)_1_20",
                name: "8. Flek Bule (Freackles)_1-20",
                price: "Rp 500.000",
                image: "./images/A_FLEKBULE(FREACKLES).webp",
            },
            {
                id: "A_FLEKBULE(FREACKLES)_21_50",
                name: "9. Flek Bule (Freackles)_21-50",
                price: "Rp 1.000.000",
                image: "./images/A_FLEKBULE(FREACKLES).webp",
            },
            {
                id: "A_FLEKBULE(FREACKLES)_50_SEWAJAH",
                name: "10. Flek Bule (Freackles)_50-Sewajah",
                price: "Rp 1.500.000",
                image: "./images/A_FLEKBULE(FREACKLES).webp",
            },
            {
                id: "A_SEBOROIKKERATOSIS_1_10",
                name: "11. Seboroik Keratosis_1-10",
                price: "Rp 500.000",
                image: "./images/A_SEBOROIKKERATOSIS.webp",
            },
            {
                id: "A_SEBOROIKKERATOSIS_11_30",
                name: "12. Seboroik Keratosis_11-30",
                price: "Rp 1.000.000",
                image: "./images/A_SEBOROIKKERATOSIS.webp",
            },
            {
                id: "A_SEBOROIKKERATOSIS_31_SEWAJAH",
                name: "13. Seboroik Keratosis_31-SEWAJAH",
                price: "Rp 1.500.000",
                image: "./images/A_SEBOROIKKERATOSIS.webp",
            },
            {
                id: "A_BABAK(NEVUSOFOTA)",
                name: "14. Babak (Nevusofota)",
                price: "Rp 350.000",
                image: "./images/A_BABAK(NEVUSOFOTA).webp",
            },
            {
                id: "A_NEVUSOFHORY",
                name: "15. Nevusofhory",
                price: "Rp 350.000",
                image: "./images/A_NEVUSOFHORY.webp",
            },
            {
                id: "A_LENTIGO_1",
                name: "16. Lentigo_1",
                price: "Rp 500.000",
                image: "./images/A_LENTIGO.webp",
            },
            {
                id: "A_LENTIGO_2_7",
                name: "17. Lentigo_2-7",
                price: "Rp 1.000.000",
                image: "./images/A_LENTIGO.webp",
            },
            {
                id: "A_LENTIGO_8_SEWAJAH",
                name: "18. Lentigo_8-SEWAJAH",
                price: "Rp 1.500.000",
                image: "./images/A_LENTIGO.webp",
            },
            {
                id: "A_NODAKOPISUSU(CAVEAULAITMACULE)",
                name: "19. Noda Kopi Susu (Caveau Lait Macule)",
                price: "Rp 500.000",
                image: "./images/A_NODAKOPISUSU(CAVEAULAITMACULE).webp",
            },
            {
                id: "A_GOSONGKARENAJENUHPAKAIKRIMRACIKAN(ONCHRONOSIS)",
                name: "20. Gosong Karena Jenuh Pakai Krim Racikan (Onchronosis)",
                price: "Rp 500.000",
                image: "./images/A_GOSONGKARENAJENUHPAKAIKRIMRACIKAN(ONCHRONOSIS).webp",
            },
            {
                id: "A_NODABEKASLUKA(HIPERPIGMENTASI)",
                name: "21. Noda Bekas Luka (Hiperpigmentasi)",
                price: "Rp 550.000",
                image: "./images/A_NODABEKASLUKA(HIPERPIGMENTASI).webp",
            },
            {
                id: "A_LASERTATO4X4CM",
                name: "22. Laser Tato 4x4cm",
                price: "Rp 350.000",
                image: "./images/A_LASERTATO4X4CM.webp",
            },
            {
                id: "A_XENTALASMA",
                name: "23. Xentalasma",
                price: "Rp 500.000",
                image: "./images/A_XENTALASMA.webp",
            },
            {
                id: "A_BLOODSPOT",
                name: "24. Blood Spot_1-10",
                price: "Rp 500.000",
                image: "./images/A_BLOODSPOT.webp",
            },
            {
                id: "A_BLOODSPOT_11_30",
                name: "25. Blood Spot_11-30",
                price: "Rp 1.000.000",
                image: "./images/A_BLOODSPOT.webp",
            },
            {
                id: "A_BLOODSPOT_31_SEWAJAH",
                name: "26. Blood Spot_31-Sewajah",
                price: "Rp 500.000",
                image: "./images/A_BLOODSPOT.webp",
            },
            {
                id: "A_TOMPEL3X3CM",
                name: "27. Tompel 3x3cm",
                price: "Rp 500.000",
                image: "./images/A_TOMPEL.webp",
            },
            {
                id: "A_MILLIA_1_10",
                name: "28. Millia_1-10",
                price: "Rp 500.000",
                image: "./images/A_MILLIA.webp",
            },
            {
                id: "A_MILLIA_11_30",
                name: "29. Millia_11-30",
                price: "Rp 1.000.000",
                image: "./images/A_MILLIA.webp",
            },
            {
                id: "A_MILLIA_31_SEWAJAH",
                name: "30. Millia_31-SEWAJAH",
                price: "Rp 1.500.000",
                image: "./images/A_MILLIA.webp",
            },
            {
                id: "A_SYRINGOMA_1_10",
                name: "31. Syringoma_1-10",
                price: "Rp 500.000",
                image: "./images/A_SYRINGOMA.webp",
            },
            {
                id: "A_SYRINGOMA_11_30",
                name: "32. Syringoma_11-30",
                price: "Rp 1.000.000",
                image: "./images/A_SYRINGOMA.webp",
            },
            {
                id: "A_SYRINGOMA_31_SEWAJAH",
                name: "33. Syringoma_31-SEWAJAH",
                price: "Rp 1.500.000",
                image: "./images/A_SYRINGOMA.webp",
            },
            {
                id: "A_MATAIKAN(CLAVUS)",
                name: "34. Mata Ikan (Clavus)",
                price: "Rp 500.000",
                image: "./images/A_MATAIKAN(CLAVUS).webp",
            },
            {
                id: "A_KANTUNGMATA(EYEBAG)",
                name: "35. Kantung Mata (Eyebag)",
                price: "Rp 550.000",
                image: "./images/A_KANTUNGMATA(EYEBAG).webp",
            },
            {
                id: "A_KERIPUT(WRINCLE)",
                name: "36. Keriput (Wrincle)",
                price: "Rp 550.000",
                image: "./images/A_KERIPUT(WRINCLE).webp",
            },
            {
                id: "A_STRETCHMARK",
                name: "37. Stretchmark",
                price: "Rp 550.000",
                image: "./images/A_STRETCHMARK.webp",
            },
            {
                id: "A_KOMEDOHITAM(BLACKHEAD)",
                name: "38. Komedo Hitam (Blackhead)",
                price: "Rp 150.000",
                image: "./images/A_KOMEDOHITAM(BLACKHEAD).webp",
            },
            {
                id: "A_KOMEDOPUTIH(WHITEHEAD)",
                name: "39. Komedo Putih (Whitehead)",
                price: "Rp 150.000",
                image: "./images/A_KOMEDOPUTIH(WHITEHEAD).webp",
            },
            {
                id: "A_JERAWAT(ACNE)",
                name: "40. Jerawat (Acne)",
                price: "Rp 250.000",
                image: "./images/A_JERAWAT(ACNE).webp",
            },
            {
                id: "A_NODABEKASJERAWAT(ACNESPOT)",
                name: "41. Noda Bekas Jerawat (Acne Spot)",
                price: "Rp 500.000",
                image: "./images/A_NODABEKASJERAWAT(ACNESPOT).webp",
            },
            {
                id: "A_BOPENG(ACNESCAR)",
                name: "42. Bopeng (Acne Scar)",
                price: "Rp 550.000",
                image: "./images/A_BOPENG(ACNESCAR).webp",
            },
            {
                id: "A_BEKASCACAR(SMALLPOXSCAR)",
                name: "43. Bekas Cacar (Smallpox scar)",
                price: "Rp 550.000",
                image: "./images/A_BEKASCACAR(SMALLPOXSCAR).webp",
            },
            {
                id: "A_BEKASLUKACEKUNG(SCAR)",
                name: "44. Bekas Luka Cekung (Scar)",
                price: "Rp 550.000",
                image: "./images/A_BEKASLUKACEKUNG(SCAR).webp",
            },
            {
                id: "A_KELLOID",
                name: "45. Kelloid",
                price: "Rp 550.000",
                image: "./images/A_KELLOID.webp",
            },
            {
                id: "A_SPIDERVEIN",
                name: "46. Spidervein",
                price: "Rp 350.000",
                image: "./images/A_SPIDERVEIN.webp",
            },
            {
                id: "A_KAPALAN(CALLOUS)",
                name: "47. Kapalan (Callous)",
                price: "Rp 300.000",
                image: "./images/A_KAPALAN(CALLOUS).webp",
            },   
            {
                id: "A_KAKIPECAH-PECAH(FISURA)",
                name: "48. Kaki Pecah-Pecah (Fisura)",
                price: "Rp 300.000",
                image: "./images/A_KAKIPECAH-PECAH(FISURA).webp",
            },
            {
                id: "A_MENCERAHKAN(BRIGHTENING)",
                name: "49. Mencerahkan (Brightening)",
                price: "Rp 350.000",
                image: "./images/A_MENCERAHKAN(BRIGHTENING).webp",
            }, 
            {
                id: "A_CHEMICALPEELING",
                name: "50. Chemical Peeling",
                price: "Rp 500.000",
                image: "./images/A_CHEMICALPEELING.webp",
            },
            {
                id: "A_BB_GLOW",
                name: "51. BB Glow",
                price: "Rp 380.000",
                image: "./images/A_BB_GLOW.webp",
            },
            {
                id: "A_DETOX",
                name: "52. Detox",
                price: "Rp 300.000",
                image: "./images/A_DETOX.webp",
            },
            {
                id: "A_RFSLIMING",
                name: "53. Rfslimng",
                price: "Rp 350.000",
                image: "./images/A_RFSLIMING.webp",
            }
        ]
    },
    perawatan3: {
        title: "Sunat Modern",
        description: "Pilih metode sunat yang sesuai dengan kebutuhan",
        type: "checkbox",
        options: [
            {
                id: "S_RING",
                name: "1. Sunat Ring",
                price: "Rp 1.200.000",
                image: "./images/S_RING.webp",
            },
            {
                id: "S_RING(EXTRAMAINAN)",
                name: "2. Sunat Ring Extra Mainan",
                price: "Rp 1.500.000",
                image: "./images/S_RING(EXTRAMAINAN).webp",
            },
            {
                id: "S_TEKNOSEALER",
                name: "3. Sunat Tekno Sealer",
                price: "Rp 2.500.000",
                image: "./images/S_TEKNOSEALER.webp",
            },
            {
                id: "S_TEKNOSEALER(EXTRAMAINAN)",
                name: "4. Sunat Tekno Sealer Extra Mainan",
                price: "Rp 2.800.000",
                image: "./images/S_TEKNOSEALER(EXTRAMAINAN).webp",
            }
        ]
    },
    perawatan4: {
        title: "Hipnoterapi",
        description: "Pilih jenis terapi hipnoterapi yang sesuai dengan kebutuhan Anda",
        type: "checkbox",
        options: [
            {
                id: "H_BERHENTIJUDOL",
                name: "1. Berhenti Judol",
                price: "Rp 500.000",
                image: "./images/H_BERHENTIJUDOL.webp",
            },
            {
                id: "H_BERHENTIMEROKOK",
                name: "2. Berhenti Merokok",
                price: "Rp 500.000",
                image: "./images/H_BERHENTIMEROKOK.webp",
            },
            {
                id: "H_BERHENTISELINGKUH",
                name: "3. Berhenti Selingkuh",
                price: "Rp 500.000",
                image: "./images/H_BERHENTISELINGKUH.webp",
            },
            {
                id: "H_MELUPAKANMANTAN",
                name: "4. Melupakan Mantan",
                price: "Rp 500.000",
                image: "./images/H_MELUPAKANMANTAN.webp",
            },
            {
                id: "H_MENGHILANGKANFOBIA",
                name: "5. Menghilangkan Fobia",
                price: "Rp 500.000",
                image: "./images/H_MENGHILANGKANFOBIA.webp",
            }
        ]
    },
    perawatan5: {
        title: "Skincare",
        description: "Pilih produk skincare yang sesuai dengan kebutuhan kulit Anda",
        type: "checkbox",
        options: [
            {
                id: "SK_BBCREAMACNE",
                name: "1. BB Cream Acne",
                price: "Rp 160.000",
                image: "./images/SK_BBCREAMACNE.webp",
            },
            {
                id: "SK_FACIALSOAPSALICID",
                name: "2. Facial Soap Salicid",
                price: "Rp 170.000",
                image: "./images/SK_FACIALSOAPSALICID.webp",
            },
            {
                id: "SK_HYDROGENPUDDINGMOISTURIZING",
                name: "3. Hydrogen Pudding Moisturizing",
                price: "Rp 210.000",
                image: "./images/SK_HYDROGENPUDDINGMOISTURIZING.webp",
            },
            {
                id: "SK_KRIMACNEMALAM",
                name: "4. Krim Acne Malam",
                price: "Rp 160.000",
                image: "./images/SK_FACIALSOAPSALICID.webp",
            },
            {
                id: "SK_PAKETPEMBERSIHLIGHTENING",
                name: "5. Paket Pembersih Lightening",
                price: "Rp 440.000",
                image: "./images/SK_PAKETPEMBERSIHLIGHTENING.webp",
            },
            {
                id: "SK_SERUMGLOWING",
                name: "6. Serum Glowing",
                price: "Rp 170.000",
                image: "./images/SK_SERUMGLOWING.webp",
            },
            {
                id: "SK_SUNSCREENACNE",
                name: "7. Sunscreen Acne",
                price: "Rp 150.000",
                image: "./images/SK_SUNSCREENACNE.webp",
            },
            {
                id: "SK_SUNSCREENPUDDING",
                name: "8. Sunscreen Pundding",
                price: "Rp 200.000",
                image: "./images/SK_SUNSCREENPUDDING.webp",
            },
            {
                id: "SK_WHITENING",
                name: "9. Whitening",
                price: "Rp 215.000",
                image: "./images/SK_WHITENING.webp",
            }
        ]
    }
};

// ===== UTILITY FUNCTIONS =====
function extractPrice(priceString) {
    if (!priceString) return 0;
    const match = priceString.match(/(\d+\.?\d*)/g);
    return match ? parseInt(match[0].replace(/\./g, '')) : 0;
}

function detectImageOrientation(imgSrc, callback) {
    const img = new Image();
    
    const timeout = setTimeout(() => {
        callback({
            isPortrait: false,
            isLandscape: true,
            isSquare: false,
            width: 400,
            height: 300,
            aspectRatio: 4/3
        });
    }, 3000);
    
    img.onload = function() {
        clearTimeout(timeout);
        const isPortrait = this.height > this.width;
        const isLandscape = this.width > this.height;
        const isSquare = this.width === this.height;
        
        callback({
            isPortrait,
            isLandscape,
            isSquare,
            width: this.width,
            height: this.height,
            aspectRatio: this.width / this.height
        });
    };
    
    img.onerror = function() {
        clearTimeout(timeout);
        callback({
            isPortrait: false,
            isLandscape: true,
            isSquare: false,
            width: 400,
            height: 300,
            aspectRatio: 4/3
        });
    };
    
    img.src = imgSrc;
}

function getImageContainerClass(orientation) {
    if (orientation.isPortrait) return 'portrait';
    if (orientation.isLandscape) return 'landscape';
    return 'square';
}

// ===== MODAL MANAGEMENT =====
const modalManager = {
    openModal: function(modalId) {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal dengan ID ${modalId} tidak ditemukan`);
            isModalTransitioning = false;
            return;
        }
        
        modal.style.display = 'block';
        modal.scrollTop = 0;
        
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('show');
            isModalTransitioning = false;
        }, 10);
    },
    
    closeModal: function(modalId) {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        
        const modal = document.getElementById(modalId);
        if (!modal) {
            isModalTransitioning = false;
            return;
        }
        
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            if (modalId === 'serviceModal') {
                const modalContent = document.getElementById('serviceModalContent');
                if (modalContent) modalContent.innerHTML = '';
            }
            isModalTransitioning = false;
        }, 300);
    },
    
    closeAll: function() {
        if (isModalTransitioning) return;
        isModalTransitioning = true;
        
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            
            setTimeout(() => {
                modal.style.display = 'none';
                
                if (modal.id === 'serviceModal') {
                    const modalContent = document.getElementById('serviceModalContent');
                    if (modalContent) modalContent.innerHTML = '';
                }
            }, 300);
        });
        
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            isModalTransitioning = false;
        }, 350);
    }
};

// ===== SERVICE DETAIL MODAL FUNCTIONS =====
function showServiceDetail(serviceId) {
    if (isModalTransitioning) return;
    
    const service = serviceDetails[serviceId];
    if (!service) {
        console.error(`Service dengan ID ${serviceId} tidak ditemukan`);
        showNotification('❌ Layanan tidak ditemukan', 'error');
        return;
    }

    const modalContent = document.getElementById('serviceModalContent');
    if (!modalContent) {
        console.error('Element serviceModalContent tidak ditemukan');
        return;
    }

    modalContent.innerHTML = `
        <div class="loading-state">
            <div class="loading-icon">⏳</div>
            <h3>Memuat Layanan...</h3>
            <p>Sedang memuat detail layanan yang dipilih</p>
        </div>
    `;

    modalManager.openModal('serviceModal');

    if (service.type === "checkbox") {
        const orientationPromises = service.options.map(option => {
            return new Promise((resolve) => {
                detectImageOrientation(option.image, (orientation) => {
                    resolve({
                        option,
                        orientation
                    });
                });
            });
        });

        Promise.all(orientationPromises)
            .then(results => {
                renderServiceOptions(serviceId, service, results);
            })
            .catch(error => {
                console.error('Error loading service details:', error);
                showErrorState(service);
            });
    }
}

function renderServiceOptions(serviceId, service, results) {
    const optionsHTML = results.map(({ option, orientation }) => {
        const containerClass = getImageContainerClass(orientation);
        
        return `
            <div class="option-card" onclick="toggleOptionSelection('${option.id}')">
                <div class="option-header">
                    <div class="option-checkbox">
                        <input type="checkbox" id="${option.id}" name="service-option" value="${option.id}" 
                               onclick="event.stopPropagation(); updateSelectionSummary('${serviceId}')">
                    </div>
                    <div class="option-image-container ${containerClass}">
                        <img src="${option.image}" alt="${option.name}" 
                             loading="lazy"
                             onload="this.style.opacity='1'"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjhmOGY4IiByeD0iMjAiLz4KPHRleHQgeD0iMjAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K'; this.style.opacity='1'"
                             style="opacity: 0; transition: opacity 0.3s ease">
                    </div>
                    <div class="option-title">
                        <h3>${option.name}</h3>
                    </div>
                </div>
                
                <div class="option-details">
                    <div class="option-price">
                        <strong>💰 Harga:</strong> ${option.price}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const content = `
        <div class="service-modal-header">
            <h2>${service.title}</h2>
            <p class="service-description">${service.description}</p>
            <p class="selection-info">✅ Pilih satu atau beberapa perawatan dengan mengklik card-nya</p>
        </div>
        
        <div class="options-container">
            ${optionsHTML}
        </div>
        
        <div class="selection-summary" id="selectionSummary" style="display: none;">
            <h4>📋 Perawatan yang Dipilih:</h4>
            <div id="selectedOptionsList"></div>
            <div class="total-price">
                <strong>💰 Total Estimasi: <span id="totalPrice">Rp 0</span></strong>
            </div>
        </div>
        
        <div class="service-modal-footer">
            <button class="cta-button secondary" onclick="modalManager.closeAll()">
                ← Kembali
            </button>
            <button class="cta-button" id="bookingBtn" onclick="proceedToBooking('${serviceId}')" disabled style="opacity: 0.6; cursor: not-allowed;">
                📅 Lanjut ke Booking
            </button>
        </div>
    `;

    const modalContent = document.getElementById('serviceModalContent');
    if (!modalContent) return;

    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.innerHTML = content;
        modalContent.style.opacity = '1';
        
        if (service.type === "checkbox") {
            attachCheckboxListeners(serviceId);
        }
        
        updateSelectionSummary(serviceId);
    }, 200);
}

function showErrorState(service) {
    const modalContent = document.getElementById('serviceModalContent');
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div class="error-state">
            <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
            <h3>Gagal Memuat Layanan</h3>
            <p>Terjadi kesalahan saat memuat detail layanan. Silakan coba lagi.</p>
            <button class="cta-button" onclick="modalManager.closeAll()" style="margin-top: 1rem;">
                Tutup
            </button>
        </div>
    `;
}

function toggleOptionSelection(optionId) {
    const checkbox = document.getElementById(optionId);
    if (!checkbox) return;

    checkbox.checked = !checkbox.checked;
    
    const optionCard = checkbox.closest('.option-card');
    if (optionCard) {
        if (checkbox.checked) {
            optionCard.classList.add('selected');
        } else {
            optionCard.classList.remove('selected');
        }
    }
    
    const serviceId = Object.keys(serviceDetails).find(id => 
        serviceDetails[id].options.some(opt => opt.id === optionId)
    );
    if (serviceId) {
        updateSelectionSummary(serviceId);
    }
}

function attachCheckboxListeners(serviceId) {
    const checkboxes = document.querySelectorAll('input[name="service-option"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const optionCard = this.closest('.option-card');
            if (optionCard) {
                if (this.checked) {
                    optionCard.classList.add('selected');
                } else {
                    optionCard.classList.remove('selected');
                }
            }
            updateSelectionSummary(serviceId);
        });
    });
}

function updateSelectionSummary(serviceId) {
    const service = serviceDetails[serviceId];
    if (!service) return;

    const selectedCheckboxes = document.querySelectorAll('input[name="service-option"]:checked');
    const bookingBtn = document.getElementById('bookingBtn');
    const selectionSummary = document.getElementById('selectionSummary');
    const selectedOptionsList = document.getElementById('selectedOptionsList');
    const totalPriceElement = document.getElementById('totalPrice');

    if (bookingBtn) {
        bookingBtn.disabled = selectedCheckboxes.length === 0;
        
        if (selectedCheckboxes.length > 0) {
            bookingBtn.style.opacity = "1";
            bookingBtn.style.cursor = "pointer";
            bookingBtn.innerHTML = `📅 Lanjut ke Booking (${selectedCheckboxes.length})`;
        } else {
            bookingBtn.style.opacity = "0.6";
            bookingBtn.style.cursor = "not-allowed";
            bookingBtn.innerHTML = `📅 Lanjut ke Booking`;
        }
    }
    
    if (selectedCheckboxes.length > 0) {
        if (selectionSummary) selectionSummary.style.display = 'block';
        
        let optionsHTML = '';
        let totalPrice = 0;
        
        selectedCheckboxes.forEach(checkbox => {
            const option = service.options.find(opt => opt.id === checkbox.value);
            if (option) {
                optionsHTML += `
                    <div class="selected-option">
                        <span class="option-name">${option.name}</span>
                        <span class="option-price">${option.price}</span>
                    </div>
                `;
                
                totalPrice += extractPrice(option.price);
            }
        });
        
        if (selectedOptionsList) selectedOptionsList.innerHTML = optionsHTML;
        if (totalPriceElement) {
            totalPriceElement.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
        }
        
    } else {
        if (selectionSummary) selectionSummary.style.display = 'none';
    }
}

function proceedToBooking(serviceId) {
    console.log('Memproses booking untuk service:', serviceId);
    
    const service = serviceDetails[serviceId];
    if (!service) {
        console.error('Service tidak ditemukan:', serviceId);
        showNotification('❌ Gagal memproses booking. Service tidak ditemukan.', 'error');
        return;
    }

    const selectedCheckboxes = document.querySelectorAll('input[name="service-option"]:checked');
    const selectedOptions = [];
    
    console.log('Jumlah opsi terpilih:', selectedCheckboxes.length);
    
    selectedCheckboxes.forEach(checkbox => {
        const option = service.options.find(opt => opt.id === checkbox.value);
        if (option) {
            selectedOptions.push({
                id: option.id,
                name: option.name,
                price: option.price
            });
            console.log('Opsi terpilih:', option.name);
        }
    });
    
    if (selectedOptions.length === 0) {
        showNotification('❌ Silakan pilih minimal satu perawatan sebelum booking.', 'warning');
        return;
    }
    
    const bookingData = {
        serviceId: serviceId,
        serviceName: service.title,
        selectedOptions: selectedOptions,
        type: 'checkbox',
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('selectedService', JSON.stringify(bookingData));
        console.log('Data booking disimpan:', bookingData);
        showBookingForm();
    } catch (error) {
        console.error('Error menyimpan data booking:', error);
        showNotification('❌ Gagal menyimpan data booking.', 'error');
    }
}

// ===== BOOKING FORM FUNCTIONS =====
function showBookingForm() {
    let selectedData;
    try {
        selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    } catch (error) {
        console.error('Error parsing selectedService:', error);
        selectedData = {};
    }
    
    console.log('Data yang akan ditampilkan di form:', selectedData);
    
    if (!selectedData.serviceId || !selectedData.selectedOptions) {
        showNotification('❌ Data booking tidak valid. Silakan pilih layanan kembali.', 'error');
        modalManager.closeAll();
        return;
    }
    
    const timeOptions = generateTimeOptions();
    const today = new Date().toISOString().split('T')[0];
    
    const servicesHTML = selectedData.selectedOptions.map(option => `
        <div class="service-summary-item">
            <div>
                <strong>${option.name}</strong>
            </div>
            <span class="service-price">${option.price}</span>
        </div>
    `).join('');

    const content = `
        <div class="booking-form-modal">
            <div class="booking-header">
                <h2>📋 Formulir Booking Perawatan</h2>
                <p class="form-description">Lengkapi data diri Anda untuk melanjutkan booking</p>
            </div>
            
            <div class="selected-services-summary">
                <h4>🛍️ Layanan yang Dipilih:</h4>
                ${servicesHTML}
            </div>
            
            <form id="patientBookingForm" class="booking-form">
                <div class="form-section">
                    <h4>👤 Data Diri Pasien</h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="patientName">Nama Lengkap *</label>
                            <input type="text" id="patientName" name="patientName" required 
                                   placeholder="Masukkan nama lengkap">
                        </div>
                        <div class="form-group">
                            <label for="patientPhone">Nomor Telepon *</label>
                            <input type="tel" id="patientPhone" name="patientPhone" required 
                                   placeholder="Contoh: 081234567890">
                        </div>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="patientAddress">Alamat Lengkap *</label>
                        <textarea id="patientAddress" name="patientAddress" rows="4" required 
                                  placeholder="Masukkan alamat lengkap (jalan, RT/RW, kelurahan, kecamatan, kota)"></textarea>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>📅 Jadwal Perawatan</h4>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="appointmentDate">Tanggal Perawatan *</label>
                            <input type="date" id="appointmentDate" name="appointmentDate" 
                                   min="${today}" required>
                            <small class="date-note">Pilih tanggal mulai hari ini</small>
                        </div>
                        <div class="form-group">
                            <label for="appointmentTime">Jam Perawatan *</label>
                            <select id="appointmentTime" name="appointmentTime" required>
                                <option value="">Pilih Jam</option>
                                ${timeOptions}
                            </select>
                            <small class="time-note">Jam praktik: 08:00 - 17:00</small>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>📝 Informasi Tambahan</h4>
                    <div class="form-group full-width">
                        <label for="patientNotes">Catatan Tambahan (opsional)</label>
                        <textarea id="patientNotes" name="patientNotes" rows="4" 
                                  placeholder="Keluhan khusus, alergi, riwayat penyakit, atau informasi lain yang perlu kami ketahui..."></textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cta-button secondary" onclick="goBackToServiceSelection()">
                        ← Kembali ke Pilihan Layanan
                    </button>
                    <button type="submit" class="cta-button">
                        📅 Konfirmasi Booking
                    </button>
                </div>
            </form>
        </div>
    `;

    const modalContent = document.getElementById('serviceModalContent');
    if (!modalContent) return;

    modalContent.innerHTML = content;
    
    setDefaultAppointmentDate();
    setupFormValidation();
    
    const form = document.getElementById('patientBookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBookingForm();
        });
    }
}

function generateTimeOptions() {
    let options = '';
    for (let hour = 8; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 17 && minute > 0) break;
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            options += `<option value="${time}">${time}</option>`;
        }
    }
    return options;
}

function setDefaultAppointmentDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.value = tomorrowFormatted;
    }
}

function setupFormValidation() {
    const phoneInput = document.getElementById('patientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length < 10 || this.value.length > 13) {
                this.setCustomValidity('Nomor telepon harus 10-13 digit');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', function(e) {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.setCustomValidity('Tidak bisa memilih tanggal yang sudah lewat');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '' && this.checkValidity()) {
                this.style.borderColor = '#4CAF50';
            } else if (this.checkValidity() === false) {
                this.style.borderColor = '#ff6b6b';
            }
        });
    });
}

function goBackToServiceSelection() {
    let selectedData;
    try {
        selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    } catch (error) {
        selectedData = {};
    }
    
    if (selectedData.serviceId) {
        showServiceDetail(selectedData.serviceId);
    } else {
        modalManager.closeAll();
    }
}

function submitBookingForm() {
    const form = document.getElementById('patientBookingForm');
    if (!form) return;

    const formData = new FormData(form);
    let selectedData;
    
    try {
        selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    } catch (error) {
        selectedData = {};
    }
    
    if (!validateBookingForm(formData)) {
        return;
    }
    
    const bookingData = {
        bookingId: 'BK' + Date.now(),
        patientInfo: {
            name: formData.get('patientName'),
            phone: formData.get('patientPhone'),
            address: formData.get('patientAddress'),
            notes: formData.get('patientNotes') || 'Tidak ada catatan'
        },
        appointmentInfo: {
            date: formData.get('appointmentDate'),
            time: formData.get('appointmentTime'),
            datetime: new Date(formData.get('appointmentDate') + 'T' + formData.get('appointmentTime'))
        },
        serviceInfo: selectedData,
        status: 'pending',
        bookingDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    if (saveBookingToStorage(bookingData)) {
        showBookingConfirmation(bookingData);
        localStorage.removeItem('selectedService');
    }
}

function validateBookingForm(formData) {
    const name = formData.get('patientName');
    const phone = formData.get('patientPhone');
    const address = formData.get('patientAddress');
    const date = formData.get('appointmentDate');
    const time = formData.get('appointmentTime');
    
    if (!name || !phone || !address || !date || !time) {
        showNotification('Harap lengkapi semua field yang wajib diisi', 'error');
        return false;
    }
    
    const nameWords = name.trim().split(/\s+/);
    if (nameWords.length < 2) {
        showNotification('Harap masukkan nama lengkap (minimal 2 kata)', 'error');
        return false;
    }
    
    if (phone.length < 10 || phone.length > 13) {
        showNotification('Nomor telepon harus 10-13 digit', 'error');
        return false;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Tidak bisa memilih tanggal yang sudah lewat', 'error');
        return false;
    }
    
    return true;
}

// ===== DATA MANAGEMENT =====
function saveBookingToStorage(bookingData) {
    try {
        const existingBookings = JSON.parse(localStorage.getItem('klinikBookings') || '[]');
        
        const isDuplicate = existingBookings.some(booking => 
            booking.patientInfo.phone === bookingData.patientInfo.phone &&
            booking.serviceInfo.serviceId === bookingData.serviceInfo.serviceId &&
            booking.appointmentInfo.date === bookingData.appointmentInfo.date
        );
        
        if (isDuplicate) {
            showNotification('Anda sudah memiliki booking untuk layanan ini di tanggal yang sama', 'warning');
            return false;
        }
        
        existingBookings.push(bookingData);
        localStorage.setItem('klinikBookings', JSON.stringify(existingBookings));
        
        showNotification('🎉 Booking berhasil disimpan! Kami akan menghubungi Anda dalam 1x24 jam.', 'success');
        return true;
        
    } catch (error) {
        console.error('Error saving booking:', error);
        showNotification('❌ Terjadi error saat menyimpan booking', 'error');
        return false;
    }
}

function showBookingConfirmation(bookingData) {
    const appointmentDate = new Date(bookingData.appointmentInfo.datetime);
    const formattedDate = appointmentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const servicesHTML = bookingData.serviceInfo.selectedOptions ? bookingData.serviceInfo.selectedOptions.map(option => `
        <div class="detail-item">
            <span><strong>${option.name}</strong></span>
            <span>${option.price}</span>
        </div>
    `).join('') : '';
    
    const content = `
        <div class="confirmation-modal">
            <div class="confirmation-icon">✅</div>
            <h2>Booking Berhasil!</h2>
            
            <div class="confirmation-details">
                <div class="detail-item">
                    <strong>Nomor Booking:</strong>
                    <span>${bookingData.bookingId}</span>
                </div>
                <div class="detail-item">
                    <strong>Nama Pasien:</strong>
                    <span>${bookingData.patientInfo.name}</span>
                </div>
                <div class="detail-item">
                    <strong>Telepon:</strong>
                    <span>${bookingData.patientInfo.phone}</span>
                </div>
                <div class="detail-item">
                    <strong>Layanan:</strong>
                    <span>${bookingData.serviceInfo.serviceName}</span>
                </div>
                ${servicesHTML}
                <div class="detail-item">
                    <strong>Tanggal & Jam:</strong>
                    <span>${formattedDate}, ${bookingData.appointmentInfo.time}</span>
                </div>
                <div class="detail-item">
                    <strong>Status:</strong>
                    <span class="status-pending">Menunggu Konfirmasi</span>
                </div>
            </div>
            
            <div class="confirmation-message">
                <p>📞 <strong>Konfirmasi Booking:</strong> Kami akan menghubungi Anda di <strong>${bookingData.patientInfo.phone}</strong> 
                   dalam 1x24 jam untuk konfirmasi jadwal.</p>
                <p>📍 <strong>Ketentuan:</strong> Pastikan Anda datang 15 menit sebelum jadwal perawatan.</p>
                <p>💳 <strong>Pembayaran:</strong> Siapkan pembayaran sesuai dengan layanan yang dipilih.</p>
                <p>📝 <strong>Catatan:</strong> ${bookingData.patientInfo.notes}</p>
            </div>
            
            <div class="confirmation-actions">
                <button class="cta-button secondary" onclick="printBookingDetails('${bookingData.bookingId}')">
                    🖨️ Cetak Detail Booking
                </button>
                <button class="cta-button" onclick="modalManager.closeAll(); showNotification('Terima kasih telah membooking layanan kami!', 'success')">
                    👍 Tutup & Selesai
                </button>
            </div>
        </div>
    `;

    const modalContent = document.getElementById('serviceModalContent');
    if (modalContent) {
        modalContent.innerHTML = content;
    }
}

function printBookingDetails(bookingId) {
    let bookings = [];
    try {
        bookings = JSON.parse(localStorage.getItem('klinikBookings') || '[]');
    } catch (error) {
        console.error('Error parsing bookings:', error);
    }
    
    const booking = bookings.find(b => b.bookingId === bookingId);
    
    if (booking) {
        const printWindow = window.open('', '_blank');
        const servicesHTML = booking.serviceInfo.selectedOptions ? booking.serviceInfo.selectedOptions.map(option => `
            <div style="background: #f9f9f9; padding: 12px; margin: 8px 0; border-radius: 8px; border-left: 4px solid #3aaff3;">
                <div style="font-weight: bold; font-size: 14px;">${option.name}</div>
                <div style="color: #666; font-size: 13px;">${option.price}</div>
            </div>
        `).join('') : '';
        
        const printContent = `
            <html>
                <head>
                    <title>Booking Confirmation - ${booking.bookingId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 30px; line-height: 1.6; color: #333; }
                        .header { text-align: center; border-bottom: 4px solid #3aaff3; padding-bottom: 20px; margin-bottom: 30px; }
                        .details { margin: 30px 0; }
                        .detail-item { margin: 15px 0; padding: 12px 0; border-bottom: 2px solid #eee; display: flex; justify-content: space-between; font-size: 14px; }
                        .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; padding-top: 20px; border-top: 2px solid #ddd; }
                        .status { background: #fff3e0; color: #ff9800; padding: 6px 15px; border-radius: 25px; font-weight: bold; font-size: 12px; border: 2px solid #ff9800; }
                        @media print { 
                            body { margin: 20px; }
                            .header { border-bottom-color: #000; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1 style="margin: 0; color: #3aaff3; font-size: 28px;">Alra Care</h1>
                        <h2 style="margin: 10px 0; color: #333; font-size: 22px;">Konfirmasi Booking</h2>
                        <p style="margin: 0; color: #666; font-size: 16px;">Kesehatan & Kecantikan Profesional</p>
                    </div>
                    <div class="details">
                        <div class="detail-item"><strong>Nomor Booking:</strong> <span>${booking.bookingId}</span></div>
                        <div class="detail-item"><strong>Nama Pasien:</strong> <span>${booking.patientInfo.name}</span></div>
                        <div class="detail-item"><strong>Telepon:</strong> <span>${booking.patientInfo.phone}</span></div>
                        <div class="detail-item"><strong>Alamat:</strong> <span>${booking.patientInfo.address}</span></div>
                        <div class="detail-item"><strong>Tanggal:</strong> <span>${booking.appointmentInfo.date}</span></div>
                        <div class="detail-item"><strong>Jam:</strong> <span>${booking.appointmentInfo.time}</span></div>
                        <div class="detail-item">
                            <strong>Layanan:</strong> 
                            <span>${booking.serviceInfo.serviceName}</span>
                        </div>
                        ${servicesHTML}
                        <div class="detail-item"><strong>Catatan:</strong> <span>${booking.patientInfo.notes}</span></div>
                        <div class="detail-item"><strong>Status:</strong> <span class="status">Menunggu Konfirmasi</span></div>
                    </div>
                    <div class="footer">
                        <p style="font-weight: bold; font-size: 14px;">Harap datang 15 menit sebelum jadwal perawatan</p>
                        <p>Bawa bukti booking ini saat datang ke klinik</p>
                        <p>Terima kasih atas kepercayaan Anda kepada Alra Care</p>
                        <p>Jl. Purnama No. 16, Pontianak • 0813-8122-3811</p>
                        <p>www.alracare.com • rahmadramadhanaswin@gmail.com</p>
                    </div>
                </body>
            </html>
        `;
        
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        
        if (type === 'error') {
            notification.style.borderLeftColor = '#ff6b6b';
            notification.style.background = '#ffeaea';
        } else if (type === 'success') {
            notification.style.borderLeftColor = '#4CAF50';
            notification.style.background = '#f0f9f0';
        } else if (type === 'warning') {
            notification.style.borderLeftColor = '#ff9800';
            notification.style.background = '#fff3e0';
        } else {
            notification.style.borderLeftColor = '#2c7873';
            notification.style.background = '#f0f9f0';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
}

// ===== NAVIGATION FUNCTIONS =====
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

function showBookingModal() {
    let selectedData;
    try {
        selectedData = JSON.parse(localStorage.getItem('selectedService') || '{}');
    } catch (error) {
        selectedData = {};
    }
    
    if (selectedData.serviceId) {
        showBookingForm();
    } else {
        showNotification('Silakan pilih layanan terlebih dahulu', 'warning');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#admin' || href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('serviceModal');
        if (event.target === modal) {
            modalManager.closeAll();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modalManager.closeAll();
        }
    });

    console.log('Alra Care Public Website initialized successfully!');
});