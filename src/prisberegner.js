/* Definere priserne for de enkelte tillægsydelser */
const priser = {
    hjemmeside: {
        base: 2500,
        ekstraSide: 400,
        leveringstid: {
            "2 uger": 2000,
            "3-5 uger": 1000,
            "6+ uger": 0
        },
        funktioner: { ja: 1500, nej: 0, "ikke sikker": 750 },
        sprog: { ja: 2000, nej: 0 },
        seo: { ja: 2000, nej: 0, "ikke sikker": 500 }
    },
    webshop: {
        base: 5000,
        type: {
            "mindre hobbyprojekt": 2000,
            "mellemstor webshop": 5000,
            "større webshop med flere ansatte": 10000
        },
        produkter: 100,
        funktioner: { ja: 3000, nej: 0, "ikke sikker": 1000 },
        sprog: { ja: 2000, nej: 0 },
        leveringstid: {
            "2 uger": 6000,
            "3-5 uger": 3000,
            "6+ uger": 0
        },
        seo: { ja: 3000, nej: 0, "ikke sikker": 750 }
    }
};

let projectData = {};

/* Funktion der håndterer næste trin i beregneren */
function nextStep(step, value = null) {
if (value) {
projectData[step] = value;
}

/* Skjul alle trin og viser det næste */
const steps = document.querySelectorAll('.step');
steps.forEach(step => step.classList.add('hidden'));

/* Vis det næste step baseret på type */
if (step === 'projectType') {
if (projectData.projectType === "hjemmeside") {
    document.getElementById('hjemmeside-form').classList.remove('hidden');
} else {
    document.getElementById('webshop-form').classList.remove('hidden');
}
} else if (step === 'extraPages') {
projectData.extraPages = document.getElementById('extra-pages').value;
document.getElementById('leveringstid').classList.remove('hidden');
} else if (step === 'webshopType') {
document.getElementById('antal-produkter-webshop').classList.remove('hidden');
} else if (step === 'products') {
document.getElementById('leveringstid').classList.remove('hidden');
} else if (step === 'leveringstid') {
document.getElementById('funktioner-webshop').classList.remove('hidden');
} else if (step === 'funktioner') {
document.getElementById('sprog').classList.remove('hidden');
} else if (step === 'sprog') {
document.getElementById('seo').classList.remove('hidden');
} else if (step === 'seo') {
document.getElementById('result').classList.remove('hidden');
calculatePrice(); 
}
}


/* Funktion der viser antallet at siderne i slideren */
function updateSliderValue(sliderId, value) {
document.getElementById(sliderId + '-value').textContent = value + " sider";  // Opdater tekst til at vise det aktuelle antal sider
projectData.extraPages = value;  // Opdater det valgte antal sider i projectData
updatePrice();  // Opdater prisen med det nye antal sider
}


/* Viser antallet af produkter */
function updateProductCount(value) {
    document.getElementById('products-value').textContent = value + " produkter";
    projectData.products = value;  // Opdater produkterne for webshop
}

/* Funktion der beregner den endelige pris */
function calculatePrice() {

let totalPrice = 0;

/* Beregningen for hjemmesider */
if (projectData.projectType === "hjemmeside") {
totalPrice += priser.hjemmeside.base || 0;
totalPrice += (projectData.extraPages || 0) * priser.hjemmeside.ekstraSide;
totalPrice += priser.hjemmeside.leveringstid[projectData.leveringstid] || 0;

/* Funktioner */
totalPrice += priser.hjemmeside.funktioner[projectData.funktioner] || 0;

/* Sprog */
totalPrice += priser.hjemmeside.sprog[projectData.sprog] || 0;

/* SEO */
totalPrice += priser.hjemmeside.seo[projectData.seo] || 0;

} 
/* Beregningen for webshop */
else if (projectData.projectType === "webshop") {
totalPrice += priser.webshop.base || 0;
totalPrice += priser.webshop.type[projectData.webshopType] || 0;
totalPrice += (projectData.products || 0) * priser.webshop.produkter;
totalPrice += priser.webshop.leveringstid[projectData.leveringstid] || 0;

/* Funktioner */
totalPrice += priser.webshop.funktioner[projectData.funktioner] || 0;

/* Sprog */
totalPrice += priser.webshop.sprog[projectData.sprog] || 0;

/* SEO */
totalPrice += priser.webshop.seo[projectData.seo] || 0;
}

/* Viser den endelig pris i DKK (Ellers en fejlmeddelelse) */
if (totalPrice > 0) {
document.getElementById("price").textContent = totalPrice + " DKK";
} else {
document.getElementById("price").textContent = "Fejl i beregningen";
}
}
