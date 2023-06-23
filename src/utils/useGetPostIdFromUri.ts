import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

export const useGetPostIdFromUri = () => {
  const router = useRouter();
  const postId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  return usePostQuery({
    pause: postId === -1,
    variables: {
      postId,
    },
  });
};
