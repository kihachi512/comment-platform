import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const [posts, setPosts] = useState<{ postId: string; title: string; body: string }[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 操作セクション */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold">ようこそ</h1>
          {!session ? (
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => signIn("google")}
            >
              Googleでログイン
            </button>
          ) : (
            <div className="text-sm text-right">
              <p className="mb-1">{session.user?.name} さん</p>
              <button
                className="bg-gray-600 text-white px-3 py-1 rounded"
                onClick={() => signOut()}
              >
                ログアウト
              </button>
            </div>
          )}
        </div>

        {session && (
          <div className="flex flex-col gap-2 mt-2">
            <Link href="/new" className="text-blue-600 underline">
              ▶ 新規投稿
            </Link>
            <Link href="/approve" className="text-blue-600 underline">
              ▶ コメントの承認
            </Link>
          </div>
        )}
      </div>

      {/* 投稿一覧 */}
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-1">投稿一覧</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">まだ投稿がありません。</p>
        ) : (
          posts.map((post) => (
            <div key={post.postId} className="border rounded p-4 mb-4 shadow-sm">
              <Link
                href={`/post/${post.postId}`}
                className="text-lg font-semibold text-blue-700 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-gray-700 mt-2">{post.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
