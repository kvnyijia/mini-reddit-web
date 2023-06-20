import React from "react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";


const Post = ({}) => {
  const router = useRouter();
  const postId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{data, fetching}] = usePostQuery({
    pause: postId === -1,
    variables: {
      postId,
    },
  });
  
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);
