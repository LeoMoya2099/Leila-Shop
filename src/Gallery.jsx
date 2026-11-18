import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; 

export default function Gallery() {
  const [Paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        const PaintingsCollection = collection(db, 'Paintings');
        const data = await getDocs(PaintingsCollection);
        
        const PaintingsList = data.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        
        setPaintings(PaintingsList);
      } catch (error) {
        console.error("¡ALERTA! Error conectando a Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando galería desde la base de datos...</div>;
  }

  // Filtramos: todo lo que NO diga 'print' se va a Originales (así no pierdes tus cuadros actuales)
  const originals = Paintings.filter((item) => item.category !== 'print');
  // Todo lo que tenga category: 'print' se va a la nueva sección
  const prints = Paintings.filter((item) => item.category === 'print');

  return (
    <div className="gallery-container">
      
      {/* --- HEADER MINIMALISTA --- */}
      <header className="shop-header">
        <div className="top-bar">
          <div className="artist-name">Lady Leila's Art Shop</div>
          <div className="social-links">
            <a href="https://www.instagram.com/leila_emo4ever" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@lady_leila006?_r=1&_t=ZS-9B6kDDs5M3S" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
        
        <h1 className="shop-title">Shop</h1>

        {/* Enlaces rápidos debajo de Shop */}
        <nav className="category-nav">
          <a href="#originals">Originals</a>
          <span>/</span>
          <a href="#prints">Prints</a>
        </nav>
      </header>

      {/* --- SECCIÓN 1: ORIGINALS --- */}
      <section id="originals" className="catalog-section">
        <h2 className="section-subtitle">Originals</h2>
        <div className="gallery-grid">
          {originals.map((Painting) => (
            <div key={Painting.id} className="gallery-item">
              <Link to={`/producto/${Painting.id}`}>
                <img src={Painting.imageUrl} alt={Painting.title} style={{ cursor: 'pointer' }} />
              </Link>
              <h3 className="gallery-title">{Painting.title}</h3>
              <p className="gallery-price">${Painting.price.toFixed(2)}</p>
              {Painting.soldOut && <p className="gallery-sold-out">Sold out</p>}
            </div>
          ))}
        </div>
      </section>

      {/* --- SECCIÓN 2: PRINTS --- */}
      <section id="prints" className="catalog-section">
        <h2 className="section-subtitle">Prints</h2>
        {prints.length === 0 ? (
          <p className="empty-category-msg">New prints comming soon...</p>
        ) : (
          <div className="gallery-grid">
            {prints.map((print) => (
              <div key={print.id} className="gallery-item">
                <Link to={`/producto/${print.id}`}>
                  <img src={print.imageUrl} alt={print.title} style={{ cursor: 'pointer' }} />
                </Link>
                <h3 className="gallery-title">{print.title}</h3>
                <p className="gallery-price">${print.price.toFixed(2)}</p>
                {print.soldOut && <p className="gallery-sold-out">Sold out</p>}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}