import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import {
    editMyReview,
    getSelectedSpotReviews,
} from "../../../store/reviewsReducer";
import { getSpot } from "../../../store/spotsReducer";
const EditReview = ({ review, setShowModal }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { spotId } = useParams();

    const user = useSelector((state) => state.session.user);
    const reviews = useSelector((state) => state.reviews);

    const reviewsList = Object.values(reviews);

    const { ReviewId } = useParams();

    const [editReview, setEditReview] = useState("");
    const [editStars, setEditStars] = useState(0);

    const sessionUser = useSelector((state) => state.session.user);

    async function handleReviewEdit(e) {
        e.preventDefault();

        const editedReviewData = {
            review: editReview,
            stars: editStars,
        };
        console.log(editedReviewData, "YOOO");

        const updateReview = await dispatch(
            editMyReview(review.id, editedReviewData)
        );

        setShowModal(false);
        dispatch(getSelectedSpotReviews(spotId));
    }

    return (
        <>
            <div className="review-listing-form-height modal-content">
                <div className="edit-spot-container">
                    <form
                        className="edit-spot-form"
                        onSubmit={handleReviewEdit}
                    >
                        <header className="edit-spot-header">
                            Modify Review
                        </header>
                        <div className="edit-spot-input-field-container">
                            <label
                                className="edit-spot-input-field-label"
                                htmlFor="address"
                            >
                                Review
                            </label>
                            <textarea
                                className="edit-spot-form-input-review"
                                id="review"
                                type="text"
                                placeholder="Update Your Review"
                                rows={10}
                                onChange={(e) => setEditReview(e.target.value)}
                                value={editReview}
                                required
                            />
                        </div>
                        <div className="stars-spot-input-field-container">
                            <label
                                className="edit-spot-input-field-label"
                                htmlFor="stars"
                            >
                                Stars:
                            </label>
                            <input
                                className="review-stars"
                                placeholder="1-5"
                                id="stars"
                                min={1}
                                max={5}
                                type="number"
                                onChange={(e) => setEditStars(e.target.value)}
                                value={editStars}
                            />
                        </div>

                        <button className="edit-spot-form-button" type="submit">
                            Save Changes
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="cancel-spot-form-button"
                            type="submit"
                        >
                            Cancel Changes
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditReview;
