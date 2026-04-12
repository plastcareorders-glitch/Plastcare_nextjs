"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    ["/signin", "/signup"].includes(pathname) ||
    pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Header />}

      <main className="flex-grow">{children}</main>

      {!hideLayout && <Footer />}
    </>
  );
}