import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { useDeletePostMutation, useMeQuery, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { UpddotSection } from "../components/UpdootSection";
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10, 
    cursor: null as string | null,
  });
  const [{data: meData}] = useMeQuery();
  const [{data, fetching}] = usePostsQuery({
    variables,
  });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>No post exists</div>;
  }

  return (
    <Layout>
    {!data && fetching ? (
      <div>loading...</div>
    ) : (
      <Stack spacing={8}>
        {data!.posts.posts.map((p) => !p ? null : (
          <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
            <UpddotSection post={p}/>
            <Box flex={1}>
              <NextLink href="/post/[id]" as={`/post/${p.id}`}>
              <Link>
                <Heading fontSize="xl">{p.title}</Heading> 
              </Link>
              </NextLink>
              <Text>Posted by {p.creator.username}</Text>
              <Flex>
                <Text flex={1} mt={4}>{p.textSnippet}</Text>
                {meData?.me?.id !== p.creatorId ? null : 
                  <Box ml="auto">
                    <EditDeletePostButtons id={p.id}/>
                  </Box>
                }
              </Flex>
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
