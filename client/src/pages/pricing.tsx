import Footer from "@/components/Footer";
import PricingCard from "./PricingCard";

const PricingPage = () => (
  <>
  <section className="w-full flex flex-col items-center pb-12">
    <div className="max-w-sm md:max-w-xl lg:max-w-3xl pt-18 md:pt-24 pb-28">
      <header className="text-center pb-18">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl pb-3 lg:pb-6 tracking-tight">
          Plans built for progress
        </h1>
        <p className="text-gray-400 md:text-lg lg:text-xl">
          Options that match your pace and priorities
        </p>
      </header>

      <PricingCard />
    </div>
  </section>
  <Footer />
  </>
);

export default PricingPage;
