// 🦇 Batman Calculator JavaScript 🦇

let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForNewInput = false;
let expression = '';

// Update display function
function updateDisplay() {
    // Show the full expression in the main display, or result if calculation is complete
    let displayText = expression || currentInput;
    
    // Format large expressions/numbers for better readability
    if (displayText.length > 15) {
        // If it's a number, use scientific notation
        if (!isNaN(displayText) && displayText.length > 10) {
            display.textContent = parseFloat(displayText).toExponential(6);
        } else {
            // For long expressions, just show them (they'll wrap or scroll)
            display.textContent = displayText;
        }
    } else {
        display.textContent = displayText;
    }
}

// Append to display
function appendToDisplay(value) {
    // Add some bunny magic with sound effects (if needed later)
    playVibeSound();
    
    if (waitingForNewInput) {
        if (['+', '-', '*', '/'].includes(value)) {
            // Continue with operator
            waitingForNewInput = false;
        } else {
            // Start new number
            currentInput = '';
            waitingForNewInput = false;
        }
    }
    
    // Handle operators
    if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
        return;
    }
    
    // Handle decimal point
    if (value === '.') {
        if (currentInput === '0') {
            currentInput = '0.';
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
        return;
    }
    
    // Handle numbers
    if (currentInput === '0') {
        currentInput = value;
        // If this is the first number, start new expression
        if (expression === '' || expression.endsWith(' = ')) {
            expression = value;
        } else if (waitingForNewInput || expression.endsWith(' ')) {
            // Replace the last number in expression if we were waiting for new input
            const parts = expression.split(' ');
            parts[parts.length - 1] = value;
            expression = parts.join(' ');
        } else {
            expression += value;
        }
    } else {
        currentInput += value;
        // Update the last number in the expression
        if (expression === '') {
            expression = currentInput;
        } else {
            const parts = expression.split(' ');
            parts[parts.length - 1] = currentInput;
            expression = parts.join(' ');
        }
    }
    
    updateDisplay();
}

// Handle operators
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    // Convert operator symbols for display
    const displayOperator = nextOperator === '*' ? '×' : nextOperator === '/' ? '÷' : nextOperator;
    
    if (previousInput === null) {
        previousInput = inputValue;
        // Add operator to expression (keep original expression intact)
        expression += ` ${displayOperator} `;
    } else if (operator) {
        const currentValue = previousInput || 0;
        const result = performCalculation(currentValue, inputValue, operator);
        
        // Keep the original expression and just add the new operator
        // Don't replace with intermediate result
        expression += ` ${displayOperator} `;
        
        currentInput = `${parseFloat(result.toFixed(10))}`;
        previousInput = parseFloat(currentInput);
        
        updateDisplay();
    } else {
        // Just add operator to existing expression
        expression += ` ${displayOperator} `;
    }
    
    waitingForNewInput = true;
    operator = nextOperator;
    updateDisplay();
}

// Perform calculation
function performCalculation(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            if (secondOperand === 0) {
                showError("Can't divide by zero! 🦇⚡");
                return firstOperand;
            }
            return firstOperand / secondOperand;
        default:
            return secondOperand;
    }
}

// Calculate result
function calculate() {
    const inputValue = parseFloat(currentInput);
    
    if (previousInput !== null && operator) {
        const result = performCalculation(previousInput, inputValue, operator);
        
        // Now show the result in the main display
        expression = `${parseFloat(result.toFixed(10))}`;
        currentInput = `${parseFloat(result.toFixed(10))}`;
        
        // Add some celebration for the result!
        celebrateCalculation();
        
        previousInput = null;
        operator = null;
        waitingForNewInput = true;
        updateDisplay();
    }
}

// Clear display
function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForNewInput = false;
    expression = '';
    updateDisplay();
    
    // Add a little bunny bounce animation
    bounceCalculator();
}

// Delete last character
function deleteLast() {
    // If we're waiting for new input (after an operation), treat DEL like clear
    if (waitingForNewInput) {
        clearDisplay();
        return;
    }
    
    // If we have an expression with operators
    if (expression.includes(' ')) {
        // Remove the last character from the expression
        expression = expression.slice(0, -1);
        
        // If we removed a space or operator, we need to update currentInput
        if (expression.endsWith(' ')) {
            // We're now at an operator, remove it too
            expression = expression.slice(0, -1);
            // Find the last number in the expression
            const parts = expression.split(' ');
            currentInput = parts[parts.length - 1] || '0';
        } else {
            // We removed a digit, update currentInput to match the last number
            const parts = expression.split(' ');
            currentInput = parts[parts.length - 1] || '0';
        }
    } else {
        // Simple number deletion
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
            expression = currentInput;
        } else {
            currentInput = '0';
            expression = '';
        }
    }
    
    updateDisplay();
}

// Show error message with Batman style
function showError(message) {
    const originalText = display.textContent;
    display.textContent = message;
    display.style.color = '#e74c3c';
    
    setTimeout(() => {
        display.textContent = originalText;
        display.style.color = '#ffd700';
    }, 2000);
}

