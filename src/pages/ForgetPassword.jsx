import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import "../styles/Login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [isOtpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let email = e.target.email.value;

    if (email.length > 0) {
      const formData = {
        email,
      };
      try {
        await axios.post(`${API_URL}/api/v1/forgetPassword`, formData);
        setOtpSent(true);
        toast.success("Please visit your email for otp!");
      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.msg || err.message);
      }
    } else {
      toast.error("Please fill your email address");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    console.log(e.target);
    let password = e.target.password.value;
    let confirmPassword = e.target.confirmPassword.value;
    let otp = e.target.otp.value;

    if (password !== confirmPassword) {
      toast.error("Password and confirm password are not same!");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/v1/resetPassword`, {
        email,
        password,
        otp,
      });
      toast.success("Password reset successful! You can login now!");
      navigate(`/customerLogin`);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.msg || err.message);
    }
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
          <div className="login-center">
            {!isOtpSent && (
              <>
                <h2>Welcome back!</h2>
                <p>Please enter your email</p>
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    name="email"
                  />
                  <div className="login-center-buttons">
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </>
            )}
            {isOtpSent && (
              <>
                <form onSubmit={handlePasswordReset}>
                  <div className="pass-input-div">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      required={true}
                    />
                    {showPassword ? (
                      <FaEyeSlash
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    ) : (
                      <FaEye
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    )}
                  </div>
                  <div className="pass-input-div">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      required={true}
                    />
                    {showPassword ? (
                      <FaEyeSlash
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    ) : (
                      <FaEye
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    )}
                  </div>
                  <input type="text" placeholder="OTP" name="otp" />
                  <div className="login-center-buttons">
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
