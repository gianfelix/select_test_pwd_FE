import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Container,
  Flex,
} from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const AdminLanding = () => {
  const [email, setEmail] = useState("");
  const [roleID, setRoleID] = useState("");
  const [baseSalary, setBaseSalary] = useState("");

  const handleCreateEmployee = async () => {
    try {
      // Sending data to the backend
      const response = await axios.post("http://localhost:8000/api/auth", {
        email,
        roleID,
        baseSalary,
      });

      // Display success message
      alert(response.data.message);
    } catch (error) {
      // Handle error
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxW="100%">
        <Flex pt={"60px"} flexDirection={"row"}>
          <Box minW={"20%"}>
            <Sidebar />
          </Box>
          <Box minW={"80%"}>
            <VStack pl={6} pt={5} spacing={6} align="stretch">
              <Heading size="lg" mb={4}>
                Create New Employee
              </Heading>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  value={roleID}
                  onChange={(e) => setRoleID(e.target.value)}
                >
                  <option value={0}> Pilih role . . . </option>
                  <option value={1}>Karyawan Pagi</option>
                  <option value={2}>Karyawan Malam</option>
                  <option value={3}>Admin</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Base Salary</FormLabel>
                <Input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                />
              </FormControl>
              <Button
                onClick={handleCreateEmployee}
                colorScheme="teal"
                size="lg"
                alignSelf="flex-start"
              >
                Create Employee
              </Button>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default AdminLanding;
