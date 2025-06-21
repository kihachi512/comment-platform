import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const USERS_TABLE = "Users";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (!session.user?.email) return session;

      try {
        const result = await client.send(
          new GetItemCommand({
            TableName: USERS_TABLE,
            Key: { email: { S: session.user.email } },
          })
        );

        if (result.Item) {
          const userData = {
            userId: result.Item.userId?.S || "",
            username: result.Item.username?.S || "",
          };
          session.user.id = userData.userId;
          session.user.name = userData.username || session.user.name;
        } else {
          // 初回ログインユーザーなので保存
          const newUserId = nanoid(12); // 12桁の一意IDを生成
          await client.send(
            new PutItemCommand({
              TableName: USERS_TABLE,
              Item: {
                email: { S: session.user.email },
                userId: { S: newUserId },
                username: { S: session.user.name || "ユーザー" },
              },
            })
          );
          session.user.id = newUserId;
        }
      } catch (err) {
        console.error("セッション処理エラー:", err);
      }

      return session;
    },
  },
});
