import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
    addNewReview,
    getSelectedSpotReviews,
} from "../../../store/reviewsReducer";
import "./index.css";
const CreateAReview = ({ setShowModal }) => {
    const dispatch = useDispatch();

    const { spotId } = useParams();

    const user = useSelector((state) => state.session.user);
    const reviews = useSelector((state) => state.reviews);

    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);

    const sessionUser = useSelector((state) => state.session.user);
    let userId = sessionUser && sessionUser.id;

    async function onSubmit(e) {
        e.preventDefault();

        const reviewData = {
            userId,
            review,
            stars,
        };

        await dispatch(addNewReview(spotId, reviewData));

        setShowModal(false);
        dispatch(getSelectedSpotReviews(spotId));
    }
    return (
        <>
            <div className="review-listing-form-height modal-content">
                <div className="edit-spot-container">
                    <form className="edit-spot-form" onSubmit={onSubmit}>
                        <header className="edit-spot-header">
                            Leave A Review
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
                                placeholder="Write a Review"
                                rows={10}
                                onChange={(e) => setReview(e.target.value)}
                                value={review}
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
                                onChange={(e) => setStars(e.target.value)}
                                value={stars}
                                required
                            />
                        </div>

                        <button className="edit-spot-form-button" type="submit">
                            Create Review
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateAReview;
