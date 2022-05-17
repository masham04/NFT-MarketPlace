import React, { useEffect, useState } from "react";
import Web3 from "web3";
import abiBTD from "../../abi/BuyTheDipNFT.json";
import abiBTDStaking from "../../abi/DipStaking.json";
import Contract from "web3-eth-contract";
import { encode, decode } from "js-base64";
import { SingleNFT } from "./SingleNFT";
// npm install --save js-base64

const initialData = {
  pre_heading: "My NFTs",
  heading: "Staking",
  btnText: "View All",
};

const buyTheDipAddress = "0x5cf87D677FC068be8E0329825C44168A6c51a3F1";
const dipStakingAddress = "0x705A18c726c53114f9A0FDACe1D53CFf85725002";
//let ENDPOINT_ETH = "https://rinkeby.infura.io/v3/415d8f8ad8bf4a179cabd397a48d08ce";
//let ENDPOINT_ETH="https://rinkeby.infura.io/v3/415d8f8ad8bf4a179cabd397a48d08ce";
//let ENDPOINT_MAINNET_ETH="https://speedy-nodes-nyc.moralis.io/fdb0fa9dd36e9d32bea0738f/eth/rinkeby";
//let ENDPOINT_TESTNET_ROPSTEN_ETH="https://speedy-nodes-nyc.moralis.io/fdb0fa9dd36e9d32bea0738f/eth/ropsten";
//let ENDPOINT_TESTNET_BSC="https://speedy-nodes-nyc.moralis.io/fdb0fa9dd36e9d32bea0738f/bsc/testnet";
//let ENDPOINT_MAINNET_BSC="https://speedy-nodes-nyc.moralis.io/fdb0fa9dd36e9d32bea0738f/bsc/mainnet";
let ENDPOINT_WSS_ETH_TESTNET =
  "wss://speedy-nodes-nyc.moralis.io/fdb0fa9dd36e9d32bea0738f/eth/rinkeby/ws";
//let ENDPOINT_WSS_BSC_TESTNET="wss://speedy-nodes-nyc.moralis.io/fdb0fa9dd36e9d32bea0738f/bsc/testnet/ws";

Contract.setProvider(ENDPOINT_WSS_ETH_TESTNET);
let web3 = new Web3();

// getAllNFTsByPreviousOwner

var dicNFT = {};

const MyNFTs = ({ props }) => {
  const [initData, setInitData] = useState(initialData);
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllNFTsByPreviousOwner();
//   populateData([0, 1, 2, 3, 4, 5]);

  }, [props.account]); //


  web3 = new Web3(props.web3Modal.connect());
  web3.setProvider(window.ethereum);

  const contract = new web3.eth.Contract(abiBTD, buyTheDipAddress);
  const stakingContract = new web3.eth.Contract(abiBTDStaking, dipStakingAddress);

  const getTokenInfo = async (_id) => {
    return contract.methods
      .tokenURI(_id)
      .call({ from: props.account })
      .then((info) => {
        dicNFT[_id] = info;
      });
  };

  const populateData = async (array) => {
    let arrayData = [];

    for (var i = 0; i < array.length; i++) {
      let pattern = {
        id: "1",
        img: "/img/image.png",
        date: "2021-12-09",
        title: "Virtual Worlds",
        seller_thumb: "/img/avatar_1.jpg",
        seller: "@Richard",
        price: "1.5 BNB",
        count: "1 of 1",
      };

      let _id = parseInt(array[i]);
      await getTokenInfo(_id); // todo wait for completion
      if (_id in dicNFT) {
        let encoded = dicNFT[_id].split("data:application/json;base64,")[1];
        let metadata = JSON.parse(decode(encoded));
        let image = metadata["image"];
        pattern.img = image;
        pattern.id = _id;
        pattern.seller = "Coming Soon"; // props.account;
        pattern.strikePrice = metadata["attributes"][1]["value"];
        //            pattern.id = metadata["attributes"];
        pattern.seller_thumb = image;
        pattern.title = "Token Number: "  + _id;
        pattern.description = metadata["description"];
        pattern.asset = "Ether";
        pattern.blockchain = "Ethereum";

        arrayData.push(pattern);
      } else {
        console.log("_id not in dictionary", _id, "delaying.");
      }
    }
    await setData(arrayData);
  };

  const getAllNFTsByPreviousOwner = async () => {
    console.log("In getAllNFTsByPreviousOwner");
    if (!props.account) return;
    console.log("props.account: ", props.account);
    stakingContract.methods
      .getAllNFTsByPreviousOwner(props.account)
      .call({ from: props.account })
      .then((NFTArray) => {
        console.log("MY STAKED TOKENS ARAY:", NFTArray);
        populateData(NFTArray);
      });
    console.log("Out getAllNFTsByPreviousOwner");
  };

  return (
    <section id="mystakednfts" className="live-auctions-area">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {/* Intro */}
            <div className="intro d-flex justify-content-between align-items-end m-0">
              <div className="intro-content">
                <span>{initData.pre_heading}</span>
                <h3 className="mt-3 mb-0">{initData.heading}</h3>
              </div>
{/* View All button
              <div className="intro-btn">
                <a className="btn content-btn" href="/auctions">
                  {initData.btnText}
                </a>
              </div>
*/}
            </div>
          </div>
        </div>
        <div className="auctions-slides">
          <div className="swiper-container slider-mid items">
            {/* <div className="swiper-wrapper"> */}
            {/* Single Slide */}
            {/* {console.log("data", data)} */}
            <SingleNFT data={data} />
            {/* </div> */}
            <div className="swiper-pagination" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyNFTs;
