import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/useAuth";
import { cancel, checkout } from "@/lib/user/payments-api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const billingDetails = [
  {
    title: "Monthly",
    interval: "month",
    price: "$10",
    extra: "Cancel anytime"
  },
  {
    title: "Yearly",
    interval: "year",
    price: "$96",
    extra: "Save 20%"
  },
] as const;

const BillingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onSuccess: (url) => {
      window.location.href = url;
    },
    onError: (err) => toast.error("Failed to establish subscription session", {
      description: err.message
    }),
  });

  const cancelMutation = useMutation({
    mutationFn: cancel,
    onSuccess: () => {
      navigate("/billing", { replace: true });
      toast.success("Your subscription was successfully canceled");
    },
    onError: (err) => toast.error("Unable to cancel subscription", {
      description: err.message
    }),
  })

  if (!user) {
    return null;
  }

  const isCanceled = user.subscriptionStatus === "canceled" && user.plan !== "Hobby";
  const isActive = user.subscriptionStatus === "active" && user.plan !== "Hobby";
  const visiblePlan =
    user.plan === "Hobby"
      ? billingDetails
      : billingDetails.filter((d) =>
        user.plan.toLowerCase().includes(d.title.toLowerCase())
      );

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 pt-2 pb-18 tracking-tight text-center">
        {user.plan === "Hobby" ? "Get access to the pro features" : "You're on the pro plan"}
      </h1>

      <div className="bg-white rounded-xl border border-gray-200">
        {visiblePlan.map((detail, i) => (
          <div key={detail.title} className="px-8">
            <div className={cn("py-6 border-gray-200 flex justify-between items-center",
              { "border-b": i !== billingDetails.length - 1 }
            )}>
              <div className="flex flex-col gap-y-1.5">
                <h2 className="font-semibold text-sm md:text-base lg:text-lg">{detail.title}</h2>
                <strong className="text-2xl lg:text-3xl">
                  {detail.price}
                  <span className="inline text-neutral-500 font-medium text-sm lg:text-base">
                    {" "}
                    /{detail.interval}
                  </span>
                </strong>
                <p className="text-neutral-600 text-xs lg:text-sm">
                  {detail.interval === "month" ? "Billed monthly" : "Billed annually"}{". "}
                  {user.plan === "Hobby" && detail.extra}.
                </p>
              </div>
              <div>
               {
                 isCanceled
                 ? <Badge className="rounded-2xl p-2">Canceled</Badge>
                 : <Button
                   variant={isActive ? "destructive" : "default"}
                   disabled={cancelMutation.isPending || checkoutMutation.isPending}
                   onClick={isActive
                     ? () => cancelMutation.mutate()
                     : () => checkoutMutation.mutate(detail.interval)
                   }
                   className="rounded-xl hover:cursor-pointer"
                 >
                   {isActive ? "Cancel" : "Upgrade"}
                 </Button>
               }
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-12">
        <Link to={"/pricing"} className="text-gray-600 hover:underline">
          See all plans and features
        </Link>
      </div>
    </section>
  );
}

export default BillingPage;
