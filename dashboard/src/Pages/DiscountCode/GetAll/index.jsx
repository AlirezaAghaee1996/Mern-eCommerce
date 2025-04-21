import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllDiscountCode = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await fetchData(
          `discount?page=${currentPage}&limit=${itemsPerPage}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }
        );
        if (response.success) {
          setDiscounts(response.data);
          setTotalCount(response.count);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [currentPage, itemsPerPage, token]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md mx-4 my-2">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Discounts</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Percent</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Expire Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Max Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Min Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((disc) => (
                <tr
                  key={disc._id}
                  onClick={() => navigate(`update/${disc._id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{disc.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{disc.percent}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.startTime ? new Date(disc.startTime).toLocaleString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.expireTime ? new Date(disc.expireTime).toLocaleString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.maxPrice !== undefined ? `$${disc.maxPrice}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.minPrice !== undefined ? `$${disc.minPrice}` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {disc.isActive ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(disc.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-4">
            <p className="text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
            </p>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAllDiscountCode;
