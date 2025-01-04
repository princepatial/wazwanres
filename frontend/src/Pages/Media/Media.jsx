import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Food from '../../assets/gallery/food.jpg';
import Food1 from '../../assets/gallery/food1.jpg';
import Food2 from '../../assets/gallery/food2.jpg';
import Food3 from '../../assets/gallery/food3.jpg';
import Foodvideo from '../../assets/gallery/food.mp4';
import guest from '../../assets/gallery/guest.jpg';
import interior from '../../assets/gallery/interior.jpg';
import interior1 from '../../assets/gallery/interior1.jpg';
import interior2 from '../../assets/gallery/interior2.jpg';
import interior3 from '../../assets/gallery/interior3.jpg';
import interior4 from '../../assets/gallery/interior4.jpg';
import interior5 from '../../assets/gallery/interior5.jpg';
import interior6 from '../../assets/gallery/interior6.jpg';
import interior7 from '../../assets/gallery/interior7.jpg';
import kitchen from '../../assets/gallery/kitchen.mp4';
import kitchen1 from '../../assets/gallery/kitchen1.mp4';
import kitchen3 from '../../assets/gallery/kitchen3.mp4';

const media = [
    { type: "image", id: 1, title: "Seasonal Symphony", category: "Multi Course", description: "Fresh Atlantic salmon with herbs", src: Food },
    { type: "video", id: 2, title: "Chef's Special", category: "Kitchen", description: "Watch our chef in action", src: "https://videos.pexels.com/video-files/2882090/2882090-uhd_2560_1440_24fps.mp4" },
    { type: "image", id: 3, title: "Seasonal Symphony", category: "Multi Course", description: "A symphony of flavors in every bite.", src: Food1 },
    { type: "image", id: 4, title: "Flavors of Passion", category: "Interior", description: "Where style meets comfort in every corner.", src: interior },
    { type: "video", id: 5, title: "Chef's Special", category: "Kitchen", description: "Watch our chef in action", src: kitchen3 },
    { type: "image", id: 6, title: "Flavors of Passion", category: "Interior", description: "Where style meets comfort in every corner.", src: interior2 },
    { type: "image", id: 7, title: "Flavors of Passion", category: "Interior", description: "Where style meets comfort in every corner.", src: interior1 },
    { type: "image", id: 8, title: "Flavors of Passion", category: "Interior", description: "Where style meets comfort in every corner.", src: interior3 },
    { type: "video", id: 18, title: "Chef's Special", category: "Kitchen", description: "Where style meets comfort in every corner.", src: kitchen },
    { type: "image", id: 9, title: "Flavors of Passion", category: "Interior", description: "Where style meets comfort in every corner.", src: interior4 },
    { type: "image", id: 10, title: "Seasonal Symphony", category: "Multi Course", description: "A symphony of flavors in every bite.", src: Food3 },
    { type: "image", id: 11, title: "Moments of Joy", category: "Events", description: "Where style meets comfort in every corner.", src: interior5 },
    { type: "image", id: 12, title: "Moments of Joy", category: "Events", description: "Where style meets comfort in every corner.", src: interior6 },
    { type: "image", id: 13, title: "Flavors of Passion", category: "Interior", description: "Where style meets comfort in every corner.", src: interior7 },
    { type: "video", id: 14, title: "Chef's Special", category: "Kitchen", description: "Watch our chef in action", src: kitchen1 },
    { type: "image", id: 15, title: "Moments of Joy", category: "Events", description: "A symphony of flavors in every bite.", src: guest },
    { type: "video", id: 16, title: "Chef's Special", category: "Kitchen", description: "Watch our chef in action", src: Foodvideo },
    { type: "image", id: 17, title: "Seasonal Symphony", category: "Multi Course", description: "A symphony of flavors in every bite.", src: Food2 },
];

