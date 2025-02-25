import React, { useContext, useEffect, useState } from "react";

import {
  mostrarAlertaError,
  mostrarAlertaExito,
  AlertaLeccion,
  Alertaskip,
  mostrarAlertaExitoFin,
  mostrarExitoEditar,
} from "../../Alert/Alerts";
import { AuthContext } from "../../../context/AuthContext";
import { updateProgress } from "../../../api/Progress";

var USER = null;
const EjercicioFooter = (props) => {
  const { user } = useContext(AuthContext);
  USER = user
  const [enviar, setEnviar] = useState(false);
  useEffect(() => {
    if (speechSynthesis.ispeaking) {
      speechSynthesis.cancel();
    }
  }, []);

  const sendRespuesta = (props) => {
    setEnviar(true);
    validarRespuesta(props);
    setEnviar(false);
  };

  return (
    <div className="mx-8 ">
      <div className="flex justify-between flex-row container  ">
        <div className=" ">
          <button
            disabled={false}
            className="bg-transparent uppercase text-md md:text-xl tracking-wider  my-2 text-gray-500 font-semibold hover:text-gray-400 py-2 px-4 border border-gray-500 hover:border-gray-500 rounded"
            onClick={
              () => {
                noEsCorrecta(props, skipExercise(props), 1);
              } /*props.onClick()*/
            }
          >
            skip
          </button>
        </div>
        <div className="">
          <button
            disabled={enviar}
            className=" text-md md:text-xl tracking-wider uppercase  my-2 text-white bg-green-500 font-semibold  hover:bg-green-400 py-2 px-4 border border-green-500 hover:border-green-600 rounded "
            onClick={() => sendRespuesta(props)}
          >
            check
          </button>
        </div>
      </div>
    </div>
  );
};

const skipExercise = (props) => {
  let tipo_ejercicio = props.ejercicio.props.ejercicio.type;
  // eslint-disable-next-line no-unused-vars
  let contadorRespuestas = props.contadorRespondidas;

  if (tipo_ejercicio === "opcion_correcta_1") {
    let correctAnswer = props.ejercicio.props.ejercicio.options
      .filter((option) => option.answer === true)[0]
      .item.toString()
      .trim();
    return correctAnswer;
  } else if (tipo_ejercicio === "opcion_correcta_n") {
    let correctAnswer = [];
    props.ejercicio.props.ejercicio.options.forEach((option) => {
      if (option.answer === true) {
        correctAnswer.push(option.item);
      }
    });
    return correctAnswer;
  } else if (tipo_ejercicio === "ordenar") {
    // eslint-disable-next-line no-unused-vars
    let hijos = [...props.miref.current.children];
    let respuestaBackEndBase = [];
    //se quita la ref
    const respuestasBack = Array.from(
      props.ejercicio.props.ejercicio.options
    ).map((item) => [...item]);
    // eslint-disable-next-line array-callback-return
    const respuestasBackEndOrdenadas = [...respuestasBack].map((item) => {
      if (item) {
        item = [...item.sort((a, b) => (a.answer > b.answer ? 1 : -1))];
        let texto = "";
        let textoBase = "";
        for (let i = 0; i < item.length; i++) {
          const element = item[i];
          texto += element.item;
          textoBase += element.item + " ";
        }

        respuestaBackEndBase.push(textoBase + " /n");
        // eslint-disable-next-line no-unused-vars
        texto = texto.replace(/\s/g, "");

        return textoBase;
      }
    });

    return respuestasBackEndOrdenadas;
  } else if (tipo_ejercicio === "true_false") {
    let respuestasBack = [];

    // eslint-disable-next-line array-callback-return
    props.ejercicio.props.ejercicio.body.map((item, index) => {
      // eslint-disable-next-line array-callback-return
      item.answer.map((item2, index2) => {
        if (item2[1]) {
          respuestasBack.push(item2[0]);
        }
      });
    });

    return respuestasBack;
  } else if (tipo_ejercicio === "completar_texto") {
    let respuestaBackEnd = [];

    //rellena las respuestas del back end y las formatea, le quita los espacios en blanco y los transforma a minusculas
    props.ejercicio.props.ejercicio.body.forEach((item) => {
      let answer = item.answer.toString().toLowerCase();
      answer = answer.replace(/\s/g, "");
      respuestaBackEnd.push(answer);
    });

    return respuestaBackEnd;
  } else if (
    tipo_ejercicio === "emparejar" ||
    tipo_ejercicio === "emparejar_img"
  ) {
    let respuestasBack = [];
    props.ejercicio.props.ejercicio.body.forEach((item) => {
      respuestasBack.push(item.answer);
    });
    return respuestasBack;
  }
};

