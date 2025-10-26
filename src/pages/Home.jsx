import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories()
        ]);
        
        if (productsResponse.success) {
          setFeaturedProducts(productsResponse.data);
        }
        
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
          <div className="hero-slide active">
            <div className="hero-content">
              <div className="hero-text">
                <h1>Terrarios</h1>
                <h2>Reptiles</h2>
                <p>Espacios perfectos para el hábitat de tus reptiles</p>
                <Link to="/productos?categoria=reptiles" className="hero-btn">
                  Ver Terrarios
                </Link>
              </div>
              <div className="hero-image">
                <img src="/images/products/reptiles/terrario-vidrio.svg" alt="Terrarios" />
              </div>
            </div>
          </div>
          
          {/* Controles del carrusel */}
          <div className="hero-controls">
            <button className="hero-prev">‹</button>
            <button className="hero-next">›</button>
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

      {/* Productos Destacados */}
      <section className="featured-products">
        <div className="container">
          <h2>Productos Destacados</h2>
          <div className="products-grid">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badge">Destacado</div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">${product.price?.toLocaleString('es-CL')}</p>
                  <Link 
                    to={`/producto/${product.id}`} 
                    className="product-btn"
                  >
                    Ver Producto
                  </Link>
                </div>
              </div>
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