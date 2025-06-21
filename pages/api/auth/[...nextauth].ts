// pages/api/auth/[...nextauth].ts
import NextAuth, { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";
import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { customAlphabet } from "nanoid";

const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TABLE_NAME = "Users";
const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
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

    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        userId: token.userId,
        username: token.username,
      };
    },
  },
};

export default NextAuth(authOptions);
