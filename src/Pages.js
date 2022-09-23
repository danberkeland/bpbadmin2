import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Ordering from "./Pages/Ordering/Ordering";
import CustomerNews from "./Pages/CustomerNews/CustomerNews";
import CustomerBilling from "./Pages/CustomerBilling/CustomerBilling";
import CustomerSettings from "./Pages/CustomerSettings/CustomerSettings";
import CustomerProducts from "./Pages/CustomerProducts/CustomerProducts";
import Production from "./Pages/Production/Production";
import Products from "./Pages/Products/Products";
import Settings from "./Pages/Settings/Settings";
import Billing from "./Pages/Billing/Billing";
import EODCounts from "./Pages/EODCounts/EODCounts";
import Logistics from "./Pages/Logistics/Logistics";
import Locations from "./Pages/Locations/Locations";
import AaaBackendTest from "./Pages/AaaBackendTest/AaaBackendTest";
import Nav from "./Nav";

function Pages() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route exact path="/" element={<div></div>} />
        <Route exact path="/Ordering" element={<Ordering />} />
        <Route exact path="/CustomerNews" element={<CustomerNews />} />
        <Route exact path="/CustomerBilling" element={<CustomerBilling />} />
        <Route exact path="/CustomerSettings" element={<CustomerSettings />} />
        <Route exact path="/CustomerProducts" element={<CustomerProducts />} />
        <Route exact path="/Production" element={<Production />} />
        <Route exact path="/Products" element={<Products />} />
        <Route exact path="/Settings" element={<Settings />} />
        <Route exact path="/Billing" element={<Billing />} />
        <Route exact path="/EODCounts" element={<EODCounts />} />
        <Route exact path="/Logistics" element={<Logistics />} />
        <Route exact path="/Locations" element={<Locations />} />
        <Route exact path="/aaaTest" element={<AaaBackendTest />} />
      </Routes>
    </Router>
  );
}

export default Pages;
