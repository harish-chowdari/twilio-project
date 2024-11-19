import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [login, setLogin] = useState({ phone: "", email: "", password: "", preferredLogin: "phone", });
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const [prefference, setPreference] = useState(false);

  const handleChangePreference = (e) => {
    setPreference(true);
    setLogin({ ...login, preferredLogin: "email" });
  };

  const handleChangeEmail = (e) => {
    setPreference(false);
    setLogin({ ...login, preferredLogin: "phone" });
  };
console.log(login);
  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      const res = await axios.post("/login", { ...login });

      if (res.data.EnterAllDetails) {
        toast.error(res.data.EnterAllDetails);
      } else if (res.data.NotExist) {
        toast.error(res.data.NotExist);
      } else if (res.data.Incorrect) {
        toast.error(res.data.Incorrect);
      } else {
        const userId = res.data._id; 
        toast.success("Login successful");
        navigate(`/home/${userId}`);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <h2>Login</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        { !prefference ? <input
          placeholder="Phone"
          type="text"
          name="phone"
          onChange={handleChange}
          value={login.phone}
          className={styles.input}
        />

        :
        <input
          placeholder="Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
          className={styles.input}
        />}

        { !prefference ? 
            <p className={styles.text1} onClick={handleChangePreference}>Login by Email ?</p> 
            : 
            <p className={styles.text1} onClick={handleChangeEmail}>Login by Number ?</p>
        }
        
        <input
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={login.password}
          className={styles.input}
        />
        <p className={styles.resetPassword}>
          Forget password? update{" "}
          <Link to="/reset" className={styles.link}>
            {" "}
            here
          </Link>
        </p>
        <button type="submit" className={styles.button}>
          Submit
        </button>

        <p className={styles.text}>
          Don't have an account?{" "}
          <Link to="/signup" className={styles.link}>
            Signup
          </Link>
        </p>
      </div>
      <ToastContainer position="top-center" />
    </form>
  );
};

export default Login;
