import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import staticProducts, { getProducts } from '../data/products';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pageVariants = prefersReducedMotion
  ? {}
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

export default function Products() {
  const [productsList, setProductsList] = useState(staticProducts);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ query: '', category: 'All' });

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await getProducts();
        if (data && !error) {
          setProductsList(data);
        }
      } catch (err) {
        console.error('Failed to load products from database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesQuery = p.name
        .toLowerCase()
        .includes(filter.query.toLowerCase());
      const matchesCategory =
        filter.category === 'All' || p.category === filter.category;
      return matchesQuery && matchesCategory;
    });
  }, [filter, productsList]);

  const handleFilter = (query, category) => {
    setFilter({ query, category });
  };

  return (
    <motion.div
      className="page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="page-hero">
        <h1>Available Products From Across India</h1>
        <p>Fresh produce sourced directly from local farmers</p>
      </div>

      <div className="container section" id="main-content">
        <SearchBar onFilter={handleFilter} products={productsList} />

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '2rem 0' }}>
            <p>Loading fresh crops...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-muted)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No products found</p>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
