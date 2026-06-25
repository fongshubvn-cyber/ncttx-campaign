/* e:\Jobs\ncttx-main\app.js */

// Global State
let tasks = [];
let logs = [];
let currentTab = 'checklist';
let currentProductFilter = 'all'; // 'all', 'ws', 'e50', 'edp30', 'tea'
let dragTaskEl = null;
let editingTaskId = null;

// Dynamic Campaigns List
let campaigns = [];

const defaultCampaigns = [
  { id: "ws", name: "Combo Workshop & Nước", code: "WS", color: "#e5b25d" },
  { id: "e50", name: "Nước hoa Elixir 50ml", code: "E50", color: "#ca6a4b" },
  { id: "edp30", name: "Nước hoa EDP 30ml", code: "EDP30", color: "#5f8dcd" },
  { id: "tea", name: "Các Loại Trà Thảo Mộc", code: "TEA", color: "#89b057" }
];

function getCampaignInfo(campaignId) {
  return campaigns.find(c => c.id === campaignId) || { name: campaignId, code: campaignId.toUpperCase(), color: '#5e826b' };
}

function hexToRgba(hex, alpha) {
  if (!hex || hex.indexOf('#') !== 0) return `rgba(255, 255, 255, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Department Options
const DEPARTMENTS = [
  'Bán hàng',
  'Kinh doanh',
  'Pha chế',
  'Vấn đề chung',
  'Truyền thông & MKT',
  'Phòng hệ thống'
];

// Initial default data if LocalStorage is empty
const defaultTasks = [
  {
    id: "duy1",
    title: "Workshop nước hoa",
    desc: "Setup, tạo quy trình, vận hành",
    dept: "Bán hàng",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Trọng Duy",
    supporter: "Thuỳ Dương",
    startDate: "19/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: "duy2",
    title: "Xử lý thủ tục đối soát hàng hoá Thời Thanh Xuân và 12 Trương Công Định",
    desc: "Thực hiện đối soát số lượng và doanh thu hàng hoá giữa các chi nhánh.",
    dept: "Kinh doanh",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Trọng Duy",
    supporter: "",
    startDate: "19/06/2026",
    endDate: "20/06/2026",
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: "duy3",
    title: "Chương trình bán hàng tháng 7/2026",
    desc: "Lên kế hoạch và triển khai chương trình ưu đãi bán hàng cho tháng 7.",
    dept: "Bán hàng",
    status: "todo",
    product: "ws",
    priority: "medium",
    owner: "Nguyễn Trọng Duy",
    supporter: "Thuỳ Dương",
    startDate: "20/06/2026",
    endDate: "25/06/2026",
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: "duy4",
    title: "Lên kế hoạch kinh doanh offline xử lý tồn kho 3 mã sản phẩm: Lá bạc, Trà, Nước hoa Đà Lạt bên hiên nhà",
    desc: "Tập trung giải phóng hàng tồn kho cho 3 sản phẩm chủ lực qua kênh trực tiếp.",
    dept: "Bán hàng",
    status: "todo",
    product: "tea",
    priority: "high",
    owner: "Nguyễn Trọng Duy",
    supporter: "Thuỳ Dương",
    startDate: "20/06/2026",
    endDate: "21/06/2026",
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: "duy5",
    title: "Điều chỉnh mã hàng kiotviet cho toàn hệ thống: Thời Thanh Xuân, 12 Trương Công Định",
    desc: "Cập nhật và chuẩn hoá mã vạch, thông tin sản phẩm trên phần mềm KiotViet.",
    dept: "Bán hàng",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Trọng Duy",
    supporter: "",
    startDate: "21/06/2026",
    endDate: "21/06/2026",
    createdAt: Date.now()
  },
  {
    id: "duy6",
    title: "Tuyển dụng đủ: 3 nhân sự bán hàng, 1 nhân sự workshop nước hoa, 1 nhân sự vệ sinh",
    desc: "Lên tin tuyển dụng, phỏng vấn và tiếp nhận nhân sự mới phục vụ mùa hè.",
    dept: "Vấn đề chung",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Trọng Duy",
    supporter: "Nguyễn Hoàng Phi",
    startDate: "21/06/2026",
    endDate: "25/06/2026",
    createdAt: Date.now()
  },
  {
    id: "duy7",
    title: "Ra mắt món bánh mới",
    desc: "Hoàn thiện công thức, chuẩn bị nguyên liệu và chạy thử món bánh mới tại quầy bar.",
    dept: "Pha chế",
    status: "todo",
    product: "tea",
    priority: "high",
    owner: "Nguyễn Trọng Duy",
    supporter: "Thuỳ Dương",
    startDate: "22/06/2026",
    endDate: "23/06/2026",
    createdAt: Date.now()
  },
  {
    id: "duy8",
    title: "Bắt đầu kế hoạch kinh doanh offline xử lý tồn kho 3 mã sản phẩm: Lá bạc, Trà, Nước hoa Đà Lạt bên hiên nhà",
    desc: "Chính thức triển khai bán hàng offline, đẩy mạnh tiếp thị trực tiếp tại quán.",
    dept: "Bán hàng",
    status: "todo",
    product: "tea",
    priority: "high",
    owner: "Nguyễn Trọng Duy",
    supporter: "Thuỳ Dương",
    startDate: "22/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now()
  },
  // Marketing Team Tasks
  {
    id: "mkt1",
    title: "Content Giới Thiệu Give Me A Little Time",
    desc: "Số lượng: 5 bài content giới thiệu chương trình ý nghĩa Give Me A Little Time.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "20/06/2026",
    endDate: "25/06/2026",
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: "mkt2",
    title: "Content Giới Thiệu Workshop 200k",
    desc: "Số lượng: 10 bài content giới thiệu chi tiết về Workshop tự làm sản phẩm trị giá 200k.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "20/06/2026",
    endDate: "25/06/2026",
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: "mkt3",
    title: "Content Giới Thiệu Set Trà 100k",
    desc: "Số lượng: 5 bài content giới thiệu set trà quà tặng mang đậm phong vị Đà Lạt.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "tea",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "20/06/2026",
    endDate: "25/06/2026",
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: "mkt4",
    title: "Content Bán Trà/Bánh Cookie",
    desc: "Số lượng: 10 bài content đẩy mạnh bán chéo set trà thơm ấm và bánh cookie giòn ngon.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "tea",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "20/06/2026",
    endDate: "25/06/2026",
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: "mkt5",
    title: "Content Bán Nước Hoa ĐLNBHN",
    desc: "Số lượng: 10 bài content giới thiệu và đẩy bán dòng nước hoa Đà Lạt Bên Hiên Nhà.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "e50",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "21/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now()
  },
  {
    id: "mkt6",
    title: "Buổi Live Stream Các Hoạt Động Tại Quán",
    desc: "Số lượng: 3 buổi livestream chia sẻ không gian bình yên và các hoạt động thường nhật ấm cúng tại quán.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "21/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now()
  },
  {
    id: "mkt7",
    title: "Buổi Live Stream Bán Hàng",
    desc: "Số lượng: 10 buổi livestream giới thiệu và thúc đẩy doanh số bán các sản phẩm trực tiếp.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "e50",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "22/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now()
  },
  {
    id: "mkt8",
    title: "Content Giới Thiệu Workshop Khách Đoàn",
    desc: "Số lượng: 5 bài viết giới thiệu gói workshop thiết kế riêng cho các đoàn khách du lịch và doanh nghiệp.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "22/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now()
  },
  {
    id: "mkt9",
    title: "Content Giới Thiệu CT 1000 Chiếc Ô",
    desc: "Số lượng: 3 bài viết giới thiệu chương trình tặng/mượn 1000 chiếc ô đầy ý nghĩa tại Đà Lạt.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "22/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now()
  },
  {
    id: "mkt10",
    title: "Content giảm 50%hs-sv",
    desc: "Số lượng: 5 bài truyền thông chương trình ưu đãi đặc biệt giảm 50% cho học sinh - sinh viên.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "high",
    owner: "Nguyễn Hoàng Phi",
    supporter: "Team Marketing",
    startDate: "22/06/2026",
    endDate: "30/06/2026",
    createdAt: Date.now()
  }
];

const defaultLogs = [
  { type: 'info', text: 'Hệ thống quản lý dự án hè khởi tạo thành công!', time: '08:30:00' },
  { type: 'add', text: 'Đã tải danh sách công việc chính thức từ Duy & Team Marketing.', time: '09:00:00' }
];

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  setupEventListeners();
});

// Authentication Checker
function checkAuthentication() {
  const auth = localStorage.getItem('ncttx_auth');
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('app-container');

  if (auth === 'true') {
    if (loginScreen) loginScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'flex';
    initData();
    updateProjectDeadlineCountdown();
    renderApp();
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
  }
}

// Initialize Data from LocalStorage
function initData() {
  const storedTasks = localStorage.getItem('ncttx_tasks');
  const storedLogs = localStorage.getItem('ncttx_logs');
  const storedCampaigns = localStorage.getItem('ncttx_campaigns');

  if (storedCampaigns) {
    campaigns = JSON.parse(storedCampaigns);
  } else {
    campaigns = [...defaultCampaigns];
    saveCampaignsToStorage();
  }

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    // Dynamic migration: if duy1 doesn't exist, we replace everything with the new official tasks
    const hasDuy1 = tasks.some(t => t.id === 'duy1');
    if (!hasDuy1) {
      tasks = [...defaultTasks];
      saveTasksToStorage();
    }
  } else {
    tasks = [...defaultTasks];
    saveTasksToStorage();
  }

  if (storedLogs) {
    logs = JSON.parse(storedLogs);
  } else {
    logs = [...defaultLogs];
    saveLogsToStorage();
  }

  // Populate dynamic options
  renderCampaigns();
}

function saveCampaignsToStorage() {
  localStorage.setItem('ncttx_campaigns', JSON.stringify(campaigns));
}

function renderCampaigns() {
  // 1. Render sidebar list
  const sidebarList = document.getElementById('sidebar-product-list');
  if (sidebarList) {
    sidebarList.innerHTML = '';
    
    // Add "All" option
    const allItem = document.createElement('div');
    allItem.className = `product-item ${currentProductFilter === 'all' ? 'active' : ''}`;
    allItem.setAttribute('data-filter', 'all');
    allItem.innerHTML = `
      <div class="product-name">Tất cả sản phẩm</div>
      <div class="product-desc">Hiển thị mọi công việc của dự án hè.</div>
    `;
    allItem.addEventListener('click', () => handleProductFilterClick('all'));
    sidebarList.appendChild(allItem);

    // Add each campaign
    campaigns.forEach(c => {
      const item = document.createElement('div');
      item.className = `product-item ${currentProductFilter === c.id ? 'active' : ''}`;
      item.setAttribute('data-filter', c.id);
      
      // Apply custom left border indicator
      item.style.borderLeft = `4px solid ${c.color}`;
      
      item.innerHTML = `
        <div class="product-name" style="color: var(--text-main); font-weight: 500;">${c.name}</div>
        <div class="product-desc">Nhóm công việc thuộc dòng ${c.name} (${c.code}).</div>
      `;
      item.addEventListener('click', () => handleProductFilterClick(c.id));
      sidebarList.appendChild(item);
    });
  }

  // 2. Render Kanban filter dropdown
  const filterSelect = document.getElementById('filter-product');
  if (filterSelect) {
    const val = filterSelect.value || currentProductFilter;
    filterSelect.innerHTML = `<option value="all">Tất cả Sản phẩm</option>`;
    campaigns.forEach(c => {
      filterSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
    filterSelect.value = val;
  }

  // 3. Render Modal task form select
  const formSelect = document.getElementById('task-product');
  if (formSelect) {
    formSelect.innerHTML = '';
    campaigns.forEach(c => {
      formSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }
}

function handleProductFilterClick(filterVal) {
  currentProductFilter = filterVal;
  
  // Highlight active items
  const items = document.querySelectorAll('.product-item');
  items.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-filter') === filterVal) {
      item.classList.add('active');
    }
  });

  // Sync Kanban filter value
  const kanbanSelect = document.getElementById('filter-product');
  if (kanbanSelect) {
    kanbanSelect.value = filterVal;
  }

  renderApp();
}

// Convert "DD/MM/YYYY" to "YYYY-MM-DD"
function dateToHtml(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return '';
}

// Convert "YYYY-MM-DD" to "DD/MM/YYYY"
function dateFromHtml(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return '';
}

// Convert "DD/MM/YYYY" to Date Object
function getTaskDateObj(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return null;
}

// Get dynamic project phase for a task (Phase 1 to 4)
function getTaskPhase(task) {
  const date = getTaskDateObj(task.endDate || task.startDate);
  if (!date) return 1;
  const month = date.getMonth() + 1; // 1-indexed
  const day = date.getDate();
  if (month === 6) {
    return 1;
  } else if (month === 7) {
    if (day <= 15) return 2;
    return 3;
  } else if (month === 8) {
    return 4;
  }
  return 1; // fallback
}

// Get formatted date range string for rendering
function getTaskDates(task) {
  if (task.startDate && task.endDate) {
    const startPart = task.startDate.split('/').slice(0, 2).join('/');
    const endPart = task.endDate.split('/').slice(0, 2).join('/');
    return `${startPart} - ${endPart}`;
  }
  return "Chưa rõ";
}

function saveTasksToStorage() {
  localStorage.setItem('ncttx_tasks', JSON.stringify(tasks));
}

function saveLogsToStorage() {
  localStorage.setItem('ncttx_logs', JSON.stringify(logs));
}

function logActivity(type, text) {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  logs.unshift({ type, text, time: timeStr });
  
  if (logs.length > 15) {
    logs.pop();
  }
  
  saveLogsToStorage();
  renderActivityLog();
}

// Render Entire App View
function renderApp() {
  updateGlobalStats();
  renderChecklist();
  renderKanban();
  renderReport();
  if (currentTab === 'timeline') {
    renderTimeline();
  }
}

// Update Header Stats
function updateGlobalStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById('stat-total-val').innerText = total;
  document.getElementById('stat-progress-val').innerText = inProgress;
  document.getElementById('stat-completion-val').innerText = `${rate}%`;
}

// Tab Switching
function setupEventListeners() {
  // Global Project Deadline picker change
  const deadlineInput = document.getElementById('project-deadline');
  if (deadlineInput) {
    let lastSavedDeadline = '';
    const saveDeadline = (e) => {
      const newDate = e.target.value;
      if (newDate && newDate !== lastSavedDeadline) {
        lastSavedDeadline = newDate;
        localStorage.setItem('ncttx_deadline', newDate);
        updateProjectDeadlineCountdown();
        
        // Log action
        const parts = newDate.split('-');
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        logActivity('info', `Cập nhật hạn chót dự án thành: ${formattedDate}`);
      }
    };
    deadlineInput.addEventListener('change', saveDeadline);
    deadlineInput.addEventListener('input', saveDeadline);
  }
  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('login-username').value.trim();
      const passwordInput = document.getElementById('login-password').value;

      if (usernameInput === 'admin' && passwordInput === 'ncttx2026') {
        if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        localStorage.setItem('ncttx_auth', 'true');
        checkAuthentication();
      } else {
        if (loginErrorMsg) loginErrorMsg.style.display = 'block';
        // Clear password field
        document.getElementById('login-password').value = '';
      }
    });
  }

  // Logout Trigger
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
        localStorage.removeItem('ncttx_auth');
        // Clear login fields
        const uInput = document.getElementById('login-username');
        const pInput = document.getElementById('login-password');
        if (uInput) uInput.value = '';
        if (pInput) pInput.value = '';
        if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        checkAuthentication();
      }
    });
  }

  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentTab = btn.getAttribute('data-tab');
      
      document.querySelectorAll('.tab-content-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      document.getElementById(`${currentTab}-tab-panel`).classList.add('active');
      
      renderApp();
    });
  });

  // Kanban Filter select inputs
  document.getElementById('filter-dept').addEventListener('change', (e) => {
    renderKanban();
  });
  document.getElementById('filter-product').addEventListener('change', (e) => {
    currentProductFilter = e.target.value;
    // Highlight sidebar active item accordingly
    const items = document.querySelectorAll('.product-item');
    items.forEach(i => {
      i.classList.remove('active');
      if (i.getAttribute('data-filter') === currentProductFilter) {
        i.classList.add('active');
      }
    });
    renderApp();
  });

  // Campaign Modal actions
  const campaignModal = document.getElementById('campaign-modal');
  const addCampaignBtn = document.getElementById('btn-add-campaign');
  const cancelCampaignBtn = document.getElementById('btn-cancel-campaign');
  const closeCampaignModalBtn = document.getElementById('btn-close-campaign-modal');
  const campaignForm = document.getElementById('campaign-form');

  if (addCampaignBtn) {
    addCampaignBtn.addEventListener('click', () => {
      campaignForm.reset();
      campaignModal.classList.add('active');
    });
  }

  const closeCampaignModal = () => {
    campaignModal.classList.remove('active');
  };

  if (closeCampaignModalBtn) closeCampaignModalBtn.addEventListener('click', closeCampaignModal);
  if (cancelCampaignBtn) cancelCampaignBtn.addEventListener('click', closeCampaignModal);
  if (campaignModal) {
    campaignModal.addEventListener('click', (e) => {
      if (e.target === campaignModal) closeCampaignModal();
    });
  }

  if (campaignForm) {
    campaignForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('campaign-name').value.trim();
      const code = document.getElementById('campaign-code').value.trim().toUpperCase();
      const color = document.getElementById('campaign-color').value;

      if (!name || !code) return;

      const id = 'camp_' + Date.now();
      const newCamp = { id, name, code, color };
      
      campaigns.push(newCamp);
      saveCampaignsToStorage();
      logActivity('add', `Thêm chiến dịch mới: ${name} (${code})`);
      
      renderCampaigns();
      closeCampaignModal();
      renderApp();
    });
  }

  // Modal actions
  const modal = document.getElementById('task-modal');
  const addTaskBtn = document.getElementById('btn-add-task');
  const cancelTaskBtn = document.getElementById('btn-cancel-task');
  const closeModalBtn = document.querySelector('.modal-close');
  const taskForm = document.getElementById('task-form');

  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      editingTaskId = null;
      document.getElementById('modal-title').innerText = 'Thêm Công Việc Mới';
      taskForm.reset();
      const statusSelect = document.getElementById('task-status');
      if (statusSelect) statusSelect.disabled = false;
      modal.classList.add('active');
    });
  }

  // Kanban columns localized Add buttons
  const colAddButtons = document.querySelectorAll('.column-add-btn');
  colAddButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      editingTaskId = null;
      document.getElementById('modal-title').innerText = 'Thêm Công Việc Mới';
      taskForm.reset();
      
      const status = btn.getAttribute('data-status');
      const statusSelect = document.getElementById('task-status');
      if (statusSelect) {
        statusSelect.value = status;
        statusSelect.disabled = true; // Lock status
      }
      modal.classList.add('active');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    editingTaskId = null;
    const statusSelect = document.getElementById('task-status');
    if (statusSelect) statusSelect.disabled = false;
  };

  closeModalBtn.addEventListener('click', closeModal);
  cancelTaskBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const dept = document.getElementById('task-dept').value;
    const product = document.getElementById('task-product').value;
    const priority = document.getElementById('task-priority').value;
    const status = document.getElementById('task-status').value;
    const owner = document.getElementById('task-owner').value.trim();
    const supporter = document.getElementById('task-supporter').value.trim();
    const startDate = dateFromHtml(document.getElementById('task-start-date').value);
    const endDate = dateFromHtml(document.getElementById('task-end-date').value);

    if (!title) return;

    if (editingTaskId) {
      // Edit mode
      const idx = tasks.findIndex(t => t.id === editingTaskId);
      if (idx !== -1) {
        const oldStatus = tasks[idx].status;
        tasks[idx] = {
          ...tasks[idx],
          title,
          desc,
          dept,
          product,
          priority,
          status,
          owner,
          supporter,
          startDate,
          endDate
        };
        logActivity('info', `Cập nhật công việc: ${title}`);
        if (oldStatus !== status) {
          logActivity('info', `Chuyển trạng thái sang: ${translateStatus(status)}`);
        }
      }
    } else {
      // New mode
      const newTask = {
        id: 'task_' + Date.now(),
        title,
        desc,
        dept,
        product,
        priority,
        status,
        owner,
        supporter,
        startDate,
        endDate,
        createdAt: Date.now()
      };
      tasks.push(newTask);
      logActivity('add', `Thêm mới công việc: ${title}`);
    }

    saveTasksToStorage();
    closeModal();
    renderApp();
  });

  // Setup HTML5 Drag and Drop handlers on columns
  const columns = document.querySelectorAll('.kanban-column');
  columns.forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('dragenter', handleDragEnter);
    column.addEventListener('dragleave', handleDragLeave);
    column.addEventListener('drop', handleDrop);
  });
}

function translateStatus(status) {
  switch (status) {
    case 'todo': return 'Cần làm';
    case 'in-progress': return 'Đang làm';
    case 'review': return 'Kiểm duyệt';
    case 'done': return 'Hoàn thành';
    default: return status;
  }
}

// --- RENDER TAB 1: CHECKLIST ---
function renderChecklist() {
  const container = document.getElementById('checklist-container-div');
  if (!container) return;
  
  container.innerHTML = '';

  DEPARTMENTS.forEach(dept => {
    // Filter tasks for this department, and respect product filter
    const deptTasksAll = tasks.filter(t => t.dept === dept);
    const deptTasksFiltered = deptTasksAll.filter(t => 
      currentProductFilter === 'all' || t.product === currentProductFilter
    );

    const total = deptTasksFiltered.length;
    const completed = deptTasksFiltered.filter(t => t.status === 'done').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const deptCard = document.createElement('div');
    deptCard.className = 'dept-card';

    // Header
    const header = document.createElement('div');
    header.className = 'dept-header';
    header.innerHTML = `
      <h3 class="dept-name">
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.047 1.077-2.84.286-.325.617-.597.936-.88Z"/>
        </svg>
        ${dept}
      </h3>
      <span class="dept-badge">${completed}/${total}</span>
    `;

    // Progress Bar
    const progressDiv = document.createElement('div');
    progressDiv.className = 'dept-progress-container';
    progressDiv.innerHTML = `
      <div class="progress-label-row">
        <span>Tiến độ hoàn thành</span>
        <span>${pct}%</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${pct}%;"></div>
      </div>
    `;

    // Checklist list container
    const listContainer = document.createElement('div');
    listContainer.className = 'checklist-list';

    if (deptTasksFiltered.length === 0) {
      listContainer.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding: 20px 0;">Chưa có việc nào của dòng sản phẩm này.</p>`;
    } else {
      // Sort tasks: Active first, Completed last, then by title
      const sortedTasks = [...deptTasksFiltered].sort((a, b) => {
        if ((a.status === 'done') !== (b.status === 'done')) {
          return a.status === 'done' ? 1 : -1;
        }
        return a.title.localeCompare(b.title);
      });

      sortedTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `checklist-item ${task.status === 'done' ? 'completed' : ''}`;
        
        // Custom Checkbox
        const chkBox = document.createElement('div');
        chkBox.className = 'custom-checkbox';
        chkBox.innerHTML = `
          <input type="checkbox" ${task.status === 'done' ? 'checked' : ''} data-id="${task.id}">
          <span class="checkmark"></span>
        `;

        const chk = chkBox.querySelector('input');
        chk.addEventListener('change', (e) => {
          const tId = e.target.getAttribute('data-id');
          const tIdx = tasks.findIndex(t => t.id === tId);
          if (tIdx !== -1) {
            const isChecked = e.target.checked;
            tasks[tIdx].status = isChecked ? 'done' : 'todo';
            logActivity(isChecked ? 'complete' : 'info', `Checklist: Đánh dấu '${tasks[tIdx].title}' là ${isChecked ? 'Hoàn thành' : 'Cần làm'}`);
            saveTasksToStorage();
            renderApp();
          }
        });

        // Details
        const details = document.createElement('div');
        details.className = 'item-details';
        
        const titleEl = document.createElement('div');
        titleEl.className = 'item-text';
        titleEl.innerText = task.title;

        // Tags
        const tagsRow = document.createElement('div');
        tagsRow.className = 'item-tags';
        
        const pInfo = getCampaignInfo(task.product);
        const prodBadge = document.createElement('span');
        prodBadge.className = `badge`;
        prodBadge.style.background = hexToRgba(pInfo.color, 0.15);
        prodBadge.style.color = pInfo.color;
        prodBadge.style.border = `1.5px solid ${pInfo.color}`;
        prodBadge.innerText = pInfo.code;

        const priorityBadge = document.createElement('span');
        priorityBadge.className = `badge priority-${task.priority}`;
        priorityBadge.style.fontSize = '8.5px';
        priorityBadge.style.border = 'none';
        priorityBadge.innerText = task.priority === 'high' ? 'Khẩn' : (task.priority === 'medium' ? 'Thường' : 'Thấp');

        tagsRow.appendChild(prodBadge);
        tagsRow.appendChild(priorityBadge);

        if (task.owner) {
          const ownerBadge = document.createElement('span');
          ownerBadge.className = 'badge';
          ownerBadge.style.fontSize = '8.5px';
          ownerBadge.style.border = 'none';
          ownerBadge.style.background = 'rgba(94, 130, 107, 0.15)';
          ownerBadge.style.color = 'var(--text-muted)';
          ownerBadge.innerText = `👤 ${task.owner}` + (task.supporter ? ` + ${task.supporter}` : '');
          tagsRow.appendChild(ownerBadge);
        }

        if (task.startDate && task.endDate) {
          const dateBadge = document.createElement('span');
          dateBadge.className = 'badge';
          dateBadge.style.fontSize = '8.5px';
          dateBadge.style.border = 'none';
          dateBadge.style.background = 'rgba(202, 106, 75, 0.15)';
          dateBadge.style.color = 'var(--terracotta)';
          const sPart = task.startDate.split('/').slice(0, 2).join('/');
          const ePart = task.endDate.split('/').slice(0, 2).join('/');
          dateBadge.innerText = `📅 ${sPart} - ${ePart}`;
          tagsRow.appendChild(dateBadge);
        }

        details.appendChild(titleEl);
        details.appendChild(tagsRow);

        item.appendChild(chkBox);
        item.appendChild(details);
        listContainer.appendChild(item);
      });
    }

    // Quick add task form
    const quickAdd = document.createElement('div');
    quickAdd.className = 'quick-add-task';
    quickAdd.innerHTML = `
      <input type="text" placeholder="Thêm việc nhanh cho ${dept}..." class="quick-input">
      <button class="quick-add-btn">
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
      </button>
    `;

    const input = quickAdd.querySelector('.quick-input');
    const btn = quickAdd.querySelector('.quick-add-btn');

    const handleQuickAdd = () => {
      const title = input.value.trim();
      if (!title) return;
      
      const newT = {
        id: 'task_' + Date.now(),
        title,
        desc: `Công việc được tạo nhanh cho ${dept}.`,
        dept: dept,
        status: 'todo',
        product: currentProductFilter === 'all' ? 'ws' : currentProductFilter, // Match current filter
        priority: 'medium',
        createdAt: Date.now()
      };
      
      tasks.push(newT);
      logActivity('add', `Checklist: Thêm nhanh việc: ${title}`);
      saveTasksToStorage();
      renderApp();
    };

    btn.addEventListener('click', handleQuickAdd);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleQuickAdd();
    });

    deptCard.appendChild(header);
    deptCard.appendChild(progressDiv);
    deptCard.appendChild(listContainer);
    deptCard.appendChild(quickAdd);
    container.appendChild(deptCard);
  });
}

