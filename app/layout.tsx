import "./globals.css";
import Provider from "./_trpc/Provider";
import NextAuthProvider from "./_components/SessionProvider"
import { MoodProvider } from "./_components/context/MoodContext";
import Navbar from "./_components/Navbar";
import { ThemeProviders } from "./_components/providers";
import { Toaster } from "@/components/ui/toaster"
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <body className="bg-gradient-to-r from-indigo-200 to-indigo-300 dark:bg-gradient-to-r dark:from-indigo-400 dark:to-indigo-700 h-full w-full">
        <NextAuthProvider>
          <ThemeProviders>
            <Provider>
              <MoodProvider>
                <Navbar />
                {children}
                <Toaster />
              </MoodProvider>
            </Provider>
          </ThemeProviders>
        </NextAuthProvider>
      </body>
    </html>
  );
}
