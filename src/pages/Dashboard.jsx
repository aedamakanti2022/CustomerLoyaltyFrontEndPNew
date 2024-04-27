import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
// import GoogleSvg from "../assets/icons8-google.svg";
// import { FaEye } from "react-icons/fa6";
// import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import "../styles/popup.css";
import { API_URL } from "../utils";

const Dashboard = () => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [data, setData] = useState({});
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [cusPoints, setCusPoints] = useState([{}]);
  const [discount, setDiscount] = useState("");

  const calcDiscount = async (e, rewardDollar, dollarPer100) => {
    let points = parseFloat(e.target.value);
    console.log(points);

    const discount1 = isNaN(points) ? "" : (points / 100).toString();
    const discount = discount1 * dollarPer100;
    setDiscount(discount);
  };
  const fetchUserData = async () => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${API_URL}/api/v1/dashboard`,
        axiosConfig
      );
      setData({ msg: response.data.msg, customerId: response.data.customerId });

      setUserData(response.data.userData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchPointsData = async () => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${API_URL}/api/v1/customerPoints`,
        axiosConfig
      );

      console.log(response.data.cusPoints);
      setCusPoints(response.data.cusPoints);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const redeemPoints = async (e, business, reward, limit) => {
    e.preventDefault();
    let points = parseFloat(e.target.redeemPoints.value);
    let redeemedPoints = parseFloat(reward - e.target.redeemPoints.value);
    console.log(points, redeemedPoints, business, reward, limit, "Hello");

    if (parseFloat(points) <= parseFloat(limit)) {
      toast.error(
        "The redeem limit is higher, please try again with higher value!"
      );
      return;
    }

    if (redeemedPoints || redeemedPoints === 0) {
      const formData = {
        customerId: data.customerId,
        businessId: business,
        redeemedPoints: redeemedPoints,
      };
      // console.log( "reward " + reward);
      // console.log( "limit " + limit);
      console.log("form data: " + formData, points, redeemPoints, reward);

      if (parseFloat(points) <= parseFloat(reward)) {
        if (parseFloat(points) >= parseFloat(limit)) {
          // console.log( "good to go ");
          try {
            const response = await axios.put(
              `${API_URL}/api/v1/updatePoints`,
              formData
            );
            fetchUserData();
            fetchPointsData();
            toast.success("Points redeemed successfully");
            togglePopup();
          } catch (err) {
            console.log(err);
            toast.error(err.message);
          }
        } else {
          toast.error("You have not reached the redeem Limit");
        }
      } else {
        toast.error("Exceed your rewarded points, try a lower value ");
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPointsData();
    if (token === "") {
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  const [showPopup, setShowPopup] = useState({});

  const togglePopup = (customerId, open) => {
    setShowPopup((prev) => ({
      ...prev,
      [customerId]: open,
    }));
  };

  const divStyle = {
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
    padding: "20px",
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div style={{ textAlign: "center" }}>
            <h1>Customer Dashboard</h1>
            <p>
              Hi {data.msg}!, your Customer Id: {data.customerId}
            </p>
            {cusPoints.map((customer, index) => (
              <div key={index} style={divStyle}>
                <p style={{ textAlign: "left" }}>
                  <span style={{ fontSize: 20 }}>Business Name : </span>{" "}
                  {customer.businessName}
                </p>
                <p style={{ textAlign: "left" }}>
                  <span style={{ fontSize: 20 }}>Points Earned: </span>Points
                  Earned: {customer.reward}
                </p>
                <p style={{ textAlign: "left" }}>
                  <span style={{ fontSize: 20 }}>Redeem Limit: </span>{" "}
                  {customer.redeemLimit}
                </p>

                {showPopup[customer._id] && (
                  <div className="popup">
                    <div className="popup-inner">
                      <h2>Redeem</h2>
                      <div className="input-group">
                        <form
                          onSubmit={(e) =>
                            redeemPoints(
                              e,
                              customer.businessId,
                              customer.reward,
                              customer.redeemLimit
                            )
                          }
                        >
                          <input
                            type="text"
                            placeholder="Points To Redeem"
                            name="redeemPoints"
                            onChange={(e) =>
                              calcDiscount(
                                e,
                                customer.rewardDollar,
                                customer.dollarPer100
                              )
                            }
                          />
                          <input
                            type="text"
                            disabled
                            name="discount"
                            placeholder="Discount"
                            value={discount}
                          />
                          <button
                            type="submit"
                            style={{
                              borderRadius: "20px",
                              backgroundColor: "blue",
                              color: "white",
                              padding: "10px 20px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Redeem
                          </button>
                          <button
                            onClick={(e) => togglePopup(customer._id, false)}
                            style={{
                              borderRadius: "20px",
                              backgroundColor: "red",
                              color: "white",
                              padding: "10px 20px",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Exit{" "}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={(e) => togglePopup(customer._id, true)}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "blue",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Redeem
                </button>
              </div>
            ))}
          </div>
          <Link to="/logout" className="logout-button">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
