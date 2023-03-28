import {
  ChangeEvent,
  Dispatch,
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Divider,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  Rental,
  RentalObjectInterface,
  RentalUpdateParams,
} from "@/lib/rental";
import { mergeDeep, stateCodes } from "@/utils/misc";
import {
  NonFunctionPublicInterfaceRecurse,
  WritableProps,
  RecursivePartial,
} from "@/utils/types";

type RentalModalProps = PropsWithChildren<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  edit?: boolean;
  rental?: Rental;
  onUpdate?: (rental: Rental) => void;
}>;

// type atestAddressUpdates = NonFunctionPublicInterfaceRecurse<string>;
type RentalModalUpdates = WritableProps<NonFunctionPublicInterfaceRecurse<Rental>>;
export const AddRentalModal = ({
  isOpen,
  onOpen,
  onClose,
  edit,
  onUpdate = () => {},
  rental: initialRental,
}: // children,
RentalModalProps) => {
  // React cannot read property updates on class objects so when we update the rental object we need to force a re-render
  const [rentalStateUpdate, updateState] = useState<any>();
  const [rental, updateRental] = useReducer(
    (prev: RentalObjectInterface, updates: RecursivePartial<RentalObjectInterface>) => {
      const temp = mergeDeep({}, prev, updates);
      // console.log(temp);
      return temp;
    },
    { ...(initialRental?.toObject() || { address: {}} as RentalObjectInterface) },
  );
  // console.log("Rental: ", rental);

  useEffect(() => {
    // console.log(rental);
  }, [rentalStateUpdate]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        updateRental({ ...(initialRental?.toObject() || { address: {}} as RentalObjectInterface) });
        onClose();
      }}
      size={"xl"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{edit ? "View/Edit" : "Add"} Rental</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormHouseInfo rental={rental} updateRental={updateRental} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={"green"}
            onClick={() => {
              // console.log("UpdateRental: ", rental);
              onUpdate(rental);
              updateRental({ ...(initialRental?.toObject() || { address: {}} as RentalObjectInterface) });
              onClose();
              // onUpdate(Rental.fromObject(rental));
            }}
          >
            {edit ? "Save" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function FormHouseInfo({
  rental,
  updateRental,
}: {
  rental: RentalUpdateParams;
  updateRental: Dispatch<Rental | RecursivePartial<RentalModalUpdates>>;
}) {
  function update(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (e.target.id.startsWith("_")) {
      updateRental({
        address: {
          [e.target.id.replace(/^./, "")]: e.target.value,
        },
      });
      return;
    }
    updateRental({
      [e.target.id]: e.target.value,
    });
  }
  return (
    <>
      <Heading size="md">House Info</Heading>
      <Divider mb={"3"} mt={"3"} />
      <FormControl>
        <FormLabel>House Name</FormLabel>
        <Input id={"name"} value={rental.name} onChange={update} />
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>Street</FormLabel>
        <Input id={"_street"} value={rental.address.street} onChange={update} />
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>City</FormLabel>
        <Input id={"_city"} value={rental.address.city} onChange={update} />
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>State</FormLabel>
        <Select id={"_state"} placeholder="" value={rental.address.state} onChange={update}>
          {stateCodes.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl isInvalid={rental.address.zip?.length !== 5 && !!rental.address?.zip}>
        <FormLabel paddingTop={"2"}>Zip Code</FormLabel>
        <Input
          value={rental.address.zip}
          id={"_zip"}
          maxLength={5}
          onChange={(e) => {
            const newZip = e.target.value;
            if (newZip.length === 0 || (newZip.length <= 5 && /^\d+$/.test(newZip))) update(e);
          }}
        />
        <FormErrorMessage>Invalid Zip Code</FormErrorMessage>
      </FormControl>
    </>
  );
}
