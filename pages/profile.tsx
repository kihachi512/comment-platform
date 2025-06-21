// pages/profile.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/profile?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.username) setUsername(data.username);
          if (data?.userId) setUserId(data.userId);
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
      <h1 className="text-2xl font-bold mb-4">💋プロフィール</h1>
      <div className="space-y-2">
        <label className="block text-sm font-medium">ユーザー名：</label>
        <input
          className="border p-2 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ももんが"
        />
        <p className="text-sm text-gray-600">一意のID: <span className="font-mono">#{userId}</span></p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={saveUsername}
        >
          保存
        </button>
        {message && <p className="text-green-600">{message}</p>}
      </div>
    </div>
  );
}
