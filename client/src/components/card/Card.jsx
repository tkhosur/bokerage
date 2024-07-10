import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item }) {

    const handleOpenNewChat = async (reciverId) => {
        console.log(reciverId);
        // try {
        //     await apiRequest.post('/chats', {
        //         reciverId: reciverId
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
    }

    return (
        <div className="card">
            <Link to={`/${item.id}`} className="imageContainer">
                <img src={item.images[0].url} alt="" />
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/${item.id}`}>{item.title}</Link>
                </h2>
                <p className="address">
                    <img src="/pin.png" alt="" />
                    <span>{item.address}</span>
                </p>
                <p className="price">$ {item.price}</p>
                <div className="bottom">
                    <div className="features">
                        <div className="feature">
                            <img src="/bed.png" alt="" />
                            <span>{item.bedroom} bedroom</span>
                        </div>
                        <div className="feature">
                            <img src="/bath.png" alt="" />
                            <span>{item.bathroom} bathroom</span>
                        </div>
                    </div>
                    <div className="icons">
                        <div className="icon">
                            <img src="/save.png" alt="" />
                        </div>
                        <div className="icon" onClick={() => handleOpenNewChat(item)}>
                            <img src="/chat.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
