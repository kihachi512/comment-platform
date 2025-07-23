// pages/_app.tsx
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import Head from "next/head";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";

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
    <ErrorBoundary>
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
          
          {/* 構造化データ */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Textories",
                "description": "投稿が1時間で自動的に見えなくなる新感覚のメッセージサービス",
                "url": "https://textories.vercel.app",
                "applicationCategory": "SocialNetworkingApplication",
                "operatingSystem": "All",
                "creator": {
                  "@type": "Organization",
                  "name": "桃缶党"
                },
                "featureList": [
                  "1時間で消える投稿",
                  "匿名投稿・コメント",
                  "Googleアカウント連携",
                  "ユーザー名設定",
                  "リアルタイム投稿表示"
                ]
              })
            }}
          />
        </Head>
        <NavBar />
        <Component {...pageProps} toggleTheme={toggleTheme} theme={theme} />
        <Footer />
      </SessionProvider>
    </ErrorBoundary>
  );
}
