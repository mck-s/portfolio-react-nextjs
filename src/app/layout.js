// app/layout.js
export const metadata = {
  title: "McK Schroeder - Portfolio Site",
  description:
    "東京在住のバイリンガルMobile/Web開発者。 スマートで構造的、かつクリエイティブなWeb体験を創り上げます。Bilingual Mobile/Web Developer based in Tokyo, Japan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preload" as="image" href="/bg.jpg" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
