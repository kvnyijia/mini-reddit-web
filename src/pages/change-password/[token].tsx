import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";
import NextLink from "next/link";

const ChangePassword: NextPage<{token: string}> = ({token}) => {
  const router = useRouter();
  // console.log(router.query);
  const [,changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState('');
  return (
    <Wrapper variant="small">
    <Formik
      initialValues={{ newPassword: '' }}
      onSubmit={async (values, {setErrors}) => {
        const response = await changePassword({
          newPassword: values.newPassword,
          token,
          // token: typeof router.query.token === "string" ? router.query.string as string : "",
        });
        if (response.data?.changePassword.errors) {
          const errorMap = toErrorMap(response.data.changePassword.errors);
          if ('token' in errorMap) {
            setTokenError(errorMap.token);
          }
          setErrors(errorMap);
        } else if (response.data?.changePassword.user) {
          router.push("/");
        }
      }}
    >
      {({isSubmitting}) => (
        <Form>
          <InputField
            name="newPassword"
            placeholder="New Password"
            label="New Password"
            type="password"
          />
          {tokenError ? (
            <Flex>
              <Box mr={2} color="red">{tokenError}</Box>
              <NextLink href="/forget-password">
                <Link>Click here to get a new one again</Link>
              </NextLink>
            </Flex>
          ) : null}
          <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme='teal'>
            Change Password
          </Button>
        </Form>
      )}
    </Formik>
    </Wrapper>
  );
}

ChangePassword.getInitialProps = ({query}) => {
  return {
    token: query.token as string
  };
}

export default withUrqlClient(createUrqlClient)(ChangePassword);
