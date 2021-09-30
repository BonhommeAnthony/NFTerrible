import React, { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import { FiPlus, FiMenu } from "react-icons/fi";
import {
  Flex,
  Heading,
  Icon,
  HStack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";

const Navbar = ({ handleClick }) => {
  const [navBackground, setNavBackground] = useState(false);

  const navRef = React.useRef();
  navRef.current = navBackground;

  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 0;
      show ? setNavBackground(true) : setNavBackground(false);
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const NavItem = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Sell NFT",
      href: "/create-item",
    },
    {
      name: "My NFT",
      href: "/my-assets",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
    },
  ];

  return (
    <Flex
      zIndex="5"
      bgColor={navBackground == true ? "whiteAlpha.900" : ""}
      w="100%"
      pos="fixed"
      top="0"
      justify="center"
      justifyContent="space-between"
      align="center"
      height={16}
      px={6}
      borderBottom="1px"
    >
      <Flex
        m="auto"
        justifyContent="space-between"
        w="container.xl"
        align="center"
      >
        <Link href="/">
          <Flex cursor="pointer">
            <Icon as={FaEthereum} w={6} h={6} />
            <Heading size="md" as="h2">
              NFTerrible
            </Heading>
          </Flex>
        </Link>
        <Flex display={["none", "none", "flex"]}>
          <HStack spacing={8}>
            {NavItem.map((item, i) => (
              <Link key={i} href={item.href}>
                <Text fontWeight="bold" cursor="pointer">
                  {item.name}
                </Text>
              </Link>
            ))}
          </HStack>
        </Flex>

        <Menu autoSelect={false}>
          <MenuButton display={["flex", "flex", "none", "none"]}>
            <IconButton colorScheme="blue" icon={<FiMenu />} />
          </MenuButton>
          <MenuList color="blue.500" w="100%" backgroundColor="whiteAlpha.900">
            {NavItem.map((item, i) => (
              <MenuItem key={i}>
                <Link href={item.href}>
                  <Text fontWeight="bold" cursor="pointer">
                    {item.name}
                  </Text>
                </Link>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
