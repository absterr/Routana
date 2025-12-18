import { queryAPI, routes } from "../api";

export const updateUsername = async (newName: string) => {
  const data = await queryAPI<{ newName: string }>
    (`${routes.user}/name`, {
      method: "PATCH",
      body: JSON.stringify({ newName })
    });

  return data.newName;
};

export const deleteUser = async () => {
  const data = await queryAPI<{ success: boolean }>
    (`${routes.user}/delete`, {
      method: "DELETE",
    });

  return data.success;
};
