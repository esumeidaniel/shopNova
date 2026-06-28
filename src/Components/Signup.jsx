import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form className="signup-form">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )

}


