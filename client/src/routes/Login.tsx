import React, { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post('/auth/login', {
        email: loginData.email,
        password: loginData.password,
      });
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message: string = error.response?.data.message;
        alert(`로그인 실패: ${message}`);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <h2 className="login-title">로그인</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            onChange={handleInputChange}
            placeholder="이메일"
            required
            autoFocus
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginData.password}
            onChange={handleInputChange}
            placeholder="비밀번호"
            required
          />
        </div>
        <button type="submit" className="login-form-button">
          로그인
        </button>
      </form>

      {/* <div className="join-link">
        <Link to="/join">회원가입</Link>
      </div> */}
    </div>
  );
}

export default Login;
