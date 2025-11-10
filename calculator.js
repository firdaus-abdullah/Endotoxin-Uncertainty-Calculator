/**
 * Endotoxin Limit (EL) Calculator
 * Formula: EL = K / M
 * K: Threshold Pyrogenic Dose (depends on route)
 * M: Maximum Recommended Dose per kg per hour
 */
function calculateEndotoxinLimit() {
    // 1. Get input values
    const kValue = parseFloat(document.getElementById('route').value);
    const mValue = parseFloat(document.getElementById('maxDose').value);
    const doseUnitSelection = document.getElementById('doseUnit').value;
    const resultDiv = document.getElementById('result');

    // 2. Input validation
    if (isNaN(kValue) || isNaN(mValue) || mValue <= 0) {
        resultDiv.innerHTML = "**Error:** Please enter valid, positive numbers for the Dose (M).";
        return;
    }

    // 3. Calculation: EL = K / M
    const elResult = kValue / mValue;

    // 4. Determine the units for the result
    let unitLabel = "";
    if (doseUnitSelection === 'mass') {
        unitLabel = "mg or Unit"; // Assuming 'M' input is dose/kg/hr in mg/kg/hr or Unit/kg/hr
    } else if (doseUnitSelection === 'volume') {
        unitLabel = "mL"; // Assuming 'M' input is dose/kg/hr in mL/kg/hr
    }

    // 5. Display the result
    resultDiv.innerHTML = `
        <h2>Calculation Results</h2>
        <p><strong>K Value (Threshold Pyrogenic Dose):</strong> ${kValue.toFixed(2)} EU/kg/hr</p>
        <p><strong>M Value (Max Dose/kg/hr):</strong> ${mValue.toFixed(4)} ${unitLabel.replace(" or Unit", "")}/kg/hr</p>
        <p><strong>Endotoxin Limit (EL):</strong> ${elResult.toFixed(4)} EU / ${unitLabel}</p>
        <p>This means your product cannot exceed ${elResult.toFixed(4)} Endotoxin Units per ${unitLabel} of product.</p>
    `;
}

// NOTE on Measurement Uncertainty (MU) Calculation:
/*
The formula for combined uncertainty (Uc) in a typical LAL assay is complex and involves Root Sum of Squares (RSS).
If your formula is: C_sample = (Endotoxin Reading * Dilution Factor) / Potency
Then the relative combined uncertainty (u_c,rel) would generally be:
u_c,rel = SQRT( (u_Reading,rel)^2 + (u_Dilution,rel)^2 + (u_Potency,rel)^2 )
And the absolute expanded uncertainty (U) is: U = u_c * k, where k is the coverage factor (e.g., 2 for 95% confidence).
The individual relative uncertainties (u_rel) must be determined from sources like standard curve RSD, volume uncertainties, etc.
*/
