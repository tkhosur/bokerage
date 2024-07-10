import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { apiRequest } from "../../lib/apiRequests";

function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);

        const formData = new FormData(e.target);

        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await apiRequest.post('/auth/register', {
                username: username,
                email: email,
                password: password
            });

            if(response) {
                navigate("/")
            } else {
                navigate("/regsiter")
            }

        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="register">
            <div className="formContainer">
                <form onSubmit={handleOnSubmit}>
                    <h1>Create an Account</h1>
                    <input name="username" type="text" placeholder="Username" />
                    <input name="email" type="text" placeholder="Email" />
                    <input name="password" type="password" placeholder="Password" />
                    <button disabled={isLoading}>Register</button>
                    {error && <span>{error}</span>}
                    <Link to="/login">Do you have an account?</Link>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default Register;
