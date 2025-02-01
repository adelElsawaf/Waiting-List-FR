import "../../styles/globals.css";
import Navbar from "./component/shared/navbar/Navbar";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
