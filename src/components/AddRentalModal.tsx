import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FormEvent,
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
  FormHelperText,
} from "@chakra-ui/react";
import { Address, Rental, RentalEditParams } from "@/lib/rental";
import { mergeDeep, stateCodes } from "@/utils/misc";
import {
  KeysMatching,
  NonFunctionPublicInterfaceRecurse,
  PublicInterfaceRecurse,
  WritableProps,
  RecursivePartial,
} from "@/utils/types";

type RentalModalProps = PropsWithChildren<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  edit?: boolean;
  rental: Rental;
  // updateRental: (rental: Rental) => void;
}>;

// type atestAddressUpdates = NonFunctionPublicInterfaceRecurse<string>;
type RentalModalUpdates = WritableProps<NonFunctionPublicInterfaceRecurse<Rental>>;
export const AddRentalModal = ({
  isOpen,
  onOpen,
  onClose,
  edit,
  rental: initialRental,
}: // children,
RentalModalProps) => {
  // React cannot read property updates on class objects so when we update the rental object we need to force a re-render
  const [rentalStateUpdate, updateState] = useState<any>();
  const [rental, updateRental] = useReducer(
    (prev: Rental, updates: RecursivePartial<RentalModalUpdates> | Rental) => {
      const _address = Object.fromEntries(
        ["_street", "_city", "_state", "_zip"]
          .filter((key) => key in updates) // line can be removed to make it inclusive
          .map((key) => {
            const _update = updates[key as keyof typeof updates];
            delete updates[key as keyof typeof updates];
            return [key.replace(/^./, ""), _update];
          }),
      );
      if (Object.keys(_address).length > 0) updates.address = _address;
      if (updates.address) {
        Object.assign(prev.address, updates.address);
        delete updates.address;
      }
      mergeDeep(prev, updates);
      updateState({});
      return prev;
    },
    initialRental.clone(),
  );

  useEffect(() => {
    console.log(rental);
  }, [rentalStateUpdate]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        updateRental(initialRental.clone());
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
          <Button colorScheme={"green"}>{edit ? "Save" : "Add"}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function FormHouseInfo({
  rental,
  updateRental,
}: {
  rental: Rental;
  updateRental: Dispatch<Rental | RecursivePartial<RentalModalUpdates>>;
}) {
  function update(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
        <Input
          id={"name"}
          value={rental.name}
          onChange={update}
        />
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>Street</FormLabel>
        <Input
          id={"_street"}
          value={rental.address.street}
          onChange={update}
        />
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>City</FormLabel>
        <Input
          id={"_city"}
          value={rental.address.city}
          onChange={update}
        />
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>State</FormLabel>
        <Select
          id={"_state"}
          placeholder=""
          value={rental.address.state}
          onChange={update}
        >
          {stateCodes.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl isInvalid={rental.address.zip.length !== 5}>
        <FormLabel paddingTop={"2"}>Zip Code</FormLabel>
        <Input
          value={rental.address.zip}
          id={"_zip"}
          maxLength={5}
          onChange={(e) => {
            const newZip = e.target.value;
            if (newZip.length <= 5 && /^\d+$/.test(newZip))
              update(e);
          }}
        />
        <FormErrorMessage>Invalid Zip Code</FormErrorMessage>
      </FormControl>
    </>
  );
}
