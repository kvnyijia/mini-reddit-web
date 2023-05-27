import React from "react";
import {Form, Formik} from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField"

interface registerProps {

}



export const Register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper variant="small">
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={(values, actions) => {
        console.log(values);
        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2))
        //   actions.setSubmitting(false)
        // }, 1000)
      }}
    >
      {({isSubmitting}) => (
        <Form>
          <InputField
            name="username"
            placeholder="username"
            label="Username"
          />
          <Box mt={4}>
          <InputField
            name="password"
            placeholder="password"
            label="Password"
          />
          </Box>
          <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme='teal'>
            register
          </Button>
          {/* <div>hhhhhhhhhhhhhh</div> */}
          {/* <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input 
              value={values.username}
              onChange={handleChange}
              id="username"
              placeholder='Username' 
            /> */}
            {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
          {/* </FormControl> */}
        </Form>
      )}
    </Formik>
    </Wrapper>
  );
}

export default Register;