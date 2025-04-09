import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";

const UpdateAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      try {
        // Fetch address data
        const addressResponse = await fetchData(`address/${id}`, {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });

        if (addressResponse.success) {
          setFields(addressResponse.data);
        }

        // Fetch users list
        const usersResponse = await fetchData("users", {
          method: "GET",
          headers: { authorization: `Bearer ${token}` },
        });

        if (usersResponse.success) {
          setUsers(usersResponse.data);
        }
      } catch (error) {
        console.log(error)
        notify("Error fetching data", "error");
      }
    })()

 
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetchData(`address/${id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (response.success) {
        notify("Address updated successfully", "success");
        navigate("/address");
      } else {
        notify(response.message, "error");
      }
    } catch (err) {
      notify("Error updating address", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            name="city"
            value={fields.city || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter city"
            required
          />
        </div>

        {/* Receiver Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name *</label>
          <input
            name="receiverName"
            value={fields.receiverName || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter receiver's name"
            required
          />
        </div>

        {/* Receiver Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Phone Number *</label>
          <input
            name="receiverPhoneNumber"
            value={fields.receiverPhoneNumber || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter receiver's phone number"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
          <input
            name="postalCode"
            value={fields.postalCode || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter postal code"
            required
          />
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
          <input
            name="street"
            value={fields.street || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter street name"
            required
          />
        </div>

        {/* Plaque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plaque *</label>
          <input
            name="plaque"
            value={fields.plaque || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter plaque number"
            required
          />
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
          <input
            name="province"
            value={fields.province || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter province"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={fields.description || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter address description (optional)"
          ></textarea>
        </div>

        {/* User Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User *</label>
          <select
            name="userId"
            value={fields.userId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          {loading ? "Updating..." : "Update Address"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAddress;