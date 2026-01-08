import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../styles/notifications-panel.css";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading notifications:", error);
        } else {
          setNotifications(data || []);
          setHasUnread((data || []).length > 0);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };
    load();
  }, []);

  return (
    <>
      {/* Bell Button */}
      <button
        className={`notifications-bell-btn ${hasUnread ? "unread" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
      >
        🔔
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </button>

      {/* Notifications Sidebar */}
      {isOpen && (
        <div className="notifications-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="notifications-sidebar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notifications-sidebar-header">
              <h3>Notifications</h3>
              <button
                className="notifications-close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="notifications-sidebar-content">
              {notifications.length === 0 ? (
                <div className="notifications-empty">
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((n, idx) => (
                  <div
                    key={n.id}
                    className="notification-item"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="notification-item-icon">📢</div>
                    <div className="notification-item-content">
                      <h4 className="notification-item-title">{n.title}</h4>
                      <p className="notification-item-message">{n.message}</p>
                      <p className="notification-item-time">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
