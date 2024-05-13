import React, { useState ,useEffect} from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FaTrash } from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { MDBRadio } from "mdb-react-ui-kit";
import { Alert } from "react-bootstrap";

import "../styles.css";

function Userleaveform() {
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [modeOfLeave, setModeOfLeave] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [workResponsibility, setWorkResponsibility] = useState("");
  const [workAlteration, setWorkAlteration] = useState("");
  const [concatenatedValues, setConcatenatedValues] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  // const [startingDateError, setStartingDateError] = useState("");
  const [endingDateError, setEndingDateError] = useState("");
  const [modeOfLeaveError, setModeOfLeaveError] = useState("");
  const [responsibilityError, setResponsibilityError] = useState("");
  const [selectedOption, setSelectedOption] = useState('option1');


  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isStartingHalfDay, setIsStartingHalfDay] = useState(false);
  const [isEndingHalfDay, setIsEndingHalfDay] = useState(false);
  const [halfdaySession, setHalfdaySession] = useState(false);
  const [daysCount, setDaysCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
const [leaveType, setLeaveType] = useState('')
 const [reason, setReason] = useState("");
 const [reasonError,setReasonError] = useState("");
 
 const [Sessionerror,setSessionError] = useState("");
 const [startingDateError, setStartingDateError] = useState(null);
 const [selectedSession, setSelectedSession] = useState("");
 


 const handleLeaveTypeOptionChange = (e) => {
  const selected_value = e.target.value
  setDaysCount(0)
  document.getElementById('date-permission').classList.add("d-none");
  document.getElementById('date-half-day').classList.add("d-none");
  document.getElementById('date-one-day').classList.add("d-none");
  document.getElementById('date-more-than-one-day').classList.add("d-none");
  const sessionSelect = document.getElementById('fnan');

  sessionSelect.required = false;

  switch (selected_value) {
    case 'option_1':
      setSelectedOption(selected_value)
      setLeaveType('permission')
      document.getElementById('date-permission').classList.remove("d-none");
    break;
    case 'option_2':
      setSelectedOption(selected_value)
      setLeaveType('half-day')
      setDaysCount(0.5)
      sessionSelect.required = true;
    document.getElementById('date-half-day').classList.remove("d-none");
    break;
    case 'option_3':
      setSelectedOption(selected_value)
      setLeaveType('one-day')
      setDaysCount(1)
    document.getElementById('date-one-day').classList.remove("d-none");
    break;
    case 'option_4':
      setSelectedOption(selected_value)
      setLeaveType('more-than-one-day')
   
    document.getElementById('date-more-than-one-day').classList.remove("d-none");
    break;
    default:;
  }

  return true;
};


  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/api/employeedata");
      const data = await response.json();
      if (response.ok) {
        const user_id = localStorage.getItem("user_id");
        const dataWithCurrentUserRemoved = data.data.filter(employee => {return employee._id !== user_id ? true : false});
        console.log(dataWithCurrentUserRemoved);
        setEmployeeData(dataWithCurrentUserRemoved);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
    setWorkAlteration(event.target.value);

  };
  //date calculated function

  const handleStartingDateChange = (e) => {
    const inputStartingDate = e.target.value;
    setStartingDate(inputStartingDate);
    calculateDaysCount(inputStartingDate, endingDate, isStartingHalfDay, isEndingHalfDay);
  };
  const handleEndingDateChange = (e) => {
    const inputEndingDate = e.target.value;
    setEndingDate(inputEndingDate);
    calculateDaysCount(startingDate, inputEndingDate, isStartingHalfDay, isEndingHalfDay);
  };

  const handleStartingHalfDayChange = (e) => {
    const isChecked = e.target.checked;
    setIsStartingHalfDay(isChecked);
    calculateDaysCount(startingDate, endingDate, isChecked, isEndingHalfDay);
  };

  const handleEndingHalfDayChange = (e) => {
    const isChecked = e.target.checked;
    setIsEndingHalfDay(isChecked);
    calculateDaysCount(startingDate, endingDate, isStartingHalfDay, isChecked);
  };

  const calculateDaysCount = (startDate, endDate, isStartHalfDay, isEndHalfDay) => {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    if (!isNaN(startDateTime) && !isNaN(endDateTime)) {
      // Set hours to 12:00 PM for half-day selection
      if (isStartHalfDay) startDateTime.setHours(12, 0, 0);
      if (isEndHalfDay) endDateTime.setHours(12, 0, 0);

      const timeDifference = endDateTime.getTime() - startDateTime.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setDaysCount(daysDifference +1);
      setShowAlert(daysDifference < 0 || daysDifference > 8);
    }
  };
  const handleWorkResponsibilityChange = (e) => {
    setWorkResponsibility(e.target.value);
  };

  // const handleWorkAlterationChange = (e) => {
  //   setWorkAlteration(e.target.value);
  // };

  const handleSessionSelect_halfday = (e)=>{
    setHalfdaySession(e.target.value)
  }


  const handleAddWorkResponsibility = () => {
    if (!workResponsibility || !workAlteration) {
      alert("Please enter the work responsibility (or) alteration");

      return;
    }
    const concatenatedValue = [workResponsibility, workAlteration];
    setConcatenatedValues([...concatenatedValues, concatenatedValue]);
    setWorkResponsibility("");
    setWorkAlteration("");
  };

  const handleRemoveResponsibility = (index) => {
    const updatedConcatenatedValues = [...concatenatedValues];
    updatedConcatenatedValues.splice(index, 1);
    setConcatenatedValues(updatedConcatenatedValues);
  };

  const handleModeOfLeaveChange = (e) => {
    setModeOfLeave(e.target.value);
    if (e.target.value === "ML-MEDICAL LEAVE") {
      setFileSelected(true);
    } else {
      setFileSelected(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (showAlert) {
      daysCount < 0 ? alert("Number of days leave cannot be negative") : alert("Number of days leave should be less than 8 days");
      return;
    }

    const user_id = localStorage.getItem("user_id");
    const user_email = localStorage.getItem("user_email");
    const user_role = localStorage.getItem("user_role");

    let validForm = true;

    if (concatenatedValues.length < 1) {
      return alert("Work Alteration not added");
    }

    if (!startingDate) {
      setEndingDateError("Please select the date.");
      validForm = false;
    
      // const sessionValue = document.getElementById("fnan").value;
      // if (!sessionValue) {
      //   setSessionError("Please select a session.");
      //   validForm = false;
      // } else {
      //   setSessionError("");
      // }

    }     else if(leaveType == "more-than-one-day" ){
        if( !endingDate ){
      setEndingDateError("Please select the ending date.");
      validForm = false;
    
    }else if (endingDate.valueOf() < startingDate.valueOf()) {
      setEndingDateError("Start time should be less than end time.");
      validForm = false;
    }
    } else {
      setStartingDateError("");
      setEndingDateError("");
    }

    if (!modeOfLeave && leaveType != 'permission') {
      setModeOfLeaveError("Please select the mode of leave.");
      validForm = false;
    
    } else {
      setModeOfLeaveError("");
    }

    if (modeOfLeave === "ML-MEDICAL LEAVE" && !file) {
      setFileError("Please choose the medical file.");
      validForm = false;
    


    } else {
      setFileError("");
    }

    if (reason.length < 10) {
      setReasonError("Please enter a reason with at least 10 characters.");
      validForm = false;
    } else {
      setReasonError("");
    }
    
    


    if (!responsibility) {
      setResponsibilityError("Please enter a responsibility.");
      validForm = false;
    


    } else {
      setResponsibilityError("");
    }

    

    if (validForm) {
      // Submit the form or perform further actions
   
      const formData = new FormData();

      formData.append('leaveType',leaveType)
      
      formData.append('daysCount',daysCount)
      formData.append('modeOfLeave',modeOfLeave)
      formData.append('file',file)
      formData.append('responsibility',responsibility)
      formData.append('reason',reason)
      formData.append('workResponsibility',workResponsibility)
      formData.append('workAlteration',  concatenatedValues)
      formData.append('user_id',user_id)
      formData.append('user_email',user_email)
      formData.append('user_role',user_role)
      
      formData.append('startingDate',startingDate)

      if(leaveType == 'more-than-one-day'){
        formData.append('endingDate',endingDate)
      }else if(leaveType == 'half-day'){
        formData.append('half_day_session', halfdaySession)
      }


      axios
        .post(process.env.REACT_APP_API_URL + "/api/userinput", formData)
        .then((response) => {
          alert("Form submitted successfully");
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Error saving user input:", error);
        });
    }
  };
  const mainStyles = {
    width: "100%",
    // height: "750px",
    maxWidth: "600px",
    background: "lightpink",
    overflow: "hidden",
    backgroundImage:
      'url("https://doc-08-2c-docs.googleusercontent.com/docs/securesc/68c90smiglihng9534mvqmq1946dmis5/fo0picsp1nhiucmc0l25s29respgpr4j/1631524275000/03522360960922298374/03522360960922298374/1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0&nonce=gcrocepgbb17m&user=03522360960922298374&hash=tfhgbs86ka6divo3llbvp93mg4csvb38")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderRadius: "10px",
    boxShadow: "5px 20px 50px #000",
    padding: "25px",
  };

  const signupStyles = {
    position: "relative",
    width: "100%",
    height: "100%",
  };

  const labelStyles = {
    color: "#fff",
    fontSize: "2.2em",
    justifyContent: "center",
    display: "flex",
    margin: "50px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.5s ease-in-out",
  };

  const inputStyles = {
    width: "65%",
    height: "40px",
    // background: "#e0dede",
    background: "#e0ffff	",
    justifyContent: "center",
    display: "flex",
    margin: "20px auto",
    padding: "10px",
    border: "none",
    outline: "none",
    borderRadius: "5px",
  };





  return (
    <div className="mx-auto" style={mainStyles}>
      <div className="signup" style={signupStyles}>
        <div className="container mb-5 ">
          <h3 style={labelStyles}>Leave Application Form</h3>
          <Form
            onSubmit={handleSubmit}
          >

<Form.Group controlId="leave_type_radio_1">
        <Form.Label className="label-styles"><h5>Type of Leave</h5></Form.Label>
        <div className="radio-group d-table text-start mx-auto d-md-flex justify-content-between ">
          
        <div className="radio m-2">
            <label style={{cursor: 'pointer'}}>
              <input  style={{cursor: 'pointer'}} className="me-2" type="radio" name="leave_type_radio_1" id="leave_type_radio_1" value="option_1" checked={selectedOption === 'option_1'} onChange={handleLeaveTypeOptionChange} />
              1 hr permission
            </label>
          </div>
          <div className="radio m-2">
            <label style={{cursor: 'pointer'}}>
              <input  style={{cursor: 'pointer'}} className="me-2" type="radio" name="leave_type_radio_2" id="leave_type_radio_2" value="option_2" checked={selectedOption === 'option_2'} onChange={handleLeaveTypeOptionChange} />
              1/2 day
            </label>
          </div>
          <div className="radio m-2">
            <label style={{cursor: 'pointer'}}>
              <input  style={{cursor: 'pointer'}} className="me-2" type="radio" name="leave_type_radio_3" id="leave_type_radio_3" value="option_3" checked={selectedOption === 'option_3'} onChange={handleLeaveTypeOptionChange} />
              1 day
            </label>
          </div>
          
          <div className="radio m-2">
            <label style={{cursor: 'pointer'}}>
              <input  style={{cursor: 'pointer'}} className="me-2" type="radio" name="leave_type_radio_4" id="leave_type_radio_4" value="option_4" checked={selectedOption === 'option_4'} onChange={handleLeaveTypeOptionChange} />
              More than 1 day
            </label>
          </div>
          

        </div>
  
    </Form.Group>

    <div id='date-permission' className="d-none">
<Form.Group className="mt-4" controlId="startingDate">
              <Form.Label className="label-styles">Select date & time</Form.Label>
              <Form.Control
                style={inputStyles}
                type="datetime-local"
                // value={startingDate}
                id='startingDate_permission'
                onChange={handleStartingDateChange}
                isInvalid={!!startingDateError}
              />
              <Form.Control.Feedback type="invalid">{startingDateError}</Form.Control.Feedback>
            </Form.Group>

            </div>    
            <div id='date-half-day' className="d-none">
            <Form.Group className="mt-4" controlId="startingDate_1">
            <Form.Label className="label-styles">Select Date</Form.Label>
              <Form.Control
                style={inputStyles}
                type="date"
                // value={startingDate}
                id='startingDate_1'
                onChange={handleStartingDateChange}
                isInvalid={!!startingDateError}
              />
              <Form.Control.Feedback type="invalid">{startingDateError}</Form.Control.Feedback>
              <select  id="fnan" name="fnan" onChange={handleSessionSelect_halfday}>
                <option value="" disabled selected>Select Session</option>
                <option value="fn">Morning Session</option>
                <option value="an">Afternoon Session</option>
              </select>
            </Form.Group>
</div>
  
<div id='date-one-day' className="d-none">
  
<Form.Group className="mt-4" controlId="startingDate_2">
              <Form.Label className="label-styles">Date</Form.Label>
              <Form.Control
                style={inputStyles}
                type="date"
                id='startingDate_2'
                // value={startingDate}
                onChange={handleStartingDateChange}
                isInvalid={!!startingDateError}
              />
              <Form.Control.Feedback type="invalid">{startingDateError}</Form.Control.Feedback>
            </Form.Group>
</div>


  <div id="date-more-than-one-day" className="d-none">
            
            <Form.Group className="mt-4" controlId="startingDate_3">
              <Form.Label className="label-styles">Starting Date</Form.Label>
              <Form.Control
                style={inputStyles}
                type="date"
                id='startingDate_3'
                // value={startingDate}
                onChange={handleStartingDateChange}
                isInvalid={!!startingDateError}
              />
              <Form.Control.Feedback type="invalid">{startingDateError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-5" controlId="endingDate">
              <Form.Label className="label-styles">Ending Date</Form.Label>
              <Form.Control style={inputStyles} type="date" id="endingDate" value={endingDate} onChange={handleEndingDateChange} isInvalid={!!endingDateError} />
              <Form.Control.Feedback type="invalid">{endingDateError}</Form.Control.Feedback>
            </Form.Group>

            <p>Number of days: {daysCount}</p>

            {showAlert && (
              <Alert variant="warning">
                {daysCount < 0 ? (
                  <span className="text-dark"> Number of days leave cannot be negative.</span>
                ) : (
                  <span className="text-dark"> Days count is crossed 8 days. Please contact the admin.</span>
                )}
              </Alert>
            )}</div>


            <br />

            {leaveType !== "permission" &&   <>
            <Form.Group className="mb-5 " controlId="modeOfLeave">
              <Form.Label className="label-styles">Mode of Leave</Form.Label>
              <Form.Control
                style={inputStyles}
                as="select"
                value={modeOfLeave}
                onChange={handleModeOfLeaveChange}
                
                id='modeOfLeave'
                isInvalid={!!modeOfLeaveError}
              >
                <option value="" disabled selected>Select Mode of Leave</option>
                <option value="CL-CASUAL LEAVE">CL-CASUAL LEAVE</option>
                <option value="ML-MEDICAL LEAVE">ML-MEDICAL LEAVE</option>
                <option value="WFH-WORK FROM HOME">WFH-WORK FROM HOME</option>
                <option value="EP-EVENING PERMISSION">EP-EVENING PERMISSION</option>
                <option value="LP-LATE PERMISSION">LP-LATE PERMISSION</option>
                <option value="LOP-LOSS OF PAY">LOP-LOSS OF PAY</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{modeOfLeaveError}</Form.Control.Feedback>
            </Form.Group>
            

            {modeOfLeave === "ML-MEDICAL LEAVE" && (
              <Form.Group className="mb-5" controlId="formFile">
                <Form.Label className="label-styles">Upload medical proof:</Form.Label>
                <Form.Control style={inputStyles} type="file" id='upload-file' onChange={handleFileChange} isInvalid={!!fileError} />
                <Form.Control.Feedback type="invalid">{fileError}</Form.Control.Feedback>
              </Form.Group>
              )}
              </>
          }
            <Form.Group className="mb-5" controlId="responsibility">
              <Form.Label className="label-styles">Reason</Form.Label>
              <Form.Control
                style={inputStyles}
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                isInvalid={!!reasonError}
                id='input-reason'
              />
              <Form.Control.Feedback type="invalid">{reasonError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-5" controlId="responsibility">
              <Form.Label className="label-styles">Responsibility</Form.Label>
              <Form.Control
                style={inputStyles}
                type="text"
                id='input-responsibility'
                value={responsibility}
                onChange={(e) => setResponsibility(e.target.value)}
                isInvalid={!!responsibilityError}
              />
              <Form.Control.Feedback type="invalid">{responsibilityError}</Form.Control.Feedback>
            </Form.Group>

            <Container>
              <Row>
                <h3>Work Alteration</h3>
                <div>
                  <ul>
                    {concatenatedValues.map((value, index) => (
                      <div key={index}>
                        {value}
                        <Button variant="danger" onClick={() => handleRemoveResponsibility(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </ul>
                </div>
              </Row>
            </Container>

            <Row>
              <Col className="mb-5">
                <Form.Group controlId="workResponsibility">
                  <Form.Label className="label-styles">Work</Form.Label>
                  <Form.Control
                    id="workresponsibility_input"
                    style={inputStyles}
                    type="text"
                    value={workResponsibility}
                    onChange={handleWorkResponsibilityChange}
                  />
                </Form.Group>
              </Col>
              <Col>
             
         {/* <Form.Group controlId="workAlteration">
  <Form.Label className="label-styles">Name</Form.Label>
  <Form.Select
    id="workalteration_input"
    style={inputStyles}
    value={workAlteration}
    onChange={handleWorkAlterationChange}
  >
    <option value="" disabled selected>Select an Name</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    
  </Form.Select>
</Form.Group> */}
 <Form.Group controlId="workAlteration">
        <Form.Label className="label-styles">Name</Form.Label>
        <Form.Select
          id="workalteration_input"
          style={inputStyles}
          value={selectedEmployee}
          onChange={handleEmployeeChange}
        >
          <option value="" disabled selected>Select an Employee</option>
          {employeeData.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

                <Button variant="warning" onClick={handleAddWorkResponsibility}>
                  Add
                </Button>
              </Col>
              
            </Row>
            <div className="mb-3 text-center ">
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    
    </div>

  );
}

export default Userleaveform;
