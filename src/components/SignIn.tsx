// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/SignIn.css";

// interface User {
//   id: string;
//   password: string;
// }

// function SignIn() {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [error, setError] = useState("");

//   const isValidEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const getUsers = (): User[] => {
//     const usersData = localStorage.getItem("users");
//     return usersData ? JSON.parse(usersData) : [];
//   };

//   const handleLogin = () => {
//     setError("");

//     if (!isValidEmail(email)) {
//       setError("올바른 이메일 형식이 아닙니다.");
//       return;
//     }

//     if (!password) {
//       setError("비밀번호를 입력해주세요.");
//       return;
//     }

//     const users = getUsers();
//     const user = users.find((u) => u.id === email && u.password === password);

//     if (user) {
//       localStorage.setItem("TMDB-Key", user.password);

//       if (rememberMe) {
//         localStorage.setItem("rememberedEmail", email);
//       }

//       alert("로그인 성공!");
//       navigate("/");
//     } else {
//       setError("아이디 또는 비밀번호가 일치하지 않습니다.");
//     }
//   };

//   const handleRegister = () => {
//     setError("");

//     if (!isValidEmail(email)) {
//       setError("올바른 이메일 형식이 아닙니다.");
//       return;
//     }

//     if (!password) {
//       setError("비밀번호(TMDB API Key)를 입력해주세요.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("비밀번호가 일치하지 않습니다.");
//       return;
//     }

//     if (!agreeTerms) {
//       setError("약관에 동의해주세요.");
//       return;
//     }

//     const users = getUsers();
//     const userExists = users.some((u) => u.id === email);

//     if (userExists) {
//       setError("이미 존재하는 이메일입니다.");
//       return;
//     }

//     const newUser: User = { id: email, password };
//     users.push(newUser);
//     localStorage.setItem("users", JSON.stringify(users));

//     alert("회원가입 성공! 로그인해주세요.");
//     setIsLogin(true);
//     setPassword("");
//     setConfirmPassword("");
//     setAgreeTerms(false);
//   };

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setError("");
//     setPassword("");
//     setConfirmPassword("");
//     setAgreeTerms(false);
//   };

//   return (
//     <div className="signin-container">
//       <div className="signin-box">
//         <h1>{isLogin ? "로그인" : "회원가입"}</h1>

//         {error && <div className="error-message">{error}</div>}

//         <div className="form-group">
//           <label htmlFor="email">이메일</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="example@email.com"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="password">
//             {isLogin ? "비밀번호" : "TMDB API Key"}
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder={isLogin ? "비밀번호 입력" : "TMDB API Key 입력"}
//           />
//         </div>

//         {!isLogin && (
//           <div className="form-group">
//             <label htmlFor="confirmPassword">비밀번호 확인</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="비밀번호 재입력"
//             />
//           </div>
//         )}

//         {isLogin ? (
//           <div className="form-options">
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//               />
//               <span>Remember me</span>
//             </label>
//           </div>
//         ) : (
//           <div className="form-options">
//             <label className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={agreeTerms}
//                 onChange={(e) => setAgreeTerms(e.target.checked)}
//               />
//               <span>약관에 동의합니다 (필수)</span>
//             </label>
//           </div>
//         )}

//         <button
//           className="submit-btn"
//           onClick={isLogin ? handleLogin : handleRegister}
//         >
//           {isLogin ? "로그인" : "회원가입"}
//         </button>

//         <div className="toggle-form">
//           <span>
//             {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
//           </span>
//           <button onClick={toggleForm} className="toggle-btn">
//             {isLogin ? "회원가입" : "로그인"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignIn;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SignIn.css";

interface User {
  id: string;
  password: string;
}

function SignIn() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getUsers = (): User[] => {
    const usersData = localStorage.getItem("users");
    return usersData ? JSON.parse(usersData) : [];
  };

  const handleLogin = () => {
    setError("");

    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    const users = getUsers();
    const user = users.find((u) => u.id === email && u.password === password);

    if (user) {
      localStorage.setItem("TMDB-Key", user.password);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      }

      alert("로그인 성공!");
      navigate("/");
    } else {
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const handleRegister = () => {
    setError("");

    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (!password) {
      setError("비밀번호(TMDB API Key)를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreeTerms) {
      setError("약관에 동의해주세요.");
      return;
    }

    const users = getUsers();
    const userExists = users.some((u) => u.id === email);

    if (userExists) {
      setError("이미 존재하는 이메일입니다.");
      return;
    }

    const newUser: User = { id: email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("회원가입 성공! 로그인해주세요.");
    setIsLogin(true);
    setPassword("");
    setConfirmPassword("");
    setAgreeTerms(false);
  };

  const toggleForm = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);
      setIsFlipping(false);
    }, 300);
  };

  return (
    <div className="signin-container">
      <div className={`signin-box ${isFlipping ? "flipping" : ""}`}>
        <h1>{isLogin ? "로그인" : "회원가입"}</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            {isLogin ? "비밀번호" : "TMDB API Key"}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "비밀번호 입력" : "TMDB API Key 입력"}
          />
        </div>

        {!isLogin && (
          <div className="form-group slide-down">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
            />
          </div>
        )}

        {isLogin ? (
          <div className="form-options fade-in">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>
        ) : (
          <div className="form-options fade-in">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span>약관에 동의합니다 (필수)</span>
            </label>
          </div>
        )}

        <button
          className="submit-btn"
          onClick={isLogin ? handleLogin : handleRegister}
        >
          {isLogin ? "로그인" : "회원가입"}
        </button>

        <div className="toggle-form">
          <span>
            {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
          </span>
          <button onClick={toggleForm} className="toggle-btn">
            {isLogin ? "회원가입" : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
