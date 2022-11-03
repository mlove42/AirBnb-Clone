import React from "react";
import { Modal } from "../../../context/Modal";
import EditListingForm from "../../Forms/EditListingForm";

const EditListingFormModal = ({
  showModal,
  setShowModal,
  addressInitialValue,
  cityInitialValue,
  stateInitialValue,
  countryInitialValue,
  latInitialValue,
  lngInitialValue,
  nameInitialValue,
  descriptionInitialValue,
  priceInitialValue,
  previewImageInitialValue,
  id,
}) => {
  return (
    <>
      {showModal && (
        <Modal onClose={setShowModal}>
          <EditListingForm
            addressInitialValue={addressInitialValue}
            cityInitialValue={cityInitialValue}
            stateInitialValue={stateInitialValue}
            countryInitialValue={countryInitialValue}
            latInitialValue={latInitialValue}
            lngInitialValue={lngInitialValue}
            nameInitialValue={nameInitialValue}
            descriptionInitialValue={descriptionInitialValue}
            priceInitialValue={priceInitialValue}
            previewImageInitialValue={previewImageInitialValue}
            id={id}
          />
        </Modal>
      )}
    </>
  );
};

export default EditListingFormModal;