async function noEsCorrecta(props, respuesta, id) {
  //Se crea otro stack para guardar las respuestas pendiente, se elimina el ejercicio actual se trabaja con la stack creada y se randomiza la stack
  //Se muestra una alerta de que la respuesta es incorrecta
  let aux = [...props.juego];
  let actual = props.juego.pop();

  //Ahora lo que se hace es randomizar el array para que la siguiente pregunta sea random y para que la siguiente no sea la misma a la ctual

  aux = randomizarArray(aux);

  aux = aux.filter((e) => e !== actual);

  aux.unshift(actual);
  // eslint-disable-next-line eqeqeq
  if (id == 1) {
    Alertaskip(respuesta);
  } else {
    mostrarAlertaError(respuesta);
  }

  props.setJuego(aux);
}

const validarRespuesta = async (props) => {
  let tipo_ejercicio = props.ejercicio.props.ejercicio.type;
  let contadorRespuestas = props.contadorRespondidas;

  if (tipo_ejercicio === "opcion_correcta_1") {
    let hijos = props.miref.current.children;
    await verificarOpcion_Correcta_1(props, hijos, contadorRespuestas);
  } else if (tipo_ejercicio === "opcion_correcta_n") {
    let hijos = props.miref.current.children;
    await verificarOpcion_Correcta_n(props, hijos, contadorRespuestas);
  } else if (tipo_ejercicio === "ordenar") {
    let hijos = [...props.miref.current.children];
    let respuestaBackEndBase = [];
    //se quita la ref
    const respuestasBack = Array.from(
      props.ejercicio.props.ejercicio.options
    ).map((item) => [...item]);
    // eslint-disable-next-line array-callback-return
    const respuestasBackEndOrdenadas = [...respuestasBack].map((item) => {
      if (item) {
        item = [...item.sort((a, b) => (a.answer > b.answer ? 1 : -1))];
        let texto = "";
        let textoBase = "";
        for (let i = 0; i < item.length; i++) {
          const element = item[i];
          texto += element.item;
          textoBase += element.item + " ";
        }
        respuestaBackEndBase.push(textoBase + " \n");
        texto = texto.replace(/\s/g, "");
        return texto;
      }
    });
    await verificarOrdenar(
      props,
      hijos,
      contadorRespuestas,
      respuestasBackEndOrdenadas,
      respuestaBackEndBase
    );
  } else if (tipo_ejercicio === "true_false") {
    let hijos = props.miref.current.children;
    //console.log(hijos);
    await verificarVerdadero_Falso(props, hijos, contadorRespuestas);
  } else if (tipo_ejercicio === "completar_texto") {
    let hijos = Array.from(props.miref.current.children);
    await verificarCompletar_Texto(props, hijos, contadorRespuestas);
  } else if (
    tipo_ejercicio === "emparejar" ||
    tipo_ejercicio === "emparejar_img"
  ) {
    let hijos = Array.from(props.miref.current.children);
    await verificarEmparejar(props, hijos, contadorRespuestas);
  } else {
    noEsCorrecta(props, "asd");
  }
};

const verificarEmparejar = async (props, hijos, contadorRespuestas) => {
  let respuestaUser = [];
  let respuestasBack = [];
  let esCorrecta = false;
  props.ejercicio.props.ejercicio.body.forEach((item) => {
    respuestasBack.push(item.answer);
  });
  let faltaMarcar = false;
  // eslint-disable-next-line array-callback-return
  hijos.some((element) => {
    if (
      element.getElementsByClassName("opt-1")[0].innerText ===
      "Waiting answer..."
    ) {
      faltaMarcar = true;
      return true;
    }
  });
  if (faltaMarcar) {
    AlertaLeccion("All fields must be filled");
    //alert("All fields must be filled");
  } else {
    // eslint-disable-next-line array-callback-return
    hijos.some((element) => {
      respuestaUser.push(element.getElementsByClassName("opt-1")[0].innerText);
    });
    if (JSON.stringify(respuestaUser) === JSON.stringify(respuestasBack)) {
      esCorrecta = true;
    } else {
      esCorrecta = false;
    }
    //console.log(JSON.stringify(respuestaUser), JSON.stringify(respuestasBack));
    if (esCorrecta) {
      enviarSiEsCorrecta(props, contadorRespuestas);
    } else {
      noEsCorrecta(props, respuestasBack);
    }
  }
};

