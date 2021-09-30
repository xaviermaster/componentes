import React, {useRef } from 'react'
import ProgressBar from './ProgressBar'

//load ejercicio.css
import './Ejercicio.css'
import EjercicioFooter from './EjercicioFooter'
import { OpcionCorrecta_1 } from './OpcionCorrecta_1'
import { OpcionCorrecta_n } from './OpcionCorrecta_n'
import Arrastrar from './Arrastrar'
import VerdaderoFalso from './VerdaderoFalso'


export const Ejercicio = (props) => {

    const [juego, setJuego] = React.useState([]);
    const [cargado, setCargado] = React.useState(true);
    const [finJuego, setFinJuego] = React.useState(false);
    const [contadorRespondidas, setContadorRespondidas] = React.useState(0);
    const [preguntasValidas, setPreguntasValidas] = React.useState(0);

    const panelJuego = useRef(null);
    

    React.useEffect(() => {
        // const cargarVista = async() => {
        //     await cargarEjercicios(juego, setJuego, panelJuego, setCargado, finJuego, ejercicios);
        // }
        if(juego.length === 0){
            cargarEjercicios2(props.ejercicios, setJuego, panelJuego,setCargado,preguntasValidas,setPreguntasValidas);
        }
        

    }, []) //cuando haya un cambio de pregunta se actualiza el estado del componente.


    return (
        <div className={"ejercicio"}>
            
            {cargado || <ProgressBar totalEjercicios = {preguntasValidas} resueltos ={contadorRespondidas} contadorRespondidas={contadorRespondidas} />}
            {finJuego? <h2 className="container m-auto p-auto w-6/12">Fin del juego...</h2>:juego[juego.length-1]}
            {/* Eejercicio footer se encarga de verificar mediante el botoòn de comprobar la respuesta correcta.
            Para esto es necesario enviar el juego actual es decir juego[juego.length-1]	y el panel del juego actual, es decir lo que està en el medio de la pantalla, que es el juego actual.
            Tambièn se debe de enviar el contador para ir incrementando el estado de respondidas. */}
        

            {finJuego || <EjercicioFooter ejercicio={juego[juego.length-1]} juego={juego} setJuego = {setJuego} cargado={cargado} setCargado={setCargado} setFinJuego={setFinJuego} miref={panelJuego} contadorRespondidas={contadorRespondidas} setContadorRespondidas={setContadorRespondidas}/>}
        </div>
    )
}

const cargarEjercicios2 = (ejercicios, setJuego, panelJuego,setCargado,preguntasValidas,setPreguntasValidas)=>{

    //los ejercicios ya están cargando desde la vista anterior, solo se necesita una estructura que almacene los ejercicios de forma con componente
    // para esto se iterra atravez de ejercicios y en una variable llamada Juego se guardan los ejercicios en forma de componentes

    //finalmente iteramos los ejercicios, preguntamos el tipo, cargamos la variable juego con el tipo de juego correspondiente y una vez se cargan todos los juegos
    //se actualiza el estado de cargando.

    //De esta manera la renderización del mensaje con estado cargando se va a mostrar hasta que se carguen todos los ejercicios.
    let contador = 0;
    ejercicios.map((ejercicio, index) => {
        
        if(ejercicio.type === "opcion_correcta_1"){  
            if(!ejercicio.img)
            
            setJuego(juego => [...juego, <OpcionCorrecta_1 key={index} ejercicio={ejercicio} miref={panelJuego}/>])
            contador++;

            //aca leon lo que se debe de hacer es pasarle una propiedad que diga, tieneImagen
            //luego en la vista OpcionCorrecta cargas unos estilos o otros dependiendo de si tieneImagen o no.
        }
        
        else{
            console.log(ejercicio);
        } 
    }
    )
    setPreguntasValidas(contador);
    setCargado(false);

}
