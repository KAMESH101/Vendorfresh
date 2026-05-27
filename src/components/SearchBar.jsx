import { useState, useMemo } from 'react';

export default function SearchBar({ onFilter, products }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(cats).sort()];
  }, [products]);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onFilter(value, category);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    onFilter(query, value);
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          className="search-input"
          placeholder="Search for products..."
          value={query}
          onChange={handleQueryChange}
          id="product-search"
          aria-label="Search products"
        />
      </div>
      <select
        className="category-select"
        value={category}
        onChange={handleCategoryChange}
        id="category-filter"
        aria-label="Filter by category"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
