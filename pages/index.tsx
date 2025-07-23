import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [posts, setPosts] = useState<{ postId: string; body: string; commentCount: number }[]>([]);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // localStorage から折りたたみ状態を復元
  useEffect(() => {
    const savedIntroState = localStorage.getItem('textories-show-intro');
    
    if (savedIntroState !== null) {
      setShowIntro(JSON.parse(savedIntroState));
    }
  }, []);

  // 状態変更時に localStorage に保存
  const toggleIntro = () => {
    const newState = !showIntro;
    setShowIntro(newState);
    localStorage.setItem('textories-show-intro', JSON.stringify(newState));
  };

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setPosts(sorted);
        } else {
          console.error("API returned invalid data format:", data);
          setPosts([]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      });
  }, []);

  return (
    <>
      <Head>
        <title>投稿一覧 | Textories - 1時間で消えるメッセージ</title>
        <meta name="description" content="最新の投稿を確認して、1時間限定のメッセージを楽しもう。Textoriesでは投稿が自動的に消える新感覚のコミュニケーションが体験できます。" />
        <meta property="og:title" content="投稿一覧 | Textories - 1時間で消えるメッセージ" />
        <meta property="og:description" content="最新の投稿を確認して、1時間限定のメッセージを楽しもう。Textoriesでは投稿が自動的に消える新感覚のコミュニケーションが体験できます。" />
        <meta name="twitter:title" content="投稿一覧 | Textories - 1時間で消えるメッセージ" />
        <meta name="twitter:description" content="最新の投稿を確認して、1時間限定のメッセージを楽しもう。" />
      </Head>
      <div className={styles.container}>

      {/* サービス紹介セクション */}
      <section className={styles.introSection}>
        <div className={styles.introHeader}>
          <h1 className={styles.introTitle}>
            📝 Textories
            <span className={styles.introSubtitle}>1時間で消えるメッセージ</span>
          </h1>
          <button 
            className={styles.toggleButton}
            onClick={toggleIntro}
          >
            {showIntro ? '▲ 閉じる' : '▼ サービス説明・使い方'}
          </button>
        </div>
        {showIntro && (
          <div className={styles.introContent}>
            {/* サービス説明 */}
            <div className={styles.heroContent}>
              <p className={styles.heroDescription}>
                今この瞬間の気持ちを投稿しよう。<br />
                投稿は<strong>1時間後に自動で消える</strong>から、ふらっとつぶやけます。
              </p>
              <div className={styles.heroFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>⏰</span>
                  <span>1時間で自動削除</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>👤</span>
                  <span>匿名投稿可能</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>💬</span>
                  <span>気軽にコメント</span>
                </div>
              </div>
              <div className={styles.heroActions}>
                <Link href="/new" className={styles.primaryButton}>
                  📝 今すぐ投稿する
                </Link>
                <Link href="/about" className={styles.secondaryButton}>
                  サービス概要
                </Link>
              </div>
            </div>
            
            {/* 使い方説明 */}
            <div className={styles.howToContent}>
              <div className={styles.steps}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <h3>投稿する</h3>
                  <p>今の気持ちや考えを50文字以内で投稿</p>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <h3>交流する</h3>
                  <p>他の人の投稿にコメントで気軽に反応</p>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <h3>消える</h3>
                  <p>1時間後に投稿が自動で見えなくなります</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 最新投稿セクション */}
      <section className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>💭 最新の投稿</h2>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              現在は投稿がありません。
            </p>
            <Link href="/new" className={styles.primaryButton}>
              新規投稿
            </Link>
          </div>
        ) : (
          <div className={styles.postList}>
        {posts.map((post) => (
          <Link key={post.postId} href={`/post/${post.postId}`} legacyBehavior>
            <div className={styles.postCard} tabIndex={0} role="button">
              <span className={styles.postBody}>{post.body}</span>
              <span className={styles.commentCount}>
                💬 {post.commentCount}
              </span>
            </div>
          </Link>
        ))}
          </div>
        )}
      </section>
      </div>
    </>
  );
}
