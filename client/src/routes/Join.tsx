import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Join() {
  const [joinData, setJoinData] = useState({ email: '', password: '' });
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMismatchError] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setJoinData({ ...joinData, [name]: value });
  };

  const checkPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(e.target.value);
    setMismatchError(joinData.password !== e.target.value);
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post('/auth/join', {
        email: joinData.email,
        password: joinData.password,
      });
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message: string = error.response?.data.message;
        alert(`회원가입 실패: ${message}`);
      }
    }
  };

  return (
    <div className="join-wrapper">
      <h2 className="join-title">회원가입</h2>
      <form className="join-form" onSubmit={handleSubmit}>
        <div className="join-form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={joinData.email}
            onChange={handleInputChange}
            placeholder="이메일"
            required
            autoFocus
          />
        </div>
        <div className="join-form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={joinData.password}
            onChange={handleInputChange}
            placeholder="비밀번호"
            required
          />
        </div>
        <div className="join-form-group">
          <label htmlFor="password">비밀번호 확인</label>
          <input
            type="password"
            id="password-check"
            name="password-check"
            value={passwordCheck}
            onChange={checkPasswordChange}
            placeholder="비밀번호 확인"
            required
          />
          {mismatchError && <strong>비밀번호가 일치하지 않습니다.</strong>}
        </div>
        <button type="submit" className="join-form-button">
          회원가입하기
        </button>
      </form>
    </div>
  );
}

export default Join;
