import GoogleProviders from "next-auth/providers/google";
import CredentialProviders from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import { findUserByEmail } from "@/app/mongodb/query/users";
import { SignInSchema } from "@/app/zod/schemas";

export const authOption: NextAuthOptions = {
  providers: [
    CredentialProviders({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", placeholder: "Email", type: "email" },
        password: {
          label: "password",
          placeholder: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const validation = SignInSchema.safeParse(credentials);

        const {
          success: validationSuccessful,
          data: validatedData,
          error,
        } = validation;

        if (!validationSuccessful) {
          console.log("Validation failed:", error.format());
          throw new Error("Invalid email or password format!");
        }

        const user = await findUserByEmail(validatedData.email);

        if (!user) {
          throw new Error("Invalid email or password!");
        }

        const passwordMatch = await bcrypt.compare(
          validatedData.password,
          user?.password!
        );

        if (!passwordMatch) {
          throw new Error("Invalid email or password!");
        }
        console.log("Login successful!");

        const { _id, fullName, email, avatarUrl } = user;
        return {
          id: _id.toString(),
          name: fullName,
          email,
          image: avatarUrl,
        };
      },
    }),
    GoogleProviders({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user) return "No user found";

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.avatarUrl = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id || token.sub,
          email: token.email,
          avatarUrl: token.avatarUrl,
        },
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
