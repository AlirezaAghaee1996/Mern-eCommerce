import { createBrowserRouter, redirect } from "react-router-dom";
import Login from "../Pages/Login";
import store from "../Store";
import Layout from "../Layout";
import Home from "../Pages/Home";
import GetAllCategory from "../Pages/Categories/GetAll";
import Categories from "../Pages/Categories";
import CreateCategory from "../Pages/Categories/Create";
import UpdateCategory from "../Pages/Categories/Update";
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
    ],
  },
]);
export default router;
