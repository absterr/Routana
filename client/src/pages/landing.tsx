import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <>
    <section className="px-8 flex flex-col items-center justify-center">
      <div
        className="flex flex-col items-center text-center max-w-sm md:max-w-lg lg:max-w-4xl min-h-[90vh]"
        id="hero"
      >
        <header className="text-center pt-36 md:pt-56">
          <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl pb-5 lg:pb-10 tracking-tight">
            Learn smarter with a roadmap that adapts to you
          </h1>
          <p className="text-gray-400 text-sm md:text-lg lg:text-xl">
            No more guessing what to study. Get structured guidance that keeps you moving forward.
          </p>
        </header>

        <div className="flex gap-x-8 py-12 lg:py-14">
          <Link to={"/signup"}>
            <Button
              size={"lg"}
              className="bg-purple-600 text-white text-sm sm:text-base font-semibold hover:bg-purple-700 rounded-lg transition-colors cursor-pointer"
            >
              Get started
            </Button>
          </Link>

          <Link to={"/pricing"}>
            <Button
              size={"lg"}
              variant={"outline"}
              className="shadow-none rounded-lg text-sm sm:text-base font-semibold cursor-pointer">
              See pricing
            </Button>
          </Link>
        </div>

        <p className="pt-24 text-gray-400 text-xs sm:text-sm font-semibold" >
          Powered by intelligent learning models and real-world skill data.
        </p>
      </div>
    </section>
    <Footer />
  </>
);

export default LandingPage;
