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
  List,
  ListItem,
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
  const [userId, setUserId] = useState(""); // Initialize with an empty string

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // Fetch user data and set the userId state here, after authentication or login
    const token = localStorage.getItem("token"); // Retrieve the JWT token from local storage
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id); // Set the userID from the decoded token
      fetchAttendanceHistory(); // Fetch attendance history once userId is set
    }
  }, []); // This effect will run whenever userId changes

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
        setClockedIn(true);
        setClockInTime(new Date());
        alert("Clock In Successful");
        fetchAttendanceHistory();
      }
    } catch (error) {
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
        setClockedOut(true);
        setClockOutTime(new Date());
        alert("Clock Out Successful");
        fetchAttendanceHistory();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <NavbarEmployee />
      <Container maxW="100%">
        <Flex pt={"60px"} flexDirection={"row"}>
          <Box minW={"20%"}>
            <SidebarEmployee />
          </Box>
          <Box minW={"80%"}>
            <VStack p={6} align="stretch">
              <Heading size="lg" mb={4}>
                Employee Attendance
              </Heading>
              <Text>Current Time: {currentTime.toLocaleTimeString()}</Text>
              <HStack mt={4} spacing={4}>
                {!clockedIn && (
                  <Button onClick={handleClockIn} colorScheme="green">
                    Clock In
                  </Button>
                )}
                {!clockedOut && (
                  <Button onClick={handleClockOut} colorScheme="red">
                    Clock Out
                  </Button>
                )}
              </HStack>
              {clockedIn && clockedOut && (
                <Box mt={4}>
                  <Text color="green.500">Attendance Recorded</Text>
                  <Text>Clock In Time: {clockInTime.toLocaleString()}</Text>
                  <Text>Clock Out Time: {clockOutTime.toLocaleString()}</Text>
                </Box>
              )}
              <Box mt={4}>
                <Heading size="md" mb={2}>
                  Attendance History
                </Heading>
                <List>
                  {attendanceHistory.map((entry) => (
                    <ListItem key={entry.id}>
                      Clock In: {new Date(entry.ClockIn).toLocaleString()} |
                      Clock Out: {new Date(entry.ClockOut).toLocaleString()} |
                      Hourly Rate: {entry.HourlyRate} |
                      Day Salary: {entry.DaySalary}
                    </ListItem>
                  ))}
                </List>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default EmployeeLanding;
