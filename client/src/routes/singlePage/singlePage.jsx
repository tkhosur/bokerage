import { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import "./singlePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequests";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";

function SinglePage() {

    const post = useLoaderData();
    const { data } = post;
    const [error, setError] = useState();
    const [saved, setSaved] = useState(data.isSaved);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSavePost = async () => {
        // After React 19 update to USEOPTISMISTIK HOOK
        setSaved((prev) => !prev);
        if(!currentUser) {
            navigate('/login');
        }
        try {
            
            await apiRequest.post(`/user/save`, {
                userId: currentUser.userInfo.id,
                postId: data.id,
            });
        } catch (error) {
            console.log(error);
            setError(error);
            setSaved((prev) => !prev);
        }
    }

    return (
        <div className="singlePage">
            <div className="details">
                <div className="wrapper">
                    <Slider images={data.images} />
                    <div className="info">
                        <div className="top">
                            <div className="post">
                                <h1>{data.title}</h1>
                                <div className="address">
                                    <img src="/pin.png" alt="" />
                                    <span>{data.address}</span>
                                </div>
                                <div className="price">$ {data.price}</div>
                            </div>
                            <div className="user">
                                <img src={data.user.avatar} alt="" />
                                <span>{data.user.username}</span>
                            </div>
                        </div>
                        <div className="bottom" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(data.postDetail.description)
                        }}></div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="wrapper">
                    <p className="title">General</p>
                    <div className="listVertical">
                        <div className="feature">
                            <img src="/utility.png" alt="" />
                            <div className="featureText">
                                <span>Utilities</span>
                                {
                                    data.postDetail.utilities === "owner" ?
                                    <p>Owner is responsible</p> : <p>Tenent is responsible</p>
                                }
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/pet.png" alt="" />
                            <div className="featureText">
                                <span>Pet Policy</span>
                                <p>Pets are {data.postDetail.pet}</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/fee.png" alt="" />
                            <div className="featureText">
                                <span>Property Type</span>
                                <p>{data.property}</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Sizes</p>
                    <div className="sizes">
                        <div className="size">
                            <img src="/size.png" alt="" />
                            <span>{data.postDetail.size} Sqft</span>
                        </div>
                        <div className="size">
                            <img src="/bed.png" alt="" />
                            <span>{data.beadroom} Rooms</span>
                        </div>
                        <div className="size">
                            <img src="/bath.png" alt="" />
                            <span>{data.bathroom} BathRooms</span>
                        </div>
                    </div>
                    <p className="title">Nearby Places</p>
                    <div className="listHorizontal">
                        <div className="feature">
                            <img src="/school.png" alt="" />
                            <div className="featureText">
                                <span>School</span>
                                <p>{data.postDetail.school > 999 ? data.postDetail.school / 1000 + " Km" : data.postDetail.school + " m"} away</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/pet.png" alt="" />
                            <div className="featureText">
                                <span>Bus Stop</span>
                                <p>{data.postDetail.bus > 999 ? data.postDetail.bus / 1000 + " Km" : data.postDetail.bus + " m"} away</p>
                            </div>
                        </div>
                        <div className="feature">
                            <img src="/fee.png" alt="" />
                            <div className="featureText">
                                <span>Restaurant</span>
                                <p>{data.postDetail.restaurant > 999 ? data.postDetail.restaurant / 1000 + " Km" : data.postDetail.restaurant + " m"} away</p>
                            </div>
                        </div>
                    </div>
                    <p className="title">Location</p>
                    <div className="mapContainer">
                        <Map items={[data]} />
                    </div>
                    <div className="buttons">
                        <button>
                            <img src="/chat.png" alt="" />
                            Send a Message
                        </button>
                        <button onClick={handleSavePost} style={{
                            backgroundColor: saved ? "#fece51" : "#fff",
                        }}>
                            <img src={saved ? "/bookmark.png" : "/save.png"} alt="" />
                            {saved ? "Place has been saved" : "Save the Place"}
                        </button>
                        {error && <span>{error}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SinglePage;
