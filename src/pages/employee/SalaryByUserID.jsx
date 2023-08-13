import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  List,
  Flex,
  ListItem,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from "@chakra-ui/react";
import NavbarEmployee from "../../components/NavbarEmployee";
import SidebarEmployee from "../../components/SidebarEmployee";

function SalaryByUserID() {
  const { userID } = useParams(); // Get userID from the URL parameter
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSalaryRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/salary/${userID}`
      );
      setSalaryRecords(response.data.salaryRecords);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const calculateSalary = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/employee/salary`,
        { userID }
      );
      fetchSalaryRecords(); // Refresh the records after calculation
      console.log(response.data.message);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSalaryRecords();
  }, [userID]);

  return (
    <Box>
      <Box>
        <NavbarEmployee />
      </Box>
      <Box pt={"60px"}>
        <Flex>
          <SidebarEmployee />
          <Box px={10} py={10} width="100%">
            <Heading mb={4} fontSize="2xl">
              Salary Reports
            </Heading>
            <Flex justifyContent="flex-end" mb={4}>
              <Button onClick={calculateSalary} colorScheme="teal">
                Calculate Salary
              </Button>
            </Flex>
            {isLoading ? (
              <Flex justifyContent="center" alignItems="center" height="300px">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Box>
                {error ? (
                  <Alert status="error" mb={4}>
                    <AlertIcon />
                    Error: {error}
                  </Alert>
                ) : (
                  <List spacing={3}>
                    {salaryRecords.map((record) => (
                      <ListItem
                        key={record.id}
                        bg="white"
                        p={4}
                        boxShadow="md"
                        borderRadius="md"
                      >
                        <Text fontSize="lg" fontWeight="semibold" mb={2}>
                          Total Salary: {record.TotalSalary}
                        </Text>
                        <Text>Total Deduction: {record.TotalDeduction}</Text>
                        <Text>Month: {record.Month}</Text>
                        <Text>Year: {record.Year}</Text>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default SalaryByUserID;
