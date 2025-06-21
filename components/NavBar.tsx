// components/NavBar.tsx
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <div className="p-2 border-b flex justify-between items-center">
      <h1 className="font-bold">コメントプラットフォーム</h1>
      {session ? (
        <div>
          {session.user?.name} さん
          <button className="ml-2 text-blue-600" onClick={() => signOut()}>ログアウト</button>
        </div>
      ) : (
        <button className="text-blue-600" onClick={() => signIn()}>ログイン</button>
      )}
    </div>
  );
}
