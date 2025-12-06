import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Aoscompo from "@/utils/aos";
const dmsans = DM_Sans({ subsets: ["latin"] });
import NextTopLoader from 'nextjs-toploader';
import { AppContextProvider } from "../context-api/PropertyContext";
import SessionProviderComp from "./provider/SessionProviderComp";

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session:any
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmsans.className}`}>
      <AppContextProvider>
      <SessionProviderComp session={session}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="light"
        >
          <Aoscompo>
            <NextTopLoader />
            {children}
          </Aoscompo>
        </ThemeProvider>
        </SessionProviderComp>
        </AppContextProvider>
      </body>
    </html>
  );
}
