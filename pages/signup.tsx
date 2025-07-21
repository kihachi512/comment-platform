import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!form.email || !form.password || !form.username) {
      setError("全ての項目を入力してください");
      return;
    }
    if (form.password.length < 6) {
      setError("パスワードは6文字以上にしてください");
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } else {
      setError(data.error || "登録に失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 16 }}>サインアップ</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="メールアドレス"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="パスワード（6文字以上）"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        {error && <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: "#059669", marginBottom: 12 }}>登録成功！ログイン画面に移動します</div>}
        <button type="submit" style={{ width: "100%", background: "#2563eb", color: "white", padding: 12, border: "none", borderRadius: 6, fontWeight: "bold", fontSize: "1rem" }}>
          登録
        </button>
      </form>
    </div>
  );
}