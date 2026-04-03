import { Bebas_Neue, Space_Mono } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}