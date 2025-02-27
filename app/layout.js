import "./globals.css";
import Nav from "./utils/nav";


export const metadata = {
  title: "MemeVerse",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-100 ">
        <Nav></Nav>
        {children}
      </body>
    </html>
  );
}
