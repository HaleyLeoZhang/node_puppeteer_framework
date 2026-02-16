'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { apiChapterDetail, apiImageList } from '@/utils/api';
import type { ChapterDetail, ImageItem } from '@/types';

function ImageReader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = parseInt(searchParams.get('id') || '0');

  const [images, setImages] = useState<ImageItem[]>([]);
  const [detail, setDetail] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageWidth, setImageWidth] = useState(55);
  const [showConfig, setShowConfig] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showBars, setShowBars] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedCountRef = useRef(0);
  const lastScrollTopRef = useRef(0);

  // 加载图片宽度配置
  useEffect(() => {
    const saved = localStorage.getItem('image_width');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setImageWidth(parsed.rate || 55);
      } catch {}
    }
  }, []);

  // 滚动时隐藏/显示顶部和底部导航栏
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // 首次滚动记录
      if (lastScrollTopRef.current === 0) {
        lastScrollTopRef.current = currentScrollTop;
        return;
      }

      // 向下滚动隐藏，向上滚动显示
      if (currentScrollTop > lastScrollTopRef.current && currentScrollTop > 100) {
        setShowBars(false);
      } else {
        setShowBars(true);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 保存阅读进度
  const saveProgress = useCallback((detail: ChapterDetail) => {
    const key = `history_read_${detail.comic.id}`;
    localStorage.setItem(key, JSON.stringify({
      id: detail.chapter.id,
      sequence: detail.chapter.sequence,
    }));
  }, []);

  // 获取章节详情和图片
  const fetchData = useCallback(async () => {
    setLoading(true);
    loadedCountRef.current = 0;
    try {
      const [detailRes, imageRes] = await Promise.all([
        apiChapterDetail(chapterId),
        apiImageList(chapterId),
      ]);

      if (detailRes.data.code === 200) {
        setDetail(detailRes.data.data);
        document.title = `${detailRes.data.data.chapter.name} | ${detailRes.data.data.comic.name}`;
        saveProgress(detailRes.data.data);
      }

      if (imageRes.data.code === 200) {
        setImages(imageRes.data.data?.list || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [chapterId, saveProgress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 懒加载图片
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              loadedCountRef.current++;
            }
          }
        });
      },
      { rootMargin: '200px' }
    );

    document.querySelectorAll('img[data-src]').forEach((img) => {
      observer.observe(img);
    });

    return () => observer.disconnect();
  }, [images]);

  // ESC 键关闭配置面板
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowConfig(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 返回上一页面（浏览器历史）
  const goBackHistory = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      goBack();
    }
  };

  // 返回章节列表
  const goBack = () => {
    if (detail) {
      router.push(`/chapter?id=${detail.comic.id}&name=${encodeURIComponent(detail.comic.name)}`);
    } else {
      router.push('/');
    }
  };

  // 跳转下一章
  const goNext = () => {
    if (detail?.next_chapter.id) {
      router.push(`/image?id=${detail.next_chapter.id}`);
    }
  };

  // 跳转上一章
  const goPrev = () => {
    if (detail?.prev_chapter.id) {
      router.push(`/image?id=${detail.prev_chapter.id}`);
    }
  };

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // 更新图片宽度
  const updateWidth = (width: number) => {
    const validWidth = Math.min(100, Math.max(30, width));
    setImageWidth(validWidth);
    localStorage.setItem('image_width', JSON.stringify({ rate: validWidth }));
  };

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>加载中...</span>
      </div>
    );
  }

  return (
    <main className={styles.main} ref={containerRef}>
      {/* 顶部导航 */}
      <header className={`${styles.header} ${showBars ? '' : styles.hidden}`}>
        <div className={styles.headerLeft}>
          <button onClick={goBackHistory} className={styles.navBtn}>
            ← 返回
          </button>
          <button onClick={goBack} className={styles.navBtn}>
            目录
          </button>
        </div>
        <h1 className={styles.title}>{detail?.chapter.name}</h1>
        <div className={styles.headerActions}>
          <button onClick={toggleFullscreen} className={styles.iconBtn} title="全屏">
            {fullscreen ? '⛶' : '⛶'}
          </button>
          <button onClick={() => setShowConfig(!showConfig)} className={styles.iconBtn} title="设置">
            ⚙
          </button>
        </div>
      </header>

      {/* 配置面板 */}
      <AnimatePresence>
        {(showConfig || !showBars) && showConfig && (
          <motion.div
            className={styles.configPanel}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <label className={styles.configLabel}>
              图片宽度: {imageWidth}%
              <input
                type="range"
                min="30"
                max="100"
                value={imageWidth}
                onChange={(e) => updateWidth(parseInt(e.target.value))}
                className={styles.rangeInput}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图片列表 */}
      <div className={styles.imageContainer}>
        <div className={styles.imageList} style={{ maxWidth: `${imageWidth}%` }}>
          {images.map((img, index) => (
            <motion.img
              key={img.id}
              data-src={img.src_origin || img.src_own}
              alt={`第 ${img.sequence} 张`}
              className={styles.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><rect fill="%231e293b" width="400" height="600"/><text x="50%" y="50%" fill="%2364748b" text-anchor="middle" dy=".3em">图片加载失败</text></svg>';
              }}
            />
          ))}
        </div>
      </div>

      {/* 底部导航 */}
      <footer className={`${styles.footer} ${showBars ? '' : styles.hidden}`}>
        <button
          onClick={goPrev}
          disabled={!detail?.prev_chapter.id}
          className={styles.footerBtn}
        >
          上一章
        </button>
        <button onClick={scrollToTop} className={styles.footerBtn}>
          ↑ 顶部
        </button>
        <button
          onClick={goNext}
          disabled={!detail?.next_chapter.id}
          className={styles.footerBtn}
        >
          下一章
        </button>
      </footer>

      {/* 浮动按钮 - 始终显示 */}
      <div className={styles.floatingBtns}>
        <button onClick={scrollToTop} className={styles.floatBtn} title="返回顶部">
          ↑
        </button>
        <button onClick={toggleFullscreen} className={styles.floatBtn} title="全屏">
          ⛶
        </button>
      </div>
    </main>
  );
}

export default function ImagePage() {
  return (
    <Suspense fallback={
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>加载中...</span>
      </div>
    }>
      <ImageReader />
    </Suspense>
  );
}
