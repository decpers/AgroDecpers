$(function () {
  /**************************************************
   * Area de asignación de eventos y captura de Id's *
   ***************************************************/

  $("#limpiarTodo").click(resetearTodo);
  $("#btnCalcularMonto").click(calcularMontoTotal);

  var pesoBruto = $("#inputPesoBruto");
  var pesoCamion = $("#inputPesoCamion");
  var pesoLibras = $("#inputPesoLibras");
  var inputPrecio = $("#inputPrecio");
  var btnCalcularSacos = $("#btnHabilitarCalcular");
  var cajaSacosCalculados = $("#cajaSacosCalculados");
  var cajaMostrarMonto = $("#cajaMostrarMonto");
  var cajaIngresarPrecio = $("#cajaIngresarPrecio");
  var añoActual = $("#añoActual");
  /**
   * Configuraciones iniciales
  */
  btnCalcularSacos.click(calcularTodo);
  añoActual.html(new Date().getFullYear())

  /******************************
   * Area de Funciones generales *
   *******************************/

  function calcularTodo() {
    var sacosTotales =
      ((pesoBruto.val() - pesoCamion.val()) * 2.2) / pesoLibras.val();
    var sacosTotalesTruncados = Math.trunc(sacosTotales * 100) / 100;

    ocultarCajasDeMensajesYPrecio();

    if (btnCalcularSacos.html() == "Habilitar") {
      habilitarTodo();
      let tamañoMaximo = 3;
      let tamañoPrecio = 5;

      document.getElementById("inputPesoLibras").oninput = function () {
        if (this.value.length > tamañoMaximo)
          this.value = this.value.slice(0, tamañoMaximo);
      };

      document.getElementById("inputPrecio").oninput = function () {
        if (this.value.length > tamañoPrecio)
          this.value = this.value.slice(0, tamañoPrecio);
      };
    } else {
      quitarClasesValidoInvalido();

      if (
        pesoBruto.val() === "" &&
        pesoCamion.val() === "" &&
        pesoLibras.val() === ""
      ) {
        agregarClaseInvalidATodoslosInputs();
        mostrarCajaFaltanCampos();
        pesoBruto.focus();
      } else {
        if (pesoBruto.val() === "") {
          pesoBruto.addClass("is-invalid");
          mostrarCajaFaltanCampos();

          if (pesoCamion.val() == "") {
            pesoCamion.addClass("is-invalid");
            pesoLibras.addClass("is-valid");
            mostrarCajaFaltanCampos();
          } else {
            pesoCamion.addClass("is-valid");
            pesoBruto.focus();

            if (pesoLibras.val() === "") {
              pesoLibras.addClass("is-invalid");
            } else {
              pesoLibras.addClass("is-valid");
            }
          }
        } else {
          pesoBruto.addClass("is-valid");

          if (pesoCamion.val() === "") {
            pesoCamion.addClass("is-invalid");
            pesoCamion.focus();
            mostrarCajaFaltanCampos();

            if (pesoLibras.val() === "") {
              pesoLibras.addClass("is-invalid");
              pesoCamion.focus();
              mostrarCajaFaltanCampos();
            } else {
              pesoLibras.classList.addClass("is-valid");
            }
          } else {
            pesoCamion.removeClass("is-invalid");
            pesoCamion.addClass("is-valid");

            if (pesoLibras.val() === "") {
              pesoLibras.addClass("is-invalid");
              pesoLibras.focus();
              mostrarCajaFaltanCampos();
            } else {
              pesoLibras.addClass("is-valid");

              if (sacosTotales > 0) {
                if (pesoLibras.val() > 0) {
                  mostrarTotalSacos();
                  calcularMontoTotal();
                  resetearBotonHabilitar();
                  desabilitarInputs();
                } else {
                  pesoLibras.addClass("is-invalid");
                  cajaSacosCalculados.html("Ingrese valores mayores a '0'");
                  cajaSacosCalculados.removeClass("d-none");
                  cajaSacosCalculados.addClass("alert-danger");
                  pesoLibras.focus();
                }
              } else {
                pesoBruto.focus();
                pesoBruto.addClass("is-invalid");
                cajaSacosCalculados.html(
                  "El peso bruto debe ser mayor que el peso del camión."
                );
                cajaSacosCalculados.removeClass("d-none");
                cajaSacosCalculados.addClass("alert-danger");
              }
            }
          }
        }
      }
    }
  }

  function resetearTodo() {
    limpiarTodosLosInputs();
    desabilitarInputs();
    resetearBotonHabilitar();
    quitarClasesValidoInvalido();
    ocultarCajasDeMensajesYPrecio();
  }

  function limpiarTodosLosInputs() {
    pesoBruto.val("");
    pesoCamion.val("");
    pesoLibras.val("");
  }

  function ocultarCajasDeMensajesYPrecio() {
    cajaSacosCalculados.addClass("d-none");
    cajaMostrarMonto.addClass("d-none");
    cajaIngresarPrecio.addClass("d-none");
  }

  function calcularMontoTotal() {
    let sacos = new Decimal(calcularSacos()).toNumber()
    let precio = new Decimal(inputPrecio.val());
    var montoTotal = precio.times(sacos).toFixed(2, 1);
    cajaMostrarMonto.removeClass("d-none");
    cajaIngresarPrecio.removeClass("d-none");
    cajaMostrarMonto.html(
      "En " +
        sacos +
        " sacos a " +
        precio +
        " dólares son " +
        montoTotal +
        " dólares."
    );
  }

  function quitarClasesValidoInvalido() {
    pesoBruto.removeClass("is-invalid");
    pesoBruto.removeClass("is-valid");
    pesoCamion.removeClass("is-invalid");
    pesoCamion.removeClass("is-valid");
    pesoLibras.removeClass("is-invalid");
    pesoLibras.removeClass("is-valid");
  }

  function mostrarCajaFaltanCampos() {
    cajaSacosCalculados.html("Complete todos los campos.");
    cajaSacosCalculados.removeClass("d-none");
    cajaSacosCalculados.addClass("alert-danger");
  }

  function habilitarTodo() {
    btnCalcularSacos.html("Calcular");
    btnCalcularSacos.removeClass("btn-success");
    btnCalcularSacos.addClass("btn-primary");
    pesoBruto.attr("disabled", false);
    pesoCamion.attr("disabled", false);
    pesoLibras.attr("disabled", false);
    inputPrecio.val(0);
    pesoBruto.focus();
  }

  function desabilitarInputs() {
    pesoBruto.attr("disabled", true);
    pesoCamion.attr("disabled", true);
    pesoLibras.attr("disabled", true);
  }

  function agregarClaseInvalidATodoslosInputs() {
    pesoBruto.addClass("is-invalid");
    pesoCamion.addClass("is-invalid");
    pesoLibras.addClass("is-invalid");
  }

  function resetearBotonHabilitar() {
    btnCalcularSacos.removeClass("btn-primary");
    btnCalcularSacos.addClass("btn-success");
    btnCalcularSacos.html("Habilitar");
  }

  function calcularSacos() {
    let pBruto = new Decimal(pesoBruto.val());
    let pCamion = new Decimal(pesoCamion.val());
    let pLibras = new Decimal(pesoLibras.val());
    let pNeto = pBruto.minus(pCamion).toNumber();
    let librasTotales = new Decimal(pNeto).times(2.2).toNumber();
    let sacosTotales = new Decimal(librasTotales).dividedBy(pLibras);
    return new Decimal(sacosTotales.toFixed(2, 1)).toNumber()
  }

  function mostrarTotalSacos() {
    let sacosTotales = calcularSacos()
    cajaSacosCalculados.removeClass("d-none");
    cajaSacosCalculados.removeClass("alert-danger");
    cajaSacosCalculados.html(
      "Respuesta: Son " + sacosTotales + " sacos."
    );
  }
});
