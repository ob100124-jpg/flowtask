// ─────────────────────────────────────────────────────────────
//  notifications-client.js
//  Include this script in ALL pages: tasks.html, dashboard.html, projects.html
//  <script src="../notifications/notifications-client.js"></script>
//  Also add this bell button in your navbar on every page:
//  <button id="notif-bell" onclick="location.href='../notifications/notifications.html'">
//    🔔 <span id="notif-badge" style="display:none;background:#f44336;color:#fff;
//    border-radius:50%;padding:1px 6px;font-size:11px;font-weight:700;">0</span>
//  </button>
// ─────────────────────────────────────────────────────────────

const NOTIF_API    = 'http://localhost:5000/api/notifications';
const NOTIF_KEY    = 'notif_archived';
const POLL_INTERVAL = 30000; // 30 seconds

let _notifPollTimer = null;
let _liveNotifs     = [];

// ── Fetch from server ─────────────────────────────────────────
const fetchNotifications = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await axios.get(NOTIF_API, {
      headers: { Authorization: 'Bearer ' + token }
    });

    _liveNotifs = res.data;

    // Archive read ones into localStorage
    _liveNotifs.filter(n => n.read).forEach(archiveNotification);

    updateNotifBadge();
  } catch (err) {
    console.warn('Notifications fetch failed:', err.message);
  }
};

// ── Archive in localStorage ───────────────────────────────────
const archiveNotification = (n) => {
  const archived = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
  const exists   = archived.find(a => a._id === n._id);
  if (!exists) {
    archived.unshift({ ...n, archivedAt: Date.now() });
    if (archived.length > 100) archived.pop(); // keep max 100
    localStorage.setItem(NOTIF_KEY, JSON.stringify(archived));
  }
};

// ── Update badge ──────────────────────────────────────────────
const updateNotifBadge = () => {
  const unread = _liveNotifs.filter(n => !n.read).length;
  const badge  = document.getElementById('notif-badge');
  if (!badge) return;

  if (unread > 0) {
    badge.textContent = unread > 9 ? '9+' : unread;
    badge.style.display = 'inline';
  } else {
    badge.style.display = 'none';
  }
};

// ── Mark one as read ──────────────────────────────────────────
const markNotificationRead = async (id) => {
  const token = localStorage.getItem('token');
  try {
    await axios.patch(NOTIF_API + '/' + id + '/read', {}, {
      headers: { Authorization: 'Bearer ' + token }
    });
    const n = _liveNotifs.find(x => x._id === id);
    if (n) { n.read = true; archiveNotification(n); }
    updateNotifBadge();
  } catch (err) {
    console.error('markNotificationRead error:', err.message);
  }
};

// ── Start polling ─────────────────────────────────────────────
const startNotifPolling = () => {
  fetchNotifications(); // immediate on load
  _notifPollTimer = setInterval(fetchNotifications, POLL_INTERVAL);
};

// ── Stop polling (call on logout) ─────────────────────────────
const stopNotifPolling = () => {
  if (_notifPollTimer) clearInterval(_notifPollTimer);
};

// Auto-start when script is loaded
startNotifPolling();