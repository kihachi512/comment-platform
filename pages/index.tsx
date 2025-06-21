// pages/index.tsx
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">投稿一覧</h1>
      {posts.map((post) => (
        <div key={post.postId} className="border p-2 mb-2">
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
