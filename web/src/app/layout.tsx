import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: '漫画书架 | 云天河',
  description: '漫画爬虫书架 - 做产品、外包请加 QQ 1290336562',
  keywords: '漫画爬虫,漫画书架',
  authors: [{ name: 'HaleyLeoZhang' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
