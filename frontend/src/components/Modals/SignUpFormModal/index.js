import React from "react";
import { Modal } from "../../../context/Modal";
import SignUpForm from "../../Forms/SignupFormPage";

const SignUpFormModal = ({ showModal, setShowModal }) => {
  return (
    <>
      {showModal && (
        <Modal onClose={setShowModal}>
          <SignUpForm />
        </Modal>
      )}
    </>
  );
};

export default SignUpFormModal;
