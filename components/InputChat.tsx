import {Button, Flex, FormControl, Input, Spacer} from "@chakra-ui/react";
import React, {useState} from "react";

export const InputChat = () => {
  const [message, setMessage] = useState("");

  const handleMessageChange = (e: any) => setMessage(e.target.value);
  const isErrorMessage = message === "";
  return (
    <Flex justify="space-between" w="100%">
      <FormControl p={3} w="100%" isInvalid={isErrorMessage}>
        <Input
          placeholder="Type a message....."
          borderColor="#C1402F"
          autoComplete="off"
          onChange={handleMessageChange}
        ></Input>
      </FormControl>

      <Flex align="center">
        <Button type="submit" disabled={isErrorMessage}>
          Submit
        </Button>
      </Flex>
    </Flex>
  );
};
