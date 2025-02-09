import { Suspense, useContext } from "react";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequests";
import "./profilePage.scss";

function ProfilePage() {

    const data = useLoaderData();
    const navigate = useNavigate();
    const { updateUser, currentUser } = useContext(AuthContext);

    const handleLogout = async() => {
        try {
            await apiRequest.post('/auth/logout');
            updateUser(null)
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="profilePage">
            <div className="details">
                <div className="wrapper">
                    <div className="title">
                        <h1>User Information</h1>
                        <Link to="/profile/update">
                            <button>Update Profile</button>
                        </Link>
                    </div>
                    <div className="info">
                        <span>
                            Avatar:
                            <img
                                src={currentUser?.userInfo?.avatar || '/noavatar.png'}
                                alt="profile"
                            />
                        </span>
                        <span>
                            Username: <b>{currentUser?.userInfo?.username}</b>
                        </span>
                        <span>
                            E-mail: <b>{currentUser?.userInfo?.email}</b>
                        </span>
                        <button onClick={() => handleLogout()}>Logout</button>
                    </div>
                    <div className="title">
                        <h1>My List</h1>
                        <Link to="/profile/create">
                            <button>Create New Post</button>
                        </Link>
                    </div>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={<p>Error on Loadin the Posts...</p>}
                        >
                            {(postResponse) => <List posts={postResponse.data.userPosts} />}
                        </Await>
                    </Suspense>
                    <div className="title">
                        <h1>Saved List</h1>
                    </div>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={<p>Error on Loadin the Posts...</p>}
                        >
                            {(postResponse) => <List posts={postResponse.data.savedPosts} />}
                        </Await>
                    </Suspense>
                </div>
            </div>
            <div className="chatContainer">
                <div className="wrapper">
                    <Suspense fallback={<p>Loading...</p>}>
                        <Await
                            resolve={data.chatResponse}
                            errorElement={<p>Error on Loadins Chats...</p>}
                        >
                            {(chatResponse) => <Chat chatsMessage={chatResponse.data} />}
                        </Await>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
