import { useAuth } from "@/lib/auth/useAuth";
import DetailsForm from "./DetailsForm";
import type { FormDetails } from "./FormDetails";

const ProfilePage = () => {
  const { user } = useAuth();

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
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-y-8 py-6 lg:py-12">
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
    </section>
  );
}

export default ProfilePage;
