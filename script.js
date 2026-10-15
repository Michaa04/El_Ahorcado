const app = document.getElementById("app");

const palabras = ["JavaScript", "Python", "HTML", "JAVA", "CSS"];

const ranking = JSON.parse(localStorage.getItem("rankingAhorcado")) || [];

let nameJugador = ""; 
let palabraSecreta = "";
let letrasAdivinadas = [];
let letrasUsadas = [];
let vidas = 6;

function mostrarJuego() {
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedor");

    const titulo = document.createElement("h1");
    titulo.classList.add("titulo");
    titulo.textContent = "El Ahorcado";
    contenedor.appendChild(titulo);

    //Inicio
    const inicioContenedor = document.createElement("div");
    inicioContenedor.classList.add("inicio-contenedor");

    const wrapperNombre = document.createElement("div");
    wrapperNombre.classList.add("campo");

    const labelNombre = document.createElement("label");
    labelNombre.classList.add("label");
    labelNombre.textContent = "Ingresa tu nombre: ";

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.classList.add("input");

    wrapperNombre.appendChild(labelNombre);
    wrapperNombre.appendChild(inputNombre);

    contenedor.appendChild(wrapperNombre);

    const button = document.createElement("button");
    button.classList.add("boton");
    button.textContent = "Comenzar Juego"; 

    const msjError = document.createElement("p");
    msjError.classList.add("error");
    contenedor.appendChild(msjError);

    const imgPortada = document.createElement("img");
    imgPortada.classList.add("img-portada");
    imgPortada.src = "img/Portada_juego.png";
    imgPortada.alt = "Portada del Ahorcado";
    
    inicioContenedor.appendChild(wrapperNombre); 
    inicioContenedor.appendChild(button);
    inicioContenedor.appendChild(msjError);
    inicioContenedor.appendChild(imgPortada);

    //Zona del Juego 
    const zonaJuego = document.createElement("div");
    zonaJuego.classList.add("zona-juego", "oculto");

    const esqueletoVidas = document.createElement("img");
    esqueletoVidas.classList.add("esqueleto-vidas");
    esqueletoVidas.src = "img/Vida_6.png";
    esqueletoVidas.alt = "Estado Del Ahorcado";
    zonaJuego.appendChild(esqueletoVidas); 

    const displayVidas = document.createElement("div");
    displayVidas.classList.add("vidas");
    displayVidas.textContent = "Vidas: 6";
    zonaJuego.appendChild(displayVidas);

    const displayPalabra = document.createElement("div");
    displayPalabra.classList.add("palabra");
    displayPalabra.textContent = "_ _ _ _ _";
    zonaJuego.appendChild(displayPalabra);

    const wrapperLetra = document.createElement("div");
    wrapperLetra.classList.add("campo");

    const labelLetra = document.createElement("label");
    labelLetra.textContent = "Ingresá una letra: ";

    const inputLetra = document.createElement("input");
    inputLetra.type = "text";
    inputLetra.maxLength = 1;
    inputLetra.classList.add("input", "input-letra");

    wrapperLetra.appendChild(labelLetra);
    wrapperLetra.appendChild(inputLetra);
    zonaJuego.appendChild(wrapperLetra);

    const letrasUtilizadas = document.createElement("p");
    letrasUtilizadas.classList.add("letras-usadas");
    letrasUtilizadas.textContent = "Letras utilizadas: -";
    zonaJuego.appendChild(letrasUtilizadas);

    const msjJuego = document.createElement("p");
    msjJuego.classList.add("error");
    zonaJuego.appendChild(msjJuego);

    const contenedorBotones = document.createElement("div");
    contenedorBotones.classList.add("botones");

    const buttonProbar = document.createElement("button");
    buttonProbar.classList.add("boton");
    buttonProbar.textContent = "Probar Letra";

    const buttonReiniciar = document.createElement("button");
    buttonReiniciar.classList.add("boton", "oculto");
    buttonReiniciar.textContent = "Jugar de nuevo";
    contenedorBotones.appendChild(buttonReiniciar);

    contenedorBotones.appendChild(buttonProbar);
    contenedorBotones.appendChild(buttonReiniciar);

    zonaJuego.appendChild(contenedorBotones);

    const columnaJuego = document.createElement("div");
    columnaJuego.classList.add("columna-juego");
    columnaJuego.appendChild(inicioContenedor);
    columnaJuego.appendChild(zonaJuego);

    contenedor.appendChild(columnaJuego);

    //Ranking
    const rankingContenedor = document.createElement("div");
    rankingContenedor.classList.add("ranking-contenedor");

    const tituloRanking = document.createElement("h2");
    tituloRanking.textContent = "Ranking";
    rankingContenedor.appendChild(tituloRanking);

    const listaRanking = document.createElement("ul");
    listaRanking.classList.add("lista-ranking");
    rankingContenedor.appendChild(listaRanking);

    contenedor.appendChild(rankingContenedor);
    actualizarRanking(listaRanking)

    //Eventos
    button.addEventListener("click", () => {
        const textoIngresado = inputNombre.value.trim();
        if (textoIngresado === "") {
            msjError.textContent = "Ingresar un nombre válido para jugar";
        } else {
            msjError.textContent = "";
            nameJugador = textoIngresado;
            
            inicioContenedor.classList.add("oculto");
            zonaJuego.classList.remove("oculto");

            inputNombre.disabled = true;
            button.disabled = true;

            iniciarPalabra(displayPalabra);
        }
    });
    
    buttonProbar.addEventListener("click", () => {
        const letraIngresada = inputLetra.value.trim().toUpperCase();
        inputLetra.value = "";
        msjJuego.textContent = "";

        const letraValida = /^[A-ZÑ]$/.test(letraIngresada);

        if (!letraValida) {
            msjJuego.textContent = "Ingresa solo letras. Por favor.";
        } else if (letrasUsadas.includes(letraIngresada)) {
            msjJuego.textContent = "Ya probaste esa letra";
        } else {
            letrasUsadas.push(letraIngresada);
            letrasUtilizadas.textContent = `Letras Utilizadas: ${letrasUsadas.join(" - ")}`;

            if (palabraSecreta.includes(letraIngresada)) {
                for (let i = 0; i < palabraSecreta.length; i++) {
                    if (palabraSecreta[i] === letraIngresada) {
                        letrasAdivinadas[i] = letraIngresada;
                    }
                }

                displayPalabra.textContent = letrasAdivinadas.join(" ");
                if (!letrasAdivinadas.includes("_")) {
                    msjJuego.textContent = `Felicidades Ganaste: ${nameJugador}`;
                    inputLetra.disabled = true;
                    buttonProbar.disabled = true;
                    buttonReiniciar.classList.remove("oculto");

                    ranking.push ({
                    nombre: nameJugador,
                    resultado: "Ganó",
                    vidasRestantes: vidas,
                    palabra: palabraSecreta
                    });
                    guardarYActualizarRanking(listaRanking);
                }
            } else {
                vidas--;
                displayVidas.textContent = "Vidas: " + vidas;

                esqueletoVidas.src = `img/Vida_${vidas}.png`;

                if (vidas === 0) {
                    msjJuego.textContent = `Perdiste, la palabra era: ${palabraSecreta}`;
                    inputLetra.disabled = true;
                    buttonProbar.disabled = true;
                    buttonReiniciar.classList.remove("oculto");

                    ranking.push ({
                    nombre:nameJugador,
                    resultado: "Perdió",
                    vidasRestantes: 0,
                    palabra: palabraSecreta
                    });
                    guardarYActualizarRanking(listaRanking);
                }
            } 
        }
    });

    buttonReiniciar.addEventListener("click", () => {
        zonaJuego.classList.add("oculto");
        inicioContenedor.classList.remove("oculto");

        inputNombre.disabled = false;
        inputNombre.value = "";
        button.disabled = false;

        vidas = 6;
        esqueletoVidas.src = "img/Vida_6.png";
        letrasUsadas = []

        displayVidas.textContent = "Vidas: " + vidas;
        letrasUtilizadas.textContent = "Letras utilizadas: -";
        msjJuego.textContent = "";
        
        inputLetra.disabled = false;
        buttonProbar.disabled = false;

        buttonReiniciar.classList.add("oculto");
        iniciarPalabra(displayPalabra);
    });

    app.appendChild(contenedor)
}

