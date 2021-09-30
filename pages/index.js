import {
  Flex,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Text,
  Button,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../.config";

import NFT from "../artifacts/contracts/NTF.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNfts();
  }, []);

  const loadNfts = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  };

  const buyNft = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNfts();
  };

  if (loadingState === "loaded" && !nfts.length)
    return (
      <Container justifyContent="center" px={[5, 6]} maxW="container.xl" py={4}>
        <Heading> No Items in marketplace</Heading>
      </Container>
    );

  return (
    <Container justifyContent="center" px={[5, 6]} maxW="container.xl" py={4}>
      <SimpleGrid columns={[1, 4]} spacing={10}>
        {nfts.map((nft, i) => (
          <Flex key={i} boxShadow="md" borderRadius="xl" overflow="hidden">
            <Image src={nft.image} />
            <Flex p={4}>
              <Text h="64px" fontSize="xl" fontWeight="semibold">
                {nft.name}
              </Text>
              <Flex h="70px" overflow="hidden">
                <Text color="gray.400">{nft.name}</Text>
              </Flex>
            </Flex>
            <Flex p={4} bg="black">
              <Text fontSize="xl" mb={4} fontWeight="bold" color="white">
                {nft.price} Matic
              </Text>
              <Button
                w="full"
                bgColor="pink.400"
                color="white"
                fontWeight="bold"
                py={2}
                px={12}
                rounded
                onClick={() => buyNft(nft)}
              >
                Buy
              </Button>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>
    </Container>
  );
}
