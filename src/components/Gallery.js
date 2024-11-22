import React from "react";
import "./Gallery.css";

const Gallery = ({ photos }) => {
    return (
        <div className="gallery">
            {photos.map((photo) => (
                <div key={photo.id} className="gallery-item">
                    <img
                        src={photo.urls.small}
                        alt={photo.alt_description || `Photo by ${photo.user.name}`}
                        loading="lazy"
                    />
                    <div className="caption">
                        <p>{photo.user.name}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Gallery;
