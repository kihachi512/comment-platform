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

      {/* 投稿一覧 */}
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
      </div>
    </>
  );
}