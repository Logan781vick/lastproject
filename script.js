// Data
const safetyTips = [
  "Never talk to strangers online or offline.",
  "Always tell a trusted adult where you are going.",
  "Do not share personal info like your address or school name.",
  "If something feels wrong, speak up immediately.",
  "Use strong passwords for devices and ask for help from parents."
];

// Elements
const tipsList = document.getElementById('tips-list');
const toggleBtn = document.getElementById('toggleBtn');
const contentWrapper = document.getElementById('contentWrapper');
const toast = document.getElementById('toast');

const reportForm = document.getElementById('reportForm');
const adminSection = document.getElementById('admin');
const adminMsg = document.getElementById('adminMsg');
const adminReports = document.getElementById('adminReports');

// Login modal
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const doLogin = document.getElementById('doLogin');
const closeLogin = document.getElementById('closeLogin');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

let reportsStore = []; // in-memory for demo
let adminLoggedIn = false;

// populate tips
safetyTips.forEach(tip => {
  const li = document.createElement('li');
  li.textContent = tip;
  tipsList.appendChild(li);
});

// toggle reveal with animation
toggleBtn.addEventListener('click', () => {
  if (contentWrapper.classList.contains('hidden')) {
    contentWrapper.classList.remove('hidden');
    // add reveal animation
    setTimeout(()=> contentWrapper.classList.add('reveal'), 30);
    toggleBtn.textContent = "HIDE PLATFORM";
  } else {
    contentWrapper.classList.add('hidden');
    contentWrapper.classList.remove('reveal');
    toggleBtn.textContent = "PRESS ME TO SEE Child Safety & Awareness Platform";
  }
});

// show toast helper
function showToast(msg, timeout = 3000) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(()=> toast.classList.add('hidden'), 400);
  }, timeout);
}

// form submission (front-end demo)
reportForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim() || 'Anonymous';
  const issue = document.getElementById('issue').value.trim();
  if (!issue) {
    showToast('Please describe the issue before submitting.');
    return;
  }

  const report = {
    id: Date.now(),
    name,
    issue,
    createdAt: new Date().toISOString()
  };

  // For demo: store locally and show toast
  reportsStore.unshift(report);
  showToast('Thank you — your report was submitted.');

  // reset form
  reportForm.reset();

  // If admin is logged in update dashboard
  if (adminLoggedIn) updateAdminList();
  console.log('Report submitted:', report);

  /* === OPTIONAL BACKEND: choose one ===

  // 1) To send to PHP backend, uncomment and provide endpoint:
  // fetch('/submit_report.php', {
  //   method: 'POST',
  //   headers: {'Content-Type':'application/json'},
  //   body: JSON.stringify(report)
  // }).then(r => r.json()).then(resp => console.log(resp));

  // 2) To send to Firebase Firestore, add Firebase config and uncomment:
  // firebase.firestore().collection('reports').add(report)
  //   .then(() => console.log('Saved to Firebase'));
  */
});

// Admin login flow (mock)
loginBtn.addEventListener('click', () => {
  loginModal.classList.remove('hidden');
});

closeLogin.addEventListener('click', () => {
  loginModal.classList.add('hidden');
});

// simple front-end credential check (demo only)
doLogin.addEventListener('click', () => {
  const email = loginEmail.value.trim();
  const pwd = loginPassword.value.trim();
  // Demo credentials: admin@site.com / admin123
  if (email === 'admin@site.com' && pwd === 'admin123') {
    adminLoggedIn = true;
    loginModal.classList.add('hidden');
    showToast('Admin signed in');
    // reveal admin dashboard
    adminSection.classList.remove('hidden');
    updateAdminList();
  } else {
    showToast('Invalid credentials (demo).');
  }
});

// update admin list UI
function updateAdminList(){
  adminReports.innerHTML = '';
  if (reportsStore.length === 0) {
    adminMsg.textContent = 'No reports yet.';
  } else {
    adminMsg.textContent = `Showing ${reportsStore.length} report(s) — newest first.`;
    reportsStore.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${r.name}</strong> — <small>${new Date(r.createdAt).toLocaleString()}</small><div>${escapeHtml(r.issue)}</div>`;
      adminReports.appendChild(li);
    });
  }
}

// small helper to avoid naive HTML injection in demo
function escapeHtml(s){
  return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

// on load: keep content hidden until user presses button
document.addEventListener('DOMContentLoaded', () => {
  // leave hidden until button click; you can auto-open by uncommenting:
  // toggleBtn.click();
});
