export const isAuthenticated = () => {
  const token = localStorage.getItem("lc-dev-userId"); // Retrieve token from storage
  if (!token) return false; // No token, not authenticated

  try {
    // Decode the payload from the JWT
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode base64
    const currentTime = Date.now() / 1000; // Current time in seconds
    return payload.exp > currentTime; // Check if token has expired
  } catch (e) {
    console.error("Invalid token", e);
    return false;
  }
};
