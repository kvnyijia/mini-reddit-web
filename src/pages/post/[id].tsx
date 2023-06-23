import React from "react";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import { Box, Heading } from "@chakra-ui/react";

const Post = ({}) => {
  const router = useRouter();
  const postId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{data, error, fetching}] = usePostQuery({
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

  if (error) {
    return (<div>{error.message}</div>);
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find the post you request.</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>
        {data.post.title}
      </Heading>
      {data.post.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Post);
