// Configuration
const accessKey = ""; // Not needed for this public API, but kept for structure
const API_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Element Selectors
const fromCurrency = document.querySelector("#from-dropdown");
const toCurrency = document.querySelector("#to-dropdown");
const amountInput = document.querySelector("#Amount-input");
const convertBtn = document.querySelector("#convert-btn");
const swapBtn = document.querySelector("#convert-pic");
const conversionResult = document.querySelector("#conversion-result");
const loader = document.querySelector("#loader");
const fromImg = document.querySelector("#from-img");
const toImg = document.querySelector("#to-img");

// Initialize dropdowns from countryList (defined in Codes.js)
function populateDropdowns() {
    [fromCurrency, toCurrency].forEach(select => {
        for (let currCode in countryList) {
            const option = document.createElement("option");
            option.innerText = `${currCode} - ${countryList[currCode][0]}`;
            option.value = currCode;
            
            // Set defaults: PKR to USD
            if (select.id === "from-dropdown" && currCode === "PKR") option.selected = true;
            if (select.id === "to-dropdown" && currCode === "USD") option.selected = true;
            
            select.append(option);
        }

        select.addEventListener("change", (e) => updateFlag(e.target));
    });
}

// Update flag image based on selected country
function updateFlag(element) {
    const currCode = element.value;
    const countryCode = countryList[currCode][1];
    const img = element.previousElementSibling;
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Main conversion logic
async function performConversion() {
    let amountVal = amountInput.value;
    if (amountVal === "" || amountVal <= 0) {
        amountInput.value = "1";
        amountVal = 1;
    }

    // Premium Loading Experience
    loader.classList.remove("hidden");
    const card = document.querySelector(".converter-card");
    card.style.filter = "blur(4px)";
    card.style.pointerEvents = "none";

    try {
        const fromCode = fromCurrency.value.toLowerCase();
        const toCode = toCurrency.value.toLowerCase();
        const url = `${API_URL}/${fromCode}.json`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("API call failed");
        
        const data = await response.json();
        const rate = data[fromCode][toCode];
        const result = (amountVal * rate);

        // Formatting result
        let formattedResult;
        if (result > 1e10) formattedResult = result.toExponential(2);
        else if (result > 1) formattedResult = result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        else formattedResult = result.toFixed(6);

        // Delay for premium feel
        setTimeout(() => {
            conversionResult.innerText = `${amountVal} ${fromCurrency.value} = ${formattedResult} ${toCurrency.value}`;
            conversionResult.style.display = "flex";
            
            // Reset UI
            card.style.filter = "none";
            card.style.pointerEvents = "all";
            loader.classList.add("hidden");
        }, 600);

    } catch (error) {
        console.error("Conversion Error:", error);
        conversionResult.innerText = "Error fetching rates. Please try again.";
        conversionResult.style.display = "flex";
        card.style.filter = "none";
        card.style.pointerEvents = "all";
        loader.classList.add("hidden");
    }
}

// Event Listeners
document.querySelector(".converter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    performConversion();
});

swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    updateFlag(fromCurrency);
    updateFlag(toCurrency);
    
    // Auto-convert on swap if result is already showing
    if (conversionResult.style.display === "flex") {
        performConversion();
    }
});

// Initialize on load
window.addEventListener("load", () => {
    populateDropdowns();
});