import CustomError from "./CustomError";

const rootAPI = "/api";

export const routes = {
  app: "/app",
  user: "/user",
  stripe: "/stripe"
} as const;

export const queryAPI = async <T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const res = await fetch(`${rootAPI}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Request failed", res.status);
  }

  return data;
};
