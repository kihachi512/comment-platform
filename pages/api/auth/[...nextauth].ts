// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { customAlphabet } from "nanoid";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TABLE_NAME = "Users";
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 初回ログイン時に user オブジェクトが存在する
      if (user?.email) {
        const email = user.email;
        try {
          const result = await client.send(
            new GetItemCommand({
              TableName: TABLE_NAME,
              Key: { email: { S: email } },
            })
          );

          if (result.Item) {
            const userData = unmarshall(result.Item);
            token.userId = userData.userId;
            token.username = userData.username;
          } else {
            // ユーザーがいなければ新規登録
            const newUserId = nanoid();
            await client.send(
              new PutItemCommand({
                TableName: TABLE_NAME,
                Item: {
                  email: { S: email },
                  username: { S: user.name ?? "" },
                  userId: { S: newUserId },
                },
              })
            );
            token.userId = newUserId;
            token.username = user.name ?? "";
          }
        } catch (err) {
          console.error("JWT callback error:", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      // 必要な情報をセッションに追加
      return {
        ...session,
        userId: token.userId,
        username: token.username,
      };
    },
  },
};

export default NextAuth(authOptions);
