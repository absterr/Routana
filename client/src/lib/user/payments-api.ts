import { queryAPI, routes } from "../api";

export const checkout = async (interval: "month" | "year") => {
  const data = await queryAPI<{ url: string }>
    (`${routes.stripe}/checkout`, {
      method: "POST",
      body: JSON.stringify({ interval })
    });

  return data.url;
};

export const cancel = async () => {
  const data = await queryAPI<{ canceled: boolean }>
    (`${routes.stripe}/cancel`, {
      method: "POST"
    });

  return data.canceled;
};
