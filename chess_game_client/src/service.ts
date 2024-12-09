import axiosInstance from "./axios.config";

interface loginUserType {
  username: string;
  password: string;
}

export const loginUser = async ({ username, password }: loginUserType) => {
  try {
    const result = await axiosInstance.post("/login", {
      username,
      password,
    });
    if (result.data.data.token) return result.data.data.token;
    return new Error("Something went wrong!");
  } catch (e) {
    return new Error("Something went wrong!");
  }
};

export const registerUser = async ({ username, password }: loginUserType) => {
  try {
    const result = await axiosInstance.post("/register", {
      username,
      password,
    });
    console.log({ result });
    if (result?.data?.error) return new Error(result?.data?.error);
    return result?.data?.message;
  } catch (e) {
    return new Error("Something went wrong!");
  }
};

export const getUserDetails = async () => {
  try {
    const result = await axiosInstance.post("/getUserDetails");
    console.log({ result });
    return result?.data?.data;
  } catch (e) {
    console.log(e);
  }
};
