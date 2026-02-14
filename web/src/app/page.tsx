'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { apiComicList } from '@/utils/api';
import type { Comic } from '@/types';

const TAG_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: '热门', color: '#ef4444' },
  2: { label: '连载', color: '#f59e0b' },
  3: { label: '完结', color: '#22c55e' },
};

export default function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastRead, setLastRead] = useState<Record<number, number>>({});
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchComics = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await apiComicList(page);
      if (res.data.code === 200) {
        const list: Comic[] = res.data.data?.list || [];

        if (list.length === 0) {
          setHasMore(false);
        } else {
          setComics(prev => [...prev, ...list]);
          setPage(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Failed to fetch comics:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // 加载阅读历史
  useEffect(() => {
    const history: Record<number, number> = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('history_read_')) {
        const id = parseInt(key.replace('history_read_', ''));
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            history[id] = parsed.sequence || 0;
          } catch {}
        }
      }
    });
    setLastRead(history);
  }, []);

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchComics();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchComics, hasMore, loading]);

  // 初始加载
  useEffect(() => {
    fetchComics();
  }, []);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className={styles.titleIcon}>📚</span>
            漫画书架
          </motion.h1>
          <p className={styles.subtitle}>云天河的漫画资源</p>
        </div>
        <div className={styles.headerDecor} />
      </header>

      <div className={styles.container}>
        <div className={styles.grid}>
          <AnimatePresence>
            {comics.map((comic, index) => (
              <motion.div
                key={`${comic.id}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  href={`/chapter?id=${comic.id}&name=${encodeURIComponent(comic.name)}`}
                  className={styles.card}
                >
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={comic.pic}
                      alt={comic.name}
                      className={styles.cardImage}
                      loading="lazy"
                    />
                    <div className={styles.cardOverlay}>
                      {comic.tag && TAG_LABELS[comic.tag] && (
                        <span
                          className={styles.tag}
                          style={{ backgroundColor: TAG_LABELS[comic.tag].color }}
                        >
                          {TAG_LABELS[comic.tag].label}
                        </span>
                      )}
                      {lastRead[comic.id] && (
                        <span className={styles.readBadge}>
                          已读 {lastRead[comic.id]} 话
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{comic.name}</h3>
                    <p className={styles.cardIntro}>{comic.intro}</p>
                    <div className={styles.cardMeta}>
                      <span className={styles.chapterCount}>
                        📖 {comic.supplier.max_sequence} 话
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div ref={loaderRef} className={styles.loader}>
          {loading && (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner} />
              <span>加载中...</span>
            </div>
          )}
          {!hasMore && comics.length > 0 && (
            <p className={styles.noMore}>没有更多了</p>
          )}
        </div>
      </div>
    </main>
  );
}
