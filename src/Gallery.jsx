import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Gallery.css';
// 1. Importamos las herramientas de Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; 

export default function Gallery() {
  // 2. Creamos estados para guardar las pinturas de la nube y mostrar un texto de "Cargando..."
  const [Paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Este useEffect hace que React vaya a Firebase en cuanto abres la página
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        // Intentamos conectarnos a Firebase
        const PaintingsCollection = collection(db, 'Paintings');
        const data = await getDocs(PaintingsCollection);
        
        const PaintingsList = data.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        
        setPaintings(PaintingsList);
      } catch (error) {
        // SI ALGO FALLA, LO IMPRIME EN ROJO EN LA CONSOLA
        console.error("¡ALERTA! Error conectando a Firebase:", error);
      } finally {
        // Pase lo que pase, quitamos la pantalla de carga
        setLoading(false);
      }
    };

    fetchPaintings();
  }, []);

  // Si todavía está descargando los datos, muestra esto:
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando galería desde la base de datos...</div>;
  }

  // Si ya terminó, dibuja la cuadrícula:
 return (
    <div className="gallery-container">
      
      {/* --- NUEVO HEADER MINIMALISTA --- */}
      <header className="shop-header">
        <div className="top-bar">
          <div className="artist-name">Lady Leila's Art Shop</div>
          <div className="social-links">
            <a href="https://www.instagram.com/leila_emo4ever" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://tiktok.com/@tu_usuario" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
        <h1 className="shop-title">shop</h1>
      </header>
      {/* -------------------------------- */}
    <div className="gallery-container">
      <div className="gallery-grid">
        {Paintings.map((Painting) => (
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
    </div>
    </div>
  );
}
