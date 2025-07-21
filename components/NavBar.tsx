// components/NavBar.tsx
import Link from "next/link";
import styles from "../styles/NavBar.module.css";

export default function NavBar({ children }: { children?: React.ReactNode }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoMain}>Textories</span>
        <span className={styles.logoSub}>〈 A note that only lasts for one hour 〉</span>
      </Link>
      <nav className={styles.nav}>{children}</nav>
    </header>
  );
}
