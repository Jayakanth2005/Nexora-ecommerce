import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";
import { cartAPI } from "../services/api";

export default function CartCard({ item, reloadCart }) {
    const [loading, setLoading] = useState(false);

    // Update quantity
    const changeQty = async (newQty) => {
        if (newQty < 1) return;

        try {
            setLoading(true);
            await cartAPI.updateItem(item.id, newQty);
            reloadCart();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Delete item
    const deleteItem = async () => {
        try {
            setLoading(true);
            await cartAPI.removeItem(item.id);
            reloadCart();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 flex gap-4"
            whileHover={{ scale: 1.01 }}
        >
            {/* Image */}
            <img
                src={item.productImageUrl}
                alt={item.productName}
                className="w-28 h-28 object-cover rounded-xl"
            />

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="font-semibold text-lg">{item.productName}</h2>
                    <p className="text-neutral-600 text-sm line-clamp-2">
                        {item.productDescription}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-2">

                    {/* Price + Qty */}
                    <div>
                        <p className="text-xl font-bold">
                            ₹{item.productPrice.toFixed(2)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => changeQty(item.qty - 1)}
                                className="p-1 rounded bg-neutral-200 hover:bg-neutral-300"
                                disabled={loading}
                            >
                                <Minus size={16} />
                            </button>

                            <span className="font-semibold">{item.qty}</span>

                            <button
                                onClick={() => changeQty(item.qty + 1)}
                                className="p-1 rounded bg-neutral-200 hover:bg-neutral-300"
                                disabled={loading}
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <p className="text-sm font-semibold mt-1">
                            Subtotal: ₹{item.subtotal.toFixed(2)}
                        </p>
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={deleteItem}
                        className="p-2 bg-red-100 rounded-full hover:bg-red-200"
                        disabled={loading}
                    >
                        <Trash2 size={18} className="text-red-500" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
