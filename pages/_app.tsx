// pages/_app.tsx
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import NavBar from "../components/NavBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={(pageProps as any).session}>
      <NavBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
