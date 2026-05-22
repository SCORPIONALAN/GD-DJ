/**
 * CatalogoPage — grilla de productos con filtro por categoría.
 */
import { useEffect, useState } from 'react';
import Nav    from '../components/Nav';
import Footer from '../components/Footer';
import { publicAPI } from '../lib/api';

export default function CatalogoPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [category, setCategory] = useState('');
  const [cats, setCats]         = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    publicAPI.getProducts({ page, limit: 12, ...(category && { category }) })
      .then((r) => {
        setProducts(r.data.products);
        setTotal(r.data.total);
        // Extrae categorías únicas de los resultados iniciales
        if (!cats.length) {
          const unique = [...new Set(r.data.products.map((p) => p.category).filter(Boolean))];
          setCats(unique);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [page, category]);

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        <p className="section-label mt-8">Catálogo</p>
        <h1 className="section-title mb-2">Equipo DJ disponible</h1>
        <p className="text-ink-dim mb-8">Equipos de sonido, iluminación y accesorios profesionales.</p>

        {/* Filtros de categoría */}
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => { setCategory(''); setPage(1); }}
              className={`px-4 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                !category ? 'border-cyan text-cyan bg-cyan/10' : 'border-cyan/20 text-ink-dim hover:border-cyan/50'
              }`}
            >
              Todos
            </button>
            {cats.map((c) => (
              <button
                key={c} type="button"
                onClick={() => { setCategory(c); setPage(1); }}
                className={`px-4 py-1.5 rounded font-mono text-xs uppercase tracking-wider border transition-colors ${
                  category === c ? 'border-cyan text-cyan bg-cyan/10' : 'border-cyan/20 text-ink-dim hover:border-cyan/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Grilla de productos */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-hud animate-pulse">
                <div className="h-48 bg-bg-3 rounded mb-4" />
                <div className="h-4 bg-bg-3 rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-3 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-ink-dim text-center py-20">No hay productos disponibles en este momento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p._id} className="card-hud group">
                {p.images?.[0]?.url ? (
                  <img
                    src={p.images[0].url}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-bg-3 rounded mb-4 flex items-center justify-center text-ink-mute">
                    🎛
                  </div>
                )}
                {p.category && <p className="section-label text-xs mb-1">{p.category}</p>}
                <h2 className="font-display text-sm font-bold text-ink mb-2 line-clamp-2">{p.name}</h2>
                <p className="font-display text-lg font-black text-cyan">
                  ${p.price.toLocaleString('es-MX')}
                  <span className="text-xs text-ink-dim font-body font-normal"> MXN</span>
                </p>
                {p.stock === 0 && (
                  <p className="text-xs text-magenta font-mono mt-1">Sin stock</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {total > 12 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline px-4 py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <span className="font-mono text-sm text-ink-dim">
              Página {page} de {Math.ceil(total / 12)}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / 12)}
              className="btn-outline px-4 py-2 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
