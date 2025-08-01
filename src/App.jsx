import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import CrmPayment from './components/CRM/CrmPayment';
import PCIDSS from './components/PCIDSS';
import TaregetCountry from './components/TaregetCountry';
import PaymentSuccess from './components/CRM/PaymentSuccess';
import PaymentFailed from './components/CRM/PaymentFailed';
import { useAuth } from './AuthContext/AuthContext';
import Order from './components/Order';
import PrescriptionRefills from './components/PrescriptionRelif';
import ScheduleCall from './components/schedulCall/SchedulCall';


// Create a ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { token } = useAuth();
  
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/proserve' element={<ProductServices/>}/>
        <Route path='/manufacture' element={<Manufacturer />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/proserve' element={<ProductServices />} />
        <Route path='/review' element={<GoogleReviews />} />
        <Route path='/our' element={<OurMission />} />
        <Route path='/career' element={<Career />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hipaa' element={<HipaaPolicy />} />
        <Route path='/terms' element={<TermsCondition />} />
        <Route path='/refund' element={<RefundPolicy />} />
        <Route path='/deliveryShipping' element={<DeliveryShippingPolicy />} />
        <Route path='/pci-dss' element={<PCIDSS />} />
        <Route path='/marketArea' element={<TaregetCountry/>}/>
        <Route path='/orders' element={<Order/>}/>

        <Route path="/checkout/:orderNumber" element={<CrmPayment />} />
        <Route path="/success/:orderNumber" element={<PaymentSuccess />} />
        <Route path="/failed/:orderNumber" element={<PaymentFailed />} />
        <Route path='/priRefil' element={<PrescriptionRefills/>}/>
        <Route path='/schedul/:id' element={<ScheduleCall/>}/>
        

        
        {/* Protected routes - require token */}
        <Route path='/view' element={
          <ProtectedRoute>
            <ViewProduct />
          </ProtectedRoute>
        } />
        <Route path='/shipping' element={
          <ProtectedRoute>
            <ShippingCart />
          </ProtectedRoute>
        } />
        <Route path="/checkout/:orderNumber" element={
          <ProtectedRoute>
            <CrmPayment />
          </ProtectedRoute>
        } />
        <Route path='/CatProduct' element={
          <ProtectedRoute>
            <ShopByCategoryProduct />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;