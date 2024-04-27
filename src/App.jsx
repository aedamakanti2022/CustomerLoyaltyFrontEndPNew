import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  BusinessDashboard,
  BusinessLogin,
  Dashboard,
  HomeLayout,
  Landing,
  Login,
  Logout,
  Register,
  RegisterBusiness,
} from "./pages";
import { ToastContainer } from "react-toastify";
import ForgetPassword from "./pages/ForgetPassword";
import ForgetPasswordBusiness from "./pages/ForgetPasswordBusiness";
import RedeemHistory from "./pages/RedeemHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "customerLogin",
        element: <Login />,
      },
      {
        path: "businessLogin",
        element: <BusinessLogin />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgetPassword",
        element: <ForgetPassword />,
      },
      {
        path: "redeemHistory",
        element: <RedeemHistory />,
      },
      {
        path: "forgetPasswordBusiness",
        element: <ForgetPasswordBusiness />,
      },

      {
        path: "businessRegister",
        element: <RegisterBusiness />,
      },
      {
        path: "customerDashboard",
        element: <Dashboard />,
      },
      {
        path: "businessDashboard",
        element: <BusinessDashboard />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
