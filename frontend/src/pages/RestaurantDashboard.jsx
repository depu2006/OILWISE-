// src/pages/RestaurantDashboard.jsx

import React, { useState, useEffect } from 'react';
import { getDishes, deleteDish, toggleDishStatus } from '../api/dishApi';
import DishForm from '../components/DishForm';
import DigitalLabel from '../components/DigitalLabel';

export default function RestaurantDashboard({ currentUser }) {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDish, setEditingDish] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!currentUser || !currentUser.id) return;
        loadDishes();
    }, [currentUser]);

    const loadDishes = async () => {
        try {
            setLoading(true);
            if (!currentUser || !currentUser.id) return;
            const data = await getDishes(currentUser.id);
            if (Array.isArray(data)) {
                setDishes(data);
            } else {
                setDishes([]);
            }
        } catch (error) {
            console.error('Error loading dishes:', error);
            setDishes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (dishId) => {
        if (!window.confirm('Are you sure you want to delete this dish?')) return;
        try {
            await deleteDish(dishId);
            setDishes(prev => prev.filter(d => d.id !== dishId));
        } catch (error) {
            console.error('Error deleting dish:', error);
            alert('Failed to delete dish');
        }
    };

    const handleToggleStatus = async (dishId, currentStatus) => {
        try {
            await toggleDishStatus(dishId, !currentStatus);
            setDishes(prev =>
                prev.map(d => d.id === dishId ? { ...d, is_active: !currentStatus } : d)
            );
        } catch (error) {
            console.error('Error toggling dish status:', error);
            alert('Failed to update dish status');
        }
    };

    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingDish(null);
        loadDishes();
    };

    const filteredDishes = dishes.filter(dish => {
        if (filter === 'all') return true;
        return dish.oil_level === filter;
    });

    const stats = {
        total: dishes.length,
        low: dishes.filter(d => d.oil_level === 'low').length,
        medium: dishes.filter(d => d.oil_level === 'medium').length,
        high: dishes.filter(d => d.oil_level === 'high').length,
    };

    if (!currentUser) {
        return (
            <div style={{ padding: 40, textAlign: "center", color: "#555" }}>
                <h2>Please log in to continue.</h2>
            </div>
        );
    }

    if (showForm) {
        return (
            <DishForm
                existingDish={editingDish}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                    setShowForm(false);
                    setEditingDish(null);
                }}
            />
        );
    }

    return (
        <>
            <div className="restaurant-dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Restaurant Dashboard</h1>
                        <p className="dashboard-subtitle">Manage your menu and track oil levels</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="add-dish-btn"
                    >
                        + Add New Dish
                    </button>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Dishes</div>
                    </div>
                    <div className="stat-card stat-low">
                        <div className="stat-value">🟢 {stats.low}</div>
                        <div className="stat-label">Low Oil</div>
                    </div>
                    <div className="stat-card stat-medium">
                        <div className="stat-value">🟡 {stats.medium}</div>
                        <div className="stat-label">Medium Oil</div>
                    </div>
                    <div className="stat-card stat-high">
                        <div className="stat-value">🔴 {stats.high}</div>
                        <div className="stat-label">High Oil</div>
                    </div>
                </div>

                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Dishes
                    </button>
                    <button
                        className={`filter-tab ${filter === 'low' ? 'active' : ''}`}
                        onClick={() => setFilter('low')}
                    >
                        🟢 Low Oil
                    </button>
                    <button
                        className={`filter-tab ${filter === 'medium' ? 'active' : ''}`}
                        onClick={() => setFilter('medium')}
                    >
                        🟡 Medium Oil
                    </button>
                    <button
                        className={`filter-tab ${filter === 'high' ? 'active' : ''}`}
                        onClick={() => setFilter('high')}
                    >
                        🔴 High Oil
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading dishes...</p>
                    </div>
                ) : filteredDishes.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🍽️</div>
                        <h3>No dishes found</h3>
                        <p>
                            {filter === 'all'
                                ? 'Start by adding your first dish!'
                                : `No ${filter} oil dishes in your menu.`}
                        </p>
                        {filter === 'all' && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="empty-cta-btn"
                            >
                                + Add Your First Dish
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="dishes-grid">
                        {filteredDishes.map((dish) => (
                            <div key={dish.id} className={`dish-card ${!dish.is_active ? 'inactive' : ''}`}>
                                <div className="dish-header">
                                    <h3 className="dish-name">{dish.name}</h3>
                                    <DigitalLabel oilLevel={dish.oil_level} oilMl={dish.oil_ml} size="small" />
                                </div>

                                {dish.description && (
                                    <p className="dish-description">{dish.description}</p>
                                )}

                                <div className="dish-meta">
                                    {dish.cuisine_type && (
                                        <span className="meta-tag">🍴 {dish.cuisine_type}</span>
                                    )}
                                    {dish.category && (
                                        <span className="meta-tag">📋 {dish.category}</span>
                                    )}
                                    {dish.price && (
                                        <span className="meta-tag">💰 ₹{dish.price}</span>
                                    )}
                                </div>

                                <div className="dish-ingredients">
                                    <strong>Ingredients:</strong>
                                    <div className="ingredients-tags">
                                        {dish.ingredients.slice(0, 3).map((ing, idx) => (
                                            <span key={idx} className="ingredient-mini-tag">{ing}</span>
                                        ))}
                                        {dish.ingredients.length > 3 && (
                                            <span className="ingredient-mini-tag">+{dish.ingredients.length - 3} more</span>
                                        )}
                                    </div>
                                </div>

                                <div className="dish-actions">
                                    <button
                                        onClick={() => {
                                            setEditingDish(dish);
                                            setShowForm(true);
                                        }}
                                        className="action-btn edit-btn"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(dish.id, dish.is_active)}
                                        className="action-btn toggle-btn"
                                    >
                                        {dish.is_active ? '👁️ Hide' : '👁️‍🗨️ Show'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dish.id)}
                                        className="action-btn delete-btn"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>

                                {!dish.is_active && (
                                    <div className="inactive-badge">Hidden from menu</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* STYLE BLOCK KEPT AS IS */}
        </>
    );
}
