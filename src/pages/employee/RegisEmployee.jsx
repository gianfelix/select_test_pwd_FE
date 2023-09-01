import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Center,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

const RegisEmployee = () => {
  const { token } = useParams();
  const [fullname, setFullname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "https://enchanting-crab-pantsuit.cyclic.app/api/auth",
        {
          fullname,
          birthday,
          username,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        navigate("/"); // Redirect to homepage after successful registration
      }
    } catch (error) {
      alert("Link Expired, your data has been updated. For more information contact admin");
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Center h="100vh" bg="gray.300">
      <Box
        w={{ base: "90%", sm: "80%", md: "60%", lg: "40%" }}
        p={6}
        bg="white"
        boxShadow="xl"
        borderRadius="3xl"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="lg">Complete Your Registration</Heading>
          <Text>Please provide your information below.</Text>
          <form onSubmit={handleSubmit}>
            <FormControl id="fullname">
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="birthday">
              <FormLabel>Birthday</FormLabel>
              <Input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            {error && <Text color="red">{error}</Text>}
            <Button mt={5} type="submit" colorScheme="blue">
              Register
            </Button>
          </form>
        </VStack>
      </Box>
    </Center>
  );
};

export default RegisEmployee;
