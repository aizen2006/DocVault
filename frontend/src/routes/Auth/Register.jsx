import React from 'react'

const registerUser = () => {
    // user register logic
}

export default function Register() {
    return (
        <div>
            <div>
                logo
                <h3>DocVault</h3>
            </div>
            <div>
                <h1>Get Started with DocVault</h1>
                <p>Manage your documents efficiently.</p>
            </div>
            <div>
                <form action="registerUser">

                    <label htmlFor="fullname">Full Name</label>
                    <input type="text" placeholder='fullname' />

                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder='username' />

                    <label htmlFor="email">Email</label>
                    <input type="text" placeholder='email' />

                    <label htmlFor="role">Role</label>
                    <select id="role" name="role">
                        <option value="">Select your role</option>
                        <option value="sender">Sender</option>
                        <option value="receiver">Receiver</option>
                    </select>

                    <input type="password" placeholder='password' />

                    <input type="password" placeholder='Confirm Password' />

                    <button type='submit'>Sign In</button>
                </form>
            </div>
            <div>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    )
}