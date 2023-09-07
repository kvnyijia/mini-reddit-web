import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
  let isServer = false;
  useEffect(() => {
    isServer = typeof window === "undefined";
  }, []);
  const [{data, fetching}] = useMeQuery({
    pause: isServer,
  });
  let body = null;
  if (fetching) {
    //
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login" style={{color: 'white', paddingRight: 12, }}>
          login
        </NextLink>
        <NextLink href="/register" style={{color: 'white', }}>
          register
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post" style={{color: 'white', paddingRight: 12, }}>
          Create Post
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
          <Heading>MiniReddit</Heading>
        </NextLink>
        <Box ml={'auto'}>
          {body} 
        </Box>
      </Flex>
    </Flex>
  );
}
