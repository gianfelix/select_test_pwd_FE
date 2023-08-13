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
    // Check if clocked in
    const userIsClockedIn = attendanceHistory.some((entry) => !entry.ClockOut);
    setClockedIn(userIsClockedIn);

    // Check if clocked out
    const userIsClockedOut = attendanceHistory.some((entry) => entry.ClockOut);
    setClockedOut(userIsClockedOut);

    // Disable Clock In button if clocked in
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


  return (
    <Box bg="gray.100" minHeight="100vh">
      <NavbarEmployee />
      <Container px={0} maxW="100%">
        <Flex pt={"60px"} flexDirection={"row"}>
          <Box  bg="white" >
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
                <Table variant="striped" colorScheme="gray">
                  <Thead>
                    <Tr>
                      <Th>Clock In</Th>
                      <Th>Clock Out</Th>
                      <Th>Hourly Work</Th>
                      <Th>Day Salary</Th>
                      <Th>Deduction</Th>
                      <Th>Month</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attendanceHistory
                      .slice()
                      .sort((a, b) => new Date(b.ClockIn) - new Date(a.ClockIn))
                      .map((entry) => (
                        <Tr key={entry.id}>
                          <Td>{new Date(entry.ClockIn).toLocaleString()}</Td>
                          <Td>{new Date(entry.ClockOut).toLocaleString()}</Td>
                          <Td>{entry.HourlyWorks.toFixed(4)} Hour</Td>
                          <Td>Rp {entry.DaySalary}</Td>
                          <Td>Rp {entry.Deduction}</Td>
                          <Td>{entry.Month}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default EmployeeLanding;
