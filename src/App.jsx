import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'
import "./resources/font-jakartaSans/importFont.css"

// Pages
import LoginProvider from "./components/loginprovider/loginprovider";
import ErrorFallback from "./components/error/error";
import Devs from "./components/devs";

export default function App() {
  return (
    <Router basename="/zenaccount/">
      <Routes>
        <Route path="/loginprovider" element={<LoginProvider />} />
        <Route path="/devs" element={<Devs />} />
        <Route path="*" element={<ErrorFallback status="404: Not Found" title="Not Found" reason="Page not found. The link may be mistyped, or the page no longer exists." />} />
      </Routes>
    </Router>
  )
}