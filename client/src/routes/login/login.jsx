import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/apiRequests";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { updateUser } = useContext(AuthContext);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        setIsLoading(true);

        const formData = new FormData(e.target);

        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await apiRequest.post('/auth/login', {
                username: username,
                password: password
            });

            updateUser(response.data);

            navigate("/");

        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="login">
            <div className="formContainer">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Welcome back</h1>
                    <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
                    <input name="password" required type="password" placeholder="Password" />
                    {error && <span>{error}</span>}
                    <button disabled={isLoading}>Login</button>
                    <Link to="/register">{"Don't"} you have an account?</Link>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default Login;
