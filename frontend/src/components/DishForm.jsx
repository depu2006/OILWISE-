// src/components/DishForm.jsx
// Form component for adding/editing dishes

import React, { useState } from 'react';
import { analyzeDish, createDish, updateDish } from '../api/dishApi';
import DigitalLabel from './DigitalLabel';
import HealthyAlternatives from './HealthyAlternatives';

export default function DishForm({ existingDish = null, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        dish_name: existingDish?.name || '',
        description: existingDish?.description || '',
        ingredients: existingDish?.ingredients || [],
        oil_ml: existingDish?.oil_ml || 20,
        cuisine_type: existingDish?.cuisine_type || '',
        category: existingDish?.category || '',
        price: existingDish?.price || '',
    });

    const [ingredientInput, setIngredientInput] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddIngredient = () => {
        if (ingredientInput.trim()) {
            setFormData(prev => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredientInput.trim()]
            }));
            setIngredientInput('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const handleAnalyze = async () => {
        setError('');
        setAnalyzing(true);

        try {
            const { data: { user } } = await window.supabase.auth.getUser();

            const analysisData = {
                dish_name: formData.dish_name,
                ingredients: formData.ingredients,
                oil_ml: parseFloat(formData.oil_ml),
                restaurant_id: user.id,
                cuisine_type: formData.cuisine_type,
                category: formData.category,
            };

            const results = await analyzeDish(analysisData);
            setAnalysisResults(results);
        } catch (err) {
            setError(err.message || 'Failed to analyze dish');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate
            if (!formData.dish_name || formData.ingredients.length === 0) {
                throw new Error('Please provide dish name and at least one ingredient');
            }

            // Analyze if not already done
            let results = analysisResults;
            if (!results) {
                const { data: { user } } = await window.supabase.auth.getUser();
                const analysisData = {
                    dish_name: formData.dish_name,
                    ingredients: formData.ingredients,
                    oil_ml: parseFloat(formData.oil_ml),
                    restaurant_id: user.id,
                    cuisine_type: formData.cuisine_type,
                    category: formData.category,
                };
                results = await analyzeDish(analysisData);
            }

            // Create or update dish
            if (existingDish) {
                await updateDish(existingDish.id, formData, results);
            } else {
                await createDish(formData, results);
            }

            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to save dish');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="dish-form-container">
                <form onSubmit={handleSubmit} className="dish-form">
                    <h2 className="form-title">
                        {existingDish ? 'Edit Dish' : 'Add New Dish'}
                    </h2>

                    {error && (
                        <div className="error-alert">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Dish Name */}
                    <div className="form-group">
                        <label className="form-label">Dish Name *</label>
                        <input
                            type="text"
                            name="dish_name"
                            value={formData.dish_name}
                            onChange={handleChange}
                            placeholder="e.g., Butter Chicken"
                            className="form-input"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the dish..."
                            className="form-textarea"
                            rows={3}
                        />
                    </div>

                    {/* Ingredients */}
                    <div className="form-group">
                        <label className="form-label">Ingredients *</label>
                        <div className="ingredient-input-group">
                            <input
                                type="text"
                                value={ingredientInput}
                                onChange={(e) => setIngredientInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                                placeholder="Add ingredient and press Enter"
                                className="form-input"
                            />
                            <button
                                type="button"
                                onClick={handleAddIngredient}
                                className="add-ingredient-btn"
                            >
                                + Add
                            </button>
                        </div>
                        <div className="ingredients-list">
                            {formData.ingredients.map((ingredient, index) => (
                                <span key={index} className="ingredient-tag">
                                    {ingredient}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(index)}
                                        className="remove-ingredient-btn"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Oil Quantity Slider */}
                    <div className="form-group">
                        <label className="form-label">
                            Oil Quantity: <strong>{formData.oil_ml}ml</strong>
                        </label>
                        <input
                            type="range"
                            name="oil_ml"
                            min="0"
                            max="100"
                            step="1"
                            value={formData.oil_ml}
                            onChange={handleChange}
                            className="oil-slider"
                        />
                        <div className="slider-labels">
                            <span>0ml</span>
                            <span>50ml</span>
                            <span>100ml</span>
                        </div>
                    </div>

                    {/* Cuisine Type & Category */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Cuisine Type</label>
                            <select
                                name="cuisine_type"
                                value={formData.cuisine_type}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select cuisine</option>
                                <option value="Indian">Indian</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Continental">Continental</option>
                                <option value="South Indian">South Indian</option>
                                <option value="Italian">Italian</option>
                                <option value="Mexican">Mexican</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="">Select category</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Snack">Snack</option>
                                <option value="Breakfast">Breakfast</option>
                            </select>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="form-group">
                        <label className="form-label">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g., 250"
                            className="form-input"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Analyze Button */}
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={analyzing || !formData.dish_name || formData.ingredients.length === 0}
                        className="analyze-btn"
                    >
                        {analyzing ? '🔄 Analyzing...' : '🔍 Analyze Dish'}
                    </button>

                    {/* Analysis Results */}
                    {analysisResults && (
                        <div className="analysis-results">
                            <h3 className="results-title">Analysis Results</h3>

                            <div className="results-summary">
                                <DigitalLabel
                                    oilLevel={analysisResults.oil_level}
                                    oilMl={analysisResults.oil_ml}
                                    size="large"
                                />
                                <p className="summary-text">{analysisResults.analysis_summary}</p>
                            </div>

                            {analysisResults.healthy_alternatives && analysisResults.healthy_alternatives.length > 0 && (
                                <HealthyAlternatives
                                    alternatives={analysisResults.healthy_alternatives}
                                    currentDishName={formData.dish_name}
                                />
                            )}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="form-actions">
                        {onCancel && (
                            <button type="button" onClick={onCancel} className="cancel-btn">
                                Cancel
                            </button>
                        )}
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? 'Saving...' : existingDish ? 'Update Dish' : 'Add Dish'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .dish-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .dish-form {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .form-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 24px;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          color: #dc2626;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .ingredient-input-group {
          display: flex;
          gap: 10px;
        }

        .add-ingredient-btn {
          padding: 12px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .add-ingredient-btn:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .ingredients-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .ingredient-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #eff6ff;
          color: #1e40af;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .remove-ingredient-btn {
          background: none;
          border: none;
          color: #dc2626;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .oil-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%);
          outline: none;
          -webkit-appearance: none;
        }

        .oil-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .analyze-btn {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .analysis-results {
          margin-top: 30px;
          padding: 24px;
          background: #f9fafb;
          border-radius: 12px;
          border: 2px solid #e5e7eb;
        }

        .results-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 16px;
        }

        .results-summary {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-text {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.6;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .cancel-btn,
        .submit-btn {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #6b7280;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .submit-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .dish-form-container {
            padding: 12px;
          }

          .dish-form {
            padding: 20px;
          }

          .form-title {
            font-size: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .ingredient-input-group {
            flex-direction: column;
          }

          .add-ingredient-btn {
            width: 100%;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
        </>
    );
}
