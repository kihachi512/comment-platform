// pages/_app.tsx
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import Head from "next/head";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // クライアントサイドでのみlocalStorageにアクセス
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // クライアントサイドでのみlocalStorageとdocumentにアクセス
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.body.classList.toggle("dark-mode", newTheme === "dark");
    }
  };

  return (
    <SessionProvider session={(pageProps as any).session}>
      <Head>
        <title>Textories | 1時間で消えるメッセージサービス</title>
        <meta name="description" content="Textoriesは、投稿が1時間で自動的に見えなくなる新感覚のメッセージサービスです。" />
        <meta property="og:title" content="Textories | 1時間で消えるメッセージサービス" />
        <meta property="og:description" content="Textoriesは、投稿が1時間で自動的に見えなくなる新感覚のメッセージサービスです。" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Textories" />
        <meta name="twitter:card" content="summary" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>
      <NavBar />
      <Component {...pageProps} toggleTheme={toggleTheme} theme={theme} />
      <Footer />
    </SessionProvider>
  );
}
