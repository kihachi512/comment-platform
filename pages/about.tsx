import Head from "next/head";
import Link from "next/link";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <>
      <Head>
        <title>サービス概要 | Textories - 1時間で消えるメッセージサービス</title>
        <meta name="description" content="Textoriesは投稿が1時間で自動的に見えなくなる新感覚のメッセージサービスです。匿名投稿・コメント機能、Googleログインでのユーザー名設定が可能。今この瞬間だけのコミュニケーションを楽しめます。" />
        <meta property="og:title" content="サービス概要 | Textories - 1時間で消えるメッセージサービス" />
        <meta property="og:description" content="Textoriesは投稿が1時間で自動的に見えなくなる新感覚のメッセージサービスです。匿名投稿・コメント機能、Googleログインでのユーザー名設定が可能。" />
        <meta name="twitter:title" content="サービス概要 | Textories" />
        <meta name="twitter:description" content="1時間で消える新感覚のメッセージサービスTextoriesの詳細をご紹介。" />
      </Head>
      <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <h1 className={styles.title}>💡サービス概要</h1>
        <p className={styles.description}>
          <b>Textories</b>は、<b>投稿が1時間で見えなくなる</b>メッセージサービスです。
        </p>
        <ul className={styles.list}>
          <li className={styles.listItem}>投稿は<b>1時間後に自動で非表示</b>になります。</li>
          <li className={styles.listItem}><b>投稿（匿名）・閲覧・コメント</b>はアカウントなしでも可能です。</li>
          <li className={styles.listItem}>ユーザー名の設定とユーザー名付きの投稿には<b>Googleアカウント連携によるログイン</b>が必要です。</li>
        </ul>
        <p className={styles.subText}>
          気軽に思いを残したり、匿名でコメントしたりできる、「今この瞬間」だけのメッセージ体験をお楽しみください。
        </p>
      </div>
      </div>
    </>
  );
}
