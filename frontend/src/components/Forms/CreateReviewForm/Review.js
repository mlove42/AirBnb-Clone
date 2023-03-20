import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSelectedSpot } from "../../../store/spotsReducer";
import EditReviewModal from "../../Modals/EditReviewModal";
import {
    getSelectedSpotReviews,
    deleteMyReview,
    editMyReview,
} from "../../../store/reviewsReducer";
import "./reviewcomponent.css";
const ReviewComponent = () => {
    const reviews = useSelector((state) => state.reviews?.Reviews);
    const sessionUser = useSelector((state) => state.session.user);

    const user = useSelector((state) => state.session.user);
    let userId = sessionUser && sessionUser.id;

    const dispatch = useDispatch();
    const { spotId } = useParams();

    const [actionToggled, setActionToggled] = useState();

    const reviewStore = useSelector((state) => state);

    useEffect(() => {
        dispatch(getSelectedSpotReviews(spotId));
        dispatch(getSelectedSpot(spotId));
    }, [dispatch, spotId]);

    return (
        <>
            <div className="header-review">
                <h1>Reviews</h1>
            </div>

            <div className="reviews-box-container">
                {reviews?.map((review) => (
                    <>
                        <div className="review-box">
                            <div className="box-top">
                                <div className="profile">
                                    <div className="name-user">
                                        <strong>
                                            {review?.User?.firstName}{" "}
                                            {review?.User?.lastName}
                                        </strong>
                                    </div>
                                </div>

                                <div className="review-ratings">
                                    <i>
                                        stars for
                                        {/* <Rating value={review?.rating} />{" "} */}
                                    </i>
                                </div>
                            </div>
                            <div className="comment-section">
                                <div className="client-comment">
                                    <p>{review?.review}</p>
                                </div>
                            </div>

                            <div>
                                {review?.User?.id === userId && (
                                    <>
                                        <EditReviewModal
                                            review={review}
                                            user={user}
                                        />
                                        <Link
                                            className="delete-icon fa-solid fa-trash"
                                            to={`/spots/${spotId}`}
                                            onClick={() => {
                                                dispatch(
                                                    deleteMyReview(review.id)
                                                );
                                                dispatch(
                                                    getSelectedSpotReviews(
                                                        spotId
                                                    )
                                                );
                                                setActionToggled(
                                                    (actionToggled) =>
                                                        !actionToggled
                                                );
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ))}
            </div>
        </>
    );
};

export default ReviewComponent;
