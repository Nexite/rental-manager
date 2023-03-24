import { RentalContext } from "@/components/RentalProvider";
import { RentalTableItem } from "@/components/RentalTableItem";
import { Address, Rental } from "@/lib/rental";
import { SearchType, SortType } from "@/lib/rental-manager";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
let i = 1;
export default function Home() {
  const [rentals, addRental, deleteRental, searchRental, sortRentals] = useContext(RentalContext);
  useEffect(() => {
    console.log("test");
  }, [rentals]);
  // console.log(rentals)
  const borderColor = useColorModeValue("gray.700", "whiteAlpha.300");

  return (
    <Card marginTop={"4rem"}>
      <CardHeader>
        <Heading size="md">All Rentals</Heading>
      </CardHeader>
      <CardBody padding={"0 1rem"}>
        <TableContainer>
          <Table variant="simple">
            <TableCaption>
              <Button
                onClick={() => {
                  addRental(
                    new Rental(
                      "test" + i,
                      { street: "street", city: "city", state: "WA", zip: "18923" },
                      "test",
                      "444-444-4444",
                      Math.floor(Math.random() * 100),
                      Math.floor(Math.random() * 20),
                      Math.floor(Math.random() * 20),
                      Math.floor(Math.random() * 20),
                    ),
                  );
                  i++;
                }}
              />
            </TableCaption>
            <Thead>
              <Tr borderBottom="2px" borderColor={borderColor}>
                <Th />
                <Th />
                <Th>Name</Th>
                <Th>Address</Th>
                <Th>Rent Per Month</Th>
                <Th>Monthly Costs</Th>
                <Th>Monthly Revenue</Th>
                <Th>Tennant Name</Th>
                <Th>Tennant Phone Number</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rentals.length === 0 && (
                <>
                  <Tr>
                    <Td width={"1px"} whiteSpace={"nowrap"} paddingLeft={"0"} paddingRight={"2"}>
                      <Button size={"sm"} height="2em" visibility={"hidden"}>
                        View
                      </Button>
                    </Td>
                    <Td width={"1px"} whiteSpace={"nowrap"} paddingLeft={"0"}>
                      <Button size={"sm"} height="2em" visibility={"hidden"}>
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                </>
              )}
              {rentals.map((rental, index) => (
                <RentalTableItem rental={rental} key={index} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}

export function getStaticProps() {
  return {
    props: { title: "Home" },
  };
}
