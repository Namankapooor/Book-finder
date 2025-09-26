import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Trash2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import Header from "../components/Header";
import { Link } from 'react-router-dom';

const MyLibrary = () => {
    const [favorites, setFavorites] = useState([]);
    const { token } = useAuth();

    // Fetch favorites
    useEffect(() => {
        if (!token) return;
        api.get(`/favorites`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setFavorites(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                toast.error("Error fetching favorites");
            });

    }, [token]);

    // Remove favorite
    const handleRemoveFavorite = async (bookId) => {
        try {
            const res = await api.delete(`/favorites/${bookId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status !== 200) throw new Error("Failed to remove favorite");

            setFavorites((prev) => prev.filter((book) => book._id !== bookId));
            toast.success("Favorite removed successfully");
        } catch (err) {
            toast.error("Error removing favorite:", err);
        }
    };

    return (
        <>
            < Header />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    📚 My Library
                </h1>

                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <BookOpen size={48} className="mb-3 opacity-70" />
                        <p className="text-lg">Your library is empty. Start adding books!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favorites.map((book) => (
                            <div
                                key={book._id}
                                className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition transform duration-200 flex flex-col"
                            >
                                <Link to={`/book/${book.bookId}`}>
                                    <img
                                        src={book.thumbnail}
                                        alt={book.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </Link>
                                <div className="p-4 flex flex-col flex-1">
                                    <Link to={`/book/${book.bookId}`}>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                            {book.title}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-1">
                                            {book.authors?.join(", ") || "Unknown Author"}
                                        </p>

                                        <span
                                            className={`mt-3 inline-block px-2 py-1 text-xs font-semibold rounded-full w-fit ${book.availability === "Free eBook"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                                }`}
                                        >
                                            {book.availability}
                                        </span>
                                    </Link>
                                    <div className="mt-auto flex justify-end">
                                        <button
                                            onClick={() => handleRemoveFavorite(book._id)}
                                            className="mt-4 flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyLibrary;
