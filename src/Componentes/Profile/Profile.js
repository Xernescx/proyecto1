/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useState, useEffect } from 'react';
import './Profile.css'
import { useForm } from "react-hook-form";
import firebase from 'firebase/app';
import { db } from '../FireBase/Firebase'
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import {
    MuiPickersUtilsProvider, KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
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
        "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: "white"
        }
    },
    color: {
        '& .MuiInputAdornment-root': {
            color: 'white',
        }
    },
    alert: {
        margin: "2%"
    }
}));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ac4caf',
        },
        secondary: {
            main: '#ac4caf'

        }

    },

})



const Profile = () => {
    const [loading, setloading] = useState(true);
    const classes = useStyles();
    const { register, handleSubmit } = useForm({});
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [userState, setUserState] = useState({});
    const [formState, setFormState] = useState();
    const [form1State, setFormState1] = useState();
    const [gpu, setGpu] = useState([])
    const [cpu, setCpu] = useState([])
    const [gpuU, setGpuU] = useState({})
    const [cpuU, setCpuU] = useState({})
    const handleChange = event => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        })
    }

    const formChange = event => {
        setFormState1({
            ...form1State,
            [event.target.name]: event.target.value,
        })

    }


    //Acutalizar info
    const onSubmit = async data => {
        console.log(formState)

        db.collection("users").doc(firebase.auth().currentUser.uid).update({

            name: formState.name,
            lastName: formState.lastName,
            country: formState.country,
        }).then(() => {
            alert("Actualizacion exitosa");
        })
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    };


    //Confimacion de usuario y busqueda de informacion del mismo 
    useEffect(() => {
        setloading(true);
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                /* console.log(user) */
                /* console.log("todo correcto por aqui"); */
            } else {
                if (window.sessionStorage.getItem("user") === null) {
                    window.location = '/home';
                } else {
                    /* console.log("si hay log"); */
                    window.location = '/home';
                }
            }

            db.collection("users").where("email", "==", user.email)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        /*  console.log(doc.data().preuba);
                         console.log(doc); */
                        let date = doc.data().date.toDate()
                        let newDate = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
                        setSelectedDate(newDate)
                        if (doc.data().cpu !== "") {
                            db.collection("Cpu").doc(doc.data().cpu.id).get().then((doc) => {
                                let data = {
                                    id: doc.id,
                                    name: doc.data().name
                                };
                                setCpuU(data)
                            })
                        }
                        if (doc.data().gpu !== "") {
                            db.collection("Gpu").doc(doc.data().gpu.id).get().then((doc) => {
                                
                                let data = {
                                    id: doc.id,
                                    name: doc.data().name

                                };
                                console.log(data)
                                setGpuU(data)
                            })
                        }
                        setUserState({
                            ...userState,
                            email: doc.data().email,
                            name: doc.data().name,
                            lastName: doc.data().lastName,
                            country: doc.data().country,
                            date: doc.data().date,
                            cpu: doc.data().cpu,
                            gpu: doc.data().gpu,
                            ram: doc.data().ram,
                            role: doc.data().userType
                        })
                        setFormState1({
                            cpu: doc.data().cpu.id,
                            gpu: doc.data().gpu.id,
                            ram: doc.data().ram
                        })
                        setFormState({
                            name: doc.data().name,
                            country: doc.data().country,
                            lastName: doc.data().lastName,
                            cpu: cpu,
                            gpu: gpu,
                            ram: doc.data().ram
                        })
                    });
                });
            db.collection("Gpu").get().then((querySnapshot) => {
                let data = [];
                querySnapshot.forEach((doc) => {
                    data.push({
                        id: doc.id,
                        name: doc.data().name
                    })
                    console.log(data)
                    setGpu(data)
                });
                /* console.log(gpu) */
            });
            db.collection("Cpu").get().then((querySnapshot) => {
                let data = [];
                querySnapshot.forEach((doc) => {
                    data.push({
                        id: doc.id,
                        name: doc.data().name
                    })
                    setCpu(data)
                });
            });
            /*  console.log(cpu) */
        });
        setloading(false);
        console.log()
    }, [])


