import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [status, setStatus] = useState(() => {
        return localStorage.getItem('status') || null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (status) {
            localStorage.setItem('status', status);
        }
    }, [user, status]);

    return (
        <UserContext.Provider value={{ user, setUser, status, setStatus }}>
            {children}
        </UserContext.Provider>
    );
};
