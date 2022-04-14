import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import Web3 from "web3";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import ItemCollection from "./ItemColletion";
function MyCollection() {
    const { authenticate, Moralis, isAuthenticated, user, refetchUserData } =
        useMoralis();
    const [products, setproducts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const { walletAddress } = useMoralisDapp();

    useEffect(() => {
        if (!walletAddress) return;
        getNFTs().then((response) => {
            console.log("FROM");
            setproducts(response);
            console.log(response);
            products.map((product, index) => (
                <div key={index} href="/MyCollection/">
                    <img src={product.imageURI} />
                    <div id="content">
                        <p id="title">{product.name}</p>
                        <div id="aligncontent">
                            <p id="price">{product.description}</p>
                        </div>
                    </div>
                </div>
            ));
            console.log(products);
            console.log("FROMED");
            setLoading(false);
        });
    }, [walletAddress]);

    async function getNFTs() {
        const queryNFTs = new Moralis.Query("NFTs");
        queryNFTs.equalTo("ownerOf", walletAddress);
        queryNFTs.ascending("updatedAt");
        const datas = await queryNFTs.find();
        console.log(datas);
        let dataFormedArray = [];
        for (let i = 0; i < datas.length; i++) {
            const dataFormed = {
                id: datas[i].id,
                name: datas[i].get("name"),
                description: datas[i].get("description"),
                imageURI: datas[i].get("imageURI"),
                ownerOf: datas[i].get("ownerOf"),
            };
            dataFormedArray.push(dataFormed);
        }
        return dataFormedArray;
    }

    if (!isAuthenticated) {
        return (
            <div>
                <h1>로그인부터하셈 ㅋㅋ</h1>
                <button onClick={() => authenticate()}>Connect MetaMask</button>
            </div>
        );
    }

    return (
        <div class="temp">
            <p>MyCollecion</p>
            {Loading ? <strong>Loading...</strong> : null}
            <div id="NFTLists" class="container">
                <ItemCollection products={products} />
            </div>
        </div>
    );
}

export default MyCollection;
