/**
 * CALCULATOR APPLICATION - JAVASCRIPT
 * 
 * This file is already wired in index.html with:
 * <script src="script.js"></script>
 */

// ============================================
// CALCULATOR STATE - Variables to track
// ============================================

let firstNumber = null;           // Stores the first number entered
let operator = null;              // Stores the operation (+, -, *, /)
let currentInput = '0';           // The number currently being displayed
let shouldResetDisplay = false;   // Flag to reset display for next input
let buttonHistory = '';           // Track buttons pressed in small font

// ============================================
// GET DOM ELEMENTS
// ============================================

const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator');
const clearButton = document.querySelector('.btn-clear');
const equalsButton = document.querySelector('.btn-equals');
const decimalButton = document.querySelector('.btn-decimal');

// ============================================
// UPDATE DISPLAY FUNCTION
// ============================================

function updateDisplay(value) {
    // Always show the calculation history line (even if empty) to prevent layout shift
    display.innerHTML = `<div style="font-size: 0.6em; color: #888; margin-bottom: 5px; min-height: 15px;">${buttonHistory}</div><div style="font-size: 1em;">${value}</div>`;
}

// ============================================
// NUMBER BUTTON CLICK HANDLER
// ============================================

numberButtons.forEach(button => {
    button.addEventListener('click', function() {
        const number = this.getAttribute('data-number');  // Get number from data attribute
        
        // Track button press in history
        buttonHistory += number;
        
        // If we just calculated or started, reset the display
        if (shouldResetDisplay) {
            currentInput = number;
            shouldResetDisplay = false;
        } else {
            // Prevent multiple decimal points in one number
            if (number === '.' && currentInput.includes('.')) {
                return;  // Do nothing if there's already a decimal
            }
            
            // Prevent leading zeros (e.g., don't allow 007)
            if (currentInput === '0' && number !== '.') {
                currentInput = number;
            } else {
                currentInput += number;
            }
        }
        
        // Update the display with the current input and history
        updateDisplay(currentInput);
    });
});

// ============================================
// DECIMAL BUTTON CLICK HANDLER
// ============================================

decimalButton.addEventListener('click', function() {
    const decimalPoint = '.';
    
    // Track button press in history
    buttonHistory += '.';
    
    // If we just calculated or started, reset the display
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        // Only add decimal if there isn't one already
        currentInput += decimalPoint;
    }
    
    updateDisplay(currentInput);
});

// ============================================
// OPERATOR BUTTON CLICK HANDLER
// ============================================

operatorButtons.forEach(button => {
    button.addEventListener('click', function() {
        const selectedOperator = this.getAttribute('data-operator');
        
        // Track operator in history (use operator symbol)
        let opSymbol = selectedOperator;
        if (selectedOperator === '*') opSymbol = '×';
        if (selectedOperator === '/') opSymbol = '÷';
        
        // If we're chaining from a previous result (after equals), start fresh with the result
        if (shouldResetDisplay && firstNumber === null) {
            // Start a new calculation with the current result
            buttonHistory = currentInput + ' ' + opSymbol + ' ';
        } else {
            // Otherwise, continue appending to the history
            buttonHistory += opSymbol + ' ';
        }
        
        // If we already have a first number and operator, calculate first (for chaining operations)
        if (firstNumber !== null && operator !== null && !shouldResetDisplay) {
            const result = calculate(firstNumber, parseFloat(currentInput), operator);
            
            // If it was division by zero, result will be 'Error'
            if (result === 'Error') {
                currentInput = 'Error';
                updateDisplay(currentInput);
                firstNumber = null;
                operator = null;
                return;
            }
            
            currentInput = String(result);
        }
        
        // Store the first number and the operator
        firstNumber = parseFloat(currentInput);
        operator = selectedOperator;
        shouldResetDisplay = true;  // Next number input will replace the display
        
        // Update display with history after operator
        updateDisplay(currentInput);
    });
});

// ============================================
// CALCULATE FUNCTION
// ============================================

function calculate(num1, num2, op) {
    // Perform the calculation based on the operator
    switch(op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            // Check for division by zero
            if (num2 === 0) {
                return 'Error';  // Return error instead of infinity
            }
            return num1 / num2;
        default:
            return num2;
    }
}

// ============================================
// EQUALS BUTTON CLICK HANDLER
// ============================================

equalsButton.addEventListener('click', function() {
    // Track button press in history
    buttonHistory += '= ';
    
    // Only calculate if we have both numbers and an operator
    if (firstNumber !== null && operator !== null) {
        const result = calculate(firstNumber, parseFloat(currentInput), operator);
        
        // If result is an error, display it
        if (result === 'Error') {
            currentInput = 'Error';
        } else {
            // Round to avoid floating point precision issues
            // (e.g., 0.1 + 0.2 = 0.30000000000000004)
            currentInput = String(Math.round(result * 100000000) / 100000000);
        }
        
        // Update display with the result
        updateDisplay(currentInput);
        
        // Reset the calculator state for the next calculation
        firstNumber = null;
        operator = null;
        shouldResetDisplay = true;
    }
});

// ============================================
// CLEAR BUTTON CLICK HANDLER
// ============================================

clearButton.addEventListener('click', function() {
    // Reset all variables to their starting state
    firstNumber = null;
    operator = null;
    currentInput = '0';
    shouldResetDisplay = false;
    buttonHistory = '';  // Clear the button history
    
    // Reset the display to 0
    updateDisplay('0');
});

// ============================================
// INITIALIZATION
// ============================================

// Display starting value when page loads
updateDisplay(currentInput);
