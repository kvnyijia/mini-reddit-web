import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetPostIdFromUri } from "../../../utils/useGetPostIdFromUri";

const EditPost = ({}) => {
  const router = useRouter();
  const postId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{data, fetching}] = useGetPostIdFromUri();
  const [, updatePost] = useUpdatePostMutation();
  if (fetching) {
    return (
      <Layout>
        <div>loading ...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find the post you request.</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
    <Formik
      initialValues={{ title: data.post.title, text: data.post.text }}
      onSubmit={async (values) => {
        await updatePost({updatePostId: postId, ...values});
        router.push("/");
      }}
    >
      {({isSubmitting}) => (
        <Form>
          <InputField
            name="title"
            placeholder="Title"
            label="Title"
            type="text"
          />
          <Box mt={4}>
            <InputField
              name="text"
              placeholder="Text"
              label="Text"
              type="text"
              textarea
            />
          </Box>
          <Button 
            mt={4}
            type="submit" 
            isLoading={isSubmitting} 
            colorScheme='teal'
          >
            Update Post
          </Button>
        </Form>
      )}
    </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
