import "./globals.css";
import Provider from "./_trpc/Provider";
import NextAuthProvider from "./_components/SessionProvider"
import { MoodProvider } from "./_components/context/MoodContext";
import Navbar from "./_components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="bg-red-300 h-full w-full">
        <NextAuthProvider>
          <Provider>
            <MoodProvider>
              <Navbar />
              {children}
            </MoodProvider>
          </Provider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
