import "./globals.css";
import Nav from "./utils/nav";
import { ThemeProvider } from "next-themes";
import { MemeProvider } from "./MemeContext";



export const metadata = {
  title: "MemeVerse",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <MemeProvider>
      <ThemeProvider attribute="class">
      <body className="bg-purple-50 dark:bg-purple-300">
        <Nav></Nav>
        {children}
      </body>
      </ThemeProvider>
      </MemeProvider>
    </html>
  );
}
