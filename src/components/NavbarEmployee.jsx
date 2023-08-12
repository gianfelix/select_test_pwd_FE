import {
    Box,
    Button,
    Flex,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
  } from "@chakra-ui/react";
  import React, { useEffect } from "react";
  import { useDispatch } from "react-redux";
  import { Link, useNavigate } from "react-router-dom";
  import { logoutSuccess } from "../redux/reducer/AuthReducer";
  import axios from "axios";
  
  const NavbarEmployee = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const handleLogout = () => {
      dispatch(logoutSuccess(localStorage.token));
      navigate("/");
    };
  
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // You can use the 'response.data' here
      } catch (error) {
        console.log("error fetching user data", error);
      }
    };
  
    useEffect(() => {
      fetchUser();
    }, []);
  
    return (
      <header>
        <Box>
          <Flex
            pos={"fixed"}
            w={"full"}
            zIndex={10}
            bg={"white"}
            color={"#1c1c1c"}
            minH={"60px"}
            borderBottom={3}
            borderStyle={"solid"}
            borderColor={"teal"}
            align={"center"}
            display={"flex"}
            justifyContent={"space-between"}
            px={"8"}
          >
            <Text fontSize="lg" fontWeight="bold">
              Attendance System App
            </Text>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                Menu
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/employee">
                  Dashboard Employee
                </MenuItem>
                <MenuItem as={Link} to="/user">
                  User Management
                </MenuItem>
                <MenuDivider />
                <MenuItem color={"red"} onClick={handleLogout}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </header>
    );
  };
  
  export default NavbarEmployee;
  