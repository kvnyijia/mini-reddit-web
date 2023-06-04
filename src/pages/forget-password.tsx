import { Flex, Button, Box, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgetPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

const ForgetPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgetPassword] = useForgetPasswordMutation();
  return (
    <Wrapper variant="small">
    <Formik
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        await forgetPassword(values);
        setComplete(true);
      }}
    >
      {({isSubmitting}) => 
        complete ? (
          <Box>
            If an account with that email exists, we've sent you an email for reseting password.
          </Box>
        ) : (
        <Form>
          <InputField
            name="email"
            placeholder="Email"
            label="Email"
            type="text"
          />
          <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme='teal'>
            Sent reset password email
          </Button>
        </Form>
      )}
    </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgetPassword);