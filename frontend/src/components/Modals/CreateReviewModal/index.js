import React from "react";
import { Modal } from "../../../context/Modal";
import CreateReview from "../../Forms/CreateReviewForm/index";
import { useState } from "react";

const ReviewModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                className="review-button"
                onClick={() => setShowModal(true)}
            >
                Write a Review
            </button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <CreateReview setShowModal={setShowModal} />
                </Modal>
            )}
        </>
    );
};

export default ReviewModal;
