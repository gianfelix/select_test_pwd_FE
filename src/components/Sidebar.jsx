import React from "react";
import { Box, Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <Box w="200px" bg="gray.200" h="93.5vh" p={4}>
      <VStack spacing={2} align="stretch">
        <Link as={RouterLink} to="/admin" color="teal.500">
          Dashboard
        </Link>
        <Link as={RouterLink} to="/admin/employees" color="teal.500">
          Employees
        </Link>
      </VStack>
    </Box>
  );
};

export default Sidebar;
