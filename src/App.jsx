
import './App.css'
import Header from './components/Header/Header'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Signup from './components/pages/Signup'
import Dashboard from './components/pages/Dashboard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    <>
    <ToastContainer/>
    <Router>
    <Routes>
      <Route path='/' element={<Signup/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
    </Routes>
    </Router>
   
   
   
    </>
  )
}

export default App
