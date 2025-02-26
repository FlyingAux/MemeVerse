import "./globals.css";
import Nav from "./components/nav";


export const metadata = {
  title: "MemeVerse",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav></Nav>
        {children}
      </body>
    </html>
  );
}
