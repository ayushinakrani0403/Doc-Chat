

// import { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google"
// import { prisma } from "./prisma"
// import bcrypt from "bcryptjs"

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         })

//         if (!user || !user.password) return null

//         const isValid = await bcrypt.compare(credentials.password, user.password)
//         if (!isValid) return null

//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           plan: user.plan,
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "google" && user.email) {
//         const existing = await prisma.user.findUnique({
//           where: { email: user.email },
//         })
//         if (!existing) {
//           await prisma.user.create({
//             data: {
//               name: user.name ?? "User",
//               email: user.email,
//               password: null,
//             },
//           })
//         }
//       }
//       return true
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.plan = (user as any).plan
//         //  token.plan = (user as { plan?: string }).plan
//         // token.plan = (user as { plan?: string }).plan
//       }
//       if (!token.plan && token.email) {
//         const dbUser = await prisma.user.findUnique({
//           where: { email: token.email as string },
//           select: { id: true, plan: true },
//         })
//         if (dbUser) {
//           token.id = dbUser.id
//           token.plan = dbUser.plan
//         }
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id as string
//         session.user.plan = token.plan as string
//       }
//       return session
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// }


import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!existing) {
          await prisma.user.create({
            data: {
              name: user.name ?? "User",
              email: user.email,
              password: null,
            },
          })
        }
      }
      return true
    },

    async jwt({ token, user , trigger, session}) {
      // On first sign-in, set id from user object
      if (user) {
        token.id = user.id
      }

        // ── ADD THIS BLOCK — handles updateSession() calls from client ──
  if (trigger === "update" && session?.name) {
    token.name = session.name
  }

      // ── Always re-fetch plan from DB so upgrades reflect immediately ──
      // This runs on every session check, ensuring plan is never stale
      const email = token.email as string | undefined
      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          // select: { id: true, plan: true },
           select: { id: true, plan: true, name: true },  // ← add name here too
        })
        if (dbUser) {
          token.id   = dbUser.id
          token.plan = dbUser.plan
          if (trigger !== "update") token.name = dbUser.name  // ← add this line
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string
        session.user.plan = token.plan as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}