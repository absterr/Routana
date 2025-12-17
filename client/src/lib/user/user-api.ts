import { queryAPI, routes } from "../api";

export const updateUsername = async (newName: string) => {
  const data = await queryAPI(`${routes.user}/name`, {
    method: "PATCH",
    body: JSON.stringify({ newName })
  });

  return data.success;
};

export const deleteUser = async () => {
  const data = await queryAPI(`${routes.user}/delete`, {
    method: "DELETE",
  });

  return data.success;
};
