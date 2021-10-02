import { Heading, Text, Button, Flex, Stack, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiPlus, FiGithub } from "react-icons/fi";

const Hero = () => {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push("/create-nft");
  };
  return (
    <>
      <VStack mb="80px" alignItems="flex-start" spacing={[12, 14]}>
        <Heading
          w={["100%", "60%"]}
          color="white"
          fontSize={["3xl", "5xl"]}
          as="h3"
        >
          Create, Collect and Sell NFT on the Polygon Sidechain easily.
        </Heading>
        <Text
          lineHeight="2rem"
          w={["100%", "40%"]}
          fontWeight="bold"
          fontSize="17px"
          color="pink.500"
        >
          MarketPlace on the Mumbai Polygon testnet.
        </Text>

        <Stack w="full" direction={["column", "row"]} spacing={4}>
          <Button
            onClick={handleClick}
            borderRadius="lg"
            boxShadow="xl"
            py={7}
            fontWeight="bold"
            bgColor="black"
            leftIcon={<FiPlus />}
          >
            Create NFT
          </Button>

          <Button
            onClick={() =>
              router.push("https://github.com/BonhommeAnthony/kickstartchain")
            }
            borderRadius="lg"
            boxShadow="xl"
            py={7}
            colorScheme="pink"
            leftIcon={<FiGithub />}
          >
            Github repo
          </Button>
        </Stack>
      </VStack>
    </>
  );
};

export default Hero;
