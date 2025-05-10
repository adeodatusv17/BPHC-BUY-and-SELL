import type React from "react"
import "./globals.css"
import Navigation from "@/components/navigation"
import { ListingsProvider } from "@/components/listings-provider"
import { AuthProvider } from "../components/authProvider" 

export const metadata = {
  title: "BPHC Buy & Sell",
  description: "A platform for buying and selling items",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Animated background particles */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <AuthProvider>
        <ListingsProvider>
          <Navigation />
          <main className="container">{children}</main>
          <footer>
            <div className="container">
              <p>&copy; {new Date().getFullYear()} Powered by ACM</p>
            </div>
          </footer>
        </ListingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

