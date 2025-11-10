/**
 * calculator.js
 * Contains the logic for the Endotoxin MU Calculator.
 */

// Define the Expanded Uncertainty (k=2) values from the source data for convenience
const EXPANDED_UNCERTAINTIES = {
    '1': 0.058971,  // For 1X Dilution
    '10': 0.060709, // For 10X Dilution
    '25': 0.055825  // For 25X Dilution
};

function updateUncertaintyPlaceholder() {
    const dilution = document.getElementById('sampleDilution').value;
    const uncertaintyInput = document.getElementById('expandedUncertaintyLog10');
    
    // Set the placeholder/value based on the selected dilution factor
    uncertaintyInput.value = EXPANDED_UNCERTAINTIES[dilution];
}

function calculateEndotoxinMU() {
    // 1. Get input values
    const resultEU = parseFloat(document.getElementById('resultEU').value) || 0;
    const expandedUncertaintyLog10 = parseFloat(document.getElementById('expandedUncertaintyLog10').value) || 0;

    // Basic Input Validation
    if (resultEU <= 0 || expandedUncertaintyLog10 <= 0) {
        displayError("Please ensure Result (EU/mL) and Expanded Uncertainty (Log10) are positive values.");
        return;
    }
    
    // --- 2. Perform Calculations ---

    // A. Log10 of Result
    const log10Result = Math.log10(resultEU);

    // B. MU of the sample (Log10) interval
    const uncertaintyIntervalLog10Lower = log10Result - expandedUncertaintyLog10;
    const uncertaintyIntervalLog10Upper = log10Result + expandedUncertaintyLog10;

    // C. Convert Log10 Interval back to EU/mL (10^Log10)
    const muSampleEULower = Math.pow(10, uncertaintyIntervalLog10Lower);
    const muSampleEUUpper = Math.pow(10, uncertaintyIntervalLog10Upper);

    // --- 3. Display Results (Formatting based on image precision) ---
    
    // Report Result (Log10) - 4 decimal places
    document.getElementById('log10Result').textContent = log10Result.toFixed(4);

    // Report Result (EU/mL) - 1 decimal place for value, 4 for uncertainty (from Log10 input)
    document.getElementById('reportResultEU').textContent = resultEU.toFixed(1);
    document.getElementById('reportUncertaintyEU').textContent = expandedUncertaintyLog10.toFixed(4); // Displaying the Log10 uncertainty for context

    // MU of the sample (EU/mL) - 3 decimal places (based on 49.889)
    const formattedMULower = muSampleEULower.toFixed(3);
    const formattedMUUpper = muSampleEUUpper.toFixed(3);
    document.getElementById('muLower').textContent = formattedMULower;
    document.getElementById('muUpper').textContent = formattedMUUpper;

    // Uncertainty Interval (EU/mL) - 3 decimal places (matching the MU fields)
    // NOTE: Unlike the Bioburden calc, the Endotoxin example does NOT round to integer, 
    // it simply displays the calculated MU values.
    document.getElementById('intervalLower').textContent = formattedMULower;
    document.getElementById('intervalUpper').textContent = formattedMUUpper;
}

function displayError(message) {
    // Clear and display an error message
    document.getElementById('log10Result').textContent = 'ERR';
    document.getElementById('reportResultEU').textContent = 'ERR';
    document.getElementById('reportUncertaintyEU').textContent = 'ERR';
    document.getElementById('muLower').textContent = 'ERR';
    document.getElementById('muUpper').textContent = 'ERR';
    document.getElementById('intervalLower').textContent = 'ERR';
    document.getElementById('intervalUpper').textContent = 'ERR';
    alert(message);
}
