import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ProductPage.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPainting = async () => {
      const docRef = doc(db, 'Paintings', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPainting({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };

    fetchPainting();
  }, [id]);

  if (loading) {
    return (
      <div className="product-page-wrapper product-status-msg">
        Loading artwork...
      </div>
    );
  }

  if (!Painting) {
    return (
      <div className="product-page-wrapper product-status-msg">
        <h2>Artwork not found</h2>
        <Link to="/" className="back-link">← Back to gallery</Link>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout', { state: { Painting } });
  };

  const isPrint = Painting.category === 'print';

  return (
    <div className="product-page-wrapper">
      {/* Navegación superior izquierda */}
      <div className="top-nav">
        <Link to="/" className="back-link">
          ← Back to gallery
        </Link>
      </div>

      <div className="product-container">
        {/* Columna de la obra */}
        <div className="product-image-section">
          <img src={Painting.imageUrl} alt={Painting.title} className="main-image" />
        </div>

        {/* Columna de información (jerarquía limpia estilo Cadima) */}
        <div className="product-info-section">
          <h1 className="product-title">{Painting.title}</h1>
          <p className="product-price">${Number(Painting.price).toFixed(2)} USD</p>

          <div className="product-details">
            {Painting.size && (
              <p><strong>Size:</strong> {Painting.size}</p>
            )}
            {Painting.descript && (
              <p><strong>Description:</strong> {Painting.descript}</p>
            )}
            {!isPrint && (
              <p className="unique-piece-warning">
                * This is a unique piece. Only 1 is available.
              </p>
            )}
          </div>

          {Painting.soldOut ? (
            <div className="sold-out-wrapper">
              <span className="sold-out-label">SOLD OUT</span>
              <button className="sold-out-button" disabled>
                Sold Out
              </button>
            </div>
          ) : (
            <button className="buy-button" onClick={handleCheckout}>
              {isPrint ? 'Purchase Print' : 'Purchase Painting'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}