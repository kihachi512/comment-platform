import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ApprovePage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;

      const postsRes = await fetch("/api/posts");
      const posts = await postsRes.json();
      const myPostIds = posts
        .filter((post: any) => post.authorId === session.user.email)
        .map((post: any) => post.postId);

      const commentsRes = await fetch("/api/comments?unapproved=true");
      const allComments = await commentsRes.json();

      const filtered = allComments.filter((c: any) => myPostIds.includes(c.postId));
      setComments(filtered);
      setLoading(false);
    };

    fetchData();
  }, [session]);

  const approve = async (commentId: string) => {
    await fetch("/api/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
  };

  if (!session) {
    return <div className="p-4">ログインが必要です。</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">🛡 コメントの承認</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">承認待ちのコメントはありません。</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.commentId} className="border rounded p-4 bg-white shadow-sm">
              <p className="text-sm text-gray-600 mb-1">投稿ID: {c.postId}</p>
              <p className="text-sm text-gray-600 mb-1">タイプ: {c.type}</p>
              <p className="mb-3">{c.content}</p>
              <button
                onClick={() => approve(c.commentId)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                承認する
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
