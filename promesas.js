

// Definimos una función llamada Promise que contiene el código para trabajar con promesas.
function Promise() {
    // Creamos una promesa que ya está resuelta con el valor 3.
    var p1 = Promise.resolve(3);

    // Definimos una variable p2 que no es una promesa, sino un número entero.
    var p2 = 1337;

    // Creamos una nueva promesa p3 que se resolverá después de 100 milisegundos con el valor "foo".
    var p3 = new Promise((resolve, reject) => {
        setTimeout(resolve, 100, "foo");
    });

    // Utilizamos Promise.all para esperar a que todas las promesas se resuelvan y manejar sus resultados.
    // Dado que p2 no es una promesa, se convierte automáticamente en una promesa resuelta con su valor.
    // Por lo tanto, Promise.all espera a que p1 y p3 se resuelvan, y también considera a p2 como un valor ya resuelto.
    Promise.all([p1, p2, p3]).then((values) => {
        // Se imprime el array con los valores de todas las promesas y valores no-promesa que se pasaron.
        console.log(values); // Esperamos que esto imprima: [3, 1337, "foo"]
    });
}

// Llamamos a la función Promise para ejecutar el código.
Promise();



// Definimos una función llamada any que contiene el código para trabajar con promesas.
function any() {
    // Creamos una promesa que siempre falla (se rechaza) con el valor "Always fails".
    const pErr = new Promise((resolve, reject) => {
        reject("Always fails");
    });

    // Creamos una promesa que se resolverá después de 500 milisegundos con el valor "Done eventually".
    const pSlow = new Promise((resolve, reject) => {
        setTimeout(resolve, 500, "Done eventually");
    });

    // Creamos una promesa que se resolverá después de 100 milisegundos con el valor "Done quick".
    const pFast = new Promise((resolve, reject) => {
        setTimeout(resolve, 100, "Done quick");
    });

    // Utilizamos Promise.any para esperar a que al menos una de las promesas se resuelva.
    // Promise.any se resolverá con el primer valor que no sea una promesa rechazada.
    // Si todas las promesas se rechazan, Promise.any se rechaza con un AggregateError.
    Promise.any([pErr, pSlow, pFast]).then((value) => {
        // Se imprime el valor de la primera promesa que se resuelve exitosamente.
        console.log(value); // Esperamos que esto imprima: "Done quick"
    });
}

// Llamamos a la función any para ejecutar el código.
any();


// Ejercicio: Consulta a Múltiples Servidores con Timeout
// Descripción del ejercicio:

// Implementa una función getFastestServerResponse que tome una lista de URLs de servidores 
// y un tiempo máximo de espera en milisegundos.
// La función debería devolver una promesa que se resuelve con la respuesta del 
// primer servidor que responda, o se rechaza con un error si ninguno responde antes del tiempo de espera.
// Instrucciones:

// Implementa la función getFastestServerResponse.
// Usa Promise.race para manejar la consulta a los servidores y el timeout.
// Maneja tanto el éxito como el error correctamente.


function getFastestServerResponse(urls, timeout) {
    // Crea una promesa que se rechaza después del tiempo de espera especificado.
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Ningún servidor respondió a tiempo')), timeout)
    );

    // Crea un array de promesas para consultar los servidores.
    const serverPromises = urls.map(url => 
        fetch(url)
            .then(response => response.text()) // Suponemos que la respuesta es texto.
            .catch(error => Promise.reject(new Error(`Error al consultar ${url}: ${error.message}`)))
    );

    // Usa Promise.race para obtener la primera promesa que se resuelva o se rechace.
    return Promise.race([timeoutPromise, ...serverPromises]);
}

// Ejemplo de uso:
const servers = [
    'https://jsonplaceholder.typicode.com/posts/1', // URL de ejemplo 1
    'https://jsonplaceholder.typicode.com/posts/2', // URL de ejemplo 2
    'https://jsonplaceholder.typicode.com/posts/3'  // URL de ejemplo 3
];

const timeout = 3000; // Tiempo de espera de 3 segundos

getFastestServerResponse(servers, timeout)
    .then(response => console.log('Respuesta recibida:', response))
    .catch(error => console.error('Error:', error.message));

/*Resultado esperado, que la funcion devuelva la promesa que se resuelve con la respuesta del primer servidor que responda,
o que rechaze si se pasa del tiempo de espera*/
/*-------------------------------------------------------------------------------------------------------------------------------------------*/



// Ejercicio: Consulta a Múltiples Servidores con Timeout usando Promise.allSettled
// Descripción del ejercicio:

// Implementa una función getAllServerResponses que tome una lista de URLs de servidores
//  y un tiempo máximo de espera en milisegundos.
//RESULTADO ESPERADO!
// La función debería devolver un objeto con el estado y el resultado de cada consulta 
// (éxito o error) después de que todas las promesas se hayan completado, o un error de timeout si el tiempo de espera se agota.
// Instrucciones:

// Implementa la función getAllServerResponses.
// Usa Promise.allSettled para manejar la consulta a los servidores y el timeout.
// Maneja tanto el éxito como el error correctamente.


function getAllServerResponses(urls, timeout) {
    // Crea una promesa que se rechaza después del tiempo de espera especificado.
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Ningún servidor respondió a tiempo')), timeout)
    );

    // Crea un array de promesas para consultar los servidores.
    const serverPromises = urls.map(url => 
        fetch(url)
            .then(response => response.text()) // Suponemos que la respuesta es texto.
            .then(data => ({ status: 'fulfilled', value: data })) // Marca la promesa como "cumplida" con el resultado.
            .catch(error => ({ status: 'rejected', reason: `Error al consultar ${url}: ${error.message}` })) // Marca la promesa como "rechazada" con el error.
    );

    // Usa Promise.race para obtener la primera promesa que se resuelva o se rechace.
    return Promise.race([timeoutPromise, Promise.allSettled(serverPromises)])
        .then(result => {
            if (result instanceof Array) {
                // Si result es un array, significa que fue el resultado de Promise.allSettled.
                return { status: 'fulfilled', value: result }; // Devuelve el resultado de todas las promesas.
            } else {
                // Si result es un error de timeout.
                throw result; // Rechaza la promesa con el error de timeout.
            }
        })
        .catch(error => {
            if (error instanceof Error && error.message.startsWith('Timeout')) {
                // Si el error es un timeout, simplemente repropaga el error.
                throw error;
            }
            // Si hay algún otro error, puede manejarse aquí si es necesario.
            throw new Error('Un error inesperado ocurrió.');
        });
}

// Ejemplo de uso:
const server = [
    'https://jsonplaceholder.typicode.com/posts/1', // URL de ejemplo 1
    'https://jsonplaceholder.typicode.com/posts/2', // URL de ejemplo 2
    'https://jsonplaceholder.typicode.com/posts/3'  // URL de ejemplo 3
];

const timeouts = 3000; // Tiempo de espera de 3 segundos

getAllServerResponses(servers, timeout)
    .then(result => {
        // Manejo de resultados después de que todas las promesas se hayan completado.
        result.value.forEach((res, index) => {
            if (res.status === 'fulfilled') {
                console.log(`Respuesta del servidor ${index}:`, res.value);
            } else {
                console.error(`Error en el servidor ${index}:`, res.reason);
            }
        });
    })
    .catch(error => console.error('Error:', error.message));
