import React from "react";
import { AppProvider } from "./components/AppProvider";
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
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
