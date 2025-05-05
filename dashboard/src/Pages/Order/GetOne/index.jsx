import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";

const GetOneOrder = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchProduct = async (id) => {
    const response = await fetchData(
      `product-variant/${id}`
    );
  }
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetchData(`order/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        if (response.success) {
          setOrder(response.data);
        } else {
          setError(response.message);
          notify("Order not found!", "error");
          navigate("/order");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();


  }, [id, token, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  if (!order) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Order not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
        <button
          onClick={() => navigate("/order")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Order ID:</span> {order._id}</p>
                <p><span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
                <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Authority:</span> {order.authority || 'N/A'}</p>
                <p><span className="font-medium">Reference ID:</span> {order.refId || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Total Price:</span> ${order.totalPrice}</p>
                {order.discountId && (
                  <>
                    <p><span className="font-medium">Discount Applied:</span> {order.discountId.code}</p>
                    <p><span className="font-medium">Final Price:</span> ${order.totalPriceAfterDiscount}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">User Details</h3>
              <p>{order.user?.username|| order.user?.phoneNumber|| 'Unknown User'}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
              {order.address ? (
                <>
                  <p>{order.address.address}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                  <p>{order.address.country}</p>
                </>
              ) : (
                <p>No address provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.product?.imagesUrl?.[0] && (
                          <img
                            src={`${import.meta.env.VITE_BASE_FILE}${item.product.imagesUrl[0]}`}
                            alt={item.product?.title || 'Product'}
                            className="h-10 w-10 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.product?.title || 'Unknown Product'}
                          </div>
                          {item.productVariantId?.name && (
                            <div className="text-sm text-gray-500">
                              Variant: {item.productVariantId.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.finalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.finalPrice * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right font-medium">totalPrice</td>
                  <td className="px-6 py-4 font-medium">${order.totalPrice}</td>
                </tr>
                {order.discountId && (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right font-medium">Discount ({order.discountId.code})</td>
                    <td className="px-6 py-4 font-medium text-red-500">
                      -${order.totalPrice - order.totalPriceAfterDiscount}
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right font-medium">finalPriceAfterDiscount</td>
                  <td className="px-6 py-4 font-medium">${order.totalPriceAfterDiscount || order.totalPrice}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetOneOrder;