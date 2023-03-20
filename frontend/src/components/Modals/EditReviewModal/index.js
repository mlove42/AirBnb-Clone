import EditReview from "../../Forms/EditReviewForm";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Modal } from "../../../context/Modal";

const EditReviewModal = ({ review, user }) => {
    const [showModal, setShowModal] = useState(false);
    const [editState, setEditState] = useState(false);
    const [reviewId, setReviewId] = useState("");
    const { spotId } = useParams();

    let modal;
    if (!user || user.id !== review.userId) {
        modal = null;
    } else {
        modal = (
            <>
                <Link
                    className="delete-icon fa-solid fa-pen-to-square"
                    to={`/spots/${spotId}`}
                    onClick={() => {
                        setShowModal(true);
                    }}
                />
                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <EditReview
                            review={review}
                            user={user}
                            setShowModal={setShowModal}
                        />
                    </Modal>
                )}
            </>
        );
    }

    return <>{modal}</>;
};

export default EditReviewModal;
