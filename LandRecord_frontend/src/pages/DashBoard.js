import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/SideBar.jsx";
import TopBar from "../components/TopBar.jsx";
import { Outlet } from "react-router-dom";
// import DashboardContant from '../components/DashboardContant.jsx'

export default function DashBoard() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <TopBar />
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "#f5f6fa",
              height: "100%",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