const RestaurantGallery = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [displayedMedia, setDisplayedMedia] = useState(media);

    const categories = ['All', 'Multi Course', 'Kitchen', 'Interior', 'Events'];

    useEffect(() => {
        const filtered = activeCategory === 'All'
            ? media
            : media.filter(item => item.category === activeCategory);
        setDisplayedMedia(filtered);
    }, [activeCategory]);

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="gallery-container">

            <button onClick={handleBack} className="back-button">
                <ArrowLeft className="mr-2" size={20} />
                Back
            </button>
            <div className="gallery-header">
                <h1 className="gallery-title" style={{ marginTop: "5rem" }}>Culinary Excellence</h1>
                <p className="gallery-subtitle">Experience the artistry of fine dining</p>
            </div>

            <div className="category-filters">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-button ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="media-grid">
                {displayedMedia.map((item) => (
                    <div key={item.id} className="media-card">
                        <div className="media-image-container">
                            {item.type === "video" ? (
                                <>
                                    <video
                                        className="media-video"
                                        src={item.src}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                    <div className="media-overlay">
                                        <h3 className="media-title">{item.title}</h3>
                                        <p className="media-description">{item.description}</p>
                                        <span className="media-category">{item.category}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        className="media-image"
                                    />
                                    <div className="media-overlay">
                                        <h3 className="media-title">{item.title}</h3>
                                        <p className="media-description">{item.description}</p>
                                        <span className="media-category">{item.category}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                /* All the previous CSS styles remain the same */
                .gallery-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
                    padding: 4rem 2rem;
                    color: #ffffff;
                }

                .back-button {
                    position: fixed;
                    top: 10rem;
                    right: 4rem;
                    display: flex;
                    align-items: center;
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 30px;
                    background: rgba(245, 215, 66, 0.9);
                    color: #1a1a1a;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                    font-weight: 500;
                    z-index: 100;
                    box-shadow: 0 4px 20px rgba(245, 215, 66, 0.3);
                }

                .back-button:hover {
                    transform: translateY(-2px);
                    background: rgba(245, 215, 66, 1);
                    box-shadow: 0 6px 25px rgba(245, 215, 66, 0.4);
                }

                .gallery-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    animation: fadeInDown 1s forwards;
                }

                .gallery-title {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(to right, #f5d742, #f5a742);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: bold;
                    letter-spacing: 2px;
                }

                .gallery-subtitle {
                    font-size: 1.5rem;
                    color: #cccccc;
                    font-weight: 300;
                }

                .category-filters {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 3rem;
                    flex-wrap: wrap;
                }

                .category-button {
                    padding: 0.8rem 1.5rem;
                    border: none;
                    border-radius: 30px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .category-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }

                .category-button.active {
                    background: #f5d742;
                    color: #1a1a1a;
                    box-shadow: 0 4px 20px rgba(245, 215, 66, 0.3);
                }

                .media-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .media-card {
                    position: relative;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .media-image-container {
                    position: relative;
                    padding-bottom: 75%;
                    overflow: hidden;
                }

                .media-image, .media-video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.7s ease;
                }

                .media-card:hover .media-image,
                .media-card:hover .media-video {
                    transform: scale(1.1);
                }

                .media-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 2rem;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
                    transform: translateY(100px);
                    transition: transform 0.5s ease;
                }

                .media-card:hover .media-overlay {
                    transform: translateY(0);
                }

                .media-title {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }

                .media-description {
                    color: #cccccc;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                }

                .media-category {
                    display: inline-block;
                    padding: 0.4rem 1rem;
                    background: rgba(245, 215, 66, 0.9);
                    color: #1a1a1a;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                @media (max-width: 768px) {
                    .gallery-title {
                        font-size: 3rem;
                    }

                    .back-button {
                        top: 1rem;
                        right: 1rem;
                        padding: 0.6rem 1.2rem;
                        font-size: 0.9rem;
                    }
                    
                    .gallery-subtitle {
                        font-size: 1.2rem;
                    }
                    
                    .media-grid {
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 1rem;
                    }
                    
                    .category-filters {
                        gap: 0.5rem;
                    }
                    
                    .category-button {
                        padding: 0.6rem 1.2rem;
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default RestaurantGallery;