const verificarCompletar_Texto = async (props, hijos, contadorRespuestas) => {
  let respuestaUser = [];
  let respuestaBackEnd = [];

  //rellena las respuestas del back end y las formatea, le quita los espacios en blanco y los transforma a minusculas
  props.ejercicio.props.ejercicio.body.forEach((item) => {
    let answer = item.answer.toString().toLowerCase();
    answer = answer.replace(/\s/g, "");
    respuestaBackEnd.push(answer);
  });

  //rellena las respuestas del usuario y las formatea, le quita los espacios en blanco y los transforma a minusculas
  hijos.forEach((item) => {
    let answer = item.children[1].value.toString().toLowerCase();
    answer = answer.replace(/\s/g, "");
    respuestaUser.push(answer);
  });

  let aRespondido = true;
  respuestaUser.forEach((item, index) => {
    if (item === "") {
      aRespondido = false;
    }
  });

  let esCorrecta = false;

  if (aRespondido) {
    if (JSON.stringify(respuestaUser) === JSON.stringify(respuestaBackEnd)) {
      esCorrecta = true;
    } else {
      esCorrecta = false;
    }
  } else {
    AlertaLeccion("All fields must be filled");
    //console.log(respuestaBackEnd);
  }
  if (aRespondido && esCorrecta) {
    enviarSiEsCorrecta(props, contadorRespuestas);
  } else if (aRespondido && !esCorrecta) {
    noEsCorrecta(props, respuestaBackEnd);
  }

  // //console.log(hijos[0].children[1].value);
};

const verificarVerdadero_Falso = async (props, hijos, contadorRespuestas) => {
  let respuestasBack = [];

  // eslint-disable-next-line array-callback-return
  props.ejercicio.props.ejercicio.body.map((item, index) => {
    // eslint-disable-next-line array-callback-return
    item.answer.map((item2, index2) => {
      if (item2[1]) {
        respuestasBack.push(item2[0]);
      }
    });
  });
  let respuestasUser = [];
  //obtengo el div del ejercicio y lo guardo en un array

  for (let index = 0; index < hijos.length; index++) {
    const element = Array.from(hijos[index].getElementsByTagName("button"));
    element.forEach((item) => {
      if (item.classList.contains("activado")) {
        respuestasUser.push(
          item.innerText.toString().replace(/\n/g, "").trim()
        );
      }
    });
  }

  let esCorrecta = false;

  if (JSON.stringify(respuestasUser) === JSON.stringify(respuestasBack)) {
    esCorrecta = true;
  } else {
    esCorrecta = false;
  }

  if (esCorrecta) {
    enviarSiEsCorrecta(props, contadorRespuestas);
  } else {
    noEsCorrecta(props, respuestasBack);
  }
};

const verificarOrdenar = async (
  props,
  hijos,
  contadorRespuestas,
  respuestasBackEndOrdenadas,
  respuestaBackEndBase
) => {
  let esCorrecta = false;
  let respuestasUser = [];
  //aca en este for se agarran los div que tengan id agarrar el texto y agregarlo a un array
  for (let i = 0; i < hijos.length; i++) {
    console.log("hijos ", i + 1, hijos[i])
    if (hijos[i].id === "arrastrar") {
      let respuesta = hijos[i].children[1].innerText
        .toString()
        .replace(/\n/g, " ")
        .trim();

      respuesta = respuesta.replace(/\s/g, "");
      respuesta.replace(/\s\s+/g, " ");
      respuestasUser.push(respuesta);
    }
  }
  if (
    JSON.stringify(respuestasUser) ===
    JSON.stringify(respuestasBackEndOrdenadas)
  ) {
    esCorrecta = true;
  } else {
    esCorrecta = false;
  }
  //console.log(respuestasUser, respuestasBackEndOrdenadas);

  if (esCorrecta) {
    enviarSiEsCorrecta(props, contadorRespuestas);
  } else {
    noEsCorrecta(props, respuestaBackEndBase);
  }
};

