// pages/_app.tsx
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
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
      </Head>
      <NavBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
