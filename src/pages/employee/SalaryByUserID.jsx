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
  HStack,
} from "@chakra-ui/react";
import { MdAttachMoney, MdDateRange } from "react-icons/md";
import NavbarEmployee from "../../components/NavbarEmployee";
import SidebarEmployee from "../../components/SidebarEmployee";

function SalaryByUserID() {
  const { userID } = useParams();
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSalaryRecords = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/salary/${userID}`,
        {
          params: {
            month: startDate,
            year: endDate,
          },
        }
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
      fetchSalaryRecords();
      console.log(response.data.message);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSalaryRecords();
  }, [userID, startDate, endDate]);

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

  const handleFilter = () => {
    if (startDate && endDate) {
      const startDateObject = new Date(startDate + "-01"); // Assuming YYYY-MM format
      const endDateObject = new Date(endDate + "-01"); // Assuming YYYY-MM format
  
      return salaryRecords.filter((record) => {
        const recordDate = new Date(record.Year, record.Month - 1, 1); // Create a Date object using Year and Month
        return recordDate >= startDateObject && recordDate <= endDateObject;
      });
    } else if (startDate) {
      const startDateObject = new Date(startDate + "-01"); // Assuming YYYY-MM format
  
      return salaryRecords.filter((record) => {
        const recordDate = new Date(record.Year, record.Month - 1, 1);
        return recordDate >= startDateObject;
      });
    } else if (endDate) {
      const endDateObject = new Date(endDate + "-01"); // Assuming YYYY-MM format
  
      return salaryRecords.filter((record) => {
        const recordDate = new Date(record.Year, record.Month - 1, 1);
        return recordDate <= endDateObject;
      });
    } else {
      return salaryRecords;
    }
  };
  
  

  const filteredData = handleFilter();

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
              <Text mb={2}>Filter by Date Range:</Text>
              <HStack spacing={2}>
                <input
                  type="month"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="month"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button onClick={() => { setStartDate(""); setEndDate(""); }}>Clear</Button>
                <Button onClick={fetchSalaryRecords}>Apply Filter</Button>
              </HStack>
            </Box>
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
                      {filteredData.map((record) => (
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