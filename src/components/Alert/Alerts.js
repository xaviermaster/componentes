import Swal from "sweetalert2";
import "./Alert.css";

  
const SuccessData = {
    title: "Great",
    type: "success",
    text: "Excelent!.",
  };

//export const Guardar
export const mostrarContenido= (tema,objetivo,explicacion,link)=>{
    let topic = tema.toLowerCase()
    let obje = objetivo.toLowerCase()
    let exp = explicacion.toLowerCase()
    if(tema.length === 0 || tema==='null'){
        topic = 'There is not topic for this lesson'
    }
    if(objetivo.length === 0 || objetivo==='null'){
        obje = 'There is not objective for this lesson'
    }
    if(explicacion.length === 0 || explicacion==='null'){
        exp = 'There is not explanation for this lesson'
    }
    Swal.fire(
        {
            title: "LESSON INFORMATION ",
            type: "success",
            //html: Array.isArray(respuesta)?"<p style='color:green; font-weight: bold;'>Correct Answer: </p>"+cadena:"<p style='color:green; font-weight: bold;'>Correct Answer: </p>"+respuesta,
            html: "<p style='color:red; font-weight: bold;'>Topic</p>"+topic+"<p> - </p> <p style='color:green; font-weight: bold;'>Objetive</p>"+obje+"<p> - </p> <p style='color:orange; font-weight: bold;'>Explication </p>"+exp,
            customClass: 'swal-wide',
            confirmButtonText: "Ok",
            showCloseButton: true,

            focusConfirm: false,
            confirmButtonText:
            "<a href="+link+">START</a>",

        },
    ).then((result) => {
        if (result.value) {
            
            // window.location = "/modulo/1/grammar/2";
        } else {
            
        }
    });
}


export const mostrarAlertaError= (respuesta)=>{
    let cadena = "";
    if(Array.isArray(respuesta)){
        respuesta.forEach((item)=>{
            cadena+= (item + " <br/>")
        })
    }

    Swal.fire(
        {
            title: "INCORRECT",
            icon: "error",
            html: Array.isArray(respuesta)?"<p style='color:green; font-weight: bold;'>Correct Answer: </p>"+cadena:"<p style='color:green; font-weight: bold;'>Correct Answer: </p>"+respuesta,
            customClass: 'swal-wide',
            confirmButtonText: "Ok",
        },
    ).then((result) => {
        if (result.value) {
            
            // window.location = "/modulo/1/grammar/2";
        } else {
            
        }
    });
}

export const mostrarAlertaErrorCuenta= async ()=>{

    var value = await Swal.fire(
        {
            title: "Advertencia",
            type: "error",
            html: "<p>¿Está seguro de cancelar el registro del usuario?  </p>",
            customClass: 'swal-wide',
            confirmButtonText: "Continuar",
            showCancelButton: true,
        },
    )
    return value
}

export const Bienvenida = async () =>{
    Swal.fire({
        title: 'BIENVENIDO',
        html: '<h1 className="text-gray-700 font-semibold text-xs  px-8 md:text-sm">Para comenzar seleccione una de las actividades   <p style="color:green">| Writing - Vocabulary - Reading - Grammar |</p> disponibles en el book 1 y resuelva sus lecciones </h1>',
        icon: 'info',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
}

export const mostrarAlertaDrive= async ()=>{
    let a= document.createElement('a');
    a.target= '_blank';
    a.href= "https://drive.google.com/drive/folders/1VpsHlAYQ021jdXfa06nX_wChrxjce7kn";
    
    Swal.fire({
        title: '<strong>AVISO </strong>',
        icon: 'info',
        html:
          'Accedera a un repositorio en <b> Google Drive</b> ', 
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Continuar',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
          '<i class="fa fa-thumbs-down">Cerrar</i>',
        cancelButtonAriaLabel: 'Thumbs down'
      }).then((result) => {
        if (result.isConfirmed) {
            //window.location.href = "https://drive.google.com/drive/folders/1VpsHlAYQ021jdXfa06nX_wChrxjce7kn";
            a.click();
        }
      })

}

export const AlertaLeccion= async (respuesta)=>{

    var value = Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: respuesta
      })
    return value
    
}
export const Alertaskip= async (respuesta)=>{
    let cadena = "";
    if(Array.isArray(respuesta)){
        respuesta.forEach((item)=>{
            cadena+= (item + " <br/>")
        })
    }
    Swal.fire(
        'SKIP',
        Array.isArray(respuesta)?"<p style='color:green; font-weight: bold;'>Correct Answer: </p>"+cadena:"<p style='color:green; font-weight: bold;'>Correct Answer: </p>"+respuesta,
        'question'
      )
    
}

export const finPrueba= (aciertos, total)=>{
    Swal.fire(
        {
            title: "Resultado",
            type: "success",
            text: "You have answered " + aciertos+ " questions correctly out of "+total,
            confirmButtonText: "Ok",
        },
    ).then((result) => {
        if (result.value) {
            ////console.log('.')
            window.location = "/evaluacion";
        } else {
            
        }
    });
}


export const mostrarAlertaExito= ()=>{
    Swal.fire({
        icon: 'success',
        ...SuccessData
    }).then((result) => {
        if (result.value) {
            
            // window.location = "/modulo/1/grammar/3";
        } else {
            
        }
    });
}


export const mostrarAlertaExitoFin= (txt)=>{
    Swal.fire({
        title: "Lesson Completed !",
        icon: 'success',
        type: "success",
        text: txt,
    }).then((result) => {

    });
}


export const mostrarImagen = (img) =>{
    Swal.fire({
        imageUrl: img, 
        imageAlt: "Text img", 
        showCloseButton: true
        })
    }

export const mostrarAlertaSalir= ()=>{
    Swal.fire(
        {
            title: "Are you sure?",
            type: "error",
            text: "You are almost to exit, you will loose all your progress.",
            confirmButtonText: "Ok",
            showCancelButton: true,
        }
    ).then((result) => {
        if (result.value) {
            window.location = "/dashboard";
        } else {
            
        }
    });
}

export const mostrarAlertaSalirEva= ()=>{
    Swal.fire(
        {
            title: "Are you sure?",
            type: "error",
            text: "You are almost to exit, you will loose all your progress.",
            confirmButtonText: "Ok",
            showCancelButton: true,
        }
    ).then((result) => {
        if (result.value) {
            window.location = "/evaluacion";
        } else {
            
        }
    });
}
