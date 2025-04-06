import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ConnectWallet from "./pages/ConnectWallet";
import Exchange from "./pages/Exchange";
import Assets from "./pages/Assets";
import Services from "./pages/Services";
import HireAsset from "./pages/HireAsset";
import HireService from "./pages/HireService";
import PublishAsset from "./pages/PublishAsset";
import PublishService from "./pages/PublishService";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterIdentity from "./pages/RegisterIdentity";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterIdentity />} />
        <Route path="/connect" element={<ConnectWallet />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/services" element={<Services />} />
        <Route path="/hire-asset/:id" element={<HireAsset />} />
        <Route path="/hire-service/:id" element={<HireService />} />
        <Route path="/publish-asset" element={<PublishAsset />} />
        <Route path="/publish-service" element={<PublishService />} />
      </Routes>
    </Router>
  );
}
