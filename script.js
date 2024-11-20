// Validar y preprocesar la expresión
function preprocesarExpresion(expresion) {
    // Detectar paréntesis consecutivos o un número seguido por un paréntesis
    return expresion.replace(/(\d)(\()/g, '$1*(')  // Ejemplo: 2(3+5) => 2*(3+5)
                    .replace(/(\))(\d)/g, ')*$2')  // Ejemplo: (3+5)2 => (3+5)*2
                    .replace(/(\))(\()/g, ')*('); // Ejemplo: (3+5)(2+4) => (3+5)*(2+4)
}

// Validar que la expresión contenga solo números, operadores y paréntesis
function validarExpresion(expresion) {
    const regex = /^[0-9+\-*/() ]+$/;
    return regex.test(expresion);
}

// Convertir una expresión infija a postfija
function infijaAPostfija(expresion) {
    let output = [];
    let operadores = [];
    let num = '';
    let precedencia = { '+': 1, '-': 1, '*': 2, '/': 2 };

    for (let i = 0; i < expresion.length; i++) {
        let char = expresion[i];

        if (char.match(/[0-9]/)) {
            num += char; // Construir número
        } else if (char === '(') {
            if (num) {
                output.push(num); // Push número antes de abrir paréntesis
                num = '';
            }
            operadores.push(char);
        } else if (char === ')') {
            if (num) {
                output.push(num); // Push número antes de cerrar paréntesis
                num = '';
            }
            while (operadores.length > 0 && operadores[operadores.length - 1] !== '(') {
                output.push(operadores.pop());
            }
            operadores.pop(); // Eliminar '(' de la pila
        } else if (char.match(/[+\-*/]/)) {
            if (num) {
                output.push(num);
                num = '';
            }
            while (operadores.length > 0 && precedencia[char] <= precedencia[operadores[operadores.length - 1]]) {
                output.push(operadores.pop());
            }
            operadores.push(char);
        }
    }

    if (num) {
        output.push(num); // Push el último número
    }

    while (operadores.length > 0) {
        output.push(operadores.pop());
    }

    return output.join(' ');
}

// Evaluar la expresión postfija
function evaluarPostfija(expresion) {
    let pila = [];
    let tokens = expresion.split(' ');

    for (let token of tokens) {
        if (token.match(/[0-9]/)) {
            pila.push(parseFloat(token)); // Empujar número
        } else if (token.match(/[+\-*/]/)) {
            let b = pila.pop();
            let a = pila.pop();
            switch (token) {
                case '+': pila.push(a + b); break;
                case '-': pila.push(a - b); break;
                case '*': pila.push(a * b); break;
                case '/': pila.push(a / b); break;
            }
        }
    }

    return pila.pop(); // Último valor en la pila
}

// Función principal de cálculo
function calcular() {
    let expresion = document.getElementById('expresion').value.trim();
    let resultadoDiv = document.getElementById('resultado');
    let errorDiv = document.getElementById('error');

    // Limpiar resultados previos
    resultadoDiv.innerHTML = '';
    errorDiv.innerHTML = '';

    // Preprocesar la expresión para añadir operadores implícitos si es necesario
    expresion = preprocesarExpresion(expresion);

    if (!validarExpresion(expresion)) {
        errorDiv.innerHTML = "⚠️ La expresión contiene caracteres no válidos. Usa solo números y operadores (+, -, *, /).";
    } else {
        try {
            let postfija = infijaAPostfija(expresion);
            let resultado = evaluarPostfija(postfija);

            resultadoDiv.innerHTML = `<p><strong>Postfija:</strong> ${postfija}</p><p><strong>Resultado:</strong> ${resultado}</p>`;
        } catch (e) {
            errorDiv.innerHTML = "⚠️ Hubo un error al procesar la expresión.";
        }
    }
}

// Borrar el campo de entrada y resultados
function borrar() {
    document.getElementById('expresion').value = '';
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('error').innerHTML = '';
}

// Asociar eventos
document.getElementById('calcular').addEventListener('click', calcular);
document.getElementById('borrar').addEventListener('click', borrar);
