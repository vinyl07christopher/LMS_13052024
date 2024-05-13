import React, { useEffect, useState } from "react";

import { Table, Button, Form } from "react-bootstrap";
import axios from "axios";
import { ResponsiveContainer } from "recharts";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
const Userstored = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [editID, setEditID] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editDesignation, setEditDesignation] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState([]);
  const [updatedRole, setUpdatedRole] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false); // New state variable
  const [refresh, setRefresh] = useState("");
  useEffect(() => {
    fetchEmployeeData();
  }, []);
  useEffect(() => {
    setEditID(editData._id);
    setEditEmail(editData.email);
    setEditRole(editData.role);
    setEditName(editData.name);
    setEditDesignation(editData.designation);
  }, [editData]);
  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/api/employeedata");
      const data = await response.json();
      if (response.ok) {
        setEmployeeData(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };
  const handleEdit = (user_id,  name, role, email, designation) => {
    setEditID(user_id);
    setEditRole(role);
    setEditEmail(email);
    setEditName(name);
    setEditDesignation(designation);
    setShowEditForm(true);
    setIsEditing(true); // Set editing mode to true
  };
  const handleUpdateData = async () => {
    try {
      const updatedData = {
        role: editRole,
        email: editEmail,
        name: editName,
        designation: editDesignation,
        password: editPassword,
      };
      await axios.put(process.env.REACT_APP_API_URL + `/api/employeedata/${editID}`, updatedData);
      fetchEmployeeData();
      setShowEditForm(false);

      setEditName("");
      setEditEmail("");
      setEditRole("");
      setEditDesignation("");
      setEditPassword("");
      window.location.reload();

      // Fetch updated data after successful update
    } catch (error) {
      console.error("Error updating data:", error);
      // Handle the error appropriately
    }
  };
  const handleDeleteData = async (id) => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + `/api/employeedata/${id}`);
      fetchEmployeeData();
      // Fetch updated data after successful deletion
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancelEdit = () => {
    setEditName("");
    setEditEmail("");
    setEditRole("");
    setEditDesignation("");
    setEditPassword("");
    setIsEditing(false);
    setShowEditForm(false);
    setRefresh("");
  };

  
  const togglePasswordVisibility = () => {
    const password_input_field = document.getElementById("password-input")
    const eye_icon = document.getElementsByClassName('eye-icon')[0];
    if(password_input_field.type === 'password'){
      password_input_field.type = 'text';
      eye_icon.style.opacity = 1 ;
    }else{
      password_input_field.type = 'password';
      eye_icon.style.opacity = 0.6 ;
    }
  }

  return (
    <>
      {showEditForm && (<>
        <h5 className="mb-2">Edit User Data</h5>
        <div className="d-flex justify-content-center gap-5  mb-4">
          
          <div className="my-2">
            <div>Name</div>
            <input  style={{width: '200px'}} className="form-input px-3 py-1" type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          
          <div className="my-2">
            <div>Email</div>
            <input  style={{width: '200px'}} className="form-input px-3 py-1" type="text" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
          </div>
          
          <div className="my-2">
          <div>Role</div>
        <select   style={{width: '200px'}}  className="form-select px-3 py-1" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="HR">HR</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
          
        <div className="my-2">
            <div>Designation</div>
            <input  style={{width: '200px'}} className="form-input px-3 py-1" type="text" value={editDesignation} onChange={(e) => setEditDesignation(e.target.value)} />
          </div>
          <div className="my-2">
            <div>Password</div>
            <div className="position-relative"> 
            <input autoComplete="new-password" id='password-input'  style={{width: '200px'}} className="form-input ps-3 py-1 pe-5" type="password"  placeholder="current password" onChange={(e) => setEditPassword(e.target.value)} />
            <FaEye className="eye-icon"  onClick={togglePasswordVisibility}/>
            </div>
          </div>

          <div style={{scale: '.8'}}>
          <Button className="mb-2 d-table" variant="primary" onClick={() => handleUpdateData(editID)}>
            Update
          </Button>

          <Button  variant="danger"  onClick={handleCancelEdit}>
            Cancel
          </Button>
          </div>
        </div>
      </>)}

      <h3>Employee Data</h3>
      <br />
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No</th>
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Email</th>
              <th style={{ textAlign: "center" }}>Role</th>
              <th style={{ textAlign: "center" }}>Designation</th>
              {/* <th style={{ textAlign: 'center' }}>Password</th> */}
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employeeData.map((user, index) => (
              <tr key={user._id}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>{user.name}</td>
                <td style={{ textAlign: "center" }}>{user.email}</td>
                <td style={{ textAlign: "center" }}>{user.role}</td>
                <td style={{ textAlign: "center" }}>{user.designation}</td>
                <td style={{ textAlign: "center" }}>
                  {/* {isEditing ? (
                                        <Button variant="danger" value={refresh} onClick={handleCancelEdit}>
                                            Cancel
                                        </Button>
                                    ) : ( */}
              <div style={{scale: '.8'}}>
              <Button variant="primary" className="mr-2 me-2" onClick={() => handleEdit(user._id, user.name, user.role, user.email, user.designation)}>
                    <FaEdit /> Edit
                  </Button>
                  {/* )} */}
             
                  <Button variant="danger" onClick={() => handleDeleteData(user._id)}>
                    <FaTrash /> Delete
                  </Button>
              </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Userstored;
