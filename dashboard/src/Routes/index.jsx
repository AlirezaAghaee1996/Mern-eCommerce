import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "../Pages/Login";
import store from "../Store";
import Layout from "../Layout";
import Home from "../Pages/Home";
import GetAllCategory from "../Pages/Categories/GetAll";
import Categories from "../Pages/Categories";
import CreateCategory from "../Pages/Categories/Create";
import UpdateCategory from "../Pages/Categories/Update";
import Brands from "../Pages/Brands";
import GetAllBrands from "../Pages/Brands/GetAll";
import CreateBrand from "../Pages/Brands/Create";
import UpdateBrand from "../Pages/Brands/Update";
import Users from "../Pages/User";
import GetAllUsers from "../Pages/User/GetAll";
import UpdateUser from "../Pages/User/Update";
const checkAuth = () => {
  const state = store.getState();
  const token = state?.auth?.token;

  if (!token) {
    return redirect("/login");
  }
  return null;
};
const checkLogin = () => {
  const state = store.getState();
  const token = state?.auth?.token;

  if (token) {
    return redirect("/");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/login",
    loader: checkLogin,
    element: <Login />,
  },
  {
    path: "/",
    loader: checkAuth,
    element: <Layout />,
    children: [
      {
        index:true,
        element: <Home />,
      },
      {
        path: "/category",
        element: <Categories />,
        children: [
          { 
            index:true, 
            element: <GetAllCategory /> 
          },
          {
            path: "create",
            element: <CreateCategory />,
          },
          {
            path: "update",
            element: <UpdateCategory />,
          },
        ],
      },
      {
        path: "/brand",
        element: <Brands />,
        children: [
          { 
            index:true, 
            element: <GetAllBrands /> 
          },
          {
            path: "create",
            element: <CreateBrand />,
          },
          {
            path: "update",
            element: <UpdateBrand />,
          },
        ],
      },
      {
        path: "/user",
        element: <Users />,
        children: [
          { 
            index:true, 
            element: <GetAllUsers /> 
          },
          {
            path: "update",
            element: <UpdateUser />,
          },
        ],
      },
    ],
  },
]);
export default router;
