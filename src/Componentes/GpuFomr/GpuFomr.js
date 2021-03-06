import React, { useEffect } from "react";
import { useState } from 'react';
import { db } from '../FireBase/Firebase'
import { useForm } from "react-hook-form";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Alert from "@material-ui/lab/Alert";
import firebase from 'firebase/app';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '30ch',
    },
    "& .MuiOutlinedInput-input": {
      color: "white"
    },
    '& .MuiInputBase-root': {
      color: 'white',
    },
    "& .MuiInputLabel-root": {
      color: "rgb(184, 180, 180)"
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "purple"
    },

    '& .MuiInput-underline:before': {
      borderBottomColor: 'rgb(184, 180, 180)',
    },

    '& .MuiInput-underline:after': {
      borderBottomColor: '#ac4caf',
    },



  },
}));


const GpuFomr = props => {
  const classes = useStyles();

  const { register, /* errors, */ handleSubmit } = useForm({});


  const [confirmet, setConfirmet] = useState();
  const [formState, setFormState] = useState();
  const handleChange = event => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    })
  }


  const onSubmit = async data => {
    registro();
  };

  //validacion de usuario admin
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        db.collection("users").where("email", "==", user.email)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (!doc.data().userType === "ROLE_ADMIN") {
                window.location = '/home';
              }

            })

          });

      } else {

        window.location = '/home';

      }
    })
  })

//subida de info a bbdd
  const registro = React.useCallback(async () => {
    try {
      console.log(formState)
      db.collection("Gpu").add({
        name: formState.name,
        marca: formState.marca,
        modelo: formState.modelo,
        ram: parseFloat(formState.ram),
        tdp: parseFloat(formState.tdp),
        transistores: parseFloat(formState.transistores),
        semiConductores: parseFloat(formState.semiConductores),
        pciExpress: parseFloat(formState.pciExpress),
        velocidadRProcesador: parseFloat(formState.velocidadRProcesador),
        indiceDePixeles: parseFloat(formState.indiceDePixeles),
        puntoFlotante: parseFloat(formState.puntoFlotante),
        indiceTextura: parseFloat(formState.indiceTextura),
        velocidadMemoriaGpu: parseFloat(formState.velocidadMemoriaGpu),
        unidadesDeTonalidad: parseFloat(formState.unidadesDeTonalidad),
        velocidadMemoriaEfectiva: parseFloat(formState.velocidadMemoriaEfectiva),
        memoriaMaximaAnchoBanda: parseFloat(formState.memoriaMaximaAnchoBanda),
        capacidadBus: parseFloat(formState.capacidadBus),
        memoriaGDD: parseFloat(formState.memoriaGDD),
        turboGpu: parseFloat(formState.turboGpu),
        tmus: parseFloat(formState.tmus),
        rops: parseFloat(formState.rops),






      });
      console.log(formState)
      setConfirmet("Se Introducido los datos con exito")


    } catch (error) {
      console.log(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  return (
    <div className="formulario">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <div className="log-form">
          <form className={classes.root} onSubmit={handleSubmit(onSubmit)} id="formulario" >

            <TextField label="Nombre" name="name"
              onChange={handleChange}
              ref={register}
            />
            <br />


            <TextField label="Marca" name="marca"
              onChange={handleChange}
              ref={register}
            />
            <br />

            <TextField label="Modelo" name="modelo"
              onChange={handleChange}
              ref={register}
            />
            <br />

            <TextField label="Tdp" name="tdp"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />

            <br />




            <TextField label="Transistores" name="transistores"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />

            <br />
            <TextField label="Semiconductores" name="semiConductores"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />

            <br />
            <TextField label="Pci Express" name="pciExpress"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />

            <br />
            <TextField label="Velocidad Reloj Procesador" name="velocidadRProcesador"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />

            <br />
            <TextField label="Índice De Pixeles" name="indiceDePixeles"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />
            <br />
            <TextField label="Punto Flotante" name="puntoFlotante"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />
            <br />
            <TextField label="Velocidad Memoria Gpu" name="velocidadMemoriaGpu"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />

            <TextField label="Índice Textura" name="indiceTextura"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />

            <br />



            <TextField label="Unidades De Tonalidad" name="unidadesDeTonalidad"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />

            <TextField label="Unidades de mapeo" name="tmus"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />

            <TextField label="Turbo Gpu" name="turboGpu"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />

            <TextField label="Unidades Generación Salida" name="rops"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />


            <TextField label="Velocidad Memoria Efectiva" name="velocidadMemoriaEfectiva"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />

            <TextField label="Memoria Máxima de Ancho Banda" name="memoriaMaximaAnchoBanda"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />

            <TextField label="Ram" name="ram"
              type="number"
              step="0.01"
              onChange={handleChange}
              ref={register}
            />
            <br />

            <TextField label="Capacidad del Bus" name="capacidadBus"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />

            <TextField label="Memoria GDD" name="memoriaGDD"
              type="number"
              step="0.01"
              ref={register}
              onChange={handleChange}
            />
            <br />
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <button className="btn" type="submit" >Registrar Gpu</button>
            </Grid>
          </form>
          {confirmet && <Alert className={classes.succes} variant="outlined" severity="success">{confirmet}</Alert>}
        </div>
      </Grid>
    </div>
  )
};

export default GpuFomr;