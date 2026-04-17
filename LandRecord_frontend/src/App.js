import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Register from "./pages/Registers.js";
import DashBoard from "./pages/DashBoard.js";
import LandRecord from "./pages/LandRecord.js";
import DashboardContant from "./components/DashboardContant.jsx";
import ManageLandRecord from "./pages/ManageLandRecord.js";
import LandDetails from "./pages/LandDetails.js";
import OwnershipHistory from "./pages/ownership/OwnershipHistory.js";
import CreateOwnership from "./pages/ownership/CreateOwnership.js";
import CreateDispute from "./pages/dispute/CreateDispute.js";
import ViewDispute from "./pages/dispute/ViewDispute.js";
import ManageDisputes from "./pages/dispute/ManageDispute.js";
import ResolvedDispute from "./pages/dispute/ResolvedDispute.js";
import ManageResolve from "./pages/dispute/ManageResolve.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ManageUsers from "./pages/users/manageUser.jsx";
import Reports from "./components/Report.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashBoard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardContant />} />
            <Route path="record" element={<LandRecord />} />
            <Route
              path="manage-record"
              element={
                <ProtectedRoute
                  element={ManageLandRecord}
                  allowedRoles={["Admin"]}
                />
              }
            />
            <Route path="land-details/:id" element={<LandDetails />} />
            <Route path="owner-history/:id" element={<OwnershipHistory />} />
            <Route path="create-record/:landId" element={<CreateOwnership />} />
            <Route path="create-record/:landId" element={<CreateOwnership />} />
            <Route path="create-dispute/:landId" element={<CreateDispute />} />
            <Route path="disputes" element={<ViewDispute />} />
            <Route path="resolve-dispute" element={<ResolvedDispute />} />
            <Route path="manage-dispute/:id" element={<ManageDisputes />} />
            <Route path="manage-resolve/:id" element={<ManageResolve />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="report" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
