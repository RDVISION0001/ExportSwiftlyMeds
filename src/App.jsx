// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Header from './components/header';
import EdProduct from './components/catagory/ED/EdProduct';
import ViewProduct from './components/catagory/ED/ViewProduct';
import Footer from './components/Footer';
import ShippingCart from './components/shippingCart/ShippingCart';
import AboutUs from './components/Pages/AboutUs';

function App() {
  return (
    <Router> 
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/ed' element={<EdProduct/>}/>
        <Route path='/view' element={<ViewProduct/>}/>
        <Route path='/shipping' element={<ShippingCart/>}/>
        <Route path='/about' element={<AboutUs/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;