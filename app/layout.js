import "./globals.css";
import Nav from "./Components/nav";


export const metadata = {
  title: "MemeVerse",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav/>
        {children}
      </body>
    </html>
  );
}
