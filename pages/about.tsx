import Link from "next/link";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <h1 className={styles.title}>💡サービス概要</h1>
        <p className={styles.description}>
          <b>Textories</b>は、<b>投稿が1時間で自動的に見えなくなる</b>新感覚のメッセージサービスです。
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}><b>投稿は1時間後に自動で非表示</b>になります。</li>
          <li className={styles.listItem}><b>投稿の閲覧・コメント</b>はアカウントなしでも可能です。</li>
          <li className={styles.listItem}><b>投稿</b>にはGoogleアカウント連携によるログインが必要です。</li>
        </ul>
        <p className={styles.subText}>
          気軽に思いを残したり、匿名でコメントしたりできる、<br />
          「今この瞬間」だけのメッセージ体験をお楽しみください。
        </p>
        <Link href="/">
          <button className={styles.backButton}>← トップページへ戻る</button>
        </Link>
      </div>
    </div>
  );
}
