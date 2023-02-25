// funcion para pag inicial fetch de foto y append de la carta (se usa en el fetch inicial)
function crearCarta(numero, response, grupo, maximoActual) {
  $(`#grupo-${grupo}`).append(
    `<div class="card text-bg-secondary flex" style="width: 18rem; id="${numero}">
    <img src="" class="card-img-top" id="pokemon-${
      Number(numero) + 1
    }-img" alt="${response.results[numero].name} image">
    <div class="card-body">
    <h5 class="card-title">${response.results[numero].name}</h5>
    </div>
    </div>`
  );

  fetch(`https://pokeapi.co/api/v2/pokemon/${Number(numero) + maximoActual}`)
    .then((response) => response.json())
    .then((response) =>
      $(`#pokemon-${Number(numero) + 1}-img`).attr(
        "src",
        `${response.sprites.front_default}`
      )
    );
}

// funcion para lista anterior
function limpiarLista() {
  $("#pag").html(`<div class="card-group" id="grupo-1"></div>
  <div class="card-group" id="grupo-2"></div>
  <div class="card-group" id="grupo-3"></div>
  <div class="card-group" id="grupo-4"></div>
  <div class="card-group" id="grupo-5"></div>
  <div class="card-group" id="grupo-6"></div>
  <div class="card-group" id="grupo-7"></div>
  <div class="card-group" id="grupo-8"></div>`);
}

