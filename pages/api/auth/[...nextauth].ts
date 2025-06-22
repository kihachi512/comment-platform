// pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { customAlphabet } from "nanoid";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user?.email) {
        const email = user.email;
        try {
          const result = await client.send(
            new GetItemCommand({
              TableName: "Users",
              Key: { email: { S: email } },
            })
          );

          if (result.Item) {
            const userData = unmarshall(result.Item);
            token.userId = userData.userId;
            token.username = userData.username;
          } else {
            const newUserId = nanoid();
            await client.send(
              new PutItemCommand({
                TableName: "Users",
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

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.userId = token.userId as string;
      session.user.username = token.username as string;
      return session;
    },
  },
};

export default NextAuth(authOptions);
