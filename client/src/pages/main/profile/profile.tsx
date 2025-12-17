import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth/useAuth";
import { deleteUser } from "@/lib/user/user-api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DetailsForm from "./DetailsForm";
import type { FormDetails } from "./FormDetails";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => navigate("/login", { replace: true }),
    onError: () => toast.error("Unable to delete account")
  });

  if (!user) {
    return null;
  }

  const formDetails: FormDetails[] = [
    {
      title: "Name",
      purpose: "Edit name",
      placeholder: user.name,
      description:
        "This will be visible on your profile and for your note collaborators to see",
      field: "Full name",
    },
    {
      title: "Email",
      purpose: "Edit email address",
      placeholder: user.email,
      description: "This will be used for logging in and account recovery",
      field: "Email address",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
      <div className="flex flex-col gap-y-8 py-6 px-2">
        <h2 className="font-semibold text-xl md:text-2xl tracking-tight">Personal details</h2>
        <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-gray-200">
          {formDetails.map((detail) => (
            <DetailsForm
              formDetails={detail}
              key={detail.title}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 py-6 px-2">
        <h2 className="font-semibold text-xl md:text-2xl tracking-tight">Manage account</h2>
        <div className="flex items-center justify-between p-6 rounded-xl border border-gray-200">
          <div>
            <h3 className="font-semibold text-base md:text-lg">
              Delete account
            </h3>
            <p className="text-neutral-700 text-sm md:text-base">
              Permanently delete your routana account
            </p>
          </div>
          <div className="px-1.5">
            <Dialog>
              <DialogTrigger className="text-red-600 font-semibold hover:underline">
                Delete
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm delete</DialogTitle>
                  <DialogDescription>
                    Deleting your account is permanent and irreversible. You will loose
                    all your goals record, roadmaps and resources.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="rounded-lg shadow-none"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    variant={"destructive"}
                    className="rounded-lg"
                    disabled={isPending}
                    onClick={() => mutate()}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
