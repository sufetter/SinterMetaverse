import React, {useEffect, useState} from "react";
import Link from "next/link";
import {
  Heading,
  Box,
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
  InputGroup,
  Spacer,
  Image,
} from "@chakra-ui/react";
import {AttachmentIcon} from "@chakra-ui/icons";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import imageIcon from "../images/imageIcon.png";
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {auth, storage, db} from "../firebaseconfig";
import {doc, setDoc} from "firebase/firestore";
import {useRouter} from "next/router";

function RegisterCard() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(
    "Please, choose your avatar (optional)"
  );
  const [imagePreview, setImagePreview] = useState<string>(imageIcon.src);
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [passwordAlerter, setPasswordAlerter] = useState<string>(
    "Please, enter your password. Min length 6 is required."
  );

  const router = useRouter();
  const handleEmailChange = (e: any) => setEmail(e.target.value);
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
    let str: string = e.target.value;
    if (str.length < 6) {
      setPasswordAlerter(
        "Please, enter your password. Min length 6 is required."
      );
    } else if (
      str.search(/[A-Z]/) == -1 ||
      str.search(/[a-z]/) == -1 ||
      str.search(/[0-9]/) == -1
    ) {
      setPasswordAlerter(
        "Password must contain at least one uppercase and lowercase letter and a number."
      );
    }
    console.log(passwordAlerter);
  };

  const handlePasswordRepeat = (e: any) => {
    setPasswordRepeat(e.target.value);
  };

  const handleDisplayNameChange = (e: any) => setDisplayName(e.target.value);

  const handleFileChange = (e: any) => {
    if (e.target.files[0]?.type == undefined) return;
    file[0] = e.target.files![0];

    if (
      file[0]?.type.includes("image") &&
      Math.round(file[0].size / 1000) < 5000
    ) {
      fileName = file[0].name.split(".").pop()!;
      fileCheck = file[0];
      setAvatar("Your Avatar is: " + file[0].name);
      let avatarPath = URL.createObjectURL(file[0]);
      setImagePreview(avatarPath);
      console.log(file[0].webkitRelativePath);
    } else {
      setAvatar("Not valid file, please, upload Image (up to 5mb)");
    }
  };

  const handleShow = () => setShow(!show);

  const navigate = (href: string) => {
    router.push(`/chat/${href}`);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(
        storage,
        displayName + "." + res.user.uid.slice(0, 5) + "." + fileName
      );

      if (fileCheck) {
        const uploadTask = uploadBytesResumable(storageRef, fileCheck);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (err) => {
            setError(true);
            console.log(err);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                // console.log("File available at", downloadURL);
                // console.log(res.user);
                await updateProfile(res.user, {
                  displayName: displayName,
                  photoURL: downloadURL,
                });
                await setDoc(doc(db, "users", res.user.uid), {
                  userID: res.user.uid,
                  displayName,
                  email,
                  photoURL: downloadURL,
                });

                await setDoc(doc(db, "userChats", res.user.uid), {});
              }
            );
          }
        );
      } else {
        await updateProfile(res.user, {
          displayName: displayName,
        });
        await setDoc(doc(db, "users", res.user.uid), {
          userID: res.user.uid,
          displayName,
          email,
        });
      }

      await setDoc(doc(db, "userChats", res.user.uid), {});

      navigate(displayName + "." + res.user.uid.slice(0, 5));
    } catch (error: any) {
      setError(true);
      // console.log(error.message);
      // console.log(error);
    }
  };

  const isErrorEmail = email === "";
  const isPassowordShort = password.length < 6;
  const isPasswordReliable =
    password.search(/[A-Z]/) !== -1 &&
    password.search(/[a-z]/) !== -1 &&
    password.search(/[0-9]/) !== -1;
  const isErrorPassword = isPassowordShort || !isPasswordReliable;
  const isErrorPasswordRepeat = passwordRepeat != password;
  const isErrorNickname = displayName === "";
  let file: Array<File> = [];
  let fileName: string = "";
  let fileCheck: File;

  return (
    <Flex
      w="100%"
      flex={"1 1 auto"}
      h="100%"
      align="center"
      justify="center"
      bg="#030812"
    >
      <Flex minWidth="400px" maxW={"400px"}>
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
              Register
            </Heading>
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={isErrorNickname}>
                <Input
                  type="text"
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  placeholder="Your nickname"
                  bg="#224957"
                />
                {!isErrorNickname ? (
                  <FormHelperText mb="2">Nice one.</FormHelperText>
                ) : (
                  <FormErrorMessage mb="2">
                    We need any nickname for you.
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isErrorEmail}>
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Email"
                  bg="#224957"
                />
                {!isErrorEmail ? (
                  <FormHelperText mb="2">Email is checked.</FormHelperText>
                ) : (
                  <FormErrorMessage mb="2">Email is required.</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isErrorPassword}>
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
                    disabled={password.length < 1}
                    ml={2}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
                {!isErrorPassword ? (
                  <FormHelperText mb={2}>Password is correct</FormHelperText>
                ) : (
                  <FormErrorMessage mb={2}>{passwordAlerter}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={isErrorPasswordRepeat}>
                <Input
                  type={show ? "text" : "password"}
                  value={passwordRepeat}
                  onChange={handlePasswordRepeat}
                  placeholder="Repeat your Password"
                  bg="#224957"
                  w="100%"
                />
                {!isErrorPasswordRepeat ? (
                  <FormHelperText mb={2}>
                    The entered passwords match each other.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage mb={2}>
                    Please repeat your password.
                  </FormErrorMessage>
                )}
              </FormControl>
              <Stack direction="row" align="center" m={3}>
                <Image boxSize="70px" objectFit="cover" src={imagePreview} />
                <FormLabel htmlFor="Avatar">
                  <Input
                    type="file"
                    pl={3}
                    color="white"
                    border="white"
                    cursor="pointer"
                    onChange={handleFileChange}
                    display="none"
                    id="Avatar"
                  ></Input>
                  <Text
                    align="center"
                    color="white"
                    _hover={{
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    flexWrap="wrap"
                  >
                    {avatar}
                  </Text>
                </FormLabel>
              </Stack>

              <Stack direction="row" mt={2}>
                <Text color="#224957" fontSize={14} fontWeight="bold">
                  Have an account?
                </Text>
                <Spacer />
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </Stack>
              <Button
                type="submit"
                w={"full"}
                mt={5}
                bg="#FE6060"
                color={"white"}
                rounded={"md"}
                disabled={submit}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
              >
                Register
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
export default RegisterCard;
