const isInvalidEmail = (email: string) => {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return !emailRegex.test(email);
};

const isInvalidPassword = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return !passwordRegex.test(password);
};

export { isInvalidEmail, isInvalidPassword };
