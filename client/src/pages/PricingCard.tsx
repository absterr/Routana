import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router-dom";

interface Plan {
  title: "Hobby" | "Pro";
  price: JSX.Element;
  features: string[];
  btnClass: string;
};

const plans: Plan[] = [
  {
    title: "Hobby",
    price: <strong className="text-4xl font-bold tracking-tight">Free</strong>,
    features: [
      "Three goals & roadmaps",
      "Curated resources",
      "Personalized roadmap",
      "Progress tracking"
    ],
    btnClass: "text-black bg-gray-200 hover:bg-gray-300",
  },
  {
    title: "Pro",
    price: (
      <div className="flex">
        <div className="pr-8">
          <strong className="text-4xl font-bold tracking-tight">$10</strong>
          <p className="text-xs text-neutral-700 pt-1.5 whitespace-nowrap">Per month<br />Billed monthly</p>
        </div>
        <div className="border-l pl-8">
          <strong className="text-4xl font-bold tracking-tight">$8</strong>
          <p className="text-xs text-neutral-700 pt-1.5 whitespace-nowrap">Per month<br />Billed annually</p>
        </div>
      </div>
    ),
    features: ["Ten goals & roadmaps", "All other features of hobby"],
    btnClass: "bg-purple-600 hover:bg-purple-700",
  },
];

const PricingCard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
      {plans.map((plan) => (
        <div key={plan.title}
          className={
            cn("flex flex-1 flex-col p-7 border rounded-xl w-full",
              plan.title === "Pro" ? "bg-white gap-3" : "gap-16")
          }
        >
          <div className={cn("text-left", plan.title === "Pro" ? "pb-8.5" : "pb-5")}>
            <p className="text-lg font-semibold pb-2 tracking-tight">{plan.title}</p>
            {plan.price}
          </div>

          <div className="text-left pb-8">
            <p className="pb-4 font-semibold text-sm text-gray-700">Available features:</p>
            <ul className="flex flex-col gap-y-2 text-gray-600">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className={cn("mt-auto", plan.title === "Pro" ? "pt-24" : "pt-1.5")}>
            <Link to={"/signup"}>
              <Button className={`w-full rounded-xl py-6 shadow-none cursor-pointer font-semibold ${plan.btnClass}`}>
                {plan.title === "Hobby" ? "Join for free" : "Get started"}
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PricingCard;
