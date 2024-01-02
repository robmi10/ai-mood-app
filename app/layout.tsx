import "./globals.css";
import Provider from "./_trpc/Provider";
import NextAuthProvider from "./_components/SessionProvider"

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
            {children}
          </Provider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
