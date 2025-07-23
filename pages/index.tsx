import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/Home.module.css";
import NavBar from "../components/NavBar";

export default function Home() {
  const [posts, setPosts] = useState<{ postId: string; body: string; commentCount: number }[]>([]);
  const { data: session } = useSession();
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

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

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/profile?email=${session.user.email}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        const fallbackName = session.user.name || "ユーザー";
        setUsername(data?.username || fallbackName);
        setUserId(data?.userId || "");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Use fallback values on error
        const fallbackName = session.user.name || "ユーザー";
        setUsername(fallbackName);
        setUserId("");
      }
    };

    fetchUser();
  }, [session]);

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

      {/* ヒーローセクション */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            📝 Textories
            <span className={styles.heroSubtitle}>1時間で消えるメッセージ</span>
          </h1>
          <p className={styles.heroDescription}>
            今この瞬間の気持ちを投稿しよう。<br />
            投稿は<strong>1時間後に自動で消える</strong>から、気軽に本音を表現できます。
          </p>
          <div className={styles.heroFeatures}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⏰</span>
              <span>1時間で自動消去</span>
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
              サービス詳細
            </Link>
          </div>
        </div>
      </section>

      {/* 使い方説明 */}
      <section className={styles.howToSection}>
        <h2 className={styles.sectionTitle}>📖 使い方</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>投稿する</h3>
            <p>今の気持ちや考えを50文字以内で投稿</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>交流する</h3>
            <p>他の人の投稿にポジティブ・ネガティブでリアクション</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>消える</h3>
            <p>1時間後に投稿が自動で見えなくなります</p>
          </div>
        </div>
      </section>

      {/* 最新投稿セクション */}
      <section className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>💭 最新の投稿</h2>
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              まだ投稿がありません。<br />
              あなたが最初の投稿者になりませんか？
            </p>
            <Link href="/new" className={styles.primaryButton}>
              最初の投稿をする
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