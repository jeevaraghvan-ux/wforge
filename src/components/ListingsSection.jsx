import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Plus, 
  AlertCircle,
  Filter,
  Send
} from 'lucide-react';

export const ListingsSection = () => {
  const { listings, handlePreorder, addReviewToListing, currentUser, setIsAuthModalOpen } = useStore();
  
  const [filterMode, setFilterMode] = useState('all'); // all, in-stock, seasonal
  const [activeReviewModalProduct, setActiveReviewModalProduct] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const filteredListings = listings.filter(item => {
    if (filterMode === 'in-stock') return item.inStock;
    if (filterMode === 'seasonal') return item.isSeasonal;
    return true;
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!activeReviewModalProduct) return;
    
    addReviewToListing(activeReviewModalProduct.id, {
      author: currentUser ? currentUser.name : (authorName.trim() || 'Student Maker'),
      email: currentUser ? currentUser.email : 'student@school.edu',
      rating: newRating,
      comment: newComment.trim() || 'Great 3D print quality!'
    });

    setNewComment('');
    setAuthorName('');
    setActiveReviewModalProduct(null);
  };

  return (
    <div className="py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Maker Listings
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              {listings.length} Models
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Browse our catalog of custom 3D prints. All items are curated and handcrafted by our 5th grade lab.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/10 liquid-glass">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Prints
          </button>
          <button
            onClick={() => setFilterMode('in-stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'in-stock'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In Stock Only
          </button>
          <button
            onClick={() => setFilterMode('seasonal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterMode === 'seasonal'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seasonal / Limited
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="liquid-glass p-12 rounded-2xl text-center space-y-3 border border-white/10">
          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No listings match this filter</h3>
          <p className="text-sm text-slate-400">Switch filter to 'All Prints' or add new models in the Admin Vault.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((product) => (
            <div
              key={product.id}
              className="liquid-glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/15 group"
            >
              {/* Product Image */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20"></div>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  {product.isSeasonal && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-amber-950 backdrop-blur-md border border-amber-300 shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-950" /> Seasonal Special
                    </span>
                  )}
                  {product.inStock ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-emerald-950 backdrop-blur-md border border-emerald-300 shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-950" /> In Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white backdrop-blur-md border border-rose-300 shadow-md flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Out of Stock
                    </span>
                  )}
                </div>

                {/* Price and Credit Tag */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <div className="px-3 py-1 rounded-xl liquid-glass border border-white/20 text-cyan-300 font-display font-bold text-xs">
                    {product.creditCost || Math.round(product.price * 10)} Credits
                  </div>
                  <div className="px-3.5 py-1 rounded-xl bg-cyan-500 text-slate-950 font-display font-extrabold text-sm shadow-glass-glow">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Product Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-cyan-400" /> {product.printTime || '1-2 hrs'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating || '5.0'}</span>
                      <span className="text-slate-500 text-[11px]">({(product.reviews || []).length})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-3 py-1.5 px-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-cyan-300/90 flex items-center justify-between">
                    <span>Material: {product.material || 'School Safe PLA'}</span>
                    <span className="text-slate-400 font-mono text-[10px]">ID: {product.id}</span>
                  </div>
                </div>

                {/* Reviews & Actions */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  {/* Customer Reviews Snippet */}
                  {product.reviews && product.reviews.length > 0 && (
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                      <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                        <span>Latest Reviews:</span>
                        <span className="text-[10px] text-cyan-400">Verified Makers</span>
                      </div>
                      {product.reviews.slice(0, 2).map((rev) => (
                        <div key={rev.id} className="p-2 rounded-lg bg-slate-900/50 border border-white/5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{rev.author}</span>
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-300 text-[10px] italic mt-0.5">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {/* Add Review Button */}
                    <button
                      onClick={() => setActiveReviewModalProduct(product)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold liquid-glass border border-white/20 text-slate-300 hover:text-white hover:border-cyan-400/40 transition-all flex items-center gap-1.5"
                      title="Rate & Review this print"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Review</span>
                    </button>

                    {/* Preorder Button (Redirects to sign up if not signed in) */}
                    <button
                      onClick={() => handlePreorder(product)}
                      disabled={!product.inStock}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        product.inStock
                          ? 'glass-btn-primary text-white shadow-glass-glow'
                          : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.inStock ? 'Preorder Print' : 'Temporarily Out of Stock'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review & Rating Modal */}
      {activeReviewModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="liquid-glass rounded-2xl max-w-md w-full p-6 border border-cyan-400/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                Rate & Review Product
              </h3>
              <button
                onClick={() => setActiveReviewModalProduct(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-cyan-300 font-semibold">
              {activeReviewModalProduct.title}
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {!currentUser && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Maya L. (5th Grade)"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-300 ml-2">{newRating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Review Comment</label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell others about the print quality, layer smoothness, or fidget feel..."
                  className="w-full glass-input rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReviewModalProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs glass-btn-secondary text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold glass-btn-primary text-white flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
