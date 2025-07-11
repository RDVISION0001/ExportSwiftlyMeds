// App.css
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Header from './components/Header';
import ViewProduct from './components/catagory/ED/ViewProduct';
import Footer from './components/Footer';
import ShippingCart from './components/shippingCart/ShippingCart';
import AboutUs from './components/Pages/AboutUs';
import ContactUs from './components/Pages/ContactUs';
import FAQ from './components/Pages/Faq';
import Blog from './components/blog/Blog';
import Manufacturer from './components/Pages/Manufacuter';
import PrivacyPolicy from './components/Privacy';
import NewArrive from './components/NewArrive';
import BestSeller from './components/BestSeller';
import SwiftlyMarket from './components/SwiftlyMarket';
import ProductServices from './components/ProductServices';
import GoogleReviews from './components/GoogleReview';
import PrescriptionRelief from './components/PrescriptionRefills';
import OurMission from './components/OurMissin';
import Career from './components/Career';
import Login from './AuthContext/Login';
import HipaaPolicy from './components/HipaaPolicy';
import TermsCondition from './components/TermsCondition';
import RefundPolicy from './components/RefundPolicy';
import DeliveryShippingPolicy from './components/DeliveryShippingPolicy';
import ShopByCategoryProduct from './components/catagory/ShopByCategoryProduct';
import PCIDSS from './components/PCIDSS';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />     
        <Route path='/view' element={<ViewProduct />} />
        <Route path='/shipping' element={<ShippingCart />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/manufacture' element={<Manufacturer />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/newArive' element={<NewArrive />} />
        <Route path='/seller' element={<BestSeller />} />
        <Route path='/marketPlace' element={<SwiftlyMarket />} />
        <Route path='/proserve' element={<ProductServices />} />
        <Route path='/review' element={<GoogleReviews />} />
        <Route path='/priRefil' element={<PrescriptionRelief />} />
        <Route path='/our' element={<OurMission />} />
        <Route path='/career' element={<Career />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hipaa' element={<HipaaPolicy />} />
        <Route path='/terms' element={<TermsCondition />} />
        <Route path='/refund' element={<RefundPolicy />} />
        <Route path='/deliveryShipping' element={<DeliveryShippingPolicy />} />
        <Route path='/CatProduct' element={<ShopByCategoryProduct />} />
        <Route path='/pci-dss' element={<PCIDSS />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;