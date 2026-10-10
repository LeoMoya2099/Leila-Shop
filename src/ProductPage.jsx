import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductPage.css';
// Importamos las herramientas de Firebase
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function ProductPage() {
  const { id } = useParams(); // Ahora recibe el ID alfanumérico de Firebase
  const navigate = useNavigate();
  const [Painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPainting = async () => {
      // Le decimos a Firebase que busque el documento exacto con este ID
      const docRef = doc(db, 'Paintings', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPainting({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };

    fetchPainting();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando pintura...</div>;

  if (!Painting) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Pintura no encontrada</h2>
        <Link to="/">Volver a la galería</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout', { state: { Painting } });
  };

  return (
    <div className="product-container">
      <div className="product-image-section">
        {/* Aquí jala la imagen de tu carpeta public usando la ruta de Firebase */}
        <img src={Painting.imageUrl} alt={Painting.title} className="main-image" />
      </div>

      <div className="product-info-section">
        <h1 className="product-title">{Painting.title}</h1>
        <p className="product-price">${Number(Painting.price).toFixed(2)} USD</p>

        <div className="product-details">
          <p><strong>Size:</strong> {Painting.size}</p>
          <p><strong>Description: </strong>Original oil painting on canvas
<br />Pintura original al oleo sobre lienzo  <br />(Unframed)</p> 
          
<p className="unique-piece-warning">* Esta es una pieza única. Solo existe 1 disponible.</p>
<p className="unique-piece-warning">* This is a unique piece. Only 1 is available.</p>
        </div>

        {Painting.soldOut ? (
  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#222', color: '#ff4444', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.2rem', border: '1px solid #ff4444' }}>
    Sold Out
  </div>
) : (
          <button className="buy-button" onClick={handleCheckout}>
            Purchase Painting
          </button>
        )}
        
        <br/>
        <Link to="/" style={{ color: '#555', textDecoration: 'underline' }}>← Volver a la galería</Link>
      </div>
    </div>
  );
}