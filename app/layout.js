import "./globals.css";
import { Toaster } from "react-hot-toast";
import { poppins } from "@/utils/font";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
export const metadata = {
  title: "UNI POLLING",
  description: "University e-voting system by oluwaseyifunmi ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-[url('/bg.svg')] bg-no-repeat bg-cover text-gray-900 antialiased flex items-center justify-center h-screen`}
      >
        <Toaster />
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
