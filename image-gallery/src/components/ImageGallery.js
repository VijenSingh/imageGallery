import React, { useEffect, useState } from "react";
import "./ImageGallery.css";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
    setModalOpen(false);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    fetch("https://picsum.photos/v2/list?limit=100")
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const imagesToLoad = document.querySelectorAll(
        ".image-gallery img[data-src]"
      );
      imagesToLoad.forEach((image) => {
        if (image.getBoundingClientRect().top <= window.innerHeight) {
          image.src = image.dataset.src;
          image.removeAttribute("data-src");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img
          key={image.id}
          src={image.download_url}
          alt={image.author}
          width="200"
          height="200"
          onClick={() => openModal(image, index)}
          className="image-gallery-item"
          data-src={image.download_url}
        />
      ))}

      {modalOpen && selectedImage && (
        <div className="modal">
          <button className="prev-button" onClick={goToPrevious}>
            &lt;
          </button>
          <img
            src={selectedImage.download_url}
            alt={selectedImage.author}
            className="modal-image"
          />
          <button className="next-button" onClick={goToNext}>
            &gt;
          </button>
          <button className="close-button" onClick={closeModal}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
