import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './Checkout.css';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const Painting = location.state?.painting || location.state?.Painting;

  const [shippingType, setShippingType] = useState('domestic');
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');

  if (!Painting) {
    return (
      <div className="checkout-page-wrapper checkout-status-wrapper">
        <div className="checkout-status-card">
          <h2 className="checkout-status-title">Your cart is empty</h2>
          <Link to="/" className="checkout-primary-btn">
            Back to gallery
          </Link>
        </div>
      </div>
    );
  }

  // --- PANTALLA DE ÉXITO ---
  if (isSuccess) {
    return (
      <div className="checkout-page-wrapper checkout-status-wrapper">
        <div className="checkout-status-card success">
          <h2 className="checkout-status-title">Payment Successful!</h2>
          <h3 className="checkout-status-subtitle">Thank you for your purchase, {customerName}.</h3>
          <p className="checkout-status-text">
            Your transaction has been completed securely. We have received your order for{' '}
            <strong>"{Painting.title}"</strong> and will prepare your shipment soon.
          </p>
          <button onClick={() => navigate('/')} className="checkout-primary-btn">
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  // --- PANTALLA NORMAL DE CHECKOUT ---
  const shippingOptions = { domestic: 6.00, international: 15.00 };
  const currentShippingCost = shippingOptions[shippingType];
  const total = Number(Painting.price) + currentShippingCost;

  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container">
        
        {/* Enlace superior izquierdo en blanco */}
        <div className="checkout-top-nav">
          <Link to={`/producto/${Painting.id}`} className="checkout-back-link">
            ← Back to product
          </Link>
        </div>

        <h2 className="checkout-main-title">Checkout</h2>

        <div className="checkout-grid">
          
          {/* Resumen de la obra */}
          <div className="checkout-card checkout-summary-card">
            <h3 className="checkout-card-title">Order Summary</h3>
            
            <div className="checkout-item-row">
              <img 
                src={Painting.imageUrl} 
                alt={Painting.title} 
                className="checkout-item-img" 
              />
              <div>
                <h4 className="checkout-item-title">{Painting.title}</h4>
                <p className="checkout-item-subtitle">
                  {Painting.category === 'print' ? 'Fine Art Print' : 'Unique Piece'}
                </p>
              </div>
            </div>

            <div className="checkout-totals">
              <div className="checkout-price-row">
                <span>Artwork price:</span>
                <span>${Number(Painting.price).toFixed(2)} USD</span>
              </div>
              <div className="checkout-price-row">
                <span>Shipping ({shippingType}):</span>
                <span>${currentShippingCost.toFixed(2)} USD</span>
              </div>
              <div className="checkout-total-row">
                <span>Total:</span>
                <span>${total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Detalles de envío y PayPal */}
          <div className="checkout-card checkout-form-section">
            <h3 className="checkout-card-title">Shipping Details</h3>
            
            <div className="shipping-group">
              <label className="shipping-group-label">Select your destination:</label>
              <div className="shipping-options">
                <label className={`shipping-option ${shippingType === 'domestic' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="domestic" 
                    checked={shippingType === 'domestic'} 
                    onChange={() => setShippingType('domestic')} 
                  />
                  <span>
                    Domestic (Mexico) — <strong>${shippingOptions.domestic.toFixed(2)} USD</strong>
                  </span>
                </label>

                <label className={`shipping-option ${shippingType === 'international' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="international" 
                    checked={shippingType === 'international'} 
                    onChange={() => setShippingType('international')} 
                  />
                  <span>
                    International — <strong>${shippingOptions.international.toFixed(2)} USD</strong>
                  </span>
                </label>
              </div>
            </div>

            <div className="paypal-info-box">
              <p>
                Clicking PayPal will open a secure gateway where you can enter your official shipping address.
              </p>
            </div>

            <div className="paypal-button-container">
              <PayPalScriptProvider 
                options={{ 
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID.trim(), 
                  "currency": "USD", 
                  "locale": "en_US" 
                }}
              >
                <PayPalButtons 
                  style={{ layout: "vertical", color: "gold", shape: "rect" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: { value: total.toFixed(2) },
                        description: `Artwork: ${Painting.title}`
                      }],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    try {
                      const details = await actions.order.capture();
                      setCustomerName(details.payer.name.given_name);

                      const PaintingRef = doc(db, 'Paintings', Painting.id);
                      await updateDoc(PaintingRef, { soldOut: true });

                      setIsSuccess(true);
                    } catch (error) {
                      console.error("Error updating Firebase:", error);
                      alert("Payment was processed, but an internal error occurred. Please contact us.");
                    }
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}