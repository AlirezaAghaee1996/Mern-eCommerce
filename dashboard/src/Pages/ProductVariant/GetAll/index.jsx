import React, { useState, useEffect } from "react";
import fetchData from "../../../Utils/fetchData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GetAllProductVariant = () => {
  const [variantsList, setVariantsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  // state for sort, e.g. "price" for ascending or "-price" for descending
  const [sort, setSort] = useState("");
  
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // Fetch data based on current page, itemsPerPage, and sort parameter.
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const sortQuery = sort ? `&sort=${sort}` : "";
        const response = await fetchData(
          `product-variant?page=${currentPage}&limit=${itemsPerPage}&populate=productId,variantId${sortQuery}`,
          {
            method: "GET",
            headers: { authorization: `Bearer ${token}` },
          }
        );
        if (response.success) {
          setVariantsList(response.data);
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

    fetchVariants();
  }, [currentPage, itemsPerPage, sort, token]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Toggle sort for a given field.
  // If sorting ascending, switch to descending; if descending, switch back to ascending.
  const handleSort = (field) => {
    if (sort === field) {
      setSort(`-${field}`);
    } else if (sort === `-${field}`) {
      setSort(field);
    } else {
      setSort(field);
    }
    setCurrentPage(1);
  };

  // Render an arrow indicating sort order for the header.
  const renderSortIndicator = (field) => {
    if (sort === field) return " ↑";
    if (sort === `-${field}`) return " ↓";
    return "";
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Product Variants</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("price")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Price{renderSortIndicator("price")}
                </th>
                <th
                  onClick={() => handleSort("discount")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Discount{renderSortIndicator("discount")}
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Quantity{renderSortIndicator("quantity")}
                </th>
                <th
                  onClick={() => handleSort("priceAfterDiscount")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Price After Discount{renderSortIndicator("priceAfterDiscount")}
                </th>
                <th
                  onClick={() => handleSort("productId")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Product{renderSortIndicator("productId")}
                </th>
                <th
                  onClick={() => handleSort("variantId")}
                  className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Variant{renderSortIndicator("variantId")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variantsList.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => navigate(`update/${item._id}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">${item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.discount}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${item.priceAfterDiscount ? item.priceAfterDiscount.toFixed(2) : (item.price - item.price * (item.discount / 100)).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.productId?.title || item.productId?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.variantId?.value || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
              </p>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border rounded-md px-2 py-1 text-sm"
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {variantsList.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No product variants found
        </div>
      )}
    </div>
  );
};

export default GetAllProductVariant;
