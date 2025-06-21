import { useEffect, useState } from "react";

export default function ApprovePage() {
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/comments?unapproved=true")
      .then((res) => res.json())
      .then(setComments);
  }, []);

  const approve = async (commentId: string) => {
    await fetch("/api/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">承認待ちコメント</h1>
      {comments.map((c) => (
        <div key={c.commentId} className="border p-2 mb-2">
          <p className="text-sm text-gray-600">投稿ID: {c.postId}</p>
          <p className="text-sm text-gray-600">タイプ: {c.type}</p>
          <p className="mb-2">{c.content}</p>
          <button
            className="bg-green-500 text-white px-3 py-1"
            onClick={() => approve(c.commentId)}
          >
            承認する
          </button>
        </div>
      ))}
    </div>
  );
}