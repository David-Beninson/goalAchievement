import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../database/conn";
import { compare } from "bcryptjs";
import UserSchema from "../../../model/UserSchema";

export default NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.CLIENT_GOOGLE_ID,
      clientSecret: process.env.CLIENT_GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.CLIENT_GITHUB_ID,
      clientSecret: process.env.CLIENT_GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials, req) {
        connectMongo().catch((error) => {
          error: "Connection Failed...!";
        });
        // check user existance
        const result = await UserSchema.findOne({ email: credentials.email });
        if (!result) {
          throw new Error("No user Found with Email Please Sign Up...!");
        }

        // compare()
        const checkPassword = await compare(
          credentials.password,
          result.password
        );

        // incorrect password
        if (!checkPassword || result.email !== credentials.email) {
          throw new Error("Username or Password doesn't match");
        }
        delete result.password;
        return result;
      },
    }),
  ],
  secret: process.env.JWS_SECRET,
  session: {
    strategy: "jwt",
  },
});
