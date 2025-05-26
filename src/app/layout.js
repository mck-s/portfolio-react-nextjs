// app/layout.js
export const metadata = {
  title: "McK Schroeder - Portfolio Site",
  description: "Bilingual (EN/JA) web developer based in Tokyo. I like computer stuff.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head />
      <body>{children}</body>
    </html>
  );
}
