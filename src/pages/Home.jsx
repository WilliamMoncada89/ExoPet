import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Terrarios",
      subtitle: "Reptiles",
      description: "Espacios perfectos para el hábitat de tus reptiles",
      image: "/images/products/reptiles/terrario_reptil_1.png",
      link: "/productos?categoria=reptiles",
      buttonText: "Ver Terrarios"
    },
    {
      title: "Peceras",
      subtitle: "Peces",
      description: "Acuarios modernos para tus peces exóticos",
      image: "/images/products/peces/pecera_pez_1.png",
      link: "/productos?categoria=peces",
      buttonText: "Ver Peceras"
    },
    {
      title: "Jaulas",
      subtitle: "Aves",
      description: "Hogares cómodos y seguros para tus aves",
      image: "/images/products/aves/jaula_ave_1.png",
      link: "/productos?categoria=aves",
      buttonText: "Ver Jaulas"
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await productService.getCategories();
        
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section con Carrusel */}
      <section className="hero-section">
        <div className="hero-carousel">
          {slides.map((slide, index) => (
            <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
              <div className="hero-content">
                <div className="hero-text">
                  <h1>{slide.title}</h1>
                  <h2>{slide.subtitle}</h2>
                  <p>{slide.description}</p>
                  <Link to={slide.link} className="hero-btn">
                    {slide.buttonText}
                  </Link>
                </div>
                <div className="hero-image">
                  <img src={slide.image} alt={slide.title} />
                </div>
              </div>
            </div>
          ))}
          
          {/* Controles del carrusel */}
          <div className="hero-controls">
            <button className="hero-prev" onClick={prevSlide}>‹</button>
            <button className="hero-next" onClick={nextSlide}>›</button>
          </div>

          {/* Indicadores del carrusel */}
          <div className="hero-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Categorías Destacadas */}
      <section className="featured-categories">
        <div className="container">
          <h2>Categorías Populares</h2>
          <div className="categories-showcase">
            {categories.slice(0, 4).map((category) => (
              <Link 
                key={category.id} 
                to={`/productos?categoria=${category.slug}`} 
                className="category-showcase-card"
              >
                <div className="category-icon">
                  {category.name === 'Reptiles' && '🦎'}
                  {category.name === 'Aves' && '🦜'}
                  {category.name === 'Peces' && '🐠'}
                  {category.name === 'Mamíferos' && '🐹'}
                </div>
                <h3>{category.name}</h3>
                <p>{category.subcategories.length} productos</p>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* Sección de Beneficios */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🚚</div>
              <h3>Envío Gratis</h3>
              <p>En compras sobre $50.000</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <h3>Pago Seguro</h3>
              <p>Transacciones protegidas</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">💬</div>
              <h3>Soporte 24/7</h3>
              <p>Atención especializada</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">↩️</div>
              <h3>Devoluciones</h3>
              <p>30 días para cambios</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;