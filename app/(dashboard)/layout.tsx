// "use client"
// import { useSession, signOut } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"
// import Link from "next/link"

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const { data: session, status } = useSession()
//   const router = useRouter()

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login")
//     }
//   }, [status, router])

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Loading...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r flex flex-col">
//         {/* Logo */}
//         <div className="p-6 border-b">
//           <h1 className="text-xl font-bold text-blue-600">DocChat</h1>
//           <p className="text-xs text-gray-500 mt-1">AI Chatbot Platform</p>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex-1 p-4 space-y-1">
//           <Link
//             href="/dashboard"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
//           >
//             📊 Dashboard
//           </Link>
//           <Link
//             href="/projects"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
//           >
//             🗂️ Projects
//           </Link>
//           <Link
//             href="/billing"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
//           >
//             💳 Billing
//           </Link>
//         </nav>

//         {/* User Info */}
//         <div className="p-4 border-t">
//           <p className="text-sm font-medium text-gray-700">
//             {session?.user?.name}
//           </p>
//           <p className="text-xs text-gray-500">{session?.user?.email}</p>
//           <button
//             onClick={() => signOut({ callbackUrl: "/login" })}
//             className="mt-2 text-xs text-red-500 hover:underline"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-auto">
//         {children}
//       </main>
//     </div>
//   )
// }

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"
import SessionProvider from "@/components/SessionProvider"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <SessionProvider session={session}>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", background: "#F1F5F9" }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
