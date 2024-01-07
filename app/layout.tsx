import "./globals.css";
import Provider from "./_trpc/Provider";
import NextAuthProvider from "./_components/SessionProvider"
import { MoodProvider } from "./_components/context/MoodContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Provider>
            <MoodProvider>
              {children}
            </MoodProvider>
          </Provider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
