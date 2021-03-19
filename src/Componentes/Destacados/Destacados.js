import React from 'react';
import { useState, useEffect } from 'react';
import './Destacados.css';
import { Link } from 'react-router-dom'
import { db } from '../FireBase/Firebase'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ThemeProvider, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
      color: "#ffff",
    },
  },
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

export default function SimpleContainer() {
  const classes = useStyles();
  const [links, setLink] = useState([]);
  const [loading, setloading] = useState(true);
  const [page, setPage] = React.useState(1)
  const [data, setdata] = React.useState({
    total: 0,
    paginas: 0,
    porPagina: 15,
  });


  const handleChange = (event, value) => {
    setloading(true)

    console.log(value)
    let ref;
    if (value < page) {
      ref = db.collection("VideoGames").limit(data.porPagina).orderBy("nameSearch").endAt(links[0].nameSearch)
    } else {
      ref = db.collection("VideoGames").limit(data.porPagina).orderBy("nameSearch").startAfter(links[14].nameSearch)
    }
    setPage(value)
    ref.get().then((querySnapshot) => {
      let docs = []
      querySnapshot.forEach((doc) => {
        /* console.log(doc.data()) */
        docs.push({
          ...doc.data(), date: doc.date,
          requerimentsMax: doc.requerimentsMax,
          requerimentsMin: doc.requerimentsMin,
          developer: doc.developer,
          discSpaces: doc.discSpaces,
          description: doc.description,
          so: doc.so
        })
      });

      setLink(docs)
      setloading(false);


    });

  };




  useEffect(() => {

    db.collection("VideoGames").get().then(res => {
      data.total = res.size
      data.paginas = Math.ceil((data.total / data.porPagina))
    })
    db.collection("VideoGames").where("nameSearch", ">=", " ").orderBy("nameSearch", "asc").limit(15).get().then((querySnapshot) => {
      let docs = []

      querySnapshot.forEach((doc) => {

        /* console.log(querySnapshot)
        console.log(doc.data()) */
        docs.push({
          ...doc.data(), date: doc.date,
          requerimentsMax: doc.requerimentsMax,
          requerimentsMin: doc.requerimentsMin,
          developer: doc.developer,
          discSpaces: doc.discSpaces,
          description: doc.description,
          so: doc.so
        })
      });

      setLink(docs)
      setloading(false);
      /* console.log(docs) */
    });
    console.log(links)
  }, [])



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
    <React.Fragment>
      <CssBaseline />


      <div className="destacadosContainer">
        {links.map(link => {
          return (
            <div className="gamesD">
              <Link className="cover" to={`/product/${link.name}`}>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <div>
                    <img className="bange" src={link.plataformURL} alt={link.plataform} />
                    <img className="covePage" alt={link.name} title={link.name} src={link.covePage} />
                    <div className="priceData">
                      {link.promo && (<spam className="promo">{link.promo}%</spam>)}
                      {link.promo && (<spam className="price">{((link.price - (link.price * link.promo) / 100)).toFixed(2)}€</spam>)}
                      {!link.promo && (<spam className="price">{link.price}€</spam>)}

                    </div>
                  </div>
                  <div className="nameGame ">{link.name}</div>
                </Grid>
              </Link>
            </div>
          )
        })}
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
            <Grid
              container
              justify="center"
              alignItems="center"
            >
              <Pagination count={data.paginas} page={page} variant="outlined" color="primary" onChange={handleChange} />
            </Grid>

          </div>
        </ThemeProvider>
      </div>

    </React.Fragment>
  );
}