//Agregar pc
    const pcUser = () => {
        console.log(form1State)
        db.collection("users").doc(firebase.auth().currentUser.uid).update({
            cpu: db.collection("Cpu").doc(form1State.cpu),
            ram: parseFloat(form1State.ram),
            gpu: db.collection("Gpu").doc(form1State.gpu)
        }).then(() => {
            alert("Actualizacion exitosa");
        })
            .catch((error) => {
                // The document probably doesn't exist.
                alert("Error updating document: ", error);
            });
    }


    if (loading === true) {
        return (
            <div className="loading">
                <ThemeProvider theme={theme}>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <div>
                            <CircularProgress theme={theme} />
                        </div>
                    </Grid>
                </ThemeProvider>
            </div>
        )
    }

    return (
        <div>
            <Alert className={classes.alert} severity="warning">Ram en GB, si quiere poner en mb use 0. los mb que tenga </Alert>

            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="center"
            >
                <div className="formulario marginProfile">
                    <div className="log-form ">
                        <form className={classes.root}  >

                            <InputLabel className={classes.root} >Cpu Min</InputLabel>
                            <Select
                                native
                                inputProps={{
                                    name: 'cpu',
                                }}
                                onChange={formChange}
                                name="cpu"
                            >
                                <option select="true" value={cpuU.id} > {cpuU.name} </option>
                                <option disabled value="">-----------------------------</option>
                                {cpu.map(cpu => {
                                    return (
                                        <option key={cpu.id.toLowerCase() + 1} value={cpu.id}>{cpu.name}</option>
                                    )
                                })}
                            </Select>

                            <TextField
                                step="0.001"
                                onChange={formChange}
                                className={classes.color}
                                label="Ram"
                                name="ram"
                                defaultValue={userState.ram}
                                placeholder={userState.ram}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    className: classes.multilineColor
                                }}


                            />

                            <InputLabel className={classes.root} >Gpu Min</InputLabel>
                            <Select
                                native

                                inputProps={{
                                    name: 'gpu',

                                }}
                                onChange={formChange}
                            >
                                <option select="true" value={gpuU.id} > {gpuU.name} </option>
                                <option disabled value="">-----------------------------</option>
                                {gpu.map(gpu => {
                                    return (
                                        <option key={gpu.id.toLowerCase() + 1} value={gpu.id}>{gpu.name}</option>
                                    )
                                })}
                            </Select>


                            {/* <a class="forgot" href="#"> Aun no tienes cuenta? registrate</a> */}
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <p className="btn" onClick={pcUser}  >Guardar</p>
                            </Grid>

                        </form>
                    </div>
                </div>
                {userState.role === "ROLE_ADMIN" && (<div className="adminControl marginProfile">
                    <Link href="/FormGpu">New Gpu</Link>
                    <Link href="/FormCpu">New Cpu</Link>
                    <Link href="/newGame">New Game</Link>
                    <Link href="/table/users">Usuarios</Link>
                    <Link href="/pedidos/all">Pedidos</Link>

                </div>)}

                <div className="formulario marginProfile" >
                    <div className="log-form ">
                        <form className={classes.root} onSubmit={handleSubmit(onSubmit)} >

                            <TextField
                                className={classes.sortFormLabel}
                                id="standard-required"
                                label="Email"
                                name="email"
                                value={userState.email}
                                onChange={handleChange}
                                disabled
                                InputProps={{
                                    className: classes.input
                                }}

                                ref={register({
                                    name: "email",
                                    required: "Parametro requerido.",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Caracteres no validos."
                                    },

                                })}

                            />
                            <br />

                            <TextField label="Nombre" name="name"
                                InputLabelProps={{ shrink: true }}
                                defaultValue={userState.name}
                                placeholder={userState.name}
                                onChange={handleChange.bind(this)}

                            />


                            <br />

                            <TextField label="Apellido" name="lastName"
                                InputLabelProps={{ shrink: true }}
                                defaultValue={userState.lastName}
                                placeholder={userState.lastName}
                                onChange={handleChange}
                            />

                            <br />
                            <MuiPickersUtilsProvider color="primary" utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disabled
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date picker dialog"
                                    format="dd/MM/yyyy"
                                    helperText={''}
                                    value={selectedDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    ref={register({
                                        required: "Fecha de nacimiento requerdia.",

                                    })}
                                />

                            </MuiPickersUtilsProvider>
                            <br />
                            <InputLabel htmlFor="age-native-simple">Pais</InputLabel>
                            <Select
                                native
                                onChange={handleChange}
                                inputProps={{
                                    name: 'country',
                                    id: 'age-native-simple',
                                }}
                            >
                                <option select="true" value={userState.country}>{userState.country}</option>
                                <option disabled value={userState.country}>-----------------------------</option>
                                <option value="Afghanistan" >Afghanistan</option>
                                <option value="Åland Islands">Åland Islands</option>
                                <option value="Albania">Albania</option>
                                <option value="Algeria">Algeria</option>
                                <option value="American Samoa">American Samoa</option>
                                <option value="Andorra">Andorra</option>
                                <option value="Angola">Angola</option>
                                <option value="Anguilla">Anguilla</option>
                                <option value="Antarctica">Antarctica</option>
                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Armenia">Armenia</option>
                                <option value="Aruba">Aruba</option>
                                <option value="Australia">Australia</option>
                                <option value="Austria">Austria</option>
                                <option value="Azerbaijan">Azerbaijan</option>
                                <option value="Bahamas">Bahamas</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Bangladesh">Bangladesh</option>
                                <option value="Barbados">Barbados</option>
                                <option value="Belarus">Belarus</option>
                                <option value="Belgium">Belgium</option>
                                <option value="Belize">Belize</option>
                                <option value="Benin">Benin</option>
                                <option value="Bermuda">Bermuda</option>
                                <option value="Bhutan">Bhutan</option>
                                <option value="Bolivia">Bolivia</option>
                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                <option value="Botswana">Botswana</option>
                                <option value="Bouvet Island">Bouvet Island</option>
                                <option value="Brazil">Brazil</option>
                                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                <option value="Brunei Darussalam">Brunei Darussalam</option>
                                <option value="Bulgaria">Bulgaria</option>
                                <option value="Burkina Faso">Burkina Faso</option>
                                <option value="Burundi">Burundi</option>
                                <option value="Cambodia">Cambodia</option>
                                <option value="Cameroon">Cameroon</option>
                                <option value="Canada">Canada</option>
                                <option value="Cape Verde">Cape Verde</option>
                                <option value="Cayman Islands">Cayman Islands</option>
                                <option value="Central African Republic">Central African Republic</option>
                                <option value="Chad">Chad</option>
                                <option value="Chile">Chile</option>
                                <option value="China">China</option>
                                <option value="Christmas Island">Christmas Island</option>
                                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Comoros">Comoros</option>
                                <option value="Congo">Congo</option>
                                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                <option value="Cook Islands">Cook Islands</option>
                                <option value="Costa Rica">Costa Rica</option>
                                <option value="Cote D'ivoire">Cote D'ivoire</option>
                                <option value="Croatia">Croatia</option>
                                <option value="Cuba">Cuba</option>
                                <option value="Cyprus">Cyprus</option>
                                <option value="Czech Republic">Czech Republic</option>
                                <option value="Denmark">Denmark</option>
                                <option value="Djibouti">Djibouti</option>
                                <option value="Dominica">Dominica</option>
                                <option value="Dominican Republic">Dominican Republic</option>
                                <option value="Ecuador">Ecuador</option>
                                <option value="Egypt">Egypt</option>
                                <option value="El Salvador">El Salvador</option>
                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                <option value="Eritrea">Eritrea</option>
                                <option value="Estonia">Estonia</option>
                                <option value="Ethiopia">Ethiopia</option>
                                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                <option value="Faroe Islands">Faroe Islands</option>
                                <option value="Fiji">Fiji</option>
                                <option value="Finland">Finland</option>
                                <option value="France">France</option>
                                <option value="French Guiana">French Guiana</option>
                                <option value="French Polynesia">French Polynesia</option>
                                <option value="French Southern Territories">French Southern Territories</option>
                                <option value="Gabon">Gabon</option>
                                <option value="Gambia">Gambia</option>
                                <option value="Georgia">Georgia</option>
                                <option value="Germany">Germany</option>
                                <option value="Ghana">Ghana</option>
                                <option value="Gibraltar">Gibraltar</option>
                                <option value="Greece">Greece</option>
                                <option value="Greenland">Greenland</option>
                                <option value="Grenada">Grenada</option>
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Guam">Guam</option>
                                <option value="Guatemala">Guatemala</option>
                                <option value="Guernsey">Guernsey</option>
                                <option value="Guinea">Guinea</option>
                                <option value="Guinea-bissau">Guinea-bissau</option>
                                <option value="Guyana">Guyana</option>
                                <option value="Haiti">Haiti</option>
                                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                <option value="Honduras">Honduras</option>
                                <option value="Hong Kong">Hong Kong</option>
                                <option value="Hungary">Hungary</option>
                                <option value="Iceland">Iceland</option>
                                <option value="India">India</option>
                                <option value="Indonesia">Indonesia</option>
                                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                <option value="Iraq">Iraq</option>
                                <option value="Ireland">Ireland</option>
                                <option value="Isle of Man">Isle of Man</option>
                                <option value="Israel">Israel</option>
                                <option value="Italy">Italy</option>
                                <option value="Jamaica">Jamaica</option>
                                <option value="Japan">Japan</option>
                                <option value="Jersey">Jersey</option>
                                <option value="Jordan">Jordan</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="Kenya">Kenya</option>
                                <option value="Kiribati">Kiribati</option>
                                <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                <option value="Korea, Republic of">Korea, Republic of</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                <option value="Latvia">Latvia</option>
                                <option value="Lebanon">Lebanon</option>
                                <option value="Lesotho">Lesotho</option>
                                <option value="Liberia">Liberia</option>
                                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                <option value="Liechtenstein">Liechtenstein</option>
                                <option value="Lithuania">Lithuania</option>
                                <option value="Luxembourg">Luxembourg</option>
                                <option value="Macao">Macao</option>
                                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                <option value="Madagascar">Madagascar</option>
                                <option value="Malawi">Malawi</option>
                                <option value="Malaysia">Malaysia</option>
                                <option value="Maldives">Maldives</option>
                                <option value="Mali">Mali</option>
                                <option value="Malta">Malta</option>
                                <option value="Marshall Islands">Marshall Islands</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Mauritania">Mauritania</option>
                                <option value="Mauritius">Mauritius</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Mexico">Mexico</option>
                                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                <option value="Moldova, Republic of">Moldova, Republic of</option>
                                <option value="Monaco">Monaco</option>
                                <option value="Mongolia">Mongolia</option>
                                <option value="Montenegro">Montenegro</option>
                                <option value="Montserrat">Montserrat</option>
                                <option value="Morocco">Morocco</option>
                                <option value="Mozambique">Mozambique</option>
                                <option value="Myanmar">Myanmar</option>
                                <option value="Namibia">Namibia</option>
                                <option value="Nauru">Nauru</option>
                                <option value="Nepal">Nepal</option>
                                <option value="Netherlands">Netherlands</option>
                                <option value="Netherlands Antilles">Netherlands Antilles</option>
                                <option value="New Caledonia">New Caledonia</option>
                                <option value="New Zealand">New Zealand</option>
                                <option value="Nicaragua">Nicaragua</option>
                                <option value="Niger">Niger</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="Niue">Niue</option>
                                <option value="Norfolk Island">Norfolk Island</option>
                                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                <option value="Norway">Norway</option>
                                <option value="Oman">Oman</option>
                                <option value="Pakistan">Pakistan</option>
                                <option value="Palau">Palau</option>
                                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                <option value="Panama">Panama</option>
                                <option value="Papua New Guinea">Papua New Guinea</option>
                                <option value="Paraguay">Paraguay</option>
                                <option value="Peru">Peru</option>
                                <option value="Philippines">Philippines</option>
                                <option value="Pitcairn">Pitcairn</option>
                                <option value="Poland">Poland</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Puerto Rico">Puerto Rico</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Reunion">Reunion</option>
                                <option value="Romania">Romania</option>
                                <option value="Russian Federation">Russian Federation</option>
                                <option value="Rwanda">Rwanda</option>
                                <option value="Saint Helena">Saint Helena</option>
                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                <option value="Saint Lucia">Saint Lucia</option>
                                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                <option value="Samoa">Samoa</option>
                                <option value="San Marino">San Marino</option>
                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Senegal">Senegal</option>
                                <option value="Serbia">Serbia</option>
                                <option value="Seychelles">Seychelles</option>
                                <option value="Sierra Leone">Sierra Leone</option>
                                <option value="Singapore">Singapore</option>
                                <option value="Slovakia">Slovakia</option>
                                <option value="Slovenia">Slovenia</option>
                                <option value="Solomon Islands">Solomon Islands</option>
                                <option value="Somalia">Somalia</option>
                                <option value="South Africa">South Africa</option>
                                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                <option value="Spain">Spain</option>
                                <option value="Sri Lanka">Sri Lanka</option>
                                <option value="Sudan">Sudan</option>
                                <option value="Suriname">Suriname</option>
                                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                <option value="Swaziland">Swaziland</option>
                                <option value="Sweden">Sweden</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                                <option value="Tajikistan">Tajikistan</option>
                                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                <option value="Thailand">Thailand</option>
                                <option value="Timor-leste">Timor-leste</option>
                                <option value="Togo">Togo</option>
                                <option value="Tokelau">Tokelau</option>
                                <option value="Tonga">Tonga</option>
                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                <option value="Tunisia">Tunisia</option>
                                <option value="Turkey">Turkey</option>
                                <option value="Turkmenistan">Turkmenistan</option>
                                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                <option value="Tuvalu">Tuvalu</option>
                                <option value="Uganda">Uganda</option>
                                <option value="Ukraine">Ukraine</option>
                                <option value="United Arab Emirates">United Arab Emirates</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="United States">United States</option>
                                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                <option value="Uruguay">Uruguay</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="Vanuatu">Vanuatu</option>
                                <option value="Venezuela">Venezuela</option>
                                <option value="Viet Nam">Viet Nam</option>
                                <option value="Virgin Islands, British">Virgin Islands, British</option>
                                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                <option value="Wallis and Futuna">Wallis and Futuna</option>
                                <option value="Western Sahara">Western Sahara</option>
                                <option value="Yemen">Yemen</option>
                                <option value="Zambia">Zambia</option>
                                <option value="Zimbabwe">Zimbabwe</option>
                            </Select>
                            <br />
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <button className="btn" type="submit" >Actualizar</button>
                            </Grid>
                        </form>
                    </div>
                </div>
            </Grid>
        </div>
    )



}

export default Profile