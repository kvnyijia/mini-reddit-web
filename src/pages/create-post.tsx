import { Button, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  // Check user is login
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  return (
    <Layout variant="small">
    <Formik
      initialValues={{ title: '', text: '' }}
      onSubmit={async (values) => {
        const {error} = await createPost({input: values});
        // The global error handler will handle error if  any
        if (!error) {
          router.push("/");
        }
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
            Create Post
          </Button>
        </Form>
      )}
    </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
