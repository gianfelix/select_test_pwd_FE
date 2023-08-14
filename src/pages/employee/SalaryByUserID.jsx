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
  HStack,
} from "@chakra-ui/react";
import NavbarEmployee from "../../components/NavbarEmployee";
import SidebarEmployee from "../../components/SidebarEmployee";

function SalaryByUserID() {
  const { userID } = useParams();
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const fetchSalaryRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/salary/${userID}`,
        {
          params: {
            Month: selectedMonth,
          },
        }
      );
      setSalaryRecords(response.data.salaryRecords);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSalaryRecords();
  }, [userID, selectedMonth]);

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
            <Box>
              <Text mb={2}>Filter by Month:</Text>
              <HStack spacing={2}>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <Button onClick={fetchSalaryRecords}>Apply Filter</Button>
              </HStack>
            </Box>
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
                          <Td>{formatCurrency(record.TotalSalary)}</Td>
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
