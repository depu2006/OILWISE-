// Supabase Edge Function: analyze-dish
// Purpose: Analyze dish oil content and recommend healthy alternatives

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DishAnalysisRequest {
    dish_name: string
    ingredients: string[]
    oil_ml: number
    restaurant_id: string
    cuisine_type?: string
    category?: string
}

interface HealthyAlternative {
    id: string
    name: string
    description: string
    oil_ml: number
    benefits: string[]
    relevance_score: number
    reason: string
}

interface AnalysisResponse {
    oil_level: 'low' | 'medium' | 'high'
    oil_ml: number
    healthy_alternatives: HealthyAlternative[]
    analysis_summary: string
}

// Calculate oil level based on quantity
function calculateOilLevel(oilMl: number): 'low' | 'medium' | 'high' {
    if (oilMl < 15) return 'low'
    if (oilMl <= 30) return 'medium'
    return 'high'
}

// Calculate relevance score between dish and healthy option
function calculateRelevanceScore(
    dishIngredients: string[],
    dishCuisine: string | undefined,
    dishCategory: string | undefined,
    optionCuisine: string,
    optionCategory: string,
    optionOilMl: number,
    dishOilMl: number
): number {
    let score = 0

    // Cuisine match (30% weight)
    if (dishCuisine && optionCuisine.toLowerCase() === dishCuisine.toLowerCase()) {
        score += 0.3
    }

    // Category match (20% weight)
    if (dishCategory && optionCategory.toLowerCase() === dishCategory.toLowerCase()) {
        score += 0.2
    }

    // Oil reduction (40% weight)
    const oilReduction = (dishOilMl - optionOilMl) / dishOilMl
    if (oilReduction > 0) {
        score += Math.min(oilReduction, 1) * 0.4
    }

    // Base relevance (10% weight) - all healthy options are somewhat relevant
    score += 0.1

    return Math.min(Math.max(score, 0), 1) // Clamp between 0 and 1
}

// Generate reason for recommendation
function generateReason(
    dishOilMl: number,
    optionOilMl: number,
    optionName: string,
    cuisineMatch: boolean
): string {
    const oilReduction = dishOilMl - optionOilMl
    const percentReduction = Math.round((oilReduction / dishOilMl) * 100)

    let reason = `${optionName} uses ${percentReduction}% less oil`

    if (cuisineMatch) {
        reason += ' and maintains similar flavors'
    }

    if (optionOilMl < 10) {
        reason += ', making it a heart-healthy choice'
    }

    return reason
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // Parse request body
        const requestData: DishAnalysisRequest = await req.json()
        const { dish_name, ingredients, oil_ml, restaurant_id, cuisine_type, category } = requestData

        // Validate input
        if (!dish_name || !ingredients || oil_ml === undefined || !restaurant_id) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: dish_name, ingredients, oil_ml, restaurant_id' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (oil_ml < 0 || oil_ml > 1000) {
            return new Response(
                JSON.stringify({ error: 'oil_ml must be between 0 and 1000' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Calculate oil level
        const oilLevel = calculateOilLevel(oil_ml)

        // Fetch healthy alternatives from database
        const { data: healthyOptions, error: fetchError } = await supabaseClient
            .from('healthy_options')
            .select('*')
            .eq('is_active', true)
            .lt('oil_ml', oil_ml) // Only show options with less oil
            .order('oil_ml', { ascending: true })
            .limit(10)

        if (fetchError) {
            console.error('Error fetching healthy options:', fetchError)
            return new Response(
                JSON.stringify({ error: 'Failed to fetch healthy alternatives' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Calculate relevance scores and generate reasons
        const alternatives: HealthyAlternative[] = (healthyOptions || [])
            .map(option => {
                const relevanceScore = calculateRelevanceScore(
                    ingredients,
                    cuisine_type,
                    category,
                    option.cuisine_type,
                    option.category,
                    option.oil_ml,
                    oil_ml
                )

                const cuisineMatch = cuisine_type?.toLowerCase() === option.cuisine_type?.toLowerCase()
                const reason = generateReason(oil_ml, option.oil_ml, option.name, cuisineMatch)

                return {
                    id: option.id,
                    name: option.name,
                    description: option.description,
                    oil_ml: option.oil_ml,
                    benefits: option.benefits || [],
                    relevance_score: relevanceScore,
                    reason: reason
                }
            })
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .slice(0, 5) // Return top 5 alternatives

        // Generate analysis summary
        let analysisSummary = `This dish contains ${oil_ml}ml of oil, classified as ${oilLevel} oil content. `

        if (oilLevel === 'high') {
            analysisSummary += `Consider reducing oil usage or trying one of the healthier alternatives below.`
        } else if (oilLevel === 'medium') {
            analysisSummary += `This is a moderate amount. You can further reduce oil for better health benefits.`
        } else {
            analysisSummary += `Great choice! This is a low-oil dish that's heart-healthy.`
        }

        // Prepare response
        const response: AnalysisResponse = {
            oil_level: oilLevel,
            oil_ml: oil_ml,
            healthy_alternatives: alternatives,
            analysis_summary: analysisSummary
        }

        return new Response(
            JSON.stringify(response),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Error in analyze-dish function:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
