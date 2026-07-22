import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Digital Readiness Assessment Tool",
  description:
    "Empowers Malaysian SMEs to assess their digital readiness through a tailored questionnaire, providing scores, insights, and resources to boost digital adoption.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
