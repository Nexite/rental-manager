import { Rental } from "@/lib/rental";
import { SearchType } from "@/lib/rental-manager";
import { Button, Td, Tr, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { AddRentalModal } from "./AddRentalModal";
import { RentalContext } from "./RentalProvider";


// function for each rental item in the table
export function RentalTableItem({ rental }: { rental: Rental }) {
  const borderColor = useColorModeValue("gray.700", "whiteAlpha.300");
  const [rentals, addRental, deleteRental, searchRental, sortRentals, updateRental] =
    useContext(RentalContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AddRentalModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        rental={rental}
        onUpdate={(rentalUpdates) => {
          updateRental(rental.name, rentalUpdates, SearchType.Name);
        }}
        edit
      />
      <Tr>
        <Td whiteSpace={"nowrap"} paddingLeft={"0"} paddingRight={"2"}>
          <Button size={"sm"} height="2em" onClick={onOpen}>
            View
          </Button>
        </Td>
        <Td whiteSpace={"nowrap"} paddingLeft={"0"} borderRight={"1px"} borderColor={borderColor}>
          <Button
            size={"sm"}
            height="2em"
            onClick={() => {
              // console.log(rental.name);
              deleteRental(rental.name, SearchType.Name);
            }}
          >
            Delete
          </Button>
        </Td>
        <Td>{rental.name}</Td>
        <Td whiteSpace="pre-line">{rental.address.toString()}</Td>
        <Td>{rental.rentPerMonth}</Td>
        <Td>{rental.totalMonthlyCost}</Td>
        <Td>{rental.monthlyRevenue}</Td>
        <Td>{rental.tennantName}</Td>
        <Td paddingRight={"0"}>{rental.tennantPhoneNumber}</Td>
      </Tr>
    </>
  );
}