function iniciarPalabra(displayPalabra) {
    const palabraAzar = Math.floor(Math.random() * palabras.length);
    palabraSecreta = palabras[palabraAzar].toUpperCase();

    letrasAdivinadas = Array(palabraSecreta.length).fill("_");  
    displayPalabra.textContent = letrasAdivinadas.join(" ");
    console.log(`Palabra secreta seleccionada: ${palabraSecreta}`);
}

function ordenarRanking() {
    ranking.sort((a, b) => {
        if (a.resultado === "Ganó" && b.resultado
            !== "Ganó") return -1;
        if (a.resultado !== "Ganó" && b.resultado === "Ganó") return 1;

        return b.vidasRestantes - a.vidasRestantes;
    })
}

function actualizarRanking(listaElemento) {
    listaElemento.innerHTML = "";
    ordenarRanking();

    ranking.forEach((partida, index) => {
        const item = document.createElement("li");
        const estado = partida.resultado === "Ganó" ? "Ganó": "Perdió";
        item.textContent = `${index + 1}. ${partida.nombre} - ${estado} (${partida.vidasRestantes} vidas) - Palabra: ${partida.palabra}`;
        listaElemento.appendChild(item);
    });
}

function guardarYActualizarRanking(listaElemento) {
    ordenarRanking();
    localStorage.setItem("rankingAhorcado", JSON.stringify(ranking));

    actualizarRanking(listaElemento)
}

 mostrarJuego()

