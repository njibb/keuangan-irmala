import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // Cari user di database berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Akun tidak ditemukan");
        }

        // Validasi password yang di-hash
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Password salah");
        }

        // Kirim data user ke session jika login sukses
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Memasukkan role ke dalam objek user
        };
      }
    })
  ],
  callbacks: {
    // Memasukkan data role ke dalam JWT Token
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    // Memasukkan data role dari token ke dalam Session agar bisa dibaca di UI
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login", // Mengarahkan ke halaman login kustom kita jika belum terautentikasi
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };