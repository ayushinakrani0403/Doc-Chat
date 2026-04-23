

// import type { Metadata } from "next"
// import { Geist } from "next/font/google"
// import "./globals.css"
// import Providers from "@/components/providers"

// const geist = Geist({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "DocChat",
//   description: "AI Chatbot Platform",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={geist.className}>
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   )
// }

import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "DocChat — AI Document Chat",
  description: "Chat with your documents instantly using AI",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-jakarta), -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
