import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/");
    } else {
      setError(res?.error || "ログインに失敗しました");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 16 }}>メールでログイン</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 6, border: "1px solid #ccc" }}
        />
        {error && <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: "100%", background: "#059669", color: "white", padding: 12, border: "none", borderRadius: 6, fontWeight: "bold", fontSize: "1rem" }} disabled={loading}>
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <button onClick={() => signIn("google")}
          style={{ background: "#2563eb", color: "white", padding: 10, border: "none", borderRadius: 6, fontWeight: "bold", fontSize: "1rem", width: "100%" }}>
          Googleでログイン
        </button>
        <div style={{ marginTop: 12 }}>
          <a href="/signup" style={{ color: "#2563eb", textDecoration: "underline" }}>アカウント新規作成</a>
        </div>
      </div>
    </div>
  );
}