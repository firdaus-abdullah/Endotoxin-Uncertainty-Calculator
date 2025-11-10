/**
 * Endotoxin Uncertainty Calculator - calculator.js
 * * Data extracted from the Endotoxin MU Calculation images.
 * The 'combined_u' is the Relative Combined Standard Uncertainty (uc/x) from the table, 
 * which is then multiplied by the Result (x) to get the absolute uc.
 * The 'expanded_u_log10' is the value used to calculate the uncertainty interval.
 */

const uncertaintyData = {
    // These values are the 'Combined uncertainty' (uc/x) and 'Expanded uncertainty, k=2' (Expanded Uncertainty Value (Log10)) 
    // extracted from the image data for each dilution.
    "1X": {
        combined_u_relative: 0.0295, // Combined uncertainty (uc/x)
        expanded_u_log10: 0.0590     // Expanded uncertainty, k=2 (U/x)
    },
    "10X": {
        combined_u_relative: 0.0304, // Combined uncertainty (uc/x)
        expanded_u_log10: 0.0608     // Expanded uncertainty, k=2 (U/x)
    },
    "25X": {
        combined_u_relative: 0.0279, // Combined uncertainty (uc/x)
        expanded_u_log10: 0.0558     // Expanded uncertainty, k=2 (U/x)
    }
};

/**
 * Performs the Endotoxin Measurement Uncertainty (MU) calculations.
 */
function calculateUncertainty() {
    // 1. Get user inputs
    const selectedDilution = document.getElementById('dilution').value;
    const result = parseFloat(document.getElementById('result').value);

    // Get the uncertainty constants for the selected dilution
    const data = uncertaintyData[selectedDilution];
    
    // Validate inputs
    if (isNaN(result) || result <= 0) {
        document.getElementById('uc_value').textContent = 'Invalid Result';
        document.getElementById('relative_uc_value').textContent = '';
        document.getElementById('expanded_log10_value').textContent = 'N/A';
        document.getElementById('report_result_with_mu').textContent = 'N/A';
        document.getElementById('interval_low').textContent = 'N/A';
        document.getElementById('interval_high').textContent = 'N/A';
        return;
    }

    // --- Core Calculations ---
    
    // 2. Calculate Combined Standard Uncertainty (uc) - Absolute Value
    // Formula from the spreadsheet structure: uc/x * x = uc (Absolute)
    const absolute_uc = data.combined_u_relative * result;
    
    // 3. Calculate Expanded Uncertainty (U) - Absolute Value
    // The spreadsheet uses the 'Expanded uncertainty, k=2' value which is U/x (Relative Expanded Uncertainty)
    // Formula: U/x * x = U (Absolute)
    const absolute_U = data.expanded_u_log10 * result;
    
    // 4. Calculate the Log10 Expanded Uncertainty Value
    // This value is the one reported directly in the yellow cell of the spreadsheet.
    // It is the Relative Expanded Uncertainty (U/x) * 100 to make it a percentage, 
    // or simply the value 'Expanded uncertainty, k=2' from the table.
    const expanded_log10_value = data.expanded_u_log10;

    // 5. Calculate the Uncertainty Interval (MU of the sample)
    // The image shows the interval is calculated using the Log10 Expanded Uncertainty Value (U/x)
    // Low Limit: Result / 10^(U/x)
    // High Limit: Result * 10^(U/x)
    const log_term = Math.pow(10, expanded_log10_value);
    const interval_low = result / log_term;
    const interval_high = result * log_term;

    // --- Display Results ---
    
    // 1. Combined Standard Uncertainty
    document.getElementById('uc_value').textContent = absolute_uc.toFixed(4);
    document.getElementById('relative_uc_value').textContent = (data.combined_u_relative * 100).toFixed(2) + '%';
    
    // 2. Expanded Uncertainty Value (Log10)
    document.getElementById('expanded_log10_value').textContent = expanded_log10_value.toFixed(4);
    
    // 3. Report Result
    // Result +/- Absolute Expanded Uncertainty (U)
    document.getElementById('report_result_with_mu').textContent = `${result.toFixed(4)} \u00B1 ${absolute_U.toFixed(4)}`; 

    // 4. Uncertainty Interval
    document.getElementById('interval_low').textContent = interval_low.toFixed(4);
    document.getElementById('interval_high').textContent = interval_high.toFixed(4);
}

// Run calculation on page load with default values
document.addEventListener('DOMContentLoaded', calculateUncertainty);
