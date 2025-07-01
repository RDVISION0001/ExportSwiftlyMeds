// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Header from './components/Header';
import EdProduct from './components/catagory/ED/EdProduct';
import ViewProduct from './components/catagory/ED/ViewProduct';
import Footer from './components/Footer';
import ShippingCart from './components/shippingCart/ShippingCart';
import AboutUs from './components/Pages/AboutUs';
import ContactUs from './components/Pages/ContactUs';
import Privacy from './components/Pages/Privacy';
import FAQ from './components/Pages/Faq';
import Blog from './components/blog/Blog';
import Manufacturer from './components/Pages/Manufacuter';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/ed' element={<EdProduct />} />
        <Route path='/view' element={<ViewProduct />} />
        <Route path='/shipping' element={<ShippingCart />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/manufacture' element={<Manufacturer/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
