import React, { useEffect, useRef, useState } from 'react';
import ReelCard from '../components/Reel/ReelCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReelsFeed } from '../services/operations/ReelsApi';


const categories = ['All', 'Comedy', 'Dance', 'Travel', 'Food', 'Fitness', 'Fashion'];

const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const reelRefs = useRef({});
  const videoRefs = useRef({});
  const { reelId } = useParams();

  const dispatch = useDispatch();


  const fetchReels = async () => {


    setLoading(true);
    try {
      // Send category in expected format, adjust if needed
      const categoryPayload = activeCategory === 'All' ? {} : { category: activeCategory };
      const result = await dispatch(getReelsFeed(categoryPayload));
      console.log('Fetched reels:', result);
      setReels(result);
    } catch (err) {
      setReels([]);
      console.error('Error fetching reels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, [activeCategory]);

  useEffect(() => {
    if (reelId && reelRefs.current[reelId]) {
      reelRefs.current[reelId].scrollIntoView({ behavior: 'smooth' });
    }
  }, [reels, reelId]);

  // Video play/pause observer
  useEffect(() => {
    if (reels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let visibleReelId = null;

        entries.forEach((entry) => {
          const id = entry.target.dataset.id;

          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            visibleReelId = id;
          }
        });

        entries.forEach((entry) => {
          const id = entry.target.dataset.id;
          const video = videoRefs.current[id];
          if (video) {
            if (entry.isIntersecting && id === visibleReelId) {
              video.play().catch(() => { });
            } else {
              video.pause();
              video.currentTime = 0;
            }
          }
        });

        if (visibleReelId) {
          navigate(`/reels/${visibleReelId}`, { replace: true });
        }
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    reels.forEach((reel) => {
      if (reelRefs.current[reel._id]) {
        observer.observe(reelRefs.current[reel._id]);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [reels, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white ">
      {/* Categories */}
      <div className="sticky top-0 z-50 bg-gray-900 py-3  px-4  ">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-1 mb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1 rounded-full text-sm border transition ${activeCategory === cat
                  ? 'bg-white text-black'
                  : 'border-white hover:bg-white hover:text-black'
                }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Back Button */}
        <div className="flex justify-center md:justify-start px-4 md:absolute md:left-4 md:top-[90px]">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-1 text-sm bg-black border border-white rounded-md hover:bg-white hover:text-black transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>


      {/* Reel Feed */}
      <div className="h-[88vh] overflow-y-scroll snap-y snap-mandatory px-1 hide-scrollbar">
        {loading ? (
          <p className="text-center">Loading reels...</p>
        ) : reels?.length === 0 ? (
          <p className="text-center">No reels found in this category.</p>
        ) : (
          reels?.map((reel) => (
            <div
              key={reel._id}
              data-id={reel._id}
              ref={(el) => (reelRefs.current[reel._id] = el)}
              className="snap-start h-[90vh] flex items-center justify-center"
            >
              <ReelCard
                reel={reel}

              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReelsPage;
