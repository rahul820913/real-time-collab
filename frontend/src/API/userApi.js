import axios from "axios";

const apicall = axios.create({
    baseURL: window.location.hostname === "localhost" 
    ? "http://localhost:5000/api" 
    : "https://real-time-collab-rqce.onrender.com/api",
});

const getAuth = () => {
  const user = localStorage.getItem("profile")
    ? JSON.parse(localStorage.getItem("profile"))
    : null;
  const token = user?.token;
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


export const fetchUserProfile = async () => {
  const res = await apicall.get("/users/me",getAuth());
  console.log(res.data);
  return res.data;
};

// ✅ Update profile
export const updateUserProfile = async (data) => {
  const res = await apicall.put("/users/update", data,getAuth());
  return res.data;
};
