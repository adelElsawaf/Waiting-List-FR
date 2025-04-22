import "../../styles/globals.css";
import Footer from "./component/shared/footer/footer";
import Navbar from "./component/shared/navbar/Navbar";
import { NavbarProvider } from "./providers/NavbarProvider";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavbarProvider>
    <html lang="en">
      <body >
        <Navbar></Navbar>
        {children}
        <Footer></Footer>
      </body>
    </html>
    </NavbarProvider>
  );
}