// Add some Batman sound effect (visual feedback for now)
function playVibeSound() {
    // Create a subtle visual feedback
    const randomEmoji = ['⚡', '🦇', '🖤', '✨', '🌆'][Math.floor(Math.random() * 5)];
    showTemporaryEmoji(randomEmoji);
}

// Show temporary emoji for vibe
function showTemporaryEmoji(emoji) {
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;
    emojiElement.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        font-size: 2rem;
        z-index: 1000;
        pointer-events: none;
        animation: fadeUpAndOut 1s ease-out forwards;
    `;
    
    // Add animation CSS if not already added
    if (!document.getElementById('vibeAnimations')) {
        const style = document.createElement('style');
        style.id = 'vibeAnimations';
        style.textContent = `
            @keyframes fadeUpAndOut {
                0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(emojiElement);
    
    setTimeout(() => {
        document.body.removeChild(emojiElement);
    }, 1000);
}

// Celebrate calculation with animation
function celebrateCalculation() {
    const celebration = ['🎆', '⚡', '🌆', '✨', '🦇'];
    celebration.forEach((emoji, index) => {
        setTimeout(() => showTemporaryEmoji(emoji), index * 100);
    });
}

// Bat fly calculator animation
function bounceCalculator() {
    const calculator = document.querySelector('.calculator-container');
    calculator.style.animation = 'none';
    calculator.offsetHeight; // Trigger reflow
    calculator.style.animation = 'batFly 0.6s ease-in-out';
    
    setTimeout(() => {
        calculator.style.animation = '';
    }, 600);
}

// Keyboard support for extra vibes!
document.addEventListener('keydown', (event) => {
    event.preventDefault();
    
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '+') {
        appendToDisplay('+');
    } else if (key === '-') {
        appendToDisplay('-');
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
updateDisplay();

// Add some Batman effects on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        ['⚡', '🦇', '🖤'].forEach((emoji, index) => {
            setTimeout(() => showTemporaryEmoji(emoji), index * 200);
        });
    }, 500);
});

// Create Batman signal shower
function createHeartShower() {
    // Play Batman sound effect
    playVibeSound();
    
    // Create 25-35 Batman signals falling from different positions
    const heartCount = Math.floor(Math.random() * 11) + 25; // 25-35 signals
    const heartEmojis = ['🦇', '⚡', '🖤', '🌆', '✨', '🔥', '🌌', '🌃', '🌇', '🌉'];
    
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-shower';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            
            // Random starting position across the screen width
            const randomX = Math.random() * window.innerWidth;
            heart.style.left = randomX + 'px';
            heart.style.top = '-30px';
            
            // Set random horizontal movement for the CSS animation (wider range)
            const horizontalDrift = (Math.random() - 0.5) * 300;
            heart.style.setProperty('--random-x', horizontalDrift + 'px');
            
            // Set random starting rotation
            const startRotation = Math.random() * 360;
            heart.style.setProperty('--start-rotation', startRotation + 'deg');
            
            // Add more size variation
            const size = 0.8 + Math.random() * 1.4; // 0.8rem to 2.2rem
            heart.style.fontSize = size + 'rem';
            
            // Random animation duration for more natural feel
            const duration = 3.5 + Math.random() * 1.5; // 3.5s to 5s
            heart.style.animationDuration = duration + 's';
            
            // Random delay for more organic feel
            const delay = Math.random() * 0.5;
            heart.style.animationDelay = delay + 's';
            
            document.body.appendChild(heart);
            
            // Remove heart after animation completes (with buffer time)
            setTimeout(() => {
                if (document.body.contains(heart)) {
                    document.body.removeChild(heart);
                }
            }, (duration + delay + 1) * 1000);
        }, i * 50); // Faster staggering for smoother cascade
    }
    
    // Add multiple Batman celebration waves
    const celebrations = ['🖤', '⚡', '🦇', '💙', '🌆'];
    celebrations.forEach((emoji, index) => {
        setTimeout(() => {
            showTemporaryEmoji(emoji);
        }, 200 + (index * 300));
    });
    
    // Bounce the calculator for extra effect
    bounceCalculator();
    
    // Add a gentle screen pulse effect
    document.body.style.animation = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.animation = 'pulse 1s ease-in-out';
    
    // Add pulse animation if it doesn't exist
    if (!document.getElementById('pulseAnimation')) {
        const style = document.createElement('style');
        style.id = 'pulseAnimation';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Reset body animation after it completes
    setTimeout(() => {
        document.body.style.animation = '';
    }, 1000);
}

// Easter egg: Konami code for Batman vibes! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (event) => {
    konamiCode.push(event.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Easter egg activated!
        showError("🦇⚡ BATMAN MODE ACTIVATED! ⚡🦇");
        konamiCode = [];
        
        // Super Batman celebration
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const randomEmoji = ['🦇', '🖤', '⚡', '🌆', '🌟', '🌌', '🌙', '⭐'][Math.floor(Math.random() * 8)];
                showTemporaryEmoji(randomEmoji);
            }, i * 150);
        }
    }
});
