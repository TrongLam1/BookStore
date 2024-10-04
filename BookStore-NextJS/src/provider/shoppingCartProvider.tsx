'use client'
import React, { useContext, useState } from "react";
import { createContext } from "react";

const defaultShoppingCart: IShoppingCart = {
    id: 0,
    totalItems: 0,
    totalPrices: 0,
    cartItems: [],
}

const ShoppingCartContext = createContext<any>(defaultShoppingCart);

export const ShoppingCartProvider = ({ children }: { children: React.ReactNode }) => {
    const [shoppingCart, setShoppingCart] = useState();
    return (
        <ShoppingCartContext.Provider value={{ shoppingCart, setShoppingCart }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export const useShoppingCart = () => useContext(ShoppingCartContext);