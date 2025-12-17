import CustomError from "../CustomError";

const USER_ROUTE = "/api/user";

export const updateUsername = async (newName: string) => {
  const res = await fetch(`${USER_ROUTE}/name`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ newName })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to update user name", res.status);
  }

  return data.url;
}

export const deleteUserAccount = async () => {
  const res = await fetch(`${USER_ROUTE}/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to delete user account", res.status);
  }

  return data.success;
}
