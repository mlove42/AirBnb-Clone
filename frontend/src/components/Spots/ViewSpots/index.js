import React, { useState, useEffect } from "react";
import "./index.css";
import EditReviewModal from "../../Modals/EditReviewModal";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReviewModal from "../../Modals/CreateReviewModal";
import ReviewComponent from "../../Forms/CreateReviewForm/Review";
import {
    addNewReview,
    getSelectedSpotReviews,
    deleteMyReview,
    editMyReview,
} from "../../../store/reviewsReducer";
import { getSelectedSpot } from "../../../store/spotsReducer";
import EditReview from "../../Forms/EditReviewForm";
import { Modal } from "../../../context/Modal";

const ViewSpots = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const spot = useSelector((state) => state.spotsState);
    const reviews = useSelector((state) => state.reviews?.Reviews);
    const test = useSelector((state) => state.reviews);
    const sessionUser = useSelector((state) => state.session.user);

    let userId = sessionUser && sessionUser.id;
    // console.log("Spot", spot);
    // const spotImg = localStorage.getItem("selectedSpotUrl");
    const history = useHistory();
    // console.log("location", location);
    const [review, setReview] = useState("");
    const [stars, setStars] = useState("");
    const [editReview, setEditReview] = useState("");
    const [editStars, setEditStars] = useState(0);
    const [actionToggled, setActionToggled] = useState();
    const [editState, setEditState] = useState(false);
    const [reviewId, setReviewId] = useState("");
    const [errors, setErrors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [BigReviewId, setBigReviewId] = useState("");

    // console.log("spot", location.pathname.length);
    //check if the location has data and the the path has data, then return the string which will be the spotId
    const spotId = location?.pathname?.substring(7, location.pathname.length);
    // console.log(spotId)
    // let rating2Decimal = spot.avgStarRating;
    // console.log("test", addNewReview);
    const spotReviews = useSelector((state) => state.reviews.Reviews);

    // console.log(spotReviews, "SPOT REVIEWS");
    // console.log(sessionUser.id, "SESSION UNION");
    //   const comments = useSelector((state) => {
    //     return Object.values(state.comment);
    // });

    const userReview = spotReviews?.filter(
        (review) => review?.userId === sessionUser?.id
    );
    // console.log(userReview, "USER REVIEW");
    // console.log(userReview, "USER REVIEW");
    const handleSubmit = (e) => {
        e.preventDefault();
        const reviewData = {
            userId,
            review,
            stars,
        };
        setReview("");
        setStars("");
        {
            // thunks always take in the same arguments as when we create the thunk
            dispatch(addNewReview(spotId, reviewData));
        }
    };

    const handleReviewEdit = (e) => {
        e.preventDefault();

        const editedReviewData = {
            review: editReview,
            stars: editStars,
            id: BigReviewId,
        };

        {
            dispatch(editMyReview(BigReviewId, editedReviewData));
            setEditState((editState) => !editState);
            setActionToggled((actionToggled) => !actionToggled);
        }
    };

    useEffect(() => {
        dispatch(getSelectedSpotReviews(spotId));
        dispatch(getSelectedSpot(spotId));
    }, [dispatch, actionToggled, errors]);

    const user = useSelector((state) => state.session.user);

    let ownerId = spot.ownerId;
    // console.log(spot.ownerId)

    return (
        <>
            <div className="spot-detail-main">
                <div className="spot-section">
                    <div className="spot-name">
                        <h1>{spot?.name}</h1>
                    </div>
                    <div className="spot-description">
                        <div>
                            <strong>Location: </strong> {spot?.city},{" "}
                            {spot?.state}
                        </div>
                    </div>

                    <div className="spot-header-image">
                        <img src={spot.previewImage} alt={spot.name} />
                    </div>
                </div>
                <div className="review-section">
                    <div className="review-header">
                        {userId !== ownerId &&
                        userReview?.length === 0 &&
                        sessionUser?.username ? (
                            <ReviewModal />
                        ) : (
                            ""
                        )}
                    </div>

                    <div className="user-review">
                        {sessionUser?.username ? (
                            <>
                                {showModal && (
                                    <Modal onClose={() => setShowModal(false)}>
                                        <EditReview
                                            review={review}
                                            setShowModal={setShowModal}
                                        />
                                    </Modal>
                                )}
                            </>
                        ) : (
                            <div>
                                <div>
                                    <div>Please log in to submit a review.</div>
                                    <div className="login-button">
                                        <button
                                            className="header-login-button"
                                            onClick={() =>
                                                history.push("/login")
                                            }
                                        >
                                            Log In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <ReviewComponent />
                </div>
            </div>
        </>
    );
};

export default ViewSpots;
