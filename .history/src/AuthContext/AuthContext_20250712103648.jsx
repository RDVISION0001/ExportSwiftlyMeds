import { createContext, useContext, useState, useEffect } from "react";

// First create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Initialize state from localStorage if available
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [product, setProduct] = useState(() => {
        const savedProduct = localStorage.getItem('product');
        return savedProduct ? JSON.parse(savedProduct) : null;
    });
    const [amount, setAmount] = useState(() => {
        const savedAmount = localStorage.getItem('amount');
        return savedAmount ? parseFloat(savedAmount) : 0;
    });


    const [category, setCategory] = useState([]);
    const [catId, setCatId] = useState('');
    const [catProduct, setCatProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectCountry, setSelectCountry] = useState('INR')
    const [itemsPerpage,setItemsPerpage]

    // Save to localStorage whenever cart, product, or amount changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('product', JSON.stringify(product));
        localStorage.setItem('amount', amount.toString());
    }, [cart, product, amount]);


    return (
        <AuthContext.Provider value={{
            cart, setCart,
            product, setProduct,
            amount, setAmount,
            category, setCategory,
            catId, setCatId,
            catProduct, setCatProduct,
            loading, setLoading,
            selectCountry, setSelectCountry
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