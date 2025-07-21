import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.postCard} style={{ maxWidth: 600, margin: "40px auto", padding: 32 }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 16 }}>サービス概要</h1>
        <p style={{ fontSize: "1.1rem", marginBottom: 20 }}>
          <b>Textories</b>は、<b>投稿が1時間で自動的に見えなくなる</b>新感覚のメッセージサービスです。
        </p>
        <ul style={{ fontSize: "1.05rem", marginBottom: 24, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>・<b>投稿は1時間後に自動で非表示</b>になります。</li>
          <li style={{ marginBottom: 10 }}>・<b>投稿の閲覧・コメント</b>はアカウントなしでも可能です。</li>
          <li style={{ marginBottom: 10 }}>・<b>投稿</b>にはGoogleアカウント連携によるログインが必要です。</li>
        </ul>
        <p style={{ color: '#6b7280', fontSize: '0.98rem', marginBottom: 32 }}>
          気軽に思いを残したり、匿名でコメントしたりできる、<br />
          「今この瞬間」だけのメッセージ体験をお楽しみください。
        </p>
        <Link href="/">
          <button className={styles.profileButton} style={{ background: '#2563eb' }}>← トップページへ戻る</button>
        </Link>
      </div>
    </div>
  );
}