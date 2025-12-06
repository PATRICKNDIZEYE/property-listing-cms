import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import ScrollToTop from "../components/scroll-to-top";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}

