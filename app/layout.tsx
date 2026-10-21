import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://researchflow-evidence-workspace.ella-white8541.chatgpt.site'),
  title: 'Aurora’s Research Workshop',
  description: '以研究任务为中心的个人 AI 学术推理工作台。',
  openGraph: {
    title: 'Aurora’s Research Workshop',
    description: '证据驱动的个人学术工作台',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Aurora’s Research Workshop — 证据驱动的个人学术工作台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurora’s Research Workshop',
    description: '证据驱动的个人学术工作台',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
