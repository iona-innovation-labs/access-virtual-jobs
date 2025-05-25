import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import { Montserrat, Bebas_Neue, Unbounded, Karla, Faustina, Archivo } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
})

const faustina = Faustina({
  subsets: ['latin'],
  variable: '--font-faustina',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})


const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("activeTheme")?.value || "system";
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
      <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${bebas.variable} ${unbounded.variable} ${karla.variable} ${faustina.variable} antialiased`}>
      <body className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : ""
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <ActiveThemeProvider initialTheme={activeThemeValue}>
              <SessionProvider>{children}</SessionProvider>
            </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
