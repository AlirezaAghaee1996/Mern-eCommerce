import React, { useEffect, useState } from "react";
import fetchData from "../../../Utils/fetchData";
import { useSelector } from "react-redux";
import useFormFields from "../../../Utils/useFormFields";
import notify from "../../../Utils/notify";
import { useNavigate, useParams } from "react-router-dom";

const Reply = () => {
    const [comment, setComment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { token } = useSelector((state) => state.auth);
    const [fields, handleChange] = useFormFields();
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState()
    const { id } = useParams()
    const navigate = useNavigate()
    // Fetch parent categories
    useEffect(() => {
        (async () => {
            try {
                const response = await fetchData(`comment/${id}`, {
                    method: "GET",
                    authorization: `Bearer ${token}`,
                });
                console.log(response)
                setComment(response.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        })();
    }, []);
   

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true);
            const response = await fetchData(`comment/reply/${id}`, {
                method: "PATCH",
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(fields),
            })
            if (response.success) {
                notify(response?.message, 'success')
                navigate('/comments')
            } else {
                notify(response?.message, 'error')

            }
        } catch (err) {
            setError(err.response?.message || "Error creating category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Reply
            </h2>
            <p>{comment?.content}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reply Comment *
                    </label>
                    <input
                        onChange={handleChange}
                        name="reply"
                        className={`w-full px-3 py-2 border rounded-md ${"border-gray-300"}`}
                    />
                </div>





                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                    {loading ? "Creating..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default Reply;
