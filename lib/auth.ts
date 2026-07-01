import { AuthOptions } from "next-auth";
import GoogleProvider      from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt              from "bcryptjs";
import { connectDB }       from "@/lib/mongodb";
import { User }            from "@/lib/models/User";
import { logUserEvent }    from "@/lib/sheets";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });
        if (!user) return null;
        if (!user.password) return null; // Google-only account
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name:     user.name,
            email:    user.email,
            image:    user.image,
            provider: "google",
          });
          await logUserEvent(user.name ?? "", user.email ?? "", "", "google", "signup");
        } else {
          await logUserEvent(user.name ?? "", user.email ?? "", "", "google", "login");
        }
      } else if (account?.provider === "credentials") {
        await logUserEvent(user.name ?? "", user.email ?? "", "", "email", "login");
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string; phone?: string }).id = token.sub;
        (session.user as { id?: string; phone?: string }).phone = token.phone as string | undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub   = user.id;
        token.phone = (user as { phone?: string }).phone;
      }
      return token;
    },
  },
  pages:   { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
  secret:  process.env.NEXTAUTH_SECRET,
};
