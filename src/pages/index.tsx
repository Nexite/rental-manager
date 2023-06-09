import { AddRentalModal } from "@/components/AddRentalModal";
import { RentalContext, useErrorToast } from "@/components/RentalProvider";
import { RentalTableItem } from "@/components/RentalTableItem";
import { Rental } from "@/lib/rental";
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
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { useContext } from "react";
let i = 1;
export default function Home() {
  const [rentals, addRental, deleteRental, searchRental, sortRentals] = useContext(RentalContext);
  const borderColor = useColorModeValue("gray.700", "whiteAlpha.300");

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AddRentalModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onUpdate={useErrorToast((object) => {
          const newRental = Rental.fromObject(object);
          addRental(newRental);
        })}
      />
      <Card marginTop={"4rem"}>
        <CardHeader>
          <Heading size="md">All Rentals</Heading>
        </CardHeader>
        <CardBody padding={"0 1rem"}>
          <TableContainer>
            <Table variant="unstyled">
              <TableCaption>
                <Button
                  onClick={() => {
                    onOpen();
                  }}
                  colorScheme="green"
                >
                  Add New Rental
                </Button>
              </TableCaption>
              <Thead>
                <Tr borderBottom="2px" borderColor={borderColor}>
                  <Th />
                  <Th />
                  <Th>Name</Th>
                  <Th>Address</Th>
                  <Th>Rent/Month</Th>
                  <Th>Monthly Costs</Th>
                  <Th>Monthly Revenue</Th>
                  <Th>Tennant Name</Th>
                  <Th paddingRight={"0"}>Tennant Phone</Th>
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
                  <RentalTableItem rental={rental.clone()} key={index} />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <Center>
        <Heading pt="10" size="lg">
          Total Monthly Profit:{" "}
          {rentals
            .map((rental) => rental.monthlyRevenue)
            .reduce((partialTotal, a) => partialTotal + a, 0)}
        </Heading>
      </Center>
    </>
  );
}

export function getStaticProps() {
  return {
    props: { title: "Home" },
  };
}
