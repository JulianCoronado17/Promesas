


/* Promise.all*/

function Promise (){
var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "foo");
});

Promise.all([p1, p2, p3]).then((values) => {
  console.log(values); // [3, 1337, "foo"]
});
}



/*Ejercicio: Consulta a Múltiples Servidores con Timeout
Descripción del ejercicio:

Implementa una función getFastestServerResponse que tome una lista de URLs de servidores
y un tiempo máximo de espera en milisegundos.
La función debería devolver una promesa que se resuelve con la respuesta del primer servidor 
que responda, o se rechaza con un error si ninguno responde antes del tiempo de espera.
Instrucciones:

Implementa la función getFastestServerResponse.
Usa Promise.race para manejar la consulta a los servidores y el timeout.
Maneja tanto el éxito como el error correctamente.*/

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

