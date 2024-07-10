import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.scss";

function Navbar() {

    const [open, setOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);

    return (
        <nav>
            <div className="left">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="" />
                    <span>LamaEstate</span>
                </a>
                <a href="/">Home</a>
                <a href="/">About</a>
                <a href="/">Contact</a>
                <a href="/">Agents</a>
            </div>
            <div className="right">
                {currentUser ? (
                    <div className="user">
                        <img
                            src={currentUser?.userInfo?.avatar || '/noavatar.png'}
                            alt=""
                        /> 
                        <span>{currentUser?.userInfo?.username}</span>
                        <Link to="/profile" className="profile">
                        <div className="notification">3</div>
                        <span>Profile</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        <a href="/login">Sign in</a>
                        <a href="/register" className="registe">
                            Sign up
                        </a>
                    </>
                )}
                <div className="menuIcon">
                    <img
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <a href="/">Home</a>
                    <a href="/">About</a>
                    <a href="/">Contact</a>
                    <a href="/">Agents</a>
                    <a href="/">Sign in</a>
                    <a href="/">Sign up</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
