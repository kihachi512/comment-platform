import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostDetail() {
  const router = useRouter();
  const { postId } = router.query;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [form, setForm] = useState({ content: "", type: "praise" });

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/post/${postId}`).then((res) => res.json()).then(setPost);
    fetch(`/api/comments?postId=${postId}`).then((res) => res.json()).then(setComments);
  }, [postId]);

  const submitComment = async () => {
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, postId }),
    });
    setForm({ content: "", type: "praise" });
    const res = await fetch(`/api/comments?postId=${postId}`);
    setComments(await res.json());
  };

  if (!post) return <div>読み込み中...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="mb-4">{post.body}</p>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">コメントを書く</h2>
        <select
          className="border p-1 mb-2"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="praise">良かった点</option>
          <option value="question">疑問点</option>
          <option value="suggestion">改善提案</option>
          <option value="feeling">感情的な感想</option>
        </select>
        <textarea
          className="border w-full p-2 mb-2"
          rows={3}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={submitComment}>
          コメント送信
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">承認されたコメント</h2>
        {comments.map((c) => (
          <div key={c.commentId} className="border p-2 mb-2">
            <p className="text-sm text-gray-600">タイプ: {c.type}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}