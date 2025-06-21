import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ApprovePage() {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;

      // 自分の投稿IDを取得
      const postsRes = await fetch("/api/posts");
      const posts = await postsRes.json();
	  const userEmail = session.user?.email;
	  const myPostIds = posts
	  .filter((post: any) => post.authorId === userEmail)
	  .map((post: any) => post.postId);


      // 全未承認コメント取得
      const commentsRes = await fetch("/api/comments?unapproved=true");
      const allComments = await commentsRes.json();

      // 自分の投稿に対するコメントだけを表示
      const filtered = allComments.filter((c: any) => myPostIds.includes(c.postId));
      setComments(filtered);
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
