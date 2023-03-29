import { ChangeEvent, Dispatch, PropsWithChildren, useEffect, useReducer, useState } from "react";

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
import { Rental, RentalObjectInterface, RentalUpdateParams } from "@/lib/rental";
import { mergeDeep, stateCodes } from "@/utils/misc";
import { NonFunctionPublicInterfaceRecurse, WritableProps, RecursivePartial } from "@/utils/types";

type RentalModalProps = PropsWithChildren<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  edit?: boolean;
  rental?: Rental;
  onUpdate?: (rental: Rental) => void;
}>;

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
  const [rental, updateRental] = useReducer(
    (
      prev: RentalObjectInterface,
      updates: RecursivePartial<RentalObjectInterface> & { reset?: Boolean },
    ) => {
      if (updates.reset) return updates;

      const temp = mergeDeep({}, prev, updates);
      return temp;
    },
    {
      ...(initialRental?.toObject() ||
        ({ address: {}, reset: true } as RecursivePartial<RentalObjectInterface> & {
          reset?: Boolean;
        })),
    },
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        updateRental({
          ...(initialRental?.toObject() ||
            ({ address: {}, reset: true } as RecursivePartial<RentalObjectInterface> & {
              reset?: Boolean;
            })),
        });
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
          <Divider mb={"3"} mt={"3"} />
          <FormTennantInfo rental={rental} updateRental={updateRental} />
          <Divider mb={"3"} mt={"3"} />
          <FormFinanceInfo rental={rental} updateRental={updateRental} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme={"green"}
            onClick={() => {
              // updateRental({ address: {} } as RentalObjectInterface);
              onUpdate(rental);
              updateRental({
                ...(initialRental?.toObject() ||
                  ({ address: {}, reset: true } as RecursivePartial<RentalObjectInterface> & {
                    reset?: Boolean;
                  })),
              });
              onClose();
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
      <FormControl isInvalid={!!!rental.name}>
        <FormLabel>House Name</FormLabel>
        <Input id={"name"} value={rental.name} onChange={update} />
        <FormErrorMessage>Please enter a name</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!!rental.address.street}>
        <FormLabel paddingTop={"2"}>Street</FormLabel>
        <Input id={"_street"} value={rental.address.street} onChange={update} />
        <FormErrorMessage>Please enter a street</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!!rental.address.city}>
        <FormLabel paddingTop={"2"}>City</FormLabel>
        <Input id={"_city"} value={rental.address.city} onChange={update} />
        <FormErrorMessage>Please enter a city</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!stateCodes.includes(rental.address.state)}>
        <FormLabel paddingTop={"2"}>State</FormLabel>
        <Select id={"_state"} placeholder="" value={rental.address.state} onChange={update}>
          <option />
          {stateCodes.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
        <FormErrorMessage>Please select a state</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={
          !rental.address.zip || (rental.address.zip?.length !== 5 && !!rental.address?.zip)
        }
      >
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
        <FormErrorMessage>Invalid zip code</FormErrorMessage>
      </FormControl>
    </>
  );
}

function FormTennantInfo({
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
      <Heading size="md">Tennant Info</Heading>
      <Divider mb={"3"} mt={"3"} />
      <FormControl isInvalid={!!!rental.tennantName}>
        <FormLabel>Tennant Name</FormLabel>
        <Input id={"tennantName"} value={rental.tennantName} onChange={update} />
        <FormErrorMessage>Please enter a tennant name</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!!rental.tennantPhoneNumber}>
        <FormLabel paddingTop={"2"}>Phone Number</FormLabel>
        <Input id={"tennantPhoneNumber"} value={rental.tennantPhoneNumber} onChange={update} />
        <FormErrorMessage>Please enter a phone number</FormErrorMessage>
      </FormControl>
    </>
  );
}

function FormFinanceInfo({
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
      <Heading size="md">Finance Info</Heading>
      <Divider mb={"3"} mt={"3"} />
      <FormControl>
        <FormLabel>Rent Per Month</FormLabel>
        <Input
          id={"rentPerMonth"}
          value={rental.rentPerMonth}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length === 0 || /^\d+$/.test(newValue)) update(e);
          }}
        />
        <FormErrorMessage>Please enter rent per month</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>Monthly Moragage</FormLabel>
        <Input
          id={"moragagePerMonth"}
          value={rental.moragagePerMonth}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length === 0 || /^\d+$/.test(newValue)) update(e);
          }}
        />
        <FormErrorMessage>Please enter moragage</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>Monthly Maitinence</FormLabel>
        <Input
          id={"maintencePerMonth"}
          value={rental.maintencePerMonth}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length === 0 || /^\d+$/.test(newValue)) update(e);
          }}
        />
        <FormErrorMessage>Please enter maitinence per month</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel paddingTop={"2"}>Monthly Misc Cost</FormLabel>
        <Input
          id={"miscPerMonth"}
          value={rental.miscPerMonth}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue.length === 0 || /^\d+$/.test(newValue)) update(e);
          }}
        />
        <FormErrorMessage>Please enter monthly miscellaneous</FormErrorMessage>
      </FormControl>
    </>
  );
}
