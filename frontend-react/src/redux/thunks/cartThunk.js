import { getCartApi } from "../../api/service/cartService";
import { setCart } from "../slice/cartSlice";

export const fetchCart = (userId) => async (dispatch) => {
  try {
    const response = await getCartApi(userId);

    dispatch(setCart(response.data));
  } catch (error) {
    console.error("Failed to fetch cart", error);
  }
};
