import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminLanding from './pages/admin/AdminLanding';
import EmployeeLanding from './pages/employee/EmployeeLanding';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminLanding />} />
        <Route path="/employee" element={<EmployeeLanding/>} />
      </Routes>
    </>
  );
}

export default App;
