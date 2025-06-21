import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function NewPostPage() {
  const [form, setForm] = useState({ title: "", body: "" });
  const submit = async () => {
    await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: uuidv4(), ...form, authorId: "user-1" }),
    });
    setForm({ title: "", body: "" });
    alert("投稿を作成しました！");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">新規投稿</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="タイトル"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="border p-2 w-full mb-2"
        rows={4}
        placeholder="本文"
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={submit}>
        投稿する
      </button>
    </div>
  );
}