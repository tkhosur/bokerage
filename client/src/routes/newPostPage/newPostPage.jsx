import { useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom"
import "react-quill/dist/quill.snow.css";
import "./newPostPage.scss";
import { apiRequest } from "../../lib/apiRequests";
import CloudinaryUploadWidget from "../../components/uploadImage/uploadImage";

function NewPostPage() {
    const [value, setValue] = useState("");
    const [error, setError] = useState();
    const [images, setImages] = useState([]);

    const navigate = useNavigate();

    const handlePostCreate = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const inputs = Object.fromEntries(formData);

        const postData = {
            title: inputs.title,
            price: parseInt(inputs.price),
            address: inputs.address,
            city: inputs.city,
            beadroom: parseInt(inputs.bedroom),
            bathroom: parseInt(inputs.bathroom),
            latitude: inputs.latitude,
            longitude: inputs.longitude,
            type: inputs.type,
            property: inputs.property
        };

        const postDetail = {
            description: value,
            utilities: inputs.utilities,
            pet: inputs.pet,
            size: parseInt(inputs.size),
            school: parseInt(inputs.school),
            bus: parseInt(inputs.bus),
            restaurant: parseInt(inputs.restaurant)
        };

        try {
            await apiRequest.post('/posts/create', {
                postData: postData,
                postDetail: postDetail,
                images: images
            });
            navigate(`/profile`);
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    return (
        <div className="newPostPage">
            <div className="formContainer">
                <h1>Add New Post</h1>
                <div className="wrapper">
                    <form onSubmit={handlePostCreate}>
                        <div className="item">
                            <label htmlFor="title">Title</label>
                            <input id="title" name="title" type="text" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="price">Price</label>
                            <input id="price" name="price" type="number" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="address">Address</label>
                            <input id="address" name="address" type="text" autoComplete="off" />
                        </div>
                        <div className="item description">
                            <label htmlFor="desc">Description</label>
                            <ReactQuill theme="snow" onChange={setValue} value={value} />
                        </div>
                        <div className="item">
                            <label htmlFor="city">City</label>
                            <input id="city" name="city" type="text" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="bedroom">Bedroom Number</label>
                            <input min={1} id="bedroom" name="bedroom" type="number" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="bathroom">Bathroom Number</label>
                            <input min={1} id="bathroom" name="bathroom" type="number" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="latitude">Latitude</label>
                            <input id="latitude" name="latitude" type="text" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="longitude">Longitude</label>
                            <input id="longitude" name="longitude" type="text" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="type">Type</label>
                            <select name="type">
                                <option value="rent" defaultChecked>
                                Rent
                                </option>
                                <option value="buy">Buy</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="type">Property</label>
                            <select name="property">
                                <option value="apartment" defaultChecked>Apartment</option>
                                <option value="house">House</option>
                                <option value="condo">Condo</option>
                                <option value="land">Land</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="utilities">Utilities Policy</label>
                            <select name="utilities">
                                <option value="owner" defaultChecked>Owner is responsible</option>
                                <option value="tenant">Tenant is responsible</option>
                                <option value="shared">Shared</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="pet">Pet Policy</label>
                            <select name="pet">
                                <option value="allowed">Allowed</option>
                                <option value="not-allowed">Not Allowed</option>
                            </select>
                        </div>
                        <div className="item">
                            <label htmlFor="size">Total Size (sqft)</label>
                            <input min={0} id="size" name="size" type="number" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="school">School</label>
                            <input min={0} id="school" name="school" type="number" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="bus">bus</label>
                            <input min={0} id="bus" name="bus" type="number" autoComplete="off" />
                        </div>
                        <div className="item">
                            <label htmlFor="restaurant">Restaurant</label>
                            <input min={0} id="restaurant" name="restaurant" type="number" autoComplete="off" />
                        </div>
                        <button className="sendButton">Add</button>
                        {error && <span>{error}</span>}
                    </form>
                </div>
            </div>
            <div className="sideContainer">
                {images.map((image, index) => (
                    <img src={image} alt="post-image" key={index} />
                ))}
                <CloudinaryUploadWidget 
                    uwConfig={{
                        multiple: true,
                        cloudName: 'dwwadwy2u',
                        uploadPreset: 'estate',
                        maxImageFileSize: 2000000,
                        folder: "posts"
                    }}
                    setState={setImages}
                />
            </div>
        </div>
    );
}

export default NewPostPage;
