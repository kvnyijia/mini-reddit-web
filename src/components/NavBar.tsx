import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  const [{data, fetching}] = useMeQuery({
    pause: isServer(),
  });
  let body = null;
  if (fetching) {
    //
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color='white' mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link color='white'>register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} ml={2} mr={2}>
            Create Post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button 
          onClick={async () => { 
            await logout("" as any); 
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    )
  }
  return (
    <Flex
      bg="#eb5528"
      p={4}
      zIndex={1}
      position="sticky"
      top={0}
    >
      <Flex
        maxW={800}
        align="center"
        m="auto"
        flex={1}
      >
        <NextLink href="/">
          <Link>
            <Heading>MiniReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>
          {body} 
        </Box>
      </Flex>
    </Flex>
  );
}
