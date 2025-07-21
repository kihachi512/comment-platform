import Link from "next/link";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <h1 className={styles.title}>💡サービス概要</h1>
        <p className={styles.description}>
          <b>Textories</b>は、<b>投稿が1時間で見えなくなる</b>メッセージサービスです。
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>投稿は<b>1時間後に自動で非表示</b>になります。</li>
          <li className={styles.listItem}>投稿の<b>閲覧・コメント</b>はアカウントなしでも可能です。</li>
          <li className={styles.listItem}>投稿には<b>Googleアカウント連携によるログイン</b>が必要です。</li>
        </ul>
        <p className={styles.subText}>
          気軽に思いを残したり、匿名でコメントしたりできる、「今この瞬間」だけのメッセージ体験をお楽しみください。
        </p>
      </div>
    </div>
  );
}
