import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ value, onChange, readOnly = false }) => {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <div className="star-rating" role="group" aria-label="Оценка">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    className={`star-btn${display >= star ? ' star-btn--active' : ''}`}
                    onClick={() => !readOnly && onChange(star)}
                    onMouseEnter={() => !readOnly && setHovered(star)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    disabled={readOnly}
                    aria-label={`${star} звезд`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;
