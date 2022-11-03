import React from "react";
import { Modal } from "../../../context/Modal";
import LoginForm from "../../Forms/LoginFormPage";

const LoginFormModal = ({ showModal, setShowModal }) => {
  return (
    <>
      {showModal && (
        <Modal onClose={setShowModal}>
          <LoginForm />
        </Modal>
      )}
    </>
  );
};

export default LoginFormModal;
