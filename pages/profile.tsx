// pages/profile.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.username) setUsername(data.username);
        });
    }
  }, [session]);

  const saveUsername = async () => {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session?.user?.email, username }),
    });

    if (res.ok) {
      setMessage("ユーザー名を更新しました！");
    } else {
      setMessage("更新に失敗しました。");
    }
  };

  if (!session) {
    return <div className="p-4">ログインが必要です。</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">🖊ユーザー名設定</h1>
      <label className="block text-sm font-medium">新しい名前：</label>
      <input
        className="border p-2 w-full rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ももんが"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={saveUsername}
      >
        保存
      </button>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}
