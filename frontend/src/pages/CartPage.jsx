import React from "react";
import { cartAPI } from "../services/api"
import { useEffect, useState } from "react"
import CartCard from "../components/cartCardEnhanced";
import { motion } from 'framer-motion';
export default function CartPage(){

    useEffect(() => {
        loadCart();
    }, []);

    const [cartItems, setCartItems] = useState(null);

    const loadCart = async () => {
        try {
            const data = await cartAPI.getCart();
            console.log(data.data)
            setCartItems(data.data);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    };

return (
    <div className="space-y-4">
        {cartItems?.map((item, index) => (
            <motion.div
                key={item.id}
                // variants={itemVariants}
                transition={{ delay: index * 0.1 }}
            >
                <CartCard item={item} reloadCart={loadCart} />
            </motion.div>
        ))}
    </div>
);

}