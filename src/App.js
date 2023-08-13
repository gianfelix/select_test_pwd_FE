import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminLanding from './pages/admin/AdminLanding';
import EmployeeLanding from './pages/employee/EmployeeLanding';
import RegisEmployee from './pages/employee/RegisEmployee';
import UserList from './pages/admin/UserList';
import SalaryByUserID from './pages/employee/SalaryByUserID';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/employee" element={<EmployeeLanding/>} />
        <Route path="/regis/:token" element={<RegisEmployee/>} />
        <Route path="/admin/employees" element={<UserList/>} />
        <Route path="/employee/salary/:userID" element={<SalaryByUserID/>} />
      </Routes>
    </>
  );
}

export default App;
