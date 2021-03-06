import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../static/css/itemcard.css";
import SkinView3d from "../../hooks/SkinView3d";
import axios from "axios";

async function MarketPlaceItem(props) {
    // function Hoverevent(event){
    //     event.target.style.transform="translateY( -5px)"
    // }
    // function HoverOutevent(event){
    //     event.target.style.transform="translateY( 5px)"
    // }
    const renderItems = () =>
        props.products &&
        props.products.map((product) => (
            <div key={product.id} className="Card">
                <NavLink
                    to={`/MarketPlace/${product.id}`}
                    style={{ textDecoration: "none" }}>
                       
                    <div className="imgContent">
                        
                        {/*console.log(
                                axios.get("/api/ipfs", {
                                    params: {
                                        imageURI: product.imageURI,
                                    },
                                }).then((response) => response.data.imageBase64)
                            )}
                        <img src = {axios.get("/api/ipfs", {
                                    params: {
                                        imageURI: product.imageURI,
                                    },
                                }).then((response) => response.data.imageBase64)}/>*/}
                        <SkinView3d imgLink={product.imageURI} /> 
                    </div>

                    <div className="cardContent">
                        <p id="title">{product.name}</p>

                        <div className="alignContent">
                            <img
                                style={{ width: "20px", height: "20px" }}
                                src={
                                    process.env.PUBLIC_URL +
                                    "/imgs/ethereum_icon.png"
                                }
                            />
                            <p id="price">{product.price} Eth</p>
                        </div>
                    </div>
                </NavLink>
            </div>
        ));

    return <div className="card-wrapper">{renderItems()}</div>;
}

export default MarketPlaceItem;
