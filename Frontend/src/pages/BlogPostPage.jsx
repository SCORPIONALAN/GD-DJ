import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav    from '../components/Nav';
import Footer from '../components/Footer';
import { publicAPI } from '../lib/api';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    setLoading(true);
    publicAPI.getBlogPost(slug)
      .then((r) => setPost(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4 max-w-3xl mx-auto">
        {loading && (
          <div className="mt-16 space-y-4 animate-pulse">
            <div className="h-64 bg-bg-2 rounded" />
            <div className="h-8 bg-bg-2 rounded w-3/4" />
            <div className="h-4 bg-bg-2 rounded w-full" />
            <div className="h-4 bg-bg-2 rounded w-5/6" />
          </div>
        )}

        {error && (
          <div className="mt-16 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-display text-xl font-bold text-ink mb-2">Artículo no encontrado</p>
            <Link to="/blog" className="btn-outline mt-4">← Volver al blog</Link>
          </div>
        )}

        {post && (
          <article className="mt-8">
            {post.featuredImage?.url && (
              <img
                src={post.featuredImage.url}
                alt={post.title}
                className="w-full max-h-80 object-cover rounded-lg mb-8 opacity-90"
              />
            )}

            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <span className="font-mono text-xs uppercase tracking-widest text-cyan/60 border border-cyan/20 px-3 py-1 rounded">
                  {post.category}
                </span>
              )}
              <span className="text-xs text-ink-mute font-mono">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-black text-ink mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-ink-dim text-lg leading-relaxed mb-8 border-l-2 border-cyan/30 pl-4">
                {post.excerpt}
              </p>
            )}

            {/* Contenido del post (texto plano o HTML sanitizado) */}
            <div className="prose-custom text-ink-dim leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-cyan/10">
                {post.tags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-ink-mute border border-ink-mute/20 px-3 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-10">
              <Link to="/blog" className="btn-outline text-xs">← Volver al blog</Link>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
