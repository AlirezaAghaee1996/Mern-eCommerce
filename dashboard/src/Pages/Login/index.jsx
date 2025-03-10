import { useDispatch, useSelector } from "react-redux";
import fetchData from "../../Utils/fetchData";
import notify from "../../Utils/notify";
import useFormFields from "../../Utils/useFormFields";
import { useEffect, useState } from "react";
import { login } from "../../Store/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [fields, handleChange] = useFormFields();
  const [errors, setErrors] = useState({});
    const {token}=useSelector(state=>state.auth)
  const validate = () => {
    const newErrors = {};
    if (!/^(\+\d{1,3})?\d{10,14}$/.test(fields.phoneNumber || "")) {
      newErrors.phoneNumber = "Invalid phone number (e.g., +989123456789)";
    }
    if (!/^.{6,}$/.test(fields.password || "")) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const dispatch = useDispatch();
  const navigate=useNavigate()
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const res = await fetchData("auth/admin", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (res.success) {
        console.log(res)
        notify(res.message, "success");
        dispatch(login({ user: res.data.user, token: res.data.token }));
        navigate('/')
      } else {
        notify(res.message, "error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-96 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={fields.phoneNumber || ""}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-700 text-white border-2 ${
                errors.phoneNumber ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-blue-500`}
            />
            {errors.phoneNumber && (
              <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={fields.password || ""}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-700 text-white border-2 ${
                errors.password ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:border-blue-500`}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
