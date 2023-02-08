import React from "react";
import { fire } from "../config/fire";

export const Login = () => {
  function signUp() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    fire

      .createUserWithEmailAndPassword(email, password)
      .then((u) => {
        console.log("Successfully Signed Up");
      })
      .catch((err) => {
        console.log("Error: " + err.toString());
      });
  }

  function login() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    fire

      .signInWithEmailAndPassword(email, password)
      .then((u) => {
        console.log("Successfully Logged In");
      })
      .catch((err) => {
        console.log("Error: " + err.toString());
      });
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <div>Email</div>
        <input id="email" placeholder="Enter Email.." type="text" />
      </div>
      <div>
        <div>Password</div>
        <input id="password" placeholder="Enter Password.." type="text" />
      </div>
      <button style={{ margin: "10px" }} onClick={login}>
        Login
      </button>
      <button style={{ margin: "10px" }} onClick={signUp}>
        Sign Up
      </button>
    </div>
  );
};

export default Login;
