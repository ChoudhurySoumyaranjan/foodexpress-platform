import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { fetchCart } from "../redux/thunks/cartThunk";
import { loginSuccess, setLoading, logout } from "../redux/slice/authSlice";
import { BACKEND_BASE_URL, DEV_MODE } from "../utils/constants";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      // ==========================
      //  DEV MODE if true (Skip Auth)
      // ==========================
      if (DEV_MODE) {
        console.warn("⚠️ DEV MODE: Skipping auth initialization");
        dispatch(setLoading(false));
        return;
      }

      // ==========================
      //  PRODUCTION MODE
      // ==========================
      try {
        const { data } = await axios.post(
          `${BACKEND_BASE_URL}/api/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        dispatch(loginSuccess(data));

        dispatch(fetchCart(data.user.id));
      } catch (error) {
        console.error(
          " Refresh token failed:",
          error.response?.data || error.message,
        );

        // Logout if refresh fails
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
