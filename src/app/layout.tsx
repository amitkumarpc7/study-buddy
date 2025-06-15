import React from "react";
import { AppProvider } from "./components/AppProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "Study Buddy",
  description: "Your personal study companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {" "}
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
