import { createContext, useContext, useState } from "react";

// First create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [product,setProduct] = useState([]);
    
    return (
        <AuthContext.Provider value={{
            cart,setCart,
            product,setProduct
        }}>
            {children} 
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}