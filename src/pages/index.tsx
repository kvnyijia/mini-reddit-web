import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { UpddotSection } from "../components/UpdootSection";


const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10, 
    cursor: null as string | null,
  });
  const [{data, fetching}] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>No post exists</div>;
  }

  return (
    <Layout>
    <Flex align="center" flexDir="row">
      <Heading>MiniReddit</Heading>
      <NextLink href="/create-post">
        <Link ml={80} mr={0}>
          Create Post
        </Link>
      </NextLink>
    </Flex>
    <br/>
    {!data && fetching ? (
      <div>loading...</div>
    ) : (
      <Stack spacing={8}>
        {data!.posts.posts.map((p) => (
          <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
            <UpddotSection post={p}/>
            <Box>
              <Heading fontSize="xl">{p.title}</Heading> 
              <Text>Posted by {p.creator.username}</Text>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box> 
          </Flex>
        ))}
      </Stack>
    )}
    {data && data.posts.hasMore ? (
      <Flex>
        <Button 
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length-1].createdAt,
            });
          }}
          isLoading={fetching} m="auto" my={8}>
          Load more
        </Button>
      </Flex>
    ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
