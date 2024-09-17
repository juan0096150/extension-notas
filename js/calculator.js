function initializeCalculator() {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calc-btn');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const historyList = document.getElementById('historyList');
    const clearHistoryButton = document.getElementById('clearHistory');

    let currentOperation = '';
    let firstOperand = null;
    let waitingForSecondOperand = false;
    let operator = null;
    let history = [];

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('operator')) {
                handleOperator(button.textContent);
            } else if (button.textContent === '.') {
                inputDecimal();
            } else {
                inputDigit(button.textContent);
            }
        });
    });

    equalsButton.addEventListener('click', handleEquals);
    clearButton.addEventListener('click', clear);
    clearHistoryButton.addEventListener('click', clearHistory);

    function updateDisplay() {
        display.value = currentOperation;
    }

    function clear() {
        currentOperation = '';
        firstOperand = null;
        waitingForSecondOperand = false;
        operator = null;
        updateDisplay();
    }

    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            currentOperation = digit;
            waitingForSecondOperand = false;
        } else {
            currentOperation = currentOperation === '0' ? digit : currentOperation + digit;
        }
        updateDisplay();
    }

    function inputDecimal() {
        if (!currentOperation.includes('.')) {
            currentOperation += '.';
            updateDisplay();
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentOperation);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation(firstOperand, inputValue, operator);
            currentOperation = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
            addToHistory(`${firstOperand} ${operator} ${inputValue} = ${result}`);
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    function handleEquals() {
        const inputValue = parseFloat(currentOperation);

        if (operator && !waitingForSecondOperand) {
            const result = performCalculation(firstOperand, inputValue, operator);
            currentOperation = `${parseFloat(result.toFixed(7))}`;
            addToHistory(`${firstOperand} ${operator} ${inputValue} = ${result}`);
            firstOperand = result;
            operator = null;
            waitingForSecondOperand = false;
            updateDisplay();
        }
    }

    function performCalculation(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    function addToHistory(operation) {
        history.push(operation);
        updateHistoryDisplay();
        saveHistoryToStorage();
    }

    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        history.slice().reverse().forEach(operation => {
            const li = document.createElement('li');
            li.textContent = operation;
            historyList.appendChild(li);
        });
    }

    function clearHistory() {
        history = [];
        updateHistoryDisplay();
        saveHistoryToStorage();
    }

    function saveHistoryToStorage() {
        chrome.storage.sync.set({ calculatorHistory: history }, () => {
            console.log('Calculator history saved');
        });
    }

    function loadHistoryFromStorage() {
        chrome.storage.sync.get('calculatorHistory', (data) => {
            if (data.calculatorHistory) {
                history = data.calculatorHistory;
                updateHistoryDisplay();
            }
        });
    }

    // Load history when initializing
    loadHistoryFromStorage();
}
