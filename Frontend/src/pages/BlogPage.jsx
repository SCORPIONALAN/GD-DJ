import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav    from '../components/Nav';
import Footer from '../components/Footer';
import { publicAPI } from '../lib/api';

export default function BlogPage() {
  const [posts, setPosts]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicAPI.getBlogPosts({ page, limit: 9 })
      .then((r) => { setPosts(r.data.posts ?? []); setTotal(r.data.total ?? 0); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        <p className="section-label mt-8">Blog</p>
        <h1 className="section-title mb-8">Publicaciones</h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-hud animate-pulse">
                <div className="h-44 bg-bg-3 rounded mb-4" />
                <div className="h-4 bg-bg-3 rounded w-3/4 mb-2" />
                <div className="h-3 bg-bg-3 rounded w-full" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-ink-dim text-center py-20">No hay publicaciones todavía.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="card-hud group block">
                {post.featuredImage?.url && (
                  <img
                    src={post.featuredImage.url}
                    alt={post.title}
                    className="w-full h-44 object-cover rounded mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                )}
                {post.category && (
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan/60">{post.category}</span>
                )}
                <h2 className="font-display text-base font-bold text-ink mt-1 mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-ink-dim text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                )}
                <p className="text-xs text-ink-mute mt-4 font-mono">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-MX') : ''}
                </p>
              </Link>
            ))}
          </div>
        )}

        {total > 9 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="btn-outline px-4 py-2 text-xs disabled:opacity-40">← Anterior</button>
            <span className="font-mono text-sm text-ink-dim">Página {page} de {Math.ceil(total / 9)}</span>
            <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 9)}
              className="btn-outline px-4 py-2 text-xs disabled:opacity-40">Siguiente →</button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
