import { Rental } from "@/lib/rental";
import { SearchType, SortType } from "@/lib/rental-manager";
import { Button, Td, Tr, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { PropsWithChildren, useContext } from "react";
import { AddRentalModal } from "./AddRentalModal";
import { RentalContext } from "./RentalProvider";

export function RentalTableItem({ rental }: { rental: Rental }) {
  const borderColor = useColorModeValue("gray.700", "whiteAlpha.300");
  const [rentals, addRental, deleteRental, searchRental, sortRentals] = useContext(RentalContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AddRentalModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} rental={rental} edit />
      <Tr>
        <Td width={"1px"} whiteSpace={"nowrap"} paddingLeft={"0"} paddingRight={"2"}>
          <Button
            size={"sm"}
            height="2em"
            onClick={onOpen}
          >
            View
          </Button>
        </Td>
        <Td width={"1px"} whiteSpace={"nowrap"} paddingLeft={"0"}>
          <Button
            size={"sm"}
            height="2em"
            onClick={() => {
              console.log(rental.name);
              deleteRental(rental.name, SearchType.Name);
            }}
          >
            Delete
          </Button>
        </Td>
        <Td borderLeft={"1px"} borderColor={borderColor}>
          {rental.name}
        </Td>
        <Td>{rental.address.toString()}</Td>
        <Td>{rental.rentPerMonth}</Td>
        <Td>{rental.totalMonthlyCost}</Td>
        <Td>{rental.monthlyRevenue}</Td>
        <Td>{rental.tennantName}</Td>
        <Td>{rental.tennantPhoneNumber}</Td>
      </Tr>
    </>
  );
}
