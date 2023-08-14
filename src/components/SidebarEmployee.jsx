import React from "react";
import { Box, Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import jwt_decode from "jwt-decode";

const SidebarEmployee = () => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("token");

  // Decode the token to extract the payload
  const decodedToken = jwt_decode(token);

  // Extract the userID from the decoded payload
  const userID = decodedToken.id;

  return (
    <Box w="200px" bg="gray.200" h="93.5vh" p={4}>
      <VStack spacing={2} align="stretch">
        <Link as={RouterLink} to="/employee" color="teal.500">
          Dashboard Employee
        </Link>
        <Link as={RouterLink} to={`/employee/salary/${userID}`} color="teal.500">
          Salary Reports
        </Link>
      </VStack>
    </Box>
  );
};

export default SidebarEmployee;
