import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function HomePage({ currentUser }) {
  const [showWelcome, setShowWelcome] = useState(true);

  const cards = [
    {
      title: "Oil Usage Tracker",
      desc: "Monitor your daily and weekly edible oil intake.",
      img: "https://plus.unsplash.com/premium_photo-1714510332132-b3074b75a312?q=80&w=1200",
      link: "/tracker",
      button: "Go to Tracker",
    },
    {
      title: "Health Audit",
      desc: "Visualize oil consumption patterns.",
      img: "https://plus.unsplash.com/premium_photo-1661609727988-62d439bf2ce4?q=80&w=1200",
      link: "/audit",
      button: "View Audit",
    },
    {
      title: "Low-Oil Recipes",
      desc: "Discover nutritious low-oil recipes.",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200",
      link: "/recipes",
      button: "Explore Recipes",
    },
    {
      title: "Campaigns & Awareness",
      desc: "Explore nationwide health campaigns.",
      img: "https://plus.unsplash.com/premium_photo-1728457508551-8973fedacaa4?q=80&w=1200",
      link: "/campaigns",
      button: "View Campaigns",
    },
    {
      title: "Rewards & Challenges",
      desc: "Earn badges as you hit health goals.",
      img: "https://plus.unsplash.com/premium_photo-1729036321929-78202e4fd944?q=80&w=1200",
      link: "/rewards",
      button: "See Rewards",
    },
    {
      title: "Product Verification",
      desc: "Verify your cooking oil quality.",
      img: "https://plus.unsplash.com/premium_photo-1683842188982-e2920f594fda?q=80&w=1200",
      link: "/verify",
      button: "Verify Now",
    },
    {
      title: 'Health Advisory',
      desc: 'Receive personalized diet, exercise, lifestyle, and BMI-based recommendations tailored to your health profile.',
      img: 'https://cdn-icons-png.flaticon.com/512/9693/9693331.png',
      link: '/advisory',
      button: 'View Advisory'
    },
    {
      title: 'Used Oil Submission',
      desc: 'Submit how long you reuse cooking oil and let collectors and centres track used oil collection across regions.',
      img: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
      link: '/oil-forms',
      button: 'Open Portal'
    },
    
  ];

  return (
    <div className="grid">
      {/* WELCOME */}
      <section className="panel" style={{ padding: "28px" }}>
        <h1 style={{ margin: 0 }}>
          Welcome to{" "}
          <span
            style={{
              background:
                "linear-gradient(90deg, var(--brand), var(--brand-accent))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Oilwise
          </span>
        </h1>
        <p className="muted">
          Track your oil usage, explore recipes, view analytics, and stay healthy.
        </p>
      </section>

      {/* CARDS */}
      <section
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((item, i) => (
          <article
            key={i}
            className="panel"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <img
              src={item.img}
              alt={item.title}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 12,
              }}
            />
            <h3>{item.title}</h3>
            <p className="muted" style={{ flex: 1 }}>
              {item.desc}
            </p>
            <a href={item.link}>
              <button style={{ width: "100%" }}>{item.button}</button>
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
