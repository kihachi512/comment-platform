// pages/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState<{ postId: string; title: string; body: string }[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">投稿一覧</h1>
      <Link href="/new" className="text-blue-500 underline mb-4 inline-block">+ 新規投稿</Link>
      {posts.map((post) => (
        <div key={post.postId} className="border p-2 mb-2">
          <Link href={`/post/${post.postId}`} className="text-lg font-semibold text-blue-600 hover:underline">
            {post.title}
          </Link>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}