const verificarOpcion_Correcta_1 = async (
  props,
  hijos,
  contadorRespondidas
) => {
  let esCorrecta = false;
  let userSelection;
  let hasSelected = false;

  for (let i = 0; i < hijos.length; i++) {
    if (hijos[i].classList.contains("activado")) {
      hasSelected = true;
      userSelection = hijos[i].innerText.toString().trim();
      break;
    }
  }
  if (hasSelected) {
    //Se obtiene la respuesta correcta para esto utilizo la funcion filter, itero las opciones de los ejercicios y para cada opcion si la respuesta es correcta se guarda en un arreglo
    let correctAnswer = props.ejercicio.props.ejercicio.options
      .filter((option) => option.answer === true)[0]
      .item.toString()
      .trim();
    if (correctAnswer === userSelection) {
      esCorrecta = true;
    }

    if (esCorrecta) {
      enviarSiEsCorrecta(props, contadorRespondidas);
    } else {
      noEsCorrecta(props, correctAnswer);
    }
  } else {
    AlertaLeccion("You did not select anything");
  }
};


const verificarOpcion_Correcta_n = async (props, hijos) => {
  let esCorrecta = false;
  let userSelection = [];
  let hasSelected = false;

  // Filtrar elementos válidos
  hijos = Array.from(hijos).filter((hijo) => hijo.nodeType === 1);

  for (let i = 0; i < hijos.length; i++) {
    if (hijos[i].classList.contains("activado")) {
      hasSelected = true;
      userSelection.push(hijos[i].textContent.trim());
    }
  }

  if (hasSelected) {
    let correctAnswer = [];
    const options = Array.isArray(props.ejercicio.props.ejercicio.options)
      ? props.ejercicio.props.ejercicio.options
      : [];

    options.forEach((option) => {
      if (option.answer === true) {
        correctAnswer.push(option.item.trim());
      }
    });

    // Comparar las respuestas
    if (userSelection.length === correctAnswer.length) {
      userSelection.sort((a, b) => a.localeCompare(b));
      correctAnswer.sort((a, b) => a.localeCompare(b));

      if (userSelection.join("") === correctAnswer.join("")) {
        esCorrecta = true;
      }
    }

    if (esCorrecta) {
      enviarSiEsCorrecta(props);
    } else {
      noEsCorrecta(props, correctAnswer);
    }
  } else {
    AlertaLeccion("You did not select anything");
  }
};


function randomizarArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

async function enviarSiEsCorrecta(props, contadorRespondidas) {
  //Se es corecta se necesita saber si se ha llegado al final de la lista de ejercicios, de ser así, se debe de terminar el juego y guardar el progreso,
  //caso contrario se debe de pasar al siguiente ejercicio

  if (props.juego.length - 1 !== 0) {
    mostrarAlertaExito(`Correct answer`);
    props.juego.pop();
    props.setContadorRespondidas(contadorRespondidas + 1);
    return;
  }
  let tasks_id =
    window.location.href.split("/")[
    window.location.href.split("/").length - 1
    ];
  let dataT = null;
  try {
    dataT = await updateProgress({
      user_id: USER._id,
      task_id: tasks_id,
    });
  } catch (error) {
    console.log(error);
    const response_alert = await mostrarExitoEditar("Error", "Error al guardar el progreso",  "error");
    if (response_alert) {
      window.location = "/dashboard";
    }
  }

  const { res } = dataT;
  if (
    res === "Task Registrada" ||
    res === "Task ya ha sido registrado en ese usuario"
  ) {
    props.setContadorRespondidas(contadorRespondidas + 1);
    props.juego.pop();
    props.setFinJuego(true);
    mostrarAlertaExitoFin(`Excellent Work `);
  } else {
    const response_alert = await mostrarExitoEditar( "Error", "Error al guardar el progreso", "error");
    if (response_alert) {
      //retorna al dashboard
      window.location = "/dashboard";
    }
  }
}

export default EjercicioFooter;
