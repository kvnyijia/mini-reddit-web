import React from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id 
}) => {
  const [, deletePost] = useDeletePostMutation();
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton 
          as={Link}
          mr={4}
          icon={<EditIcon />} 
          aria-label="Edit Post"
        />
      </NextLink>
      <IconButton 
        ml="auto" 
        icon={<DeleteIcon />} 
        aria-label="Delete Post"
        onClick={() => {
          deletePost({deletePostId: id})
        }}
      />
    </Box>
  );
};
