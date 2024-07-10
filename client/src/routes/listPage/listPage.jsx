import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {

    const data = useLoaderData();

    return (
        <div className="listPage">
            <div className="listContainer">
                <div className="wrapper">
                    <Filter/>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Await
                            resolve={data.postResponse}
                            errorElement={<p>Error on Loadin the Posts...</p>}
                        >
                            {(postResponse) => postResponse.data.data.map((post) => (
                                <Card key={post.id} item={post} />
                            ))}
                        </Await>
                    </Suspense>
                </div>
            </div>
            <div className="mapContainer">
                <Suspense fallback={<p>Loading...</p>}>
                    <Await
                        resolve={data.postResponse}
                        errorElement={<p>Error on Loading the Map...</p>}
                    >
                        {(postResponse) => <Map items={postResponse.data.data}/>}
                    </Await>
                </Suspense>
            </div>
        </div>
    );
}

export default ListPage;
