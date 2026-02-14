'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { apiChapterList } from '@/utils/api';
import type { Chapter } from '@/types';

function ChapterList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const comicId = parseInt(searchParams.get('id') || '0');
  const comicName = decodeURIComponent(searchParams.get('name') || '漫画');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReverse, setIsReverse] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chapter_order');
      return saved === '-1';
    }
    return false;
  });
  const [lastReadId, setLastReadId] = useState<number>(0);

  // 获取章节列表
  const fetchChapters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiChapterList(comicId);
      if (res.data.code === 200) {
        const list: Chapter[] = res.data.data?.list || [];
        setChapters(list);

        // 获取上次阅读
        if (typeof window !== 'undefined') {
          const historyKey = `history_read_${comicId}`;
          const history = localStorage.getItem(historyKey);
          if (history) {
            try {
              const parsed = JSON.parse(history);
              setLastReadId(parsed.id || 0);
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    } finally {
      setLoading(false);
    }
  }, [comicId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // 切换排序
  const toggleOrder = () => {
    const newOrder = !isReverse;
    setIsReverse(newOrder);
    localStorage.setItem('chapter_order', newOrder ? '-1' : '1');
  };

  // 显示的章节列表
  const displayedChapters = isReverse ? [...chapters].reverse() : chapters;

  // 返回书架
  const goBack = () => {
    router.push('/');
  };

  // 跳转到上次阅读
  const goToLastRead = () => {
    if (lastReadId) {
      const element = document.getElementById(`chapter-${lastReadId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <button onClick={goBack} className={styles.backBtn}>
          <span className={styles.backIcon}>←</span>
          返回书架
        </button>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{comicName}</h1>
        </div>
        <div className={styles.actions}>
          <button onClick={toggleOrder} className={styles.orderBtn}>
            {isReverse ? '🔃 正序' : '🔃 倒序'}
          </button>
          {lastReadId > 0 && (
            <button onClick={goToLastRead} className={styles.lastReadBtn}>
              📖 上次阅读
            </button>
          )}
        </div>
      </header>

      <div className={styles.container}>
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`${styles.chapterCard} ${styles.skeleton}`} />
            ))}
          </div>
        ) : (
          <motion.div className={styles.grid} layout>
            <AnimatePresence>
              {displayedChapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <Link
                    href={`/image?id=${chapter.id}`}
                    className={`${styles.chapterCard} ${
                      lastReadId === chapter.id ? styles.lastRead : ''
                    }`}
                    id={`chapter-${chapter.id}`}
                  >
                    <span className={styles.chapterName}>{chapter.name}</span>
                    {lastReadId === chapter.id && (
                      <span className={styles.readingBadge}>续</span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && chapters.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>暂无章节数据</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ChapterPage() {
  return (
    <Suspense fallback={
      <div className={styles.main}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>加载中...</span>
        </div>
      </div>
    }>
      <ChapterList />
    </Suspense>
  );
}
