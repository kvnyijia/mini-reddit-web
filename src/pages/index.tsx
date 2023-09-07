import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { MeQuery, PostsQuery, useMeQuery, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import NextLink from "next/link";
import { Box, Button, Flex, Heading, IconButton, Link, Stack, StackDivider, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UpddotSection } from "../components/UpdootSection";
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
  const [localMeData, setLocalMeData] = useState<MeQuery>(null as any)
  const [localData, setLocalData] = useState<PostsQuery>(null as any);
  const [localFetching, setLocalFetching] = useState(false);
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  useEffect(() => {
    setLocalFetching(fetching);
  }, [fetching]);

  useEffect(() => {
    if (meData) {
      setLocalMeData(meData);
    }
  }, [meData]);

  if (!localFetching && !localData) {
    return (
      <Layout>
        <div>No post exists. The server might not be running.</div>
      </Layout>
    );
  }

  return (
    <Layout>
    {!localData && localFetching ? (
      <div>loading...</div>
    ) : (
      <Stack spacing={8}>
        {localData!.posts.posts.map((p) => !p ? null : (
          <Flex 
            key={p.id} 
            p={5} 
            shadow="md" 
            borderWidth="1px" 
            borderRadius="7px"
          >
            <UpddotSection post={p}/>
            <Box flex={1}>
              <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                <Heading fontSize="xl">{p.title}</Heading> 
              </NextLink>
              <Text>Posted by {p.creator.username}</Text>
              <Flex>
                <Text flex={1} mt={4}>{p.textSnippet}</Text>
                {localMeData?.me?.id !== p.creatorId ? null : 
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
    {localData && localData.posts.hasMore ? (
      <Flex>
        <Button 
          onClick={() => {
            setVariables({
              limit: variables.limit,
              cursor: localData.posts.posts[localData.posts.posts.length-1].createdAt,
            });
          }}
          isLoading={localFetching} m="auto" my={8}>
          Load more
        </Button>
      </Flex>
    ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
