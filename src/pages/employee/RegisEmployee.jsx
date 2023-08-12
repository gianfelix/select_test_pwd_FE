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
} from "@chakra-ui/react";
import { unstable_HistoryRouter, useNavigate, useParams } from "react-router-dom";

const RegisEmployee = () => {
  const { token } = useParams();
//   const history = useHistory()
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
        "http://localhost:8000/api/auth",
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
        navigate("/"); // Menggunakan prop redirectToLogin untuk mengalihkan halaman
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Container maxW="xl">
        <VStack p={6} spacing={4} align="stretch">
          <Heading size="lg">Register Lanjutan</Heading>
          <Text>Please complete your registration.</Text>
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
            <Button type="submit" colorScheme="blue">
              Register
            </Button>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default RegisEmployee;
