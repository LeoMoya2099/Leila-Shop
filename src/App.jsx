import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Gallery from './Gallery';
import ProductPage from './ProductPage';
import Checkout from './Checkout';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        {/* Agregamos /:id para capturar el identificador de la pintura */}
        <Route path="/producto/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<Checkout />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;