import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TableChartIcon from "@mui/icons-material/TableChart";
import GavelIcon from "@mui/icons-material/Gavel";
import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate=useNavigate();
  const [openMenu, setOpenMenu] = useState({
    users: false,
    landRecords: false,
    dispute: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggle = (menu) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <h1 style={{ textAlign: "center", fontSize: "25px" }}>Land Records</h1>
      <h2 style={{ textAlign: "center", fontSize: "20px" }}>Management</h2>

      <List sx={{ paddingTop: "20px" }}>
        {/* Dashboard */}
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <HomeIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Dispute */}
        <ListItemButton onClick={() => handleToggle("dispute")}>
          <ListItemIcon>
            <GavelIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Dispute" />
          {openMenu.dispute ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.dispute} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ "& .MuiListItemText-primary": { fontSize: "15px" } }}>
             <ListItemButton sx={{ pl: 7 }} onClick={() => navigate("/dashboard/disputes")}>
              <ListItemText primary="View Disputes" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 7 }} onClick={() => navigate("/dashboard/resolve-dispute")}>
              <ListItemText primary="Resolved Cases" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Users */}
        <ListItemButton onClick={() => handleToggle("users")}>
          <ListItemIcon>
            <PeopleIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Users" />
          {openMenu.users ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.users} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ "& .MuiListItemText-primary": { fontSize: "15px" } }}>
            {/* <ListItemButton sx={{ pl: 7 }}>
              <ListItemText primary="Add User" />
            </ListItemButton> */}
            <ListItemButton sx={{ pl: 7 }} onClick={() => navigate("/dashboard/manage-users")}>
              <ListItemText primary="Manage Users" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Land Records */}
        <ListItemButton onClick={() => handleToggle("landRecords")}>
          <ListItemIcon>
            <TableChartIcon sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Land Records" />
          {openMenu.landRecords ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMenu.landRecords} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ "& .MuiListItemText-primary": { fontSize: "15px" } }}>
            <ListItemButton sx={{ pl: 7 }} onClick={() => navigate("/dashboard/record")}>
              <ListItemText primary="Add Record" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 7 }} onClick={() => navigate("/dashboard/manage-record")}>
              <ListItemText primary="Manage Records" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Reports */}
        <ListItemButton onClick={() => navigate("/dashboard/report")}>
          <ListItemIcon>
            <SignalCellularAltIcon sx={{ color: "#fff" }}  />
          </ListItemIcon>
          <ListItemText primary="Reports & Analytics" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: "fixed", top: 10, left: 10, zIndex: 2000 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#1b483c",
              color: "#fff",
              width: 240,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop Drawer */
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            
            "& .MuiDrawer-paper": {
              backgroundColor: "#1b483c",
              color: "#fff",
              paddingTop: 2,
              borderTopLeftRadius:"0.5rem",
              width: 240,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
