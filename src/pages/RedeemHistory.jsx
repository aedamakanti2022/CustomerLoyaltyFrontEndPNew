import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL } from "../utils";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Logo from "../assets/logo.png";
import Image from "../assets/image.png";

function RedeemHistory() {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchPointDetails = async () => {
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${API_URL}/api/v1/businessPoints`,
        axiosConfig
      );
      setData(response.data?.cusPoints);
      console.log(response);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchPointDetails();

    if (token === "") {
      navigate("/businessLogin");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);
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
          <div className="login-center">
            <h1>Redeem History</h1>
            <div style={{ overflow: "scroll", height: "400px" }}>
              {data.map((d, index) => (
                <div key={index + d._id}>
                  {(d.redeemHistory || []).map((redeemHist, index) => (
                    <div key={redeemHist._id + index}>
                      <span>Customer Name:- {redeemHist.customerName}</span>
                      <br />
                      <span>Redeemed Points:- {redeemHist.redeemedPoints}</span>
                      <br />
                      <span>Dollar:- {redeemHist.dollar}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Link to="/businessDashboard">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default RedeemHistory;
