import './App.css';
import {NavComponent} from './components/NavComponent';
import EModule from './components/EModules/EModule';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Grammar from './components/pages/ejercicios/Grammar';
/* PAGES */
import  Inicio  from './components/pages/inicio/Inicio.js';
import HomePage from './components/pages/HomePage/HomePage'
import SignUpPage from './components/pages/SignUpPage/SignUpPage'
import SigInPage from './components/pages/SigInPage/SigInPage'
import NotFoundPage from './components/pages/NotFoundPage/NotFoundPage'
import { Emparejar } from './components/pages/ejercicios/Emparejar';
import { Drag } from './components/pages/ejercicios/Drag';
import NuevaaG from './components/pages/ParaVideo/NuevaaG';
import { Grammar2 } from './components/pages/ejercicios/Grammar2';
import AccountPendingPage from './components/pages/AccountPendingPage/AccountPendingPage'
function App() {
  
  return (
    <div className="App">      
    {/* Rutas solo de pruebas para probar las vistas */}

    <Router>
    <Switch>
      <Route path="/modulo/1/grammar/1/:id">
        <Grammar2 />
      </Route>
      <Route exact path="/modulo/1/grammar/2">
        <Emparejar />
      </Route>      
      <Route exact path="/modulo/1/grammar/3">
        <NuevaaG />
      </Route>            
      <Route exact path="/modulo/1/vocabulary/1">
        <Emparejar />
      </Route>
      <Route exact path="/modulo/1/writting/1">
        <Drag />
      </Route>      

      <Route exact path="/dashboard">
        <Inicio />
      </Route>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/signup">
        <SignUpPage />
      </Route>
      <Route exact path="/signin">
        <SigInPage />
      </Route>
      <Route exact path="/PendingAccount">
        <AccountPendingPage />
      </Route>
      <Route > <NotFoundPage/> </Route>
      </Switch>
    </Router>

    </div>
  );
}

export default App;


