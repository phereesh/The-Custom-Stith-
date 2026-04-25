import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Home, Login, Register, ForgotPassword, ResetPassword, Dashboard, SuitDesigns, ShirtDesigns, PantDesigns, MeasurementGuide, FabricChoice, Profile, SuitBuilder, Collection, BookHomeVisit, BookShopVisit, AdminDashboard, PaymentSuccess, PaymentFailure, KhaltiSuccess } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset_password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/suit-designs" element={<SuitDesigns />} />
        <Route path="/shirt-designs" element={<ShirtDesigns />} />
        <Route path="/pant-designs" element={<PantDesigns />} />
        <Route path="/measurements" element={<MeasurementGuide />} />
        <Route path="/fabrics" element={<FabricChoice />} />
        <Route path="/build-suit" element={<SuitBuilder />} />
        <Route path="/exclusive-collection" element={<Collection />} />
        <Route path="/book-home-visit" element={<BookHomeVisit />} />
        <Route path="/book-boutique-visit" element={<BookShopVisit />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/payment/khalti-success" element={<KhaltiSuccess />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;

