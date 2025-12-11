import CustomError from "../CustomError";

export const updateUsername = async (newName: string) => {
  const res = await fetch("/api/user/name", {
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
  const res = await fetch("/api/user/delete", {
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