// funcion de busqueda
function busquedaUsuario(busqueda) {
  $("#contenedor-lista").css("display", "none");
  $("#contenedor-busqueda").css("display", "block");
  $(".resultado-busqueda").html("");
  $("#barra-buscar").val("");

  fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda}`)
    .then((response) => response.json())
    // funcion que llena con toda la info
    .then((response) => {
      $("title").text(response.name);

      // vacia resultados anteriores
      $("#resultado").html(
        `<div class="card-group flex" id="primera-fila"></div>
        <div class="card-group flex" id="segunda-fila"></div>
        <div class="card-group flex" id="tercera-fila"></div>`
      );
      $("#pokename").html("");

      // agrega nombre de pokemon a titulo
      $("#pokename").append(`<h2>${response.name}</h2>`);

      // agrega divs
      $("#primera-fila").append(
        `<div class="card text-bg-secondary carta-busqueda" id="imagen-busqueda"><img id="respuesta-img" src="${response.sprites.front_default}" alt="${response.name} picture"></div>
        <div class="card text-bg-secondary carta-busqueda" id="caracteristicas"><h4><u>Characteristics</u></h4></div>`
      );
      $("#segunda-fila").append(
        `<div class="card text-bg-secondary carta-busqueda" id="tipos y habilidades">
          <div id="tipos"><h4><u>Type</u></h4></div>
          <div id="habilidades"><h4><u>Ability</u></h4></div>
        </div>
        <div class="card text-bg-secondary carta-busqueda" id="stats"><h4><u>Stats</u></h4></div>`
      );
      $("#tercera-fila").append(
        `<div class="card text-bg-secondary carta-busqueda" id="evolution-chains"><h4><u>Evolution chain</u></h4><br><h5 id=evoluciones>${response.name}</h5></div>`
      );

      // agrega caracteristicas
      $("#caracteristicas").append(
        `<p>weight: ${response.weight / 10} kg</p>
        <p>height: ${response.height * 10} cm</p>
        <p>id: ${response.id}`
      );

      // agrega tipos
      Object.keys(response.types).forEach((numero) =>
        $("#tipos").append(`<p>${response.types[numero].type.name}</p>`)
      );

      // agrega habilidades
      Object.keys(response.abilities).forEach((numero) =>
        $("#habilidades").append(
          `<p>${response.abilities[numero].ability.name}</p>`
        )
      );

      // agrega estadisticas
      Object.keys(response.stats).forEach((numero) =>
        $("#stats").append(
          `<p>${response.stats[numero].stat.name}:${response.stats[numero].base_stat}</p>`
        )
      );

      // agrega cadena evolutiva
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${response.name}/`)
        .then((response) => response.json())
        .then((response) =>
          fetch(`${response.evolution_chain.url}`)
            .then((response) => response.json())
            .then((response) => response.chain)
            .then((response) => {
              // esto asegura que minimo haya 2 en la cadena,de lo contrario cae en el catch
              $("#evoluciones").html(
                `<h4>${response.species.name}</h4><br><h5>↧↧</h5><br><h4>${response.evolves_to[0].species.name}</h4><br>`
              );
              if (
                response.evolves_to[0].evolution_details[0].min_level != null
              ) {
                $("#evoluciones").html(
                  `<h4>${response.species.name}</h4><br><h5>↧(lvl ${response.evolves_to[0].evolution_details[0].min_level})↧</h5><br><h4>${response.evolves_to[0].species.name}</h4>`
                );
              }
              // si son 3 en la cadena evolutiva
              if (response.evolves_to[0].evolves_to[0] != 0) {
                $("#evoluciones").html(
                  `<h4>${response.species.name}</h4><br><h5>↧↧</h5><br><h4>${response.evolves_to[0].species.name}</h4><br><h5>↧↧</h5><br><h4>${response.evolves_to[0].evolves_to[0].species.name}</h4>`
                );
                if (
                  response.evolves_to[0].evolution_details[0].min_level !=
                    null &&
                  response.evolves_to[0].evolves_to[0].evolution_details[0]
                    .min_level != null
                ) {
                  $("#evoluciones").html(
                    `<h4>${response.species.name}</h4><br><h5>↧(lvl ${response.evolves_to[0].evolution_details[0].min_level})↧</h5><br><h4>${response.evolves_to[0].species.name}</h4><br><h5>↧(lvl ${response.evolves_to[0].evolves_to[0].evolution_details[0].min_level})↧</h5><br><h4>${response.evolves_to[0].evolves_to[0].species.name}</h4>`
                  );
                } else if (
                  response.evolves_to[0].evolution_details[0].min_level != null
                ) {
                  $("#evoluciones").html(
                    `<h4>${response.species.name}</h4><br><h5>↧(lvl ${response.evolves_to[0].evolution_details[0].min_level})↧</h5><br><h4>${response.evolves_to[0].species.name}</h4><br><h5>↧↧</h5><br><h4>${response.evolves_to[0].evolves_to[0].species.name}</h4>`
                  );
                } else if (
                  response.evolves_to[0].evolves_to[0].evolution_details[0]
                    .min_level != null
                ) {
                  $("#evoluciones").html(
                    `<h4>${response.species.name}</h4><br><h5>↧↧</h5><br><h4>${response.evolves_to[0].species.name}</h4><br><h5>↧(lvl ${response.evolves_to[0].evolves_to[0].evolution_details[0].min_level})↧</h5><br><h4>${response.evolves_to[0].evolves_to[0].species.name}</h4>`
                  );
                }
              }
            })
        )
        .catch((error) => console.log("no tiene cadena evolutiva", error));
    })
    .catch((error) => alert("no reconozco este pokemon", error));
}

// fetch inicial
fetch("https://pokeapi.co/api/v2/pokemon?limit=40&offset=0")
  .then((response) => response.json())
  .then((response) => {
    Object.keys(response.results).forEach((numero) => {
      if (Number(numero) <= 4) {
        crearCarta(numero, response, 1, 1);
      } else if (Number(numero) <= 9 && Number(numero) > 4) {
        crearCarta(numero, response, 2, 1);
      } else if (Number(numero) <= 14 && Number(numero) > 9) {
        crearCarta(numero, response, 3, 1);
      } else if (Number(numero) <= 19 && Number(numero) > 14) {
        crearCarta(numero, response, 4, 1);
      } else if (Number(numero) <= 24 && Number(numero) > 19) {
        crearCarta(numero, response, 5, 1);
      } else if (Number(numero) <= 29 && Number(numero) > 24) {
        crearCarta(numero, response, 6, 1);
      } else if (Number(numero) <= 34 && Number(numero) > 29) {
        crearCarta(numero, response, 7, 1);
      } else if (Number(numero) <= 39 && Number(numero) > 34) {
        crearCarta(numero, response, 8, 1);
      }
    });
  })
  .catch((error) => console.log("error", error));

