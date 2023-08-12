import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducer/AuthReducer";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
  
      if (response.status === 200) {
        dispatch(loginSuccess(response.data.token));
        if (response.data.user.roleID === 1) {
          navigate("/employee");
        } else if (response.data.user.roleID === 2) {
          navigate("/employee");
        } else if (response.data.user.roleID === 3) {
          navigate("/admin");
        }
        console.log(response.data.user.roleID);
        console.log("Login successful");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle login error
    }
  };

  return (
    <Box
      p={4}
      bg="gray.100"
      borderRadius="lg"
      boxShadow="md"
      w={{ base: "90%", md: "50%" }}
      h={"100%"}
      mt={{ base: 15, md: 10 }}
      mx={"auto"}
    >
      <Box p={6}>
        <Heading as="h2" size="lg" mb={4}>
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" w="100%">
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
