import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  Container,
  Flex,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import NavbarEmployee from "../../components/NavbarEmployee";
import SidebarEmployee from "../../components/SidebarEmployee";
import jwtDecode from "jwt-decode";

const EmployeeLanding = () => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [userId, setUserId] = useState("");
  const [isClockInDisabled, setIsClockInDisabled] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
      fetchAttendanceHistory();
    }
  }, [userId]);

  useEffect(() => {
    const userIsClockedIn = attendanceHistory.some((entry) => !entry.ClockOut);
    setClockedIn(userIsClockedIn);

    const userIsClockedOut = attendanceHistory.some((entry) => entry.ClockOut);
    setClockedOut(userIsClockedOut);

    setIsClockInDisabled(userIsClockedIn);
  }, [attendanceHistory]);

  const fetchAttendanceHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/employee/attendance-history/${userId}`
      );
      setAttendanceHistory(response.data.history);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClockIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/employee/clock-in",
        {
          userID: userId,
        }
      );

      if (response.status === 200) {
        setClockInTime(new Date());
        alert("Clock In Successful");
        fetchAttendanceHistory();
      }
    } catch (error) {
      alert("Clock in Failed, because already clocked in");
      console.error("Error:", error);
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/employee/clock-out",
        {
          userID: userId,
        }
      );

      if (response.status === 200) {
        setClockOutTime(new Date());
        alert("Clock Out Successful");
        fetchAttendanceHistory();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSort = (columnName) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const getSortIndicator = (columnName) => {
    if (columnName === sortColumn) {
      return sortDirection === "asc" ? "▲" : "▼";
    }
    return "";
  };

  const handleFilter = () => {
    console.log("Applying filter...");
    console.log("Filtering with startDate:", startDate);
    console.log("Filtering with endDate:", endDate);

    if (startDate && endDate) {
      return attendanceHistory.filter((entry) => {
        const entryDate = new Date(entry.ClockIn);
        return (
          entryDate >= new Date(startDate) && entryDate <= new Date(endDate)
        );
      });
    } else if (startDate) {
      return attendanceHistory.filter((entry) => {
        const entryDate = new Date(entry.ClockIn);
        return entryDate >= new Date(startDate);
      });
    } else if (endDate) {
      return attendanceHistory.filter((entry) => {
        const entryDate = new Date(entry.ClockIn);
        return entryDate <= new Date(endDate);
      });
    } else {
      return attendanceHistory;
    }
  };

  const filteredData = handleFilter();
  console.log("Filtered Data:", filteredData);

  return (
    <Box bg="gray.100" minHeight="100vh">
      <NavbarEmployee />
      <Container px={0} maxW="100%">
        <Flex pt={"60px"} flexDirection={"row"}>
          <Box bg="white">
            <SidebarEmployee />
          </Box>
          <Box w={"100%"} bg="white" p={6}>
            <VStack align="stretch">
              <Heading size="lg" mb={4}>
                Employee Attendance
              </Heading>
              <Text fontSize="lg">
                Current Time: {currentTime.toLocaleTimeString()}
              </Text>
              <HStack mt={4} spacing={4}>
                <Button
                  onClick={handleClockIn}
                  colorScheme="green"
                  disabled={isClockInDisabled}
                >
                  Clock In
                </Button>
                <Button
                  onClick={handleClockOut}
                  colorScheme="red"
                  disabled={!isClockInDisabled}
                >
                  Clock Out
                </Button>
              </HStack>
              {clockedIn && clockedOut && clockInTime && clockOutTime && (
                <VStack mt={4} spacing={2}>
                  <Text color="green.500" fontWeight="bold">
                    Attendance Recorded
                  </Text>
                  <Text>Clock In Time: {clockInTime.toLocaleString()}</Text>
                  <Text>Clock Out Time: {clockOutTime.toLocaleString()}</Text>
                </VStack>
              )}
              <Box mt={4}>
                <Heading size="md" mb={2}>
                  Attendance History
                </Heading>
                <Box
                  maxH={650}
                  overflowY="auto"
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                >
                  <Box p={4}>
                    <Text>Filter by Date Range:</Text>
                    <HStack mt={2} spacing={4}>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Button onClick={() => setStartDate(null)}>Clear</Button>
                      <Button onClick={handleFilter}>Apply Filter</Button>
                    </HStack>
                  </Box>
                  <Table variant="striped" colorScheme="gray">
                    <Thead
                      style={{
                        position: "sticky",
                        top: 0,
                        background: "white",
                        zIndex: 1,
                      }}
                    >
                      <Tr>
                        <Th
                          onClick={() => handleSort("ClockIn")}
                          cursor="pointer"
                        >
                          Clock In{" "}
                          <Box as="span" ml={1}>
                            {getSortIndicator("ClockIn")}
                          </Box>
                        </Th>
                        <Th
                          onClick={() => handleSort("ClockOut")}
                          cursor="pointer"
                        >
                          Clock Out{" "}
                          <Box as="span" ml={1}>
                            {getSortIndicator("ClockOut")}
                          </Box>
                        </Th>
                        <Th
                          onClick={() => handleSort("HourlyWorks")}
                          cursor="pointer"
                        >
                          Hourly Work
                        </Th>
                        <Th
                          onClick={() => handleSort("DaySalary")}
                          cursor="pointer"
                        >
                          Day Salary
                        </Th>
                        <Th
                          onClick={() => handleSort("Deduction")}
                          cursor="pointer"
                        >
                          Deduction
                        </Th>
                        <Th
                          onClick={() => handleSort("Month")}
                          cursor="pointer"
                        >
                          Month
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {attendanceHistory
                        .slice()
                        .sort((a, b) => {
                          if (
                            sortColumn === "ClockIn" ||
                            sortColumn === "ClockOut"
                          ) {
                            const aValue = new Date(a[sortColumn]);
                            const bValue = new Date(b[sortColumn]);
                            return sortDirection === "asc"
                              ? aValue - bValue
                              : bValue - aValue;
                          } else {
                            const aValue = a[sortColumn];
                            const bValue = b[sortColumn];
                            return sortDirection === "asc"
                              ? aValue - bValue
                              : bValue - aValue;
                          }
                        })
                        .map((entry) => (
                          <Tr key={entry.id}>
                            <Td>{new Date(entry.ClockIn).toLocaleString()}</Td>
                            <Td>
                              {entry.ClockOut
                                ? new Date(entry.ClockOut).toLocaleString()
                                : "Not Clocked Out"}
                            </Td>
                            <Td>{entry.HourlyWorks.toFixed(4)} Hour</Td>
                            <Td>Rp {entry.DaySalary}</Td>
                            <Td>Rp {entry.Deduction}</Td>
                            <Td>{entry.Month}</Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default EmployeeLanding;
