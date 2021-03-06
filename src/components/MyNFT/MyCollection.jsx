import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import MyCollectionItem from "./MyCollectionItem";
import IsnotLogin from "./IsnotLogin";
import '../../static/css/MyCollection.css';
import '../../static/css/itemcard.css';

function MyCollection() {
    const { authenticate, Moralis, isAuthenticated } =
        useMoralis();
    const [products, setproducts] = useState([]);
    const [Loading, setLoading] = useState(true);
    const { walletAddress } = useMoralisDapp();

    useEffect(() => {
        if (!walletAddress) return;
        getNFTs().then((response) => {
            setproducts(response);
            setLoading(false);
        });
    }, [walletAddress]);

    async function getNFTs() {
        const queryNFTs = new Moralis.Query("NFTs");
        queryNFTs.equalTo("ownerOf", walletAddress);
        queryNFTs.descending("updatedAt");
        const datas = await queryNFTs.find();
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

            <IsnotLogin authenticateclick = {authenticate}>

            </IsnotLogin>
            
        );
    }

    return (
        <div class="MyColPage">
            <h2>My Colletions</h2>
   
            {Loading ? 
                      <div id="loading">
                          <div class="spinner"></div>
                          <strong>Loading...</strong>
                          </div>
                     :
                     <MyCollectionItem products={products} />
                    }

          
          
           
            
        </div>
    );
}

export default MyCollection;
