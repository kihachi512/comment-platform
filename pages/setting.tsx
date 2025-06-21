// pages/settings.tsx
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // 初期表示時に現在のusernameを取得
  useEffect(() => {
    const fetchUsername = async () => {
      if (!session?.user?.email) return;

      const res = await fetch(`/api/users/${session.user.email}`);
      const data = await res.json();
      setUsername(data.username || "");
      setLoading(false);
    };

    fetchUsername();
  }, [session]);

  const save = async () => {
    if (!session?.user?.email) return;

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, username }),
    });

    alert("ユーザー名を更新しました！");
  };

  if (loading) return <div className="p-4">読み込み中...</div>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🛠 ユーザー名の設定</h1>
      <label className="block mb-2 text-sm font-medium">ユーザー名</label>
      <input
        className="border p-2 w-full mb-4 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        保存する
      </button>
    </div>
  );
}
