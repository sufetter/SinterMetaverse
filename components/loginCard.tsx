import React, {useState, useContext} from "react";
import Link from "next/link";
import {
  Heading,
  useColorModeValue,
  Box,
  Image,
  Flex,
  Center,
  Text,
  Button,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputRightElement,
  InputGroup,
  Checkbox,
  Spacer,
} from "@chakra-ui/react";
import {mainStyles} from "./LayoutCard";
import {auth} from "../firebaseconfig";
import {signInWithEmailAndPassword} from "firebase/auth";
import {useRouter} from "next/router";
import {AuthContext} from "../context/AuthContext";
import {navigate} from "./LayoutCard";
import SingupGoogle from "./SingupGoogle";

function loginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [submit, setSubmit] = useState(false);

  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleShow = () => setShow(!show);
  const currentUser = useContext(AuthContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          // Signed in
          const user = userCredential.user;
          navigate("/chat/" + user?.displayName + "." + user?.uid.slice(0, 5));
        }
      );
    } catch (error: any) {
      setError(true);
      console.log(error.message);
      console.log(error.code);
    }
  };

  const isErrorEmail = email === "";
  const isErrorPssword = password === "";

  return (
    <Flex
      flex={1}
      w="100%"
      align="center"
      justify="center"
      bg={mainStyles.mainBGColor}
    >
      <Flex
        border="2px solid"
        borderColor={mainStyles.cardBorder}
        borderRadius="10px"
      >
        <Box
          maxW={"470px"}
          w={"full"}
          boxShadow={"2xl"}
          rounded={"md"}
          overflow={"hidden"}
          flex={1}
        >
          <Box p={4}>
            <Heading
              fontSize={"38px"}
              fontWeight={500}
              fontFamily={"body"}
              color="white"
              mb="5"
            >
              Login
            </Heading>
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={isErrorEmail}>
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email"
                  bg="#224957"
                />
                {!isErrorEmail ? (
                  <FormHelperText mb="2">
                    Enter your email address.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage mb="2">Email is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isErrorPssword}>
                <InputGroup mb={2}>
                  <Input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                    bg="#224957"
                    w="100%"
                  />
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleShow}
                    p="20px"
                    disabled={isErrorPssword}
                    ml={2}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
                {!isErrorPssword ? (
                  <FormHelperText mb={2}>Enter your password.</FormHelperText>
                ) : (
                  <FormErrorMessage mb={2}>
                    Pssword is required.
                  </FormErrorMessage>
                )}
              </FormControl>

              <Stack direction="row">
                <Checkbox defaultChecked color="white">
                  Remember me
                </Checkbox>
                <Spacer />
                <Link color="#FFE927" href="/reset">
                  <a>
                    <Text
                      color={mainStyles.reservTextColor}
                      fontWeight="660"
                      _hover={{textDecoration: "underline"}}
                    >
                      Forgot Pssword?
                    </Text>
                  </a>
                </Link>
              </Stack>
              <Stack direction="row" mt={2}>
                <Text color="#224957" fontSize={14} fontWeight="bold">
                  Do you want to register?
                </Text>
                <Spacer />
                <Link href="/register">
                  <a>
                    <Text
                      color={mainStyles.secondTextColor}
                      fontWeight="660"
                      _hover={{textDecoration: "underline"}}
                    >
                      Register
                    </Text>
                  </a>
                </Link>
              </Stack>
              <Button
                type="submit"
                w={"full"}
                mt={5}
                bg={mainStyles.mainItemColor}
                color={"white"}
                rounded={"md"}
                disabled={submit}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
              >
                Login
              </Button>
              <Flex justify="center" mt={1} mb={1.5}>
                <Text color={mainStyles.mainTextColor}>or</Text>
              </Flex>
              <SingupGoogle />
            </form>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
export default loginCard;
