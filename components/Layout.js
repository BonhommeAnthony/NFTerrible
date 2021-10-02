import { Flex } from "@chakra-ui/react";
import React from "react";
import Head from "next/head";
import { Box, Divider, HStack, Text } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiLinkedin, FiGithub, FiInstagram } from "react-icons/fi";
import Link from "next/link";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const router = useRouter();

  const logos = [
    {
      name: FiLinkedin,
      link: "https://www.linkedin.com/in/anthony-bonhomme-1a9a2519b/",
    },
    {
      name: FiGithub,
      link: "https://github.com/BonhommeAnthony",
    },
    {
      name: FiInstagram,
      link: "https://www.instagram.com/bonhommeanthony/",
    },
  ];

  const handleClick = (e) => {
    e.preventDefault();
    router.push("/campaigns/new");
  };

  return (
    <Flex
      bgGradient="background-color: #8EC5FC;
    background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
    "
      minHeight="100vh"
      justify="center"
      flexDir="column"
      m="auto"
      color="white"
    >
      <Head>
        <title>NFTerrible</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar handleClick={handleClick} />
      <Flex my={[20, "150px"]} direction="column">
        {children}
      </Flex>
      <Divider />
      <Flex
        py={10}
        align="center"
        w="100%"
        color="black"
        direction="column"
        px={6}
        justifyContent="space-between"
        textAlign="center"
      >
        <Text fontWeight="bold" fontSize="sm">
          Proudly made with
          <Box as="span" mr={2}>
            ❤️
          </Box>
          by{" "}
          <Link href="https://bonhommeanthony.com/">
            <Box cursor="pointer" as="span" color="black">
              Bonhomme Anthony
            </Box>
          </Link>
        </Text>
        <HStack spacing={8} my={8}>
          {logos.map((logo, i) => (
            <Link href={logo.link} key={i}>
              <Icon cursor="pointer" as={logo.name} />
            </Link>
          ))}
        </HStack>
        <Link href="https://vercel.com/">
          <Flex
            cursor="pointer"
            borderRadius="md"
            p="8px 16px"
            backgroundColor="black"
            fontWeight="bold"
            color="white"
          >
            Deployed by ▲ Vercel
          </Flex>
        </Link>
        <Link href="https://chakra-ui.com/">
          <Flex
            color="white"
            cursor="pointer"
            mt={4}
            fontWeight="bold"
            borderRadius="md"
            p="8px 16px"
            backgroundColor="teal"
          >
            Created with Chakra UI
          </Flex>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Layout;
