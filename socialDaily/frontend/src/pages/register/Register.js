import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck, FaCircle, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterUsersMutation } from "../../store/Apislice";
const FormData = require("form-data");

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register() {
  let [userData, { isError, isLoading }] = useRegisterUsersMutation();
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [username, setUser] = useState("");
  const [validUser, setValidUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [pwdType, setPwdType] = useState("password");
  const [pwdIcon, setPwdIcon] = useState(false);
  const [pwdTypeMatch, setPwdTypeMatch] = useState("password");
  const [pwdIconMatch, setPwdIconMatch] = useState(false);
  const [validPwd, setValidPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatchPwd, setValidMatchPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [sucessMsg, setSucessMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setValidUser(USER_REGEX.test(username));
    setSucessMsg("");
    setErrMsg("");
  }, [username, email, name, password, matchPwd]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatchPwd(password === matchPwd);
  }, [password, matchPwd]);

  const handleIconClick = () => {
    if (pwdType === "password") {
      setPwdIcon(true);
      setPwdType("text");
    } else if (pwdType === "text") {
      setPwdIcon(false);
      setPwdType("password");
    }
  };

  const handleIconClickMatch = () => {
    if (pwdTypeMatch === "password") {
      setPwdIconMatch(true);
      setPwdTypeMatch("text");
    } else if (pwdTypeMatch === "text") {
      setPwdIconMatch(false);
      setPwdTypeMatch("password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);

    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return null;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("username", username);
    form.append("email", email);
    form.append("password", password);

    const response = userData({
      name,
      username,
      email,
      password,
    });

    const value = await response;

    if (!value.error && value.data) {
      setSubmitting(false);
      setErrMsg("");
      setSucessMsg("success");
      toast.success(`Registered Successfully,Verification Sent to ${email}`);
    } else {
      setSubmitting(false);
      if (value.error.status === "FETCH_ERROR") {
        setErrMsg("No Server Response");
      } else if (value.error.status === 400) {
        setSucessMsg("");
        setErrMsg(value.error.data.message);
      } else {
        setSucessMsg("");
        setErrMsg("Registration Failed");
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialDaily</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on SocialDaily.
          </span>
        </div>
        <div className="loginRight">
          <div className="body">
            <p
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <p
              className={sucessMsg ? "successmsg" : "offscreen"}
              aria-live="assertive"
            >
              Successfully Registered
            </p>
            <ToastContainer />
            <form className="loginBox" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Name"
                  id="signup-name"
                  type="text"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>

              <div className="form-group">
                
                  <FaCheck className={validUser ? "valid" : "hide"} />

                <p className={validUser ? "validp" : "hide"}>Valid Username</p>

                <FaTimes
                  className={validUser || !username ? "hide" : "invalid"}
                />

                <p className={validUser || !username ? "hide" : "invalidp"}>
                  Invalid Username
                </p>

                <input
                  className="form-control"
                  id="signup-uname"
                  placeholder="Username"
                  name="username"
                  type="text"
                  onChange={(e) => setUser(e.target.value)}
                  value={username}
                  required
                  aria-invalid={validUser ? "false" : "true"}
                  aria-describedby="uidnote"
                />
                <p
                  id="uidnote"
                  className={
                    username && !validUser ? "instructions" : "offscreen"
                  }
                >
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              <div className="form-group">
                <input
                  className="form-control"
                  id="signup-email"
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>

              <div className="form-group">
                
                <FaCheck className={validPwd ? "valid" : "hide"} />
                
                <p className={validPwd ? "validp" : "hide"}>Valid Password</p>

                <FaTimes
                  className={validPwd || !password ? "hide" : "invalid"}
                />

                <p className={validPwd || !password ? "hide" : "invalidp"}>
                  Invalid Password
                </p>

                <input
                  className="form-control"
                  id="signup-password"
                  name="password"
                  placeholder="Password"
                  type={pwdType}
                  onChange={(e) => setPwd(e.target.value)}
                  value={password}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                />
                <span className="eye" onClick={handleIconClick}>
                  {pwdIcon ? <FaEye /> : <FaEyeSlash />}
                </span>
                <p
                  id="pwdnote"
                  className={
                    password && !validPwd ? "instructions" : "offscreen"
                  }
                >
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              </div>

              <div className="form-group">

                <FaCheck
                  className={validMatchPwd && matchPwd ? "valid" : "hide"}
                />

                <p className={validMatchPwd && matchPwd? "validp" : "hide"}>Password Matched</p>

                <FaTimes
                  className={validMatchPwd || !matchPwd ? "hide" : "invalid"}
                />

                <p className={validMatchPwd || !matchPwd ? "hide" : "invalidp"}>
                Password Not Matched
                </p>

                <input
                  className="form-control"
                  id="signup-matchPwd"
                  placeholder="Retype Password"
                  type={pwdTypeMatch}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  aria-invalid={matchPwd ? "false" : "true"}
                  aria-describedby="confirmnote"
                  required
                />
                <span className="eye" onClick={handleIconClickMatch}>
                  {pwdIconMatch ? <FaEye /> : <FaEyeSlash />}
                </span>
                <p
                  id="confirmnote"
                  className={
                    matchPwd && !validMatchPwd ? "instructions" : "offscreen"
                  }
                >
                  <FaCircle />
                  Must match the first password input field.
                </p>
              </div>

              <button
                className="loginButton"
                type="submit"
                disabled={!validUser || !validPwd || !validMatchPwd}
              >
                {submitting? 'Signing Up...' : 'Sign Up'}
              </button>
              <div className="bottom">
                <span className="helper-text">
                  Already have an account?
                  <Link to="/login" className="loginRegisterButton">
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
