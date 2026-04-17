import API from './api';

export const loginUser = async (data) => {
  return await API.post('/user/login', data);
};

export const registerUser = async (data) => {
  return await API.post('/user/register', data);
};