// --- RENDER TAB 2: KANBAN ---
function renderKanban() {
  const selectDept = document.getElementById('filter-dept').value;
  
  // Update the select filters to match local storage/sidebar state on load
  const selectProduct = document.getElementById('filter-product');
  if (selectProduct && selectProduct.value !== currentProductFilter) {
    selectProduct.value = currentProductFilter;
  }

  // Filter tasks based on filters
  const filteredTasks = tasks.filter(task => {
    const matchDept = (selectDept === 'all' || task.dept === selectDept);
    const matchProd = (currentProductFilter === 'all' || task.product === currentProductFilter);
    return matchDept && matchProd;
  });

  const columns = {
    'todo': document.getElementById('col-todo-cards'),
    'in-progress': document.getElementById('col-progress-cards'),
    'review': document.getElementById('col-review-cards'),
    'done': document.getElementById('col-done-cards')
  };

  // Clear all columns
  Object.keys(columns).forEach(k => {
    if (columns[k]) {
      columns[k].innerHTML = '';
      // Update badge count
      const countEl = document.getElementById(`count-${k}`);
      if (countEl) {
        countEl.innerText = filteredTasks.filter(t => t.status === k).length;
      }
    }
  });

  filteredTasks.forEach(task => {
    const colContainer = columns[task.status];
    if (!colContainer) return;

    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', task.id);

    // Draggable event listeners
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    // Card Top
    const cardTop = document.createElement('div');
    cardTop.className = 'card-top';
    
    const prioritySpan = document.createElement('span');
    prioritySpan.className = `card-priority priority-${task.priority}`;
    prioritySpan.innerText = task.priority === 'high' ? 'Khẩn' : (task.priority === 'medium' ? 'Thường' : 'Thấp');

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'card-actions';
    
    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'card-action-btn';
    editBtn.innerHTML = `
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.46-.325z"/>
      </svg>
    `;
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(task);
    });

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'card-action-btn delete-btn';
    deleteBtn.innerHTML = `
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
      </svg>
    `;
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Bạn có chắc chắn muốn xóa công việc: "${task.title}"?`)) {
        tasks = tasks.filter(t => t.id !== task.id);
        logActivity('delete', `Đã xóa công việc: ${task.title}`);
        saveTasksToStorage();
        renderApp();
      }
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    cardTop.appendChild(prioritySpan);
    cardTop.appendChild(actionsDiv);

    // Title & Desc
    const titleEl = document.createElement('h4');
    titleEl.className = 'card-title';
    titleEl.innerText = task.title;

    const descEl = document.createElement('p');
    descEl.className = 'card-desc';
    descEl.innerText = task.desc || 'Chưa có mô tả chi tiết.';

    // Owner & Dates Row in Kanban card
    const cardMetaRow = document.createElement('div');
    cardMetaRow.className = 'card-meta-row';
    cardMetaRow.style.display = 'flex';
    cardMetaRow.style.justifyContent = 'space-between';
    cardMetaRow.style.alignItems = 'center';
    cardMetaRow.style.marginTop = '8px';
    cardMetaRow.style.marginBottom = '8px';
    cardMetaRow.style.fontSize = '11px';
    cardMetaRow.style.color = 'var(--text-muted)';
    
    let ownerText = '';
    if (task.owner) {
      ownerText = `👤 ${task.owner}`;
      if (task.supporter) {
        ownerText += ` + ${task.supporter}`;
      }
    }
    
    let dateText = '';
    if (task.startDate && task.endDate) {
      const sDate = task.startDate.split('/').slice(0, 2).join('/');
      const eDate = task.endDate.split('/').slice(0, 2).join('/');
      dateText = `📅 ${sDate} - ${eDate}`;
    }
    
    cardMetaRow.innerHTML = `
      <span>${ownerText}</span>
      <span>${dateText}</span>
    `;

    // Card Footer
    const footer = document.createElement('div');
    footer.className = 'card-footer';
    
    // Department Badge
    const deptSpan = document.createElement('span');
    deptSpan.className = 'card-dept';
    deptSpan.innerHTML = `
      <svg width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
      </svg>
      ${task.dept}
    `;

    // Product Code Badge
    const pInfo = getCampaignInfo(task.product);
    const prodBadge = document.createElement('span');
    prodBadge.className = `badge`;
    prodBadge.style.background = hexToRgba(pInfo.color, 0.15);
    prodBadge.style.color = pInfo.color;
    prodBadge.style.border = `1.5px solid ${pInfo.color}`;
    prodBadge.innerText = pInfo.code;

    footer.appendChild(deptSpan);
    footer.appendChild(prodBadge);

    card.appendChild(cardTop);
    card.appendChild(titleEl);
    card.appendChild(descEl);
    card.appendChild(cardMetaRow);
    card.appendChild(footer);

    colContainer.appendChild(card);
  });
}

function openEditModal(task) {
  editingTaskId = task.id;
  document.getElementById('modal-title').innerText = 'Chỉnh Sửa Công Việc';
  
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-desc').value = task.desc || '';
  document.getElementById('task-dept').value = task.dept;
  document.getElementById('task-product').value = task.product;
  document.getElementById('task-priority').value = task.priority;
  
  const statusSelect = document.getElementById('task-status');
  if (statusSelect) {
    statusSelect.value = task.status;
    statusSelect.disabled = false; // Enable status editing
  }
  
  document.getElementById('task-owner').value = task.owner || '';
  document.getElementById('task-supporter').value = task.supporter || '';
  document.getElementById('task-start-date').value = dateToHtml(task.startDate);
  document.getElementById('task-end-date').value = dateToHtml(task.endDate);

  document.getElementById('task-modal').classList.add('active');
}

// Drag and Drop Logic Handlers
function handleDragStart(e) {
  dragTaskEl = this;
  this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  dragTaskEl = null;
  // Remove border indicators from all columns
  document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); 
  }
  return false;
}

function handleDragEnter(e) {
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();
  
  const id = e.dataTransfer.getData('text/plain');
  const targetColId = this.getAttribute('id'); // e.g. col-todo, col-progress
  
  let targetStatus = '';
  if (targetColId === 'col-todo') targetStatus = 'todo';
  else if (targetColId === 'col-progress') targetStatus = 'in-progress';
  else if (targetColId === 'col-review') targetStatus = 'review';
  else if (targetColId === 'col-done') targetStatus = 'done';
  
  if (id && targetStatus) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1 && tasks[idx].status !== targetStatus) {
      const oldStatus = tasks[idx].status;
      tasks[idx].status = targetStatus;
      logActivity('complete', `Kéo thả: Di chuyển '${tasks[idx].title}' từ [${translateStatus(oldStatus)}] sang [${translateStatus(targetStatus)}]`);
      saveTasksToStorage();
      renderApp();
    }
  }
  return false;
}

// --- RENDER TAB 3: REPORT & METRICS ---
function renderReport() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Progress Ring calculations
  const circle = document.getElementById('progress-ring-circle-element');
  if (circle) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius; // Approx 502.65
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    const offset = circumference - (rate / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    // Percent text
    document.getElementById('report-pct-text').innerText = `${rate}%`;
  }

  // Text metrics
  document.getElementById('lbl-report-total').innerText = total;
  document.getElementById('lbl-report-done').innerText = completed;
  document.getElementById('lbl-report-progress').innerText = tasks.filter(t => t.status === 'in-progress').length;
  document.getElementById('lbl-report-review').innerText = tasks.filter(t => t.status === 'review').length;
  document.getElementById('lbl-report-todo').innerText = tasks.filter(t => t.status === 'todo').length;

  // Render Charts
  renderDepartmentChart();
  renderProductChart();
  renderActivityLog();
}

// Draw Department Completion Chart
function renderDepartmentChart() {
  const container = document.getElementById('chart-dept-container');
  if (!container) return;

  container.innerHTML = '';

  DEPARTMENTS.forEach(dept => {
    const deptTasks = tasks.filter(t => t.dept === dept);
    const total = deptTasks.length;
    const completed = deptTasks.filter(t => t.status === 'done').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const item = document.createElement('div');
    item.className = 'chart-bar-item';
    item.innerHTML = `
      <div class="chart-label" title="${dept}">${dept}</div>
      <div class="chart-track">
        <div class="chart-fill dept-fill" style="width: ${pct}%;"></div>
      </div>
      <div class="chart-value">${completed}/${total} (${pct}%)</div>
    `;
    container.appendChild(item);
  });
}

// Draw Campaign-wise detailed reports with task lists
function renderProductChart() {
  const container = document.getElementById('campaign-report-list-container');
  if (!container) return;

  container.innerHTML = '';

  campaigns.forEach(c => {
    const prodTasks = tasks.filter(t => t.product === c.id);
    const total = prodTasks.length;
    const completed = prodTasks.filter(t => t.status === 'done').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const card = document.createElement('div');
    card.className = 'campaign-report-card';
    card.style.borderLeft = `4px solid ${c.color}`;

    // Header with name & completion %
    const header = document.createElement('div');
    header.className = 'campaign-report-header';
    header.innerHTML = `
      <div class="campaign-report-title">
        <span class="badge" style="background: ${hexToRgba(c.color, 0.15)}; color: ${c.color}; border: 1.5px solid ${c.color};">${c.code}</span>
        ${c.name}
      </div>
      <div class="campaign-report-pct">${completed}/${total} việc (${pct}%)</div>
    `;

    // Progress bar
    const barBg = document.createElement('div');
    barBg.className = 'campaign-report-bar-bg';
    barBg.innerHTML = `
      <div class="campaign-report-bar-fill" style="width: ${pct}%; background: ${c.color};"></div>
    `;

    // Task list
    const tasksDiv = document.createElement('div');
    tasksDiv.className = 'campaign-report-tasks';

    if (prodTasks.length === 0) {
      tasksDiv.innerHTML = `<p style="font-size:12px; color:var(--text-muted); padding: 5px 0; text-align:center; font-style:italic;">Chưa có công việc nào cho chiến dịch này.</p>`;
    } else {
      // Sort tasks: Active first, Done last
      const sortedTasks = [...prodTasks].sort((a, b) => {
        if ((a.status === 'done') !== (b.status === 'done')) {
          return a.status === 'done' ? 1 : -1;
        }
        return a.title.localeCompare(b.title);
      });

      sortedTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'campaign-task-item';
        
        let metaText = `Ban ${task.dept}`;
        if (task.owner) {
          metaText += ` | 👤 ${task.owner}`;
          if (task.supporter) metaText += ` + ${task.supporter}`;
        }
        if (task.endDate) {
          metaText += ` | 📅 Hạn: ${task.endDate}`;
        }

        item.innerHTML = `
          <div class="campaign-task-info">
            <div class="campaign-task-title" style="${task.status === 'done' ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</div>
            <div class="campaign-task-meta">${metaText}</div>
          </div>
          <div class="campaign-task-status">
            <span class="status-badge status-badge-${task.status === 'in-progress' ? 'progress' : task.status}" style="font-size:10px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">
              ${translateStatus(task.status)}
            </span>
          </div>
        `;
        tasksDiv.appendChild(item);
      });
    }

    card.appendChild(header);
    card.appendChild(barBg);
    card.appendChild(tasksDiv);
    container.appendChild(card);
  });
}

// Render Recent Log List
function renderActivityLog() {
  const container = document.getElementById('activity-list-container');
  if (!container) return;

  container.innerHTML = '';

  if (logs.length === 0) {
    container.innerHTML = `<p style="font-size:12px; color:var(--text-muted); text-align:center; padding: 20px 0;">Chưa có hoạt động nào được ghi nhận.</p>`;
    return;
  }

  logs.forEach(log => {
    const item = document.createElement('div');
    item.className = `activity-item ${log.type}`;
    item.innerHTML = `
      <div class="activity-details">
        <div>${log.text}</div>
        <div class="activity-time">${log.time}</div>
      </div>
    `;
    container.appendChild(item);
  });
}

// --- TAB 4: TIMELINE RENDERING ---
const PHASES = [
  {
    id: 1,
    name: "Giai đoạn 1: Chuẩn bị & Thiết lập",
    dates: "10/06 - 30/06",
    desc: "Tập trung chuẩn bị nguyên liệu trà, sản xuất mẻ nước hoa đầu, setup không gian và lập form đăng ký.",
    taskIds: ['t1', 't2', 't3', 't4', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15', 't16', 't17', 't18']
  },
  {
    id: 2,
    name: "Giai đoạn 2: Khởi chạy & Truyền thông",
    dates: "01/07 - 15/07",
    desc: "Đăng bài truyền thông giới thiệu nước hoa & workshop, gửi email xác nhận đặt chỗ, ra mắt Landing page, sản xuất mẫu thử.",
    taskIds: ['t5', 't19', 't20', 't21', 't22', 't23', 't24', 't25', 't26', 't27', 't28', 't29']
  },
  {
    id: 3,
    name: "Giai đoạn 3: Bán hàng & Trải nghiệm",
    dates: "16/07 - 31/07",
    desc: "Đẩy mạnh các buổi livestream bán nước hoa, mở góc trải nghiệm tự pha matcha tại quán, chạy combo trà & bánh cookies.",
    taskIds: ['t30', 't31', 't32', 't33', 't34', 't35', 't37', 't38', 't39', 't40']
  },
  {
    id: 4,
    name: "Giai đoạn 4: Vận hành & Báo cáo",
    dates: "01/08 - 15/08",
    desc: "Vận hành nướng bánh cookies tươi hằng ngày phục vụ khách thưởng trà, tổng kết doanh thu và tối ưu hóa tồn kho.",
    taskIds: ['t36']
  }
];

function renderTimeline() {
  const container = document.getElementById('timeline-path-container');
  if (!container) return;

  container.innerHTML = '';

  PHASES.forEach(phase => {
    // Filter tasks dynamically using getTaskPhase
    const phaseTasks = tasks.filter(t => getTaskPhase(t) === phase.id);

    // Filter by current product sidebar filter if active
    const filteredPhaseTasks = phaseTasks.filter(t => 
      currentProductFilter === 'all' || t.product === currentProductFilter
    );

    const total = filteredPhaseTasks.length;
    const completed = filteredPhaseTasks.filter(t => t.status === 'done').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    const section = document.createElement('div');
    section.className = 'timeline-phase-section';
    section.innerHTML = `
      <div class="phase-card-header">
        <div class="phase-title-group">
          <h3 class="phase-title-text">${phase.name}</h3>
          <span class="phase-date-range">Thời gian: ${phase.dates}</span>
        </div>
        <div class="phase-progress-widget">
          <div class="phase-progress-bar-bg">
            <div class="phase-progress-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <span class="phase-progress-percent">${pct}%</span>
        </div>
      </div>
      <p style="font-size:12.5px; color:var(--text-muted); line-height:1.5; font-style:italic;">${phase.desc}</p>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'timeline-items-wrapper';

    if (filteredPhaseTasks.length === 0) {
      wrapper.innerHTML = `<p style="font-size:12px; color:var(--text-muted); padding: 10px 0;">Không có đầu việc nào thuộc giai đoạn này cho dòng sản phẩm đang chọn.</p>`;
    } else {
      const sortedTasks = [...filteredPhaseTasks].sort((a, b) => {
        const dateA = getTaskDates(a).split(' - ')[0];
        const dateB = getTaskDates(b).split(' - ')[0];
        return dateA.localeCompare(dateB);
      });

      sortedTasks.forEach(task => {
        const item = document.createElement('div');
        item.className = `timeline-task-item ${task.status}`;
        
        const dot = document.createElement('div');
        dot.className = 'timeline-task-dot';
        
        const card = document.createElement('div');
        card.className = 'timeline-task-card';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'timeline-task-time';
        timeSpan.innerText = getTaskDates(task);

        const details = document.createElement('div');
        details.className = 'timeline-task-details';
        
        const title = document.createElement('div');
        title.className = 'timeline-task-title';
        title.innerText = task.title;

        const meta = document.createElement('div');
        meta.className = 'timeline-task-meta';
        
        const dept = document.createElement('span');
        dept.className = 'timeline-task-dept';
        dept.innerHTML = `<strong>${task.dept}</strong>`;

        const pInfo = getCampaignInfo(task.product);
        const prod = document.createElement('span');
        prod.className = `badge`;
        prod.style.background = hexToRgba(pInfo.color, 0.15);
        prod.style.color = pInfo.color;
        prod.style.border = `1.5px solid ${pInfo.color}`;
        prod.innerText = pInfo.code;

        meta.appendChild(dept);
        meta.appendChild(prod);
        
        // Owner and supporter meta info
        if (task.owner) {
          const ownerMeta = document.createElement('span');
          ownerMeta.className = 'timeline-task-owner';
          ownerMeta.style.marginLeft = '8px';
          ownerMeta.style.fontSize = '11px';
          ownerMeta.style.color = 'var(--text-muted)';
          ownerMeta.innerText = `👤 ${task.owner}` + (task.supporter ? ` + ${task.supporter}` : '');
          meta.appendChild(ownerMeta);
        }

        details.appendChild(title);
        details.appendChild(meta);

        const statusBadgeDiv = document.createElement('div');
        statusBadgeDiv.className = 'timeline-task-status-badge';
        
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge status-badge-${task.status === 'in-progress' ? 'progress' : task.status}`;
        statusBadge.innerText = translateStatus(task.status);

        statusBadgeDiv.appendChild(statusBadge);

        card.appendChild(timeSpan);
        card.appendChild(details);
        card.appendChild(statusBadgeDiv);

        item.appendChild(dot);
        item.appendChild(card);
        wrapper.appendChild(item);
      });
    }

    section.appendChild(wrapper);
    container.appendChild(section);
  });
}

// Global Project Deadline Countdown calculator
function updateProjectDeadlineCountdown() {
  const deadlineInput = document.getElementById('project-deadline');
  const countdownBadge = document.getElementById('deadline-countdown');
  if (!deadlineInput || !countdownBadge) return;

  let deadlineDateStr = localStorage.getItem('ncttx_deadline');
  if (!deadlineDateStr) {
    deadlineDateStr = '2026-08-15'; // Default end date of summer project (Phase 4)
    localStorage.setItem('ncttx_deadline', deadlineDateStr);
  }

  deadlineInput.value = deadlineDateStr;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(deadlineDateStr);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  countdownBadge.className = 'deadline-countdown-badge';

  if (diffDays > 5) {
    countdownBadge.innerText = `Còn ${diffDays} ngày`;
  } else if (diffDays > 0) {
    countdownBadge.innerText = `Còn ${diffDays} ngày`;
    countdownBadge.classList.add('warning');
  } else if (diffDays === 0) {
    countdownBadge.innerText = `Hôm nay hạn chót!`;
    countdownBadge.classList.add('warning');
  } else {
    countdownBadge.innerText = `Quá hạn ${Math.abs(diffDays)} ngày`;
    countdownBadge.classList.add('overdue');
  }
}
