/**
 * Blog — preview de los 3 últimos posts en la home.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../lib/api';
import { useReveal } from '../hooks/useReveal';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [ref, visible]    = useReveal();

  useEffect(() => {
    publicAPI.getBlogPosts({ limit: 3 }).then((r) => setPosts(r.data.posts ?? [])).catch(() => null);
  }, []);

  if (!posts.length) return null;

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto" ref={ref}>
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label">Blog</p>
            <h2 className="section-title">Últimas publicaciones</h2>
          </div>
          <Link to="/blog" className="btn-outline text-xs px-4 py-2 hidden sm:inline-flex">
            Ver todo →
          </Link>
        </div>

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
              <h3 className="font-display text-base font-bold text-ink mt-1 mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-ink-dim text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
              )}
              <p className="text-xs text-ink-mute mt-4 font-mono">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('es-MX') : ''}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link to="/blog" className="btn-outline">Ver todo el blog →</Link>
        </div>
      </div>
    </section>
  );
}
