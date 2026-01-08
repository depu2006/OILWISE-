import { useEffect, useState } from 'react';
import axios from 'axios';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import '../styles/analytics.css';

const API = 'http://localhost:4000';
const DEMO_USER = 'u1';

function calcGauge(bmi){
  const value = Math.min(40, Math.max(10, bmi));
  return [{ name:'BMI', value }];
}

export default function AnalyticsPage(){
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({ heightCm: '', weightKg: '', age: '', mealsPerDay: 3 });
  const [evaluated, setEvaluated] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(()=>{
    axios.get(`${API}/api/health/${DEMO_USER}`).then(res=> setSummary(res.data));
  },[]);

  const bmi = evaluated?.bmi ?? summary?.bmi ?? 0;
  const risk = evaluated?.risk ?? summary?.risk ?? 'normal';

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#ffb020', advice: 'Consider consulting a nutritionist for healthy weight gain strategies.' };
    if (bmi < 25) return { category: 'Normal', color: '#3ee57f', advice: 'Great! Maintain your current healthy lifestyle.' };
    if (bmi < 30) return { category: 'Overweight', color: '#ff9bfb', advice: 'Focus on portion control and regular exercise.' };
    return { category: 'Obese', color: '#ff5d5d', advice: 'Consider consulting healthcare professionals for a comprehensive plan.' };
  };

  const getPersonalizedTips = (bmi, age, mealsPerDay) => {
    const tips = [];
    const bmiInfo = getBMICategory(bmi);
    
    tips.push(`Your BMI of ${bmi.toFixed(1)} indicates ${bmiInfo.category} weight. ${bmiInfo.advice}`);
    
    if (bmi > 25) {
      tips.push('Reduce oil consumption to 1-2 teaspoons per meal.');
      tips.push('Include more steamed and grilled foods in your diet.');
    }
    
    if (age > 50) {
      tips.push('Consider heart-healthy oils like olive oil and avocado oil.');
    }
    
    if (mealsPerDay > 3) {
      tips.push('Try intermittent fasting or reduce meal frequency to 2-3 times daily.');
    }
    
    tips.push('Track your oil consumption daily for better awareness.');
    tips.push('Replace deep-fried foods with air-fried or baked alternatives.');
    
    return tips;
  };

  return (
    <div className="grid">
      <section className="panel">
        <h1 style={{ marginBottom: 0 }}>Health Analytics</h1>
        {hasSubmitted && evaluated && (
          <div className="analytics-bmi-grid">
            <div className="analytics-bmi-section">
              <h3 style={{marginTop:0, color:'var(--brand)'}}>Your BMI Analysis</h3>
              <div className="analytics-bmi-chart">
                <ResponsiveContainer>
                  <RadialBarChart innerRadius="60%" outerRadius="100%" data={calcGauge(bmi)} startAngle={180} endAngle={0}>
                    <RadialBar minAngle={15} clockWise dataKey="value" fill={getBMICategory(bmi).color} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="analytics-bmi-stats">
                <div className="analytics-bmi-value" style={{color:getBMICategory(bmi).color}}>
                  BMI: {bmi.toFixed(1)}
                </div>
                <div className="muted">{getBMICategory(bmi).category}</div>
              </div>
            </div>
            <div className="analytics-bmi-section">
              <h3 style={{marginTop:0, color:'var(--brand)'}}>Personalized Health Tips</h3>
              <div className="analytics-tips-list">
                {getPersonalizedTips(bmi, form.age, form.mealsPerDay).map((tip, i) => (
                  <div key={i} className="analytics-tip-item">
                    💡 {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <h3 style={{marginTop:0}}>Your Details</h3>
        <form className="analytics-form" onSubmit={async (e)=>{
          e.preventDefault();
          setHasSubmitted(true);
          // Simulate realistic BMI calculation
          const heightM = Number(form.heightCm) / 100;
          const weightKg = Number(form.weightKg);
          const bmi = weightKg / (heightM * heightM);
          
          const risk = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';
          
          setEvaluated({
            bmi: bmi,
            risk: risk,
            advice: getPersonalizedTips(bmi, Number(form.age), Number(form.mealsPerDay))
          });
        }}>
          <input type="number" placeholder="Height (cm)" value={form.heightCm} onChange={e=> setForm({...form, heightCm: e.target.value})} required />
          <input type="number" placeholder="Weight (kg)" value={form.weightKg} onChange={e=> setForm({...form, weightKg: e.target.value})} required />
          <input type="number" placeholder="Age" value={form.age} onChange={e=> setForm({...form, age: e.target.value})} required />
          <input type="number" placeholder="Meals / day" value={form.mealsPerDay} onChange={e=> setForm({...form, mealsPerDay: e.target.value})} min="1" />
          <button type="submit">Evaluate</button>
        </form>
        {!hasSubmitted && (
          <div style={{marginTop:16, textAlign:'center', padding:'20px', background:'rgba(124,245,255,0.1)', borderRadius:'12px'}}>
            <h4 style={{margin:'0 0 8px 0', color:'var(--brand)'}}>Get Your Health Analysis</h4>
            <p className="muted" style={{margin:0}}>Enter your details above to see your personalized BMI analysis and health tips!</p>
          </div>
        )}
      </section>
    </div>
  );
}


