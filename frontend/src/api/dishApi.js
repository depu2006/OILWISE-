// src/api/dishApi.js
// API helper functions for dish management and analysis

import { supabase } from '../supabaseClient';

const EDGE_FUNCTION_URL = 'https://otpmnhcvfslpzqbjqmcw.supabase.co/functions/v1/analyze-dish';

/**
 * Analyze a dish using the Supabase Edge Function
 * @param {Object} dishData - Dish information
 * @returns {Promise<Object>} Analysis results with oil level and alternatives
 */
export async function analyzeDish(dishData) {
    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dishData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to analyze dish');
        }

        return await response.json();
    } catch (error) {
        console.error('Error analyzing dish:', error);
        throw error;
    }
}

/**
 * Create a new dish and save analysis results
 * @param {Object} dishData - Complete dish information
 * @param {Object} analysisResults - Results from analyzeDish
 * @returns {Promise<Object>} Created dish
 */
export async function createDish(dishData, analysisResults) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // Insert dish
        const { data: dish, error: dishError } = await supabase
            .from('dishes')
            .insert({
                restaurant_id: user.id,
                name: dishData.dish_name,
                description: dishData.description,
                ingredients: dishData.ingredients,
                oil_ml: dishData.oil_ml,
                oil_level: analysisResults.oil_level,
                cuisine_type: dishData.cuisine_type,
                category: dishData.category,
                price: dishData.price,
            })
            .select()
            .single();

        if (dishError) throw dishError;

        // Insert dish alternatives
        if (analysisResults.healthy_alternatives && analysisResults.healthy_alternatives.length > 0) {
            const alternatives = analysisResults.healthy_alternatives.map(alt => ({
                dish_id: dish.id,
                healthy_option_id: alt.id,
                relevance_score: alt.relevance_score,
                reason: alt.reason,
            }));

            const { error: altError } = await supabase
                .from('dish_alternatives')
                .insert(alternatives);

            if (altError) {
                console.error('Error inserting alternatives:', altError);
                // Don't throw - dish was created successfully
            }
        }

        return dish;
    } catch (error) {
        console.error('Error creating dish:', error);
        throw error;
    }
}

/**
 * Update an existing dish
 * @param {string} dishId - Dish ID
 * @param {Object} dishData - Updated dish information
 * @param {Object} analysisResults - New analysis results
 * @returns {Promise<Object>} Updated dish
 */
export async function updateDish(dishId, dishData, analysisResults) {
    try {
        // Update dish
        const { data: dish, error: dishError } = await supabase
            .from('dishes')
            .update({
                name: dishData.dish_name,
                description: dishData.description,
                ingredients: dishData.ingredients,
                oil_ml: dishData.oil_ml,
                oil_level: analysisResults.oil_level,
                cuisine_type: dishData.cuisine_type,
                category: dishData.category,
                price: dishData.price,
            })
            .eq('id', dishId)
            .select()
            .single();

        if (dishError) throw dishError;

        // Delete old alternatives
        await supabase
            .from('dish_alternatives')
            .delete()
            .eq('dish_id', dishId);

        // Insert new alternatives
        if (analysisResults.healthy_alternatives && analysisResults.healthy_alternatives.length > 0) {
            const alternatives = analysisResults.healthy_alternatives.map(alt => ({
                dish_id: dishId,
                healthy_option_id: alt.id,
                relevance_score: alt.relevance_score,
                reason: alt.reason,
            }));

            await supabase
                .from('dish_alternatives')
                .insert(alternatives);
        }

        return dish;
    } catch (error) {
        console.error('Error updating dish:', error);
        throw error;
    }
}

/**
 * Get all dishes for a restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array>} List of dishes
 */
export async function getDishes(restaurantId) {
    try {
        const { data, error } = await supabase
            .from('dishes')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching dishes:', error);
        throw error;
    }
}

/**
 * Get a single dish with its alternatives
 * @param {string} dishId - Dish ID
 * @returns {Promise<Object>} Dish with alternatives
 */
export async function getDishWithAlternatives(dishId) {
    try {
        // Get dish
        const { data: dish, error: dishError } = await supabase
            .from('dishes')
            .select('*')
            .eq('id', dishId)
            .single();

        if (dishError) throw dishError;

        // Get alternatives
        const { data: alternatives, error: altError } = await supabase
            .from('dish_alternatives')
            .select(`
        *,
        healthy_options (*)
      `)
            .eq('dish_id', dishId)
            .order('relevance_score', { ascending: false });

        if (altError) throw altError;

        return {
            ...dish,
            alternatives: alternatives || [],
        };
    } catch (error) {
        console.error('Error fetching dish with alternatives:', error);
        throw error;
    }
}

/**
 * Delete a dish
 * @param {string} dishId - Dish ID
 * @returns {Promise<void>}
 */
export async function deleteDish(dishId) {
    try {
        const { error } = await supabase
            .from('dishes')
            .delete()
            .eq('id', dishId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting dish:', error);
        throw error;
    }
}

/**
 * Toggle dish active status
 * @param {string} dishId - Dish ID
 * @param {boolean} isActive - New active status
 * @returns {Promise<Object>} Updated dish
 */
export async function toggleDishStatus(dishId, isActive) {
    try {
        const { data, error } = await supabase
            .from('dishes')
            .update({ is_active: isActive })
            .eq('id', dishId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error toggling dish status:', error);
        throw error;
    }
}

/**
 * Get all healthy options (for reference)
 * @returns {Promise<Array>} List of healthy options
 */
export async function getHealthyOptions() {
    try {
        const { data, error } = await supabase
            .from('healthy_options')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching healthy options:', error);
        throw error;
    }
}
