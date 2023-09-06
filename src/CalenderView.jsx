import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "./Calender.css";
import moment from "moment";
function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendance, setAttendance] = useState("Present");
  const [attendanceData, setAttendanceData] = useState([]);
  const [theDateData, setTheDateData] = useState(null);
  const handleCellClick = (date) => {
    setTheDateData(null);
    console.log(date);
    setDate(date);
    setIsModalOpen(true);
    var givenDate = moment(date); // Replace with your given date
    var formattedTimestamp = givenDate.set({ millisecond: 0 }).valueOf();
    console.log(attendanceData);
    attendanceData.map((ele) => {
      var eleDate = moment(ele.date); // Replace with your given date
      var eleFormattedTimestamp = eleDate.set({ millisecond: 0 }).valueOf();

      if (formattedTimestamp === eleFormattedTimestamp) {
        console.log(formattedTimestamp);
        setTheDateData({
          ...ele,
        });
      }
    });
  };

  useEffect(() => {
    // Make an API request to fetch initial attendance data
    axios
      .get("http://localhost:5000/api/fetch-attendance")
      .then((response) => {
        setAttendanceData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [attendance]);

  const markAttendance = (date, status) => {
    // Make an API request to mark/update attendance

    axios
      .post("http://localhost:5000/api/mark-attendance", { date, status })
      .then((response) => {
        console.log(response.data.data);
        theDateData(response.data.data);
        setAttendanceData([...attendanceData, response.data.data]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Attendance Calendar</h1>
      <Calendar onClickDay={handleCellClick} />
      {isModalOpen && (
        <div className="modal">
          {theDateData == null ? (
            <h1>No Record Found</h1>
          ) : (
            <h1>{theDateData?.status}</h1>
          )}
          <p>Date: {date.toDateString()}</p>
          <label>
            {" Attendance Status : "}
            <select
              style={{ margin: "0px 4px" }}
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </label>
          <button
            style={{ margin: "0px 4px" }}
            onClick={() => {
              markAttendance(date, attendance);
            }}
          >
            Submit
          </button>
          <button
            style={{ margin: "0px 4px" }}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default CalendarComponent;
