import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./PasswordReset.module.css";

const PasswordReset = () => {
  const [login, setLogin] = useState({ email: "", otp: "", newPassword: "", phone: "", });
  const [errorMessage, setErrorMessage] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const [prefference, setPreference] = useState(false);
  const [preferredLogin, setPreferredLogin] = useState("phone");

  const handleChangePreference = (e) => {
    setPreference(true);
    setPreferredLogin("email");
    setLogin({ ...login,  });
  };

  console.log(preferredLogin);

  const handleChangeEmail = (e) => {
    setPreference(false);
    setPreferredLogin("phone");
    setLogin({ ...login});
  };

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  console.log(login);

  const handleSms = async (e) => {
    //e.preventDefault();
    setErrorMessage("");

    if (!isOTPSent) {
      try {
        const res = await axios.post("/sms", { phone: login.phone });

        if (res.data.phoneRequire) {
          setErrorMessage("Please enter your phone number.");
        } else if (res.data.userNotExist) {
          setErrorMessage("No account found with this phone number.");
        } else if (res.data.msg === "OTP sent successfully") {
          alert("OTP has been sent to your Mobile. Please check your SMS.");
          setIsOTPSent(true);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred. Please try again.");
      }
    } else {
      try {
        const res = await axios.post("/update-password-phone", {
          phone: login.phone,
          otp: login.otp,
          newPassword: login.newPassword,
        });

        if (res.data.otpNotValid) {
          setErrorMessage("Invalid OTP. Please try again.");
        } else if (res.data.otpExpired) {
          setErrorMessage("OTP has expired. Please request a new one.");
        } else if (res.data.updatedPassword) {
          alert("Password updated successfully! You can now log in.");
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred while updating the password.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isOTPSent) {
      try {
        const res = await axios.post("/send-otp", { email: login.email });

        if (res.data.emailRequire) {
          setErrorMessage("Please enter your email address.");
        } else if (res.data.userNotExist) {
          setErrorMessage("No account found with this email address.");
        } else if (res.data.msg === "OTP sent successfully") {
          alert("OTP has been sent to your email. Please check your inbox.");
          setIsOTPSent(true);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred. Please try again.");
      }
    } else {
      try {
        const res = await axios.post("/update-password", {
          email: login.email,
          otp: login.otp,
          newPassword: login.newPassword,
        });

        if (res.data.otpNotValid) {
          setErrorMessage("Invalid OTP. Please try again.");
        } else if (res.data.otpExpired) {
          setErrorMessage("OTP has expired. Please request a new one.");
        } else if (res.data.updatedPassword) {
          alert("Password updated successfully! You can now log in.");
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred while updating the password.");
      }
    }
  };

  return (
    <form className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Password Reset</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        { prefference ? <input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
          className={styles.input}
          
        />
        :
        <input
        placeholder="Enter Your Phone Number"
        type="text"
        name="phone"
        onChange={handleChange}
        value={login.phone}
        className={styles.input}
        
      />
        }
        {
          prefference ? ( isOTPSent ? null :
            <button
              type="button"
              className={styles.button}
              onClick={handleChangeEmail}
            >
              Use Phone 
            </button>
          ) : (isOTPSent ? null :
            <button
              type="button"
              className={styles.button}
              onClick={handleChangePreference}
            >
              Use Email
            </button>
          )
        }

        {isOTPSent && (
          <>
            <input
              placeholder="Enter OTP"
              type="text"
              name="otp"
              onChange={handleChange}
              value={login.otp}
              className={styles.input}
              required
            />

            <input
              placeholder="Enter New Password"
              type="password"
              name="newPassword"
              onChange={handleChange}
              value={login.newPassword}
              className={styles.input}
              required
            />
          </>
        )}

        <button style={{ marginLeft: "10px" }} type="button" onClick={(e)=>{
          preferredLogin === "email" ? handleSubmit(e) : handleSms(e)
        }} className={styles.button}>
          {isOTPSent ? "Reset Password" : "Send OTP"}
        </button>

        <p className={styles.passwordText}>
          Remember your password?{" "}
          <Link to="/" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </form>
  );
};

export default PasswordReset;
