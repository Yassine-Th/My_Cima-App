import axios from "axios";
const checkLoggedIn = async () => {
  try {
    const userString = localStorage.getItem("user_boutique");
    const userId = userString ? JSON.parse(userString).id : null;
    if (userId === null) {
      return false;
    }
    const response = await axios.get(`http://localhost:3001/Users/${userId}`);
    const userToken = response.data.token;

    if (!userString) {
      return false;
    }

    const user = JSON.parse(userString);

    if (user.token !== userToken) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking logged in status:", error);
    return false;
  }
};

/**
 * Checks if a user is logged in.
 * @param {function} setIsAuthorized - A setter function from a useState hook
 *                                     that sets the value of the 'isAuthorized'
 *                                     state to the result of the check.
 * @returns {undefined}
 */
export default function isLoggedIn(setIsAuthorized) {
  const checkAuth = async () => {
    const authorized = await checkLoggedIn();
    setIsAuthorized(authorized);
  };
  checkAuth();
}
