import { createContext, useContext, useState, useEffect } from "react";

import Swal from 'sweetalert2';

// Create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [category, setCategory] = useState([]);
    const [catId, setCatId] = useState('');
    const [catProduct, setCatProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectCountry, setSelectCountry] = useState('INR');
    const [itemsPerpage, setItemsPerpage] = useState(20);
    const [searchItem, setSearchItem] = useState('');
    const [token, setToken] = useState(localStorage.getItem("jwtToken"));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });


    const logout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of the system.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
            cancelButtonText: 'Cancel'
        });
        if (result.isConfirmed) {
            try {
                setToken(null);
                localStorage.removeItem("jwtToken");
                setUser(null);
                localStorage.removeItem("user");
                await Swal.fire({
                    title: 'Logged out!',
                    text: 'You have been successfully logged out.',
                    icon: 'success',
                    timer: 2000,  // Auto close after 2 seconds
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                window.location.reload()
            } catch (error) {
                await Swal.fire({
                    title: 'Error!',
                    text: 'There was a problem logging out.',
                    icon: 'error'
                });
            }
        }
    };

    // ... rest of your AuthProvider code ...

    return (
        <AuthContext.Provider value={{
            category, setCategory,
            catId, setCatId,
            catProduct, setCatProduct,
            loading, setLoading,
            selectCountry, setSelectCountry,
            itemsPerpage, setItemsPerpage,
            searchItem, setSearchItem,
            token, setToken,
            user, setUser,
            logout // Add the logout function to the context
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