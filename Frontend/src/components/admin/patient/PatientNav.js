import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../../../../src/images/White.png";
import "../Notification.scss";

import { io } from "socket.io-client";
import apiPath from "../../../isProduction";

const socket = io(await apiPath());

function PatientNav() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const [notifications, setNotifications] = useState(false);
  const [notificationBell, setBell] = useState(false);

  const [userId, setUserId] = useState(false);
  const userIdRef = useRef(userId);

  async function checkLocalUser() {
    const user = await JSON.parse(localStorage.getItem("profile"));

    if (user) {
      const { id } = await user;
      setUserId(id);
      userIdRef.current = id; // Update ref here

      navigate("/patient-dashboard/dashboard");
    } else {
      navigate("/");
    }
  }

  useEffect(() => {
    checkLocalUser();
  }, []);

  useEffect(() => {
    socket.on("new-notification-patient", (data) => {
      if (data.recipientId == userIdRef.current) {
        if (notifications) {
          setTimeout(() => {
            setNotifications(data);
            setBell(true);
          }, 9000);
        } else {
          setNotifications(data);
          setBell(true);
        }
      }
    });
  }, []);

  function showNotification(notification) {
    if (notification) {
      setTimeout(() => {
        setNotifications(false);
      }, 8000);

      return (
        <Link id="notification-popup" to="/patient-dashboard/notification">
          <h2>You Have a New Notification</h2>
          <hr />
          <img src={notification?.doctorImg} alt="doctor-image" />
          <p>{notification?.message}</p>
          <b>{notification?.type}</b>

          <span className="progress"></span>
        </Link>
      );
    } else {
      return <></>;
    }
  }

  return (
    <>
      <div id="flex">
        <header id="doctor-nav">
          <Link to="/">
            <h1>
              <img src={Logo} /> Medi<span>Connect</span>
            </h1>
          </Link>
          <NavLink
            to="/patient-dashboard/notification"
            className="icon"
            onClick={() => {
              setBell(false);
            }}
            id="notification-icon"
          >
            {notificationBell ? (
              <i
                className="fi fi-bs-bell-notification-social-media"
                id="newNotification"
              ></i>
            ) : (
              <i className="fi fi-bs-bell"> </i>
            )}
          </NavLink>

          <nav className={`mobile ${menu ? "close" : ""}`} id="doctor-sidebar">
            <ul>
              <li>
                <NavLink to="/patient-dashboard/dashboard">
                  <i className="fa-solid fa-house"></i> Home
                </NavLink>
              </li>
              <li
                onClick={() => {
                  setBell(false);
                }}
              >
                <NavLink
                  to="/patient-dashboard/notification"
                  id="notification-icon"
                >
                  {notificationBell ? (
                    <i
                      className="fi fi-bs-bell-notification-social-media"
                      id="newNotification"
                    ></i>
                  ) : (
                    <i className="fi fi-bs-bell"></i>
                  )}{" "}
                  Notification
                </NavLink>
              </li>
              <li>
                <NavLink to="/patient-dashboard/appointments">
                  <i className="fa-regular fa-calendar-check"></i> Appointments
                </NavLink>
              </li>
              <li>
                <NavLink to="/patient-dashboard/history">
                  <i className="fa-solid fa-clock-rotate-left"></i> My History
                </NavLink>
              </li>
              <li>
                <NavLink to="/patient-dashboard/laboratory">
                  <i className="fa-solid fa-hospital-user"></i> Laboratory
                  Reports
                </NavLink>
              </li>
            </ul>
            <ul>
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    checkLocalUser();
                  }}
                  className="logout"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Logou
                </button>
              </li>

              <li className="profile">
                <NavLink to="/patient-dashboard/profile">
                  <i className="fa-solid fa-user"></i> My Profile
                </NavLink>
              </li>
            </ul>

            <button
              onClick={() => {
                setMenu(!menu);
              }}
              id="menu"
            >
              {menu ? (
                <i className="fi fi-ss-dot-pending"></i>
              ) : (
                <i className="fi fi-ss-cross-circle"></i>
              )}
            </button>
          </nav>
        </header>

        <main id="dashboard">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-navigation">
        <ul>
          <li title="Home">
            <NavLink to="/patient-dashboard/dashboard">
              <i className="fa-solid fa-house"></i>
            </NavLink>
          </li>
          <li title="History">
            <NavLink to="/patient-dashboard/history">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </NavLink>
          </li>
          <li id="main-btn" title="Appointments">
            <NavLink to="/patient-dashboard/appointments">
              <i className="fa-regular fa-calendar-check"></i>
            </NavLink>
          </li>
          <li title="Laboratory">
            <NavLink to="/patient-dashboard/laboratory">
              <i className="fa-solid fa-hospital-user"></i>
            </NavLink>
          </li>
          <li title="Profile">
            <NavLink to="/patient-dashboard/profile">
              <i className="fa-solid fa-user"></i>
            </NavLink>
          </li>
        </ul>
      </nav>

      {showNotification(notifications)}
    </>
  );
}

export default PatientNav;
