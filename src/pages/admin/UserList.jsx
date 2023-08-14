import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
} from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const getRoleName = (roleID) => {
    switch (roleID) {
      case 1:
        return "Karyawan Pagi";
      case 2:
        return "Karyawan Malam";
      case 3:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  return (
    <Box>
      <Navbar />
      <Flex pt={"60px"}>
        <Box>
          <Sidebar />
        </Box>
        <Box px={20} py={10} w={"full"} flex="1"  bg="white" boxShadow="md" rounded="md">
          <Heading size="lg" mb={4}>
            User List
          </Heading>
          <Table variant="simple" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Full Name</Th>
                <Th>Email</Th>
                <Th>Username</Th>
                <Th>Role</Th>
                <Th>Birthday</Th>
                <Th>Base Salary</Th>
                <Th>Day Salary</Th>
                <Th>Income</Th>
                <Th>Active</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.username}</Td>
                  <Td>{getRoleName(user.roleID)}</Td>
                  <Td>{user.birthday}</Td>
                  <Td>{user.baseSalary}</Td>
                  <Td>{user.daySalary}</Td>
                  <Td>{user.income}</Td>
                  <Td>
                    <Text color={user.isActive ? "green.500" : "red.500"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserList;