// contador de la pag
let page = 0;

// pasar a la siguiente pagina
$("#next").click(() => {
  page += 1;
  const maximoActual = page * 40 + 1;
  limpiarLista();

  fetch(`https://pokeapi.co/api/v2/pokemon?limit=40&offset=${page * 40}`)
    .then((response) => response.json())
    .then((response) => {
      Object.keys(response.results).forEach((numero) => {
        if (Number(numero) <= 4) {
          crearCarta(numero, response, 1, maximoActual);
        } else if (Number(numero) <= 9 && Number(numero) > 4) {
          crearCarta(numero, response, 2, maximoActual);
        } else if (Number(numero) <= 14 && Number(numero) > 9) {
          crearCarta(numero, response, 3, maximoActual);
        } else if (Number(numero) <= 19 && Number(numero) > 14) {
          crearCarta(numero, response, 4, maximoActual);
        } else if (Number(numero) <= 24 && Number(numero) > 19) {
          crearCarta(numero, response, 5, maximoActual);
        } else if (Number(numero) <= 29 && Number(numero) > 24) {
          crearCarta(numero, response, 6, maximoActual);
        } else if (Number(numero) <= 34 && Number(numero) > 29) {
          crearCarta(numero, response, 7, maximoActual);
        } else if (Number(numero) <= 39 && Number(numero) > 34) {
          crearCarta(numero, response, 8, maximoActual);
        }
      });
    })
    .catch((error) => console.log("error", error));
});

// pasar a la pagina anterior
$("#prev").click(() => {
  if (page - 1 >= 0) {
    page -= 1;
    const maximoActual = page * 40 + 1;
    limpiarLista();

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=40&offset=${page * 40}`)
      .then((response) => response.json())
      .then((response) => {
        Object.keys(response.results).forEach((numero) => {
          if (Number(numero) <= 4) {
            crearCarta(numero, response, 1, maximoActual);
          } else if (Number(numero) <= 9 && Number(numero) > 4) {
            crearCarta(numero, response, 2, maximoActual);
          } else if (Number(numero) <= 14 && Number(numero) > 9) {
            crearCarta(numero, response, 3, maximoActual);
          } else if (Number(numero) <= 19 && Number(numero) > 14) {
            crearCarta(numero, response, 4, maximoActual);
          } else if (Number(numero) <= 24 && Number(numero) > 19) {
            crearCarta(numero, response, 5, maximoActual);
          } else if (Number(numero) <= 29 && Number(numero) > 24) {
            crearCarta(numero, response, 6, maximoActual);
          } else if (Number(numero) <= 34 && Number(numero) > 29) {
            crearCarta(numero, response, 7, maximoActual);
          } else if (Number(numero) <= 39 && Number(numero) > 34) {
            crearCarta(numero, response, 8, maximoActual);
          }
        });
      })
      .catch((error) => console.log("error", error));
  }
});

// buscador
$("#boton-buscar").click(() => {
  const busqueda = $("#barra-buscar").val();
  busquedaUsuario(busqueda);
});

/*
fetch(`https://pokeapi.co/api/v2/pokemon/bulbasaur`)
.then((response) => response.json())
.then((response) => console.log(response))
*/

/*
fetch(`https://pokeapi.co/api/v2/pokemon-species/1/`)
.then((response2) => response2.json())
.then((response2) => console.log(response2));
 */

/*
fetch(`https://pokeapi.co/api/v2/evolution-chain/1/`)
.then((response2) => response2.json())
.then((response2) => console.log(response2));
*/

// <h5>↧↧</h5><br><h4>${response.evolves_to[0].evolves_to[0].species.name}</h4>`
