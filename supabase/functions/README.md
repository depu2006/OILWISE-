# Supabase Edge Function Deployment Guide

## Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Supabase project created
- Logged in to Supabase CLI: `supabase login`

## Local Development

### 1. Link to your Supabase project
```bash
cd c:\Users\pavan\OneDrive\Desktop\Oilwise-updated\Oilwise
supabase link --project-ref otpmnhcvfslpzqbjqmcw
```

### 2. Start Supabase locally (optional)
```bash
supabase start
```

### 3. Serve function locally
```bash
supabase functions serve analyze-dish
```

### 4. Test locally
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/analyze-dish' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "dish_name": "Butter Chicken",
    "ingredients": ["chicken", "butter", "cream", "tomato"],
    "oil_ml": 45,
    "restaurant_id": "test-uuid",
    "cuisine_type": "Indian",
    "category": "Main Course"
  }'
```

## Deployment to Supabase

### 1. Deploy the function
```bash
supabase functions deploy analyze-dish
```

### 2. Set environment variables (if needed)
```bash
supabase secrets set MY_SECRET=value
```

### 3. Get function URL
After deployment, your function will be available at:
```
https://otpmnhcvfslpzqbjqmcw.supabase.co/functions/v1/analyze-dish
```

## Testing Deployed Function

```bash
curl -i --location --request POST 'https://otpmnhcvfslpzqbjqmcw.supabase.co/functions/v1/analyze-dish' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "dish_name": "Paneer Tikka",
    "ingredients": ["paneer", "yogurt", "spices"],
    "oil_ml": 12,
    "restaurant_id": "test-uuid",
    "cuisine_type": "Indian",
    "category": "Appetizer"
  }'
```

## Function API Documentation

### Endpoint
`POST /functions/v1/analyze-dish`

### Headers
- `Authorization: Bearer <SUPABASE_ANON_KEY>`
- `Content-Type: application/json`

### Request Body
```typescript
{
  dish_name: string        // Required: Name of the dish
  ingredients: string[]    // Required: Array of ingredient names
  oil_ml: number          // Required: Oil quantity in ml (0-1000)
  restaurant_id: string   // Required: UUID of restaurant
  cuisine_type?: string   // Optional: e.g., "Indian", "Chinese"
  category?: string       // Optional: e.g., "Appetizer", "Main Course"
}
```

### Response
```typescript
{
  oil_level: "low" | "medium" | "high"
  oil_ml: number
  healthy_alternatives: Array<{
    id: string
    name: string
    description: string
    oil_ml: number
    benefits: string[]
    relevance_score: number
    reason: string
  }>
  analysis_summary: string
}
```

### Oil Level Classification
- **Low**: < 15ml
- **Medium**: 15-30ml
- **High**: > 30ml

## Troubleshooting

### Function not deploying
- Ensure you're logged in: `supabase login`
- Check project is linked: `supabase projects list`
- Verify function syntax: `deno check supabase/functions/analyze-dish/index.ts`

### CORS errors
- Function includes CORS headers by default
- Ensure you're sending proper Authorization header

### Database connection issues
- Verify RLS policies are set up correctly
- Check that healthy_options table has seed data
- Ensure user has proper permissions

## Next Steps
1. Run the SQL migration to create tables
2. Deploy this Edge Function
3. Test with sample data
4. Integrate with React frontend
