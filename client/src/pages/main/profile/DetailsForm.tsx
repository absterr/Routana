import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { changeEmail } from "@/lib/auth/auth-client";
import { emailSchema, nameSchema } from "@/lib/auth/auth-schema";
import { updateUsername } from "@/lib/user/user-api";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { FormDetails } from "./FormDetails";

const DetailsForm = ({
  formDetails,
}: {
  formDetails: FormDetails;
}) => {
  const { title, purpose, placeholder, description, field } =
    formDetails;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(placeholder);
  const [error, setError] = useState<string | null>(null);
  const [emailPending, startTransition] = useTransition();

  const { isPending: namePending, mutate } = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Name successfully updated");
    },
    onError: () => toast.error("Couldn't update name")
  });

  const handleSubmit = async () => {
    const value = input.trim();

    const validation =
      title === "Name"
        ? nameSchema.safeParse({ name: value })
        : emailSchema.safeParse({ email: value });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setError(null);

    if (title === "Name") {
      mutate(value);
    } else {
      startTransition(async () => {
        try {
          await changeEmail({
            newEmail: value
          });
          toast("Verification email sent", {
            description:
              "A verification email has been sent to the new email. Please check your email",
          });
          setIsOpen(false);
        } catch {
          toast.error("An error occured while making email change.");
        }
      });
    }
  };

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4"
      >
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-base md:text-lg">
              {isOpen ? purpose : title}
            </h3>
            <p className="text-neutral-700 text-sm md:text-base pr-2">
              {isOpen ? description : placeholder}
            </p>
          </div>
          <CollapsibleTrigger className="hover:underline font-semibold px-1.5">
            {isOpen ? "Cancel" : "Edit"}
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent
          className={cn(
            "transition-all duration-150 ease-in-out",
            "data-[state=closed]:animate-collapsible-up",
            "data-[state=open]:animate-collapsible-down"
          )}
        >
          <div className="flex items-center justify-between py-2">
            <p className="font-semibold">{field}</p>
            {error && <p className="text-sm text-red-500 ml-2 mb-1">{error}</p>}
          </div>
          <div className="flex justify-between items-center gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={cn(
                "rounded-2xl border px-3 py-2 w-full focus:outline-none focus:border-2",
                error ? "border-red-500" : "focus:border-foreground"
              )}
            />
            <Button
              disabled={title === "Email" ? emailPending : namePending}
              className="rounded-2xl h-10"
              onClick={handleSubmit}
            >
              { title === "Email"
                ? emailPending ? "Saving..." : "Save"
                : namePending ? "Saving..." : "Save"
              }
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {title === "Name" && <hr />}
    </>
  );
};

export default DetailsForm;
