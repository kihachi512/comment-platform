import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function NewPostPage() {
  const [form, setForm] = useState({ body: "" });
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!session?.user?.userId) {
      alert("投稿にはログインが必要です。");
      return;
    }

    if (form.body.length > 50) {
      setError("本文は50文字以内で入力してください。");
      return;
    }

    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: uuidv4(),
        body: form.body,
        authorId: session.user.userId,
        authorName: session.user.username,
      }),
    });

    if (res.ok) {
      setForm({ body: "" });
      alert("投稿を作成しました！");
      router.push("/");
    } else {
      const data = await res.json();
      setError(data?.error || "投稿に失敗しました。");
    }
  };

  if (status === "loading") {
    return <div className="p-4">ログイン状態を確認中...</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🆕 新規投稿</h1>

      <textarea
        className="border p-2 w-full mb-2 rounded"
        rows={4}
        placeholder="本文"
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <p className="text-sm text-gray-500 mb-3">{form.body.length}/50文字</p>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={submit}
        disabled={form.body.length > 50}
      >
        投稿する
      </button>
    </div>
  );
}
