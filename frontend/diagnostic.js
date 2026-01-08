// Quick Diagnostic Script - Run this in browser console
// Open browser console (F12) and paste this code

console.log('=== RESTAURANT DASHBOARD DIAGNOSTIC ===');

// Check if user is logged in
const userStr = localStorage.getItem('oilwise_current_user');
if (!userStr) {
    console.error('❌ NO USER LOGGED IN');
    console.log('Solution: You need to log in first');
} else {
    const user = JSON.parse(userStr);
    console.log('✅ User logged in:', user.email);
    console.log('📋 User role:', user.role);

    if (user.role === 'restaurant') {
        console.log('✅ CORRECT ROLE: You should see Restaurant Dashboard');
        console.log('If you don\'t see it, try:');
        console.log('1. Refresh the page (F5)');
        console.log('2. Clear cache (Ctrl+Shift+Delete)');
        console.log('3. Check browser console for errors');
    } else {
        console.error('❌ WRONG ROLE: Current role is "' + user.role + '"');
        console.log('Solution: You need to:');
        console.log('1. Log out');
        console.log('2. Register a NEW account');
        console.log('3. Select 🍽️ Restaurant role during registration');
    }
}

console.log('\n=== CHECKING COMPONENTS ===');
console.log('Current URL:', window.location.href);
console.log('Expected: Should be at "/" (home page)');

// Check if RestaurantDashboard component exists
const dashboardElement = document.querySelector('.restaurant-dashboard');
if (dashboardElement) {
    console.log('✅ Restaurant Dashboard component is rendered!');
} else {
    console.log('❌ Restaurant Dashboard component NOT found');
    console.log('Check: Are you on the home page ("/") ?');
}

console.log('\n=== END DIAGNOSTIC ===');
