import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import ErrorPage from "../pages/ErrorPage";
import AdminDashboard from "../pages/AdminDashboard";
import HomePage from "../pages/HomePage";
import FoodByCategoryPage from "../pages/FoodByCategoryPage";
import SearchPage from "../pages/SearchPage";
import ContactUsPage from "../pages/ContactUsPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import OrdersPage from "../pages/OrdersPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminRoute from "./AdminRoute";
import AdminUserManagementPage from "../pages/AdminUserManagementPage";
import ProfilePage from "../pages/ProfilePage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminLayout from "../layouts/AdminLayout";
import UserRoute from "./UserRoute";
import PublicRoute from "./PublicRoute";
import FoodCard from "../components/FoodCard";
import FoodDetails from "../components/FoodDetails";
import DashboardOverview from "../components/DashboardOverview";
import AdminCategoryPage from "../pages/AdminCategoryPage";
import AdminQueryManagementPage from "../pages/AdminQueryManagementPage";
import AdminFoodPage from "../pages/AdminFoodPage";

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      // Accessible only when NOT logged in
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/admin/login",
            element: <AdminLoginPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "/api/auth/reset-password",
            element: <ResetPasswordPage />,
          },
        ],
      },

      // Accessible by everyone
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/foods/category/:categoryId",
        element: <FoodByCategoryPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/contactUs",
        element: <ContactUsPage />,
      },
      {
        path: "/food/:id",
        element: <FoodDetails />,
      },
    ],
  },

  // Customer Routes
  {
    element: <UserRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/checkout",
            element: <CheckoutPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/my-orders",
            element: <OrdersPage />,
          },
        ],
      },
    ],
  },
  // Admin Routes
  {
    element: <AdminRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
            children: [
              {
                index: true,
                element: <DashboardOverview />,
              },
              {
                path: "users",
                element: <AdminUserManagementPage />,
              },
              {
                path: "food",
                element: <AdminFoodPage />,
              },
              {
                path: "category",
                element: <AdminCategoryPage />,
              },
              {
                path: "all/orders",
                element: <AdminOrdersPage />,
              },
              {
                path: "query",
                element: <AdminQueryManagementPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
