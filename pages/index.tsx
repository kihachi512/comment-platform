import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const [posts, setPosts] = useState<{ postId: string; title: string; body: string }[]>([]);
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          const fallback = session.user?.name || "ユーザー";
          setUsername(data?.username || fallback);
          setUserId(data?.userId || "");
        });
    }
  }, [session]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ようこそ</h1>
        {!session ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => signIn("google")}
          >
            Googleでログイン
          </button>
        ) : (
          <div className="text-sm text-right space-y-1">
            <div>
              {username} <span className="text-gray-500 text-xs">#{userId}</span> さん
            </div>
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => (window.location.href = "/approve")}
              >
                コメントの承認
              </button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={() => signOut()}
              >
                ログアウト
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ログインユーザー専用操作 */}
      {session && (
        <div className="flex flex-wrap gap-4">
          <Link href="/new">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              新規投稿
            </button>
          </Link>
          <Link href="/profile">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              プロフィール設定
            </button>
          </Link>
        </div>
      )}

      {/* 区切り */}
      <hr className="border-t border-gray-300 my-4" />

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.postId} className="border p-4 rounded shadow-sm bg-white">
            <Link
              href={`/post/${post.postId}`}
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-gray-700 mt-2">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
