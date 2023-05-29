import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
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
      <Flex>
      <Box mr={2}>{data.me.username}</Box>
      <Button 
        onClick={() => { logout("" as any); }}
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
      bg="tan"
      p={4}
    >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  );
}