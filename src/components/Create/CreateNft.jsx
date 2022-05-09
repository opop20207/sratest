import { useState } from "react";
import { ThemeProvider } from "react-bootstrap";
import { useMoralis } from "react-moralis";
import Web3 from "web3";
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider";
import "../../static/css/Create.css";

function CreateNft() {
    const { authenticate, isAuthenticated, Moralis } = useMoralis();
    const nft_contract_address = "0x3d05364012a5f131e3a32a68deba6c23041fb917"; //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
    const web3 = new Web3(Web3.givenProvider);
    const { walletAddress } = useMoralisDapp();
    const [ preImage , setpreImage] = useState("");
    const [hoverImg , sethoverImg] = useState("visible");

    async function upload() {
        const fileInput = document.getElementById("file");
        const data = fileInput.files[0];
        const imageFile = new Moralis.File(data.name, data);
        document.getElementById("upload").setAttribute("disabled", null);
        document.getElementById("file").setAttribute("disabled", null);
        document.getElementById("name").setAttribute("disabled", null);
        document.getElementById("description").setAttribute("disabled", null);
        await imageFile.saveIPFS();

        const imageURI = imageFile.ipfs();
        const metadata = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            image: imageURI,
        };

        const metadataFile = new Moralis.File("metadata.json", {
            base64: btoa(JSON.stringify(metadata)),
        });
        await metadataFile.saveIPFS();

        const metadataURI = metadataFile.ipfs();
        const tx = await mintToken(metadataURI);

        const savedData = new Moralis.Object("NFTs");
        savedData.set("name", document.getElementById("name").value);
        savedData.set(
            "description",
            document.getElementById("description").value
        );
        savedData.set("imageURI", imageURI);
        savedData.set("ownerOf", walletAddress);
        savedData.set("createdBy", walletAddress);
        savedData.set("tx", tx);

        await savedData.save();
    }

    async function mintToken(_uri) {
        const encodedFunction = web3.eth.abi.encodeFunctionCall(
            {
                name: "mintToken",
                type: "function",
                inputs: [
                    {
                        type: "string",
                        name: "tokenURI",
                    },
                ],
            },
            [_uri]
        );

        const transactionParameters = {
            to: nft_contract_address,
            from: walletAddress,
            data: encodedFunction,
        };
        const txt = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        console.log(txt);
        return txt;
    }

    async function notify(_txt) {
        document.getElementById(
            "resultSpace"
        ).innerHTML = `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="Your NFT was minted in transaction ${_txt}">`;
    }

    function readImage(e) {
        
        const reader = new FileReader();
        const previewImage = document.getElementById("preview-image");
       
        // 이미지가 로드가 된 경우
        if(e.target.files && e.target.files[0]){
        
            reader.onload = (e) => {
          
               // previewImage.src = e.target.result;
                setpreImage(e.target.result);
                sethoverImg("hidden")
            };
            // reader가 이미지 읽도록 하기
            reader.readAsDataURL(e.target.files[0]);
        }
        else{
            previewImage.src = "";
        }
    }
    // input file에 change 이벤트 부여

    if (!isAuthenticated) {
        return (
            <div>
                <h1>로그인부터하셈 ㅋㅋ</h1>
                <button onClick={() => authenticate()}>Connect MetaMask</button>
            </div>
        );
    }

    function hoverInenvet () {
       if( preImage !=""){ sethoverImg("visible")}
    }
    function hoverOutenvet () {
       if(preImage != "") { sethoverImg("hidden") }
    }

    return (
        <>
            <h1>Mint NFT</h1>

            <div class="mb-3">
                <div class="form-group">
                   
                   <div className="imgcontent">
                      
                        <div class="input-group mb-3">
                            <input
                                type="file"
                                name="file"
                                id="file"
                                class="inputfile"
                                onChange={readImage}
                            /> 
                            <label className="wrap_preview" for="file"  onMouseOver={ () => hoverInenvet()} onMouseOut = { () => hoverOutenvet()}>
                                
                                <div className="preview_image">
                                { preImage != "" ?  <img  id="preview-image" src = { preImage} /> :  "" }
                                </div>
                         
                                <div className="default_image">

                                <img style ={{visibility: hoverImg }} src = {process.env.PUBLIC_URL + '/imgs/picture_icon.png'}/>
                             
                               
                                </div>
                              
                            </label>
                           
                        </div>
                   </div>
                   
                    <div className="inputContent">
                        <div class="input-group mb-3">
                            <input
                                id="name"
                                type="text"
                                class="form-control"
                                placeholder="NFT Name"
                                aria-label="URL"
                                aria-describedby="basic-addon1"
                            />
                        </div>
                        <div class="input-group mb-3">
                            <input
                                id="description"
                                type="text"
                                class="form-control"
                                placeholder="Description"
                                aria-label="URL"
                                aria-describedby="basic-addon1"
                            />
                        </div>
                    </div>
                  
                </div>
                <div>
                    <button
                        class="btn btn-primary"
                        id="upload"
                        onClick={upload}
                       >
                        Upload and Mint
                    </button>
                </div>

                <div class="input-group mb-3" id="resultSpace"></div>
            </div>
        </>
    );
}

export default CreateNft;
