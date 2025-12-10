import CustomError from "./CustomError";

export const checkout = async (interval: "month" | "year") => {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ interval })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Failed to create checkout session", res.status);
  }

  return data.url;
}

export const cancel = async () => {
  const res = await fetch("/api/stripe/cancel", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    }
  });

 const data = await res.json();
 if (!res.ok) {
   throw new CustomError(data.error || "Unable to cancel subscription", res.status);
 }

  return data.canceled;
}
