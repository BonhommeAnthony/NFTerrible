import { useState } from "react";
import { ethers } from "ethers";
import { nftaddress, nftmarketaddress } from "../.config";
import NFT from "../artifacts/contracts/NTF.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
import { useRouter } from "next/dist/client/router";

import {
  Button,
  Input,
  Textarea,
  Image,
  Container,
  Heading,
  VStack,
  Progress,
  Box,
  useToast,
} from "@chakra-ui/react";

const createItemPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const [fileSize, setFileSize] = useState(null);
  const [fileprogress, setFileprogress] = useState(null);

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      setFileSize(file.size);
      const added = await client.add(file, {
        progress: (prog) => setFileprogress(prog),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      setFileSize(null);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    toast({
      title: "NFT created.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    router.push("/");
  }

  return (
    <Container justifyContent="center" px={[5, 6]} maxW="container.xl" py={4}>
      <VStack color="black" m="auto" spacing={6} maxW="600px">
        <Heading color="black" mb={8} as="h3">
          Create Nft
        </Heading>

        <Input
          bgColor="white"
          placeholder="Asset Name"
          p={4}
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />

        <Textarea
          bgColor="white"
          placeholder="Asset Description"
          p={4}
          onChange={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />
        <Input
          type="number"
          bgColor="white"
          placeholder="Asset Price in Matic"
          p={4}
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />
        <Input border="none" type="file" name="Asset" onChange={onChange} />
        {fileSize && (
          <Box w="100%">
            <Progress
              colorScheme="pink"
              hasStripe
              w="full"
              value={(fileprogress / fileSize) * 100}
            />
          </Box>
        )}
        {fileUrl && <Image rounded mt={4} width="350" src={fileUrl} />}
        <Button
          onClick={createMarket}
          fontWeight="bold"
          bg="pink.500"
          color="white"
          borderRadius="lg"
          p={4}
          boxShadow="lg"
        >
          Create Digital Asset
        </Button>
      </VStack>
    </Container>
  );
};

export default createItemPage;
