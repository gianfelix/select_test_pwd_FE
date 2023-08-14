import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Divider,
} from "@chakra-ui/react";
import { MdAttachMoney, MdDateRange } from "react-icons/md";
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

  function getMonthName(month) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month - 1];
  }

  // Format currency as IDR
  function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <Box>
      <NavbarEmployee />
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
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Total Salary</Th>
                        <Th>Total Deduction</Th>
                        <Th>Month</Th>
                        <Th>Year</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {salaryRecords.map((record) => (
                        <Tr key={record.id}>
                          <Td>
                            {formatCurrency(record.TotalSalary)}
                          </Td>
                          <Td>{formatCurrency(record.TotalDeduction)}</Td>
                          <Td>{getMonthName(record.Month)}</Td>
                          <Td>{record.Year}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
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
