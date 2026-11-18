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
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const fetchPainting = async () => {
      const docRef = doc(db, 'Paintings', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPainting({ id: docSnap.id, ...docSnap.data() });
        setCurrentImgIndex(0);
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

  // Combina la imagen principal con cualquier imagen extra que exista en Firestore
  const allImages = [
    Painting.imageUrl,
    ...(Array.isArray(Painting.extraImages) ? Painting.extraImages : [])
  ].filter(Boolean);

  const handlePrevImage = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImgIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { Painting } });
  };

  const isPrint = Painting.category === 'print';

  return (
    <div className="product-page-wrapper">
      <div className="top-nav">
        <Link to="/" className="back-link">
          ← Back to gallery
        </Link>
      </div>

      <div className="product-container">
        {/* Columna de la obra con soporte para múltiples fotos */}
        <div className="product-image-section">
          <div className="carousel-wrapper">
            {allImages.length > 1 && (
              <span className="image-counter">
                {currentImgIndex + 1} / {allImages.length}
              </span>
            )}

            {allImages.length > 1 && (
              <button
                type="button"
                className="carousel-arrow prev"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            <img
              src={allImages[currentImgIndex]}
              alt={`${Painting.title} - view ${currentImgIndex + 1}`}
              className="main-image"
            />

            {allImages.length > 1 && (
              <button
                type="button"
                className="carousel-arrow next"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>

          {/* Miniaturas seleccionables debajo de la obra */}
          {allImages.length > 1 && (
            <div className="thumbnail-strip">
              {allImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${Painting.title} thumbnail ${index + 1}`}
                  className={`thumbnail-item ${index === currentImgIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImgIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha de información */}
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