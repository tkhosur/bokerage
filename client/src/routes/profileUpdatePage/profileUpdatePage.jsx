import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import "./profileUpdatePage.scss";
import { apiRequest } from "../../lib/apiRequests"
import CloudinaryUploadWidget from "../../components/uploadImage/uploadImage";

function ProfileUpdatePage() {

    const { currentUser, updateUser } = useContext(AuthContext);
    const [error, setError] = useState();
    const [avatar, setAvatar] = useState([]);
    const navigate = useNavigate();

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const { username, email } = Object.fromEntries(formData);

        try {
            const response = await apiRequest.put(`/user/${currentUser?.userInfo?.id}`, {
                username,
                email,
                avatar: avatar[0]
            });
            updateUser(response.data);
            navigate('/profile');
        } catch (error) {
            console.log(error);
            setError(error.response);
        }
    }

    return (
        <div className="profileUpdatePage">
            <div className="formContainer">
                <form onSubmit={handleUpdateUser}>
                    <h1>Update Profile</h1>
                    <div className="item">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            defaultValue={currentUser?.userInfo?.username}
                        />
                    </div>
                    <div className="item">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={currentUser?.userInfo?.email}
                        />
                    </div>
                    <button>Update</button>
                    {error && <span>{error}</span>}
                </form>
            </div>
            <div className="sideContainer">
                <img src={avatar[0] || currentUser?.userInfo?.avatar || '/noavatar.png'} alt="profile" className="avatar" />
                <CloudinaryUploadWidget 
                    uwConfig = {{
                        cloudName: 'dwwadwy2u',
                        uploadPreset: 'estate',
                        multiple: false,
                        maxImageFileSize: 2000000,
                        folder: "avatars"
                    }}
                    setAvatar={setAvatar}
                />
            </div>
        </div>
    );
}

export default ProfileUpdatePage;
