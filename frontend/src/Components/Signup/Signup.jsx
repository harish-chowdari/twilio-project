import React, { useState } from "react";
import axios from "../../axios";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [signup, setSignup] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    preferredLogin: "phone",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [prefference, setPreference] = useState(false);

  const handleChangePreference = (e) => {
    setPreference(true);
    setSignup({ ...signup, preferredLogin: "email" });
  };

  const handleChangeEmail = (e) => {
    setPreference(false);
    setSignup({ ...signup, preferredLogin: "phone" });
  };


  console.log(signup);

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("/signup", { ...signup });

      if (res.data.EnterAllDetails) {
        setErrorMessage(res.data.EnterAllDetails);
      } else if (res.data.AlreadyExist) {
        setErrorMessage(res.data.AlreadyExist);
      } 
      else if (res.data.PhoneExist) {
        setErrorMessage(res.data.PhoneExist);
      }
      else {
        const userId = res.data._id;
        navigate(`/home/${userId}`);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while signing up. Please try again.");
    }
  };

  return (
  
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>Signup</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div>
          <input
            placeholder="Enter Your Name"
            type="text"
            name="name"
            onChange={handleChange}
            value={signup.name}
            className={styles.input}
          />
        </div>
        
        { !prefference ?
         <div>
          <input
            placeholder="Enter Your Phone Number"
            type="text"
            name="phone"
            onChange={handleChange}
            value={signup.phone}
            className={styles.input}
          />
        </div>
        :
        <div>
          <input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={signup.email}
            className={styles.input}
          />
        </div>
        }

        { !prefference ? 
            <p className={styles.text1} onClick={handleChangePreference}>Login by Email ?</p> 
            : 
            <p className={styles.text1} onClick={handleChangeEmail}>Login by Number ?</p>
        }

        <div>
          <input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={signup.password}
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.button}>
          Submit
        </button>
        <p className={styles.text}>
          Already have an account?{" "}
          <Link to="/" className={styles.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
