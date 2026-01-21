import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import {AuthProvider} from "@/context/AuthProvider";
import {SettingProvider} from "@/context/SettingProvider";
import {Toaster} from "@/components/ui/sonner";
import {RefreshDataProvider} from "@/context/RefreshDataProvider";
import {GeminiApiKeyContext, GeminiApiKeyProvider} from "@/context/GeminiApiKeyProvider";
import {GoogleOAuthProvider} from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uixify - Замечательный UI/UX с ИИ",
  description: "Ваш ИИ-инструмент для генерации крутого UI/UX дизайна - абсолютно бесплатно!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (



    <html lang="en">
    <head>
        <script defer
                data-website-id="ef6303d0-b92c-45c4-bf6c-ed31064c3158"
                data-domain="https://uixify-ai.vercel.app"
                src="https://analytity-track.vercel.app/analytics.js">
        </script>
    </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Toaster/>


          <AuthProvider>
              <SettingProvider>
                  <RefreshDataProvider>
                      <GeminiApiKeyProvider>
                          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!} >
                              {children}
                          </GoogleOAuthProvider>
                      </GeminiApiKeyProvider>
                  </RefreshDataProvider>
              </SettingProvider>
          </AuthProvider>

      </body>
    </html>

  );
}
