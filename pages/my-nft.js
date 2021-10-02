import { Container, Heading, SimpleGrid, Text, Flex } from "@chakra-ui/layout";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../.config";

import NFT from "../artifacts/contracts/NTF.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { Image } from "@chakra-ui/image";
import { Button } from "@chakra-ui/button";

const MyNft = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <Container justifyContent="center" px={[5, 6]} maxW="container.xl" py={4}>
        <Heading as="h3">No assets owned</Heading>
      </Container>
    );
  return (
    <Container justifyContent="center" px={[5, 6]} maxW="container.xl" py={4}>
      <Heading mb={8} as="h3">
        My Nft
      </Heading>
      <SimpleGrid columns={[1, 3]} spacing={10}>
        {nfts.map((nft, i) => {
          console.log(nft);
          console.log(nft.name);
          return (
            <Flex
              key={i}
              bg="white"
              backdropBlur="blur(64px)"
              // overflow="hidden"
              direction="column"
              fontSize="13px"
              borderRadius="lg"
              boxShadow="xl"
              key={i}
              color="white"
            >
              <Flex className="item-zoom" direction="column">
                <Image
                  overflow="hidden"
                  objectFit="cover"
                  h="400px"
                  borderTopRadius="lg"
                  src={nft.image}
                />
              </Flex>

              <Flex borderBottomRadius="lg" direction="column" p={4} bg="black">
                <Text fontSize="2xl" mb={4} fontWeight="bold" color="white">
                  {nft.price} Matic
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default MyNft;
