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

  const [shippingType, setShippingType] = useState('nacional');
  
  // NUEVOS ESTADOS PARA LA PANTALLA DE ÉXITO
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');

  if (!Painting) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Tu carrito está vacío</h2>
        <Link to="/">Volver a la galería</Link>
      </div>
    );
  }

  // --- PANTALLA DE ÉXITO (Se muestra solo si el pago se aprueba) ---
  if (isSuccess) {
    return (
      <div className="checkout-page-wrapper" style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '12px', border: '1px solid #ffc439' }}>
          <h2 style={{ color: '#ffc439', fontSize: '2.5rem', marginBottom: '20px' }}>¡Pago Exitoso!</h2>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Gracias por tu compra, {customerName}.</h3>
          <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '30px' }}>
            Tu transacción se ha completado de manera segura. Hemos recibido tu orden para la pieza única <strong>"{Painting.title}"</strong> y prepararemos tu envío pronto.
          </p>
          <button 
            onClick={() => navigate('/')} 
            style={{ padding: '12px 25px', fontSize: '1.1rem', background: '#ffc439', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Volver a la Galería
          </button>
        </div>
      </div>
    );
  }

  // --- PANTALLA NORMAL DE CHECKOUT ---
  const shippingOptions = { nacional: 8.00, internacional: 25.00 };
  const currentShippingCost = shippingOptions[shippingType];
  const total = Painting.price + currentShippingCost;

  return (
    <div className="checkout-page-wrapper" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/producto/${Painting.id}`} style={{ color: '#aaa', textDecoration: 'none' }}>
          ← Volver al producto
        </Link>
      </div>

      <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Finalizar Compra</h2>

      <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Resumen de la obra */}
        <div className="checkout-summary-card" style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Resumen de la obra</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            <img src={Painting.imageUrl} alt={Painting.title} style={{ width: '110px', height: '140px', objectFit: 'cover', borderRadius: '8px' }} />
            <div>
              <h4 style={{ textTransform: 'capitalize', fontSize: '1.2rem', marginBottom: '5px' }}>{Painting.title}</h4>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Pieza Única</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #333', paddingTop: '15px', color: '#ccc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Precio de la obra:</span><span>${Number(Painting.price).toFixed(2)} USD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Envío ({shippingType}):</span><span>${currentShippingCost.toFixed(2)} USD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginTop: '10px', borderTop: '1px solid #333', paddingTop: '10px' }}>
              <span>Total a pagar:</span><span>${total.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {/* Envío y PayPal */}
        <div className="checkout-form-section" style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Detalles de Envío</h3>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Selecciona tu destino:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#222', padding: '10px 15px', borderRadius: '8px', border: shippingType === 'nacional' ? '1px solid #ffc439' : '1px solid transparent' }}>
                <input type="radio" name="shipping" value="nacional" checked={shippingType === 'nacional'} onChange={() => setShippingType('nacional')} />
                Nacional (México) — <strong>${shippingOptions.nacional.toFixed(2)} USD</strong>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#222', padding: '10px 15px', borderRadius: '8px', border: shippingType === 'internacional' ? '1px solid #ffc439' : '1px solid transparent' }}>
                <input type="radio" name="shipping" value="internacional" checked={shippingType === 'internacional'} onChange={() => setShippingType('internacional')} />
                Internacional — <strong>${shippingOptions.internacional.toFixed(2)} USD</strong>
              </label>
            </div>
          </div>
          <div style={{ marginBottom: '25px', fontSize: '0.85rem', color: '#888', background: '#222', padding: '12px', borderRadius: '8px' }}>
            <p>ℹ️ Al hacer clic en PayPal, se abrirá una pasarela segura donde podrás ingresar tu dirección de entrega oficial.</p>
          </div>

          <div className="paypal-button-container">
            <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD" }}>
              <PayPalButtons 
                style={{ layout: "vertical", color: "gold", shape: "rect" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: { value: total.toFixed(2) },
                      description: `Obra: ${Painting.title}`
                    }],
                  });
                }}
                onApprove={async (data, actions) => {
                  try {
                    const details = await actions.order.capture();
                    
                    // 1. Guardamos el nombre del cliente en el nuevo estado
                    setCustomerName(details.payer.name.given_name);

                    // 2. Actualizamos Firebase
                    const PaintingRef = doc(db, 'Paintings', Painting.id);
                    await updateDoc(PaintingRef, { soldOut: true });

                    // 3. Ocultamos el formulario y mostramos la pantalla de éxito
                    setIsSuccess(true);

                  } catch (error) {
                    console.error("Error al actualizar Firebase:", error);
                    alert("El pago se procesó, pero hubo un fallo interno. Contáctanos.");
                  }
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </div>
  );
}