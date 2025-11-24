import { useQuery } from "@tanstack/react-query";
import { getSession } from "./auth-client";

const useCachedSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useCachedSession;
