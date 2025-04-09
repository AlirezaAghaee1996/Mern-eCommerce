import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate } from "react-router-dom";

const CreateAddress = () => {
  const [fields, handleChange] = useFormFields();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // State to store the list of users
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchData("user", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.success) {
          // Assuming response.data is an array of user objects.
          setUsers(response.data);
        } else {
          notify("Failed to fetch users", "error");
        }
      } catch (err) {
        notify("Error fetching users", "error");
      }
    };

    fetchUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Send the form data along with the selected userId
      const response = await fetchData("address", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });
      if (response.success) {
        notify("Address created successfully", "success");
        navigate("/address");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error creating address", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* City Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            name="city"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter city"
          />
        </div>

        {/* Receiver Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name *</label>
          <input
            name="receiverName"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter receiver's name"
          />
        </div>

        {/* Receiver Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Phone Number *</label>
          <input
            name="receiverPhoneNumber"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter receiver's phone number"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
          <input
            name="postalCode"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter postal code"
          />
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
          <input
            name="street"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter street name"
          />
        </div>

        {/* Plaque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plaque *</label>
          <input
            name="plaque"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter plaque number"
          />
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
          <input
            name="province"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter province"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter address description (optional)"
          ></textarea>
        </div>

        {/* Select Box for User */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User *</label>
          <select
            name="userId"
            value={fields.userId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name || user.phoneNumber} {/* Adjust this based on your user object (e.g. user.email) */}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Creating..." : "Create Address"}
        </button>
      </form>
    </div>
  );
};

export default CreateAddress;
