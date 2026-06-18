/* e:\Jobs\ncttx-main\app.js */

// Global State
let tasks = [];
let logs = [];
let currentTab = 'checklist';
let currentProductFilter = 'all'; // 'all', 'ws', 'e50', 'edp30', 'tea'
let dragTaskEl = null;
let editingTaskId = null;

// Product Data Mapping for Labels/Titles
const PRODUCT_INFO = {
  'ws': { name: 'Combo Workshop', badge: 'ws-theme', code: 'WS' },
  'e50': { name: 'Elixir 50ml: Đà Lạt hiên nhà', badge: 'e50-theme', code: 'E50' },
  'edp30': { name: 'EDP 30ml: Xuân hạ thu đông', badge: 'edp30-theme', code: 'EDP30' },
  'tea': { name: 'Các loại trà: Oolong, Xuân, Matcha', badge: 'tea-theme', code: 'TEA' }
};

// Department Options
const DEPARTMENTS = [
  'Sản xuất',
  'Truyền thông & MKT',
  'Vận hành & Thiết kế',
  'Nhân sự'
];

// Initial default data if LocalStorage is empty
const defaultTasks = [
  {
    id: 't1',
    title: "Chiết rót & dán nhãn nước hoa Elixir 50ml 'Đà Lạt bên hiên nhà'",
    desc: "Chiết rót mẻ nước hoa Elixir 50ml đầu tiên phục vụ chiến dịch hè, số lượng chỉ tiêu 100 chai. Đảm bảo vệ sinh phòng đóng chai.",
    dept: "Sản xuất",
    status: "todo",
    product: "e50",
    priority: "high",
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 't2',
    title: "Thiết kế poster & brochure cho Combo Workshop pha trà vẽ cốc",
    desc: "Thiết kế ấn phẩm truyền thông mang phong cách mộc mạc của quán. Chuẩn bị file in ấn trước ngày 25/6.",
    dept: "Truyền thông & MKT",
    status: "in-progress",
    product: "ws",
    priority: "medium",
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 't3',
    title: "Chuẩn bị hoa khô & tinh dầu thơm cho khu vực Workshop",
    desc: "Thu gom hoa cẩm tú cầu, hoa hồng khô, và sắp xếp dụng cụ làm nến thơm/xà phòng tại căn nhà gỗ phía sau quán.",
    dept: "Vận hành & Thiết kế",
    status: "review",
    product: "ws",
    priority: "low",
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: 't4',
    title: "Nhập trà oolong mật, trà xuân và matcha từ xưởng Bảo Lộc",
    desc: "Kiểm tra chất lượng đóng gói và bảo quản hút chân không. Sắp xếp lên kệ trưng bày phía trước quầy bar.",
    dept: "Sản xuất",
    status: "done",
    product: "tea",
    priority: "high",
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 't5',
    title: "Viết bài truyền thông giới thiệu BST nước hoa EDP 'Xuân, hạ, thu, đông, rồi lại Xuân'",
    desc: "Bài viết đính kèm hình ảnh mô tả nốt hương nhẹ nhàng của hoa hồng Đà Lạt, gỗ thông sương sớm qua đóng lá.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "edp30",
    priority: "medium",
    createdAt: Date.now() - 43200000
  },
  {
    id: 't6',
    title: "Tập huấn ngôn ngữ ký hiệu chủ đề Hè cho các bạn khiếm thính",
    desc: "Hướng dẫn các bạn pha chế và phục vụ quầy cách giới thiệu Combo Workshop và các loại trà mới bằng cử chỉ ấm áp.",
    dept: "Nhân sự",
    status: "in-progress",
    product: "tea",
    priority: "high",
    createdAt: Date.now() - 86400000 * 1.5
  },
  {
    id: 't7',
    title: "Thiết lập file Google Sheets theo dõi doanh thu chiến dịch Hè",
    desc: "Tách biệt doanh thu từ Combo Workshop, nước hoa Elixir, nước hoa EDP và trà tại quầy để báo cáo vào cuối tuần.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "ws",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't8',
    title: "Chụp ảnh lookbook nước hoa Elixir 50ml tại góc cửa sổ ngập nắng",
    desc: "Chụp ảnh sản phẩm với ánh nắng dịu buổi sáng Đà Lạt, kết hợp phụ kiện gỗ, hoa thông và ly trà xuân mộc mạc.",
    dept: "Truyền thông & MKT",
    status: "done",
    product: "e50",
    priority: "low",
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 't9',
    title: "Kiểm tra chất lượng bao bì & đầu xịt chai thủy tinh EDP 30ml",
    desc: "Đảm bảo chai nước hoa vòi xịt đều mịn, không bị rò rỉ khi di chuyển đường dài cho khách đặt ship.",
    dept: "Sản xuất",
    status: "review",
    product: "edp30",
    priority: "high",
    createdAt: Date.now() - 12000000
  },
  {
    id: 't10',
    title: "Thiết kế Form đăng ký & Landing Page giới thiệu Combo Workshop",
    desc: "Tạo biểu mẫu thu thập thông tin và trang giới thiệu trải nghiệm làm workshop tại quán.",
    dept: "Truyền thông & MKT",
    status: "done",
    product: "ws",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't11',
    title: "Đăng bài truyền thông giới thiệu và link đăng ký Workshop lên Fanpage",
    desc: "Lên bài viết kèm hình ảnh không gian thơ mộng của quán để thu hút khách đăng ký đặt trước.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't12',
    title: "Gửi email xác nhận đặt chỗ thành công cho khách hàng",
    desc: "Xác nhận thời gian, số lượng người tham gia và gửi hướng dẫn đường đi, chuẩn bị trước khi đến quán.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "ws",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't13',
    title: "Dọn dẹp và trang trí không gian khu vực làm Workshop tại quán",
    desc: "Bố trí bàn ghế gỗ, cắm hoa cẩm tú cầu tươi, sắp xếp ánh sáng vàng ấm cúng mang phong cách Đà Lạt.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "ws",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't14',
    title: "Chuẩn bị nguyên liệu và dụng cụ làm nến thơm/xà phòng thảo mộc",
    desc: "Chuẩn bị khuôn, cốc đo, sáp nến, bấc nến, thảo mộc khô Đà Lạt và tinh dầu thiên nhiên.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "ws",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't15',
    title: "Chuẩn bị menu nước uống bất kỳ phục vụ kèm tại quầy",
    desc: "Đảm bảo nguyên liệu trà oolong mật, trà xuân và matcha luôn sẵn sàng phục vụ khi khách làm workshop.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "ws",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't16',
    title: "In ấn bảng hướng dẫn các bước làm Workshop tại bàn",
    desc: "Thiết kế bảng hướng dẫn ngắn gọn bằng hình ảnh/chữ để khách hàng (đặc biệt là khách khiếm thính dễ theo dõi).",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "ws",
    priority: "low",
    createdAt: Date.now()
  },
  {
    id: 't17',
    title: "Phân công ca trực hướng dẫn workshop cho tình nguyện viên và nhân sự khiếm thính",
    desc: "Sắp xếp lịch làm việc cụ thể cho từng buổi, đảm bảo luôn có người hỗ trợ khách làm sản phẩm.",
    dept: "Nhân sự",
    status: "todo",
    product: "ws",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't18',
    title: "Tập huấn quy trình đón tiếp và check-in khách đặt trước qua Form",
    desc: "Hướng dẫn nhân viên quầy cách tra cứu danh sách đăng ký từ Google Sheets, xác nhận và mời khách chọn nước.",
    dept: "Nhân sự",
    status: "todo",
    product: "ws",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't19',
    title: "Tổng hợp danh sách đăng ký và đối soát thanh toán đặt trước",
    desc: "Kiểm tra các giao dịch chuyển khoản đặt trước Combo, cập nhật trạng thái đã thanh toán vào Google Sheets.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "ws",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't20',
    title: "Lên kịch bản và quay video ngắn truyền thông nước hoa Elixir 50ml",
    desc: "Xây dựng video TikTok/Reels lột tả nốt hương thông sương mờ đặc trưng và kể câu chuyện về Quán của Thời Thanh Xuân.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "e50",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't21',
    title: "Lên lịch phát sóng Livestream bán nước hoa Elixir trên Tiktok/Shopee",
    desc: "Lên lịch live định kỳ, chuẩn bị kịch bản tương tác giới thiệu sản phẩm trực tiếp và xúc tiến đơn hàng.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "e50",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't22',
    title: "Thiết kế Landing Page bán hàng chuyên biệt cho nước hoa Elixir 50ml",
    desc: "Thiết kế trang Landing Page tối ưu chuyển đổi, nêu bật các tầng hương tinh tế và thiết kế bao bì nghệ thuật.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "e50",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't23',
    title: "Thiết lập tính năng gợi ý sản phẩm mua kèm (Cross-sell) trên Landing Page",
    desc: "Cài đặt thuật toán hoặc mục gợi ý: Khách mua nước hoa Elixir sẽ được gợi ý mua kèm Trà Oolong mật hoặc EDP 30ml.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "e50",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't24',
    title: "Đồng bộ tồn kho nước hoa Elixir 50ml lên hệ thống bán hàng KiotViet",
    desc: "Cập nhật chính xác số lượng tồn kho thực tế lên hệ thống KiotViet để tránh tình trạng lệch tồn kho khi bán đa kênh.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "e50",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't25',
    title: "Sản xuất chai mẫu thử (tester 2ml) nước hoa Elixir 50ml số lượng lớn",
    desc: "Chuẩn bị vỏ chai thủy tinh 2ml, vòi xịt mini và tiến hành chiết nước hoa làm mẫu thử tặng kèm khách hàng.",
    dept: "Sản xuất",
    status: "todo",
    product: "e50",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't26',
    title: "Đóng gói sẵn nước hoa Elixir 50ml kèm quà tặng nhỏ và thiệp cảm ơn",
    desc: "Hộp quà mộc mạc, kèm thiệp viết tay bằng cả tấm lòng của các bạn khiếm thính để gửi tới khách mua online.",
    dept: "Sản xuất",
    status: "todo",
    product: "e50",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't27',
    title: "Set up quầy trải nghiệm xịt thử nước hoa Elixir 50ml tại trung tâm quán",
    desc: "Thiết kế góc dùng thử nước hoa nhỏ xinh cạnh quầy trà, bày biện lọ dùng thử và thẻ ngửi hương.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "e50",
    priority: "low",
    createdAt: Date.now()
  },
  {
    id: 't28',
    title: "Thiết lập chương trình tặng mẫu thử (tester 2ml) nước hoa Elixir",
    desc: "Cài đặt chương trình: Mua hóa đơn bất kỳ tại quầy hoặc mua Trà online được tặng kèm 1 tester nước hoa Elixir.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "e50",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't29',
    title: "Thiết lập mã giảm giá và chương trình ưu đãi độc quyền trên Livestream",
    desc: "Thiết lập các mã voucher ngắn hạn phục vụ các khung giờ vàng livestream xúc tiến mua hàng ngay lập tức.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "e50",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't30',
    title: "Theo dõi doanh số bán hàng nước hoa qua KiotViet và báo cáo hàng tuần",
    desc: "Tổng hợp dữ liệu doanh số từ Landing Page, KiotViet, Livestream để đánh giá hiệu quả chương trình bán chéo.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "e50",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't31',
    title: "Kiểm kê số lượng tồn kho thực tế của các loại trà thảo mộc",
    desc: "Kiểm tra số lượng và hạn sử dụng trà oolong mật, trà xuân tại kho để lập kế hoạch giải phóng tồn kho.",
    dept: "Sản xuất",
    status: "todo",
    product: "tea",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't32',
    title: "Nghiên cứu và làm thử bánh cookies hương vị Matcha, Hojicha, Chocolate",
    desc: "Thử nghiệm công thức bánh ngọt khô ăn kèm trà, sử dụng nguyên liệu pha chế chất lượng sẵn có của quán.",
    dept: "Sản xuất",
    status: "todo",
    product: "tea",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't33',
    title: "Đóng gói set bột Matcha và Hojicha phục vụ khách tự pha chế",
    desc: "Chia bột matcha và bột hojicha thành các set nhỏ có kèm nhãn hướng dẫn định lượng chi tiết.",
    dept: "Sản xuất",
    status: "todo",
    product: "tea",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't34',
    title: "Setup góc trải nghiệm 'Tự tay làm một ly Matcha' tại quầy bar",
    desc: "Trang bị bát chasen, chổi chasen đánh trà, thìa tre múc bột và tờ hướng dẫn các bước đánh bọt Matcha Nhật Bản.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "tea",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't35',
    title: "Thiết kế góc trưng bày sản phẩm 'Văn hóa Trà và Thanh Xuân'",
    desc: "Trưng bày hộp trà oolong mật, trà xuân kèm hoa khô, ấm trà gốm mộc mạc và những thông điệp viết tay ấm áp.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "tea",
    priority: "low",
    createdAt: Date.now()
  },
  {
    id: 't36',
    title: "Nướng bánh cookies tươi (Matcha/Hojicha/Chocolate) phục vụ mỗi sáng",
    desc: "Lên lịch chuẩn bị nguyên liệu bột và nướng bánh tươi nóng hổi phục vụ khách dùng kèm trà.",
    dept: "Vận hành & Thiết kế",
    status: "todo",
    product: "tea",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't37',
    title: "Biên tập chuỗi bài viết đẩy mạnh truyền thông 'Văn hóa trà & Sự tĩnh lặng'",
    desc: "Viết bài chia sẻ nghệ thuật thưởng trà, giá trị tinh thần khi uống trà chậm rãi bên hiên nhà gỗ của quán.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "tea",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't38',
    title: "Thiết kế poster & video ngắn giới thiệu trải nghiệm tự làm Matcha",
    desc: "Chụp ảnh, quay video ngắn hướng dẫn dùng chổi chasen đánh matcha bọt mịn và thưởng thức kèm bánh cookies.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "tea",
    priority: "medium",
    createdAt: Date.now()
  },
  {
    id: 't39',
    title: "Tạo gói Combo ưu đãi 'Trà ấm & Bánh Cookies tươi' giải quyết tồn kho",
    desc: "Thiết kế ưu đãi ghép cặp trà oolong mật/trà xuân với set bánh cookies để đẩy mạnh doanh số bán kèm.",
    dept: "Truyền thông & MKT",
    status: "todo",
    product: "tea",
    priority: "high",
    createdAt: Date.now()
  },
  {
    id: 't40',
    title: "Đào tạo nhân viên khiếm thính kỹ năng hướng dẫn khách đánh matcha",
    desc: "Tập huấn các ngôn ngữ ký hiệu đơn giản để hướng dẫn khách cầm chổi chasen đánh trà tạo bọt mịn.",
    dept: "Nhân sự",
    status: "todo",
    product: "tea",
    priority: "high",
    createdAt: Date.now()
  }
];

const defaultLogs = [
  { type: 'info', text: 'Hệ thống quản lý dự án hè khởi tạo thành công!', time: '08:30:00' },
  { type: 'complete', text: 'Nhập trà oolong mật, trà xuân và matcha hoàn thành.', time: '09:15:20' },
  { type: 'add', text: 'Thêm công việc: Thiết lập file theo dõi doanh thu chiến dịch Hè.', time: '10:02:11' }
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

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    // Dynamic migration: if t31 doesn't exist, we add all new tasks to the existing task list
    const hasT31 = tasks.some(t => t.id === 't31');
    if (!hasT31) {
      const newTasksToInject = defaultTasks.filter(dt => !tasks.some(st => st.id === dt.id));
      if (newTasksToInject.length > 0) {
        tasks = [...tasks, ...newTasksToInject];
        saveTasksToStorage();
      }
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

  // Product Filter Selection (Sidebar)
  const productItems = document.querySelectorAll('.product-item');
  productItems.forEach(item => {
    item.addEventListener('click', () => {
      productItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      currentProductFilter = item.getAttribute('data-filter');
      
      // Update Kanban select filter as well to match
      const kanbanProductFilter = document.getElementById('filter-product');
      if (kanbanProductFilter) {
        kanbanProductFilter.value = currentProductFilter;
      }
      
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
    productItems.forEach(i => {
      i.classList.remove('active');
      if (i.getAttribute('data-filter') === currentProductFilter) {
        i.classList.add('active');
      }
    });
    renderApp();
  });

  // Modal actions
  const modal = document.getElementById('task-modal');
  const addTaskBtn = document.getElementById('btn-add-task');
  const cancelTaskBtn = document.getElementById('btn-cancel-task');
  const closeModalBtn = document.querySelector('.modal-close');
  const taskForm = document.getElementById('task-form');

  addTaskBtn.addEventListener('click', () => {
    editingTaskId = null;
    document.getElementById('modal-title').innerText = 'Thêm Công Việc Mới';
    taskForm.reset();
    modal.classList.add('active');
  });

  const closeModal = () => {
    modal.classList.remove('active');
    editingTaskId = null;
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
          status
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
        
        const pInfo = PRODUCT_INFO[task.product];
        const prodBadge = document.createElement('span');
        prodBadge.className = `badge badge-${task.product}`;
        prodBadge.innerText = pInfo ? pInfo.code : task.product;

        const priorityBadge = document.createElement('span');
        priorityBadge.className = `badge priority-${task.priority}`;
        priorityBadge.style.fontSize = '8.5px';
        priorityBadge.style.border = 'none';
        priorityBadge.innerText = task.priority === 'high' ? 'Khẩn' : (task.priority === 'medium' ? 'Thường' : 'Thấp');

        tagsRow.appendChild(prodBadge);
        tagsRow.appendChild(priorityBadge);

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
    const pInfo = PRODUCT_INFO[task.product];
    const prodBadge = document.createElement('span');
    prodBadge.className = `badge badge-${task.product}`;
    prodBadge.innerText = pInfo ? pInfo.code : task.product;

    footer.appendChild(deptSpan);
    footer.appendChild(prodBadge);

    card.appendChild(cardTop);
    card.appendChild(titleEl);
    card.appendChild(descEl);
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
  document.getElementById('task-status').value = task.status;

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

// Draw Product Line Distribution Chart
function renderProductChart() {
  const container = document.getElementById('chart-product-container');
  if (!container) return;

  container.innerHTML = '';

  Object.keys(PRODUCT_INFO).forEach(key => {
    const pInfo = PRODUCT_INFO[key];
    const prodTasks = tasks.filter(t => t.product === key);
    const total = prodTasks.length;
    const completed = prodTasks.filter(t => t.status === 'done').length;
    const pct = tasks.length > 0 ? Math.round((total / tasks.length) * 100) : 0;

    const item = document.createElement('div');
    item.className = 'chart-bar-item';
    item.innerHTML = `
      <div class="chart-label" title="${pInfo.name}">${pInfo.name}</div>
      <div class="chart-track">
        <div class="chart-fill prod-fill-${key}" style="width: ${pct}%;"></div>
      </div>
      <div class="chart-value">${total} việc (${pct}%)</div>
    `;
    container.appendChild(item);
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

function getTaskDates(taskId) {
  switch (taskId) {
    case 't4': return "10/06 - 18/06";
    case 't8': return "12/06 - 18/06";
    case 't10': return "10/06 - 17/06";
    case 't1': return "15/06 - 25/06";
    case 't2': return "18/06 - 26/06";
    case 't7': return "18/06 - 24/06";
    case 't11': return "18/06 - 25/06";
    case 't3': return "20/06 - 28/06";
    case 't6': return "20/06 - 27/06";
    case 't12': return "20/06 - 30/06";
    case 't14': return "20/06 - 28/06";
    case 't9': return "22/06 - 28/06";
    case 't13': return "22/06 - 29/06";
    case 't15': return "22/06 - 29/06";
    case 't17': return "24/06 - 29/06";
    case 't5': return "25/06 - 02/07";
    case 't16': return "25/06 - 30/06";
    case 't18': return "25/06 - 29/06";
    case 't19': return "28/06 - 05/07";
    case 't20': return "01/07 - 10/07";
    case 't22': return "01/07 - 08/07";
    case 't25': return "01/07 - 08/07";
    case 't23': return "03/07 - 10/07";
    case 't21': return "05/07 - 12/07";
    case 't24': return "05/07 - 09/07";
    case 't27': return "06/07 - 12/07";
    case 't26': return "08/07 - 15/07";
    case 't28': return "08/07 - 15/07";
    case 't29': return "10/07 - 15/07";
    case 't30': return "15/07 - 30/07";
    case 't31': return "15/07 - 20/07";
    case 't32': return "16/07 - 22/07";
    case 't40': return "17/07 - 23/07";
    case 't33': return "18/07 - 24/07";
    case 't34': return "18/07 - 23/07";
    case 't37': return "18/07 - 28/07";
    case 't35': return "20/07 - 26/07";
    case 't38': return "20/07 - 27/07";
    case 't39': return "22/07 - 31/07";
    case 't36': return "23/07 - 15/08";
    default: return "01/08 - 15/08";
  }
}

function renderTimeline() {
  const container = document.getElementById('timeline-path-container');
  if (!container) return;

  container.innerHTML = '';

  PHASES.forEach(phase => {
    let phaseTasks = [];
    if (phase.id === 4) {
      phaseTasks = tasks.filter(t => {
        const isMapped = PHASES.some(p => p.id !== 4 && p.taskIds.includes(t.id));
        return !isMapped;
      });
    } else {
      phaseTasks = tasks.filter(t => phase.taskIds.includes(t.id));
    }

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
        const dateA = getTaskDates(a.id).split(' - ')[0];
        const dateB = getTaskDates(b.id).split(' - ')[0];
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
        timeSpan.innerText = getTaskDates(task.id);

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

        const pInfo = PRODUCT_INFO[task.product];
        const prod = document.createElement('span');
        prod.className = `badge badge-${task.product}`;
        prod.innerText = pInfo ? pInfo.code : task.product;

        meta.appendChild(dept);
        meta.appendChild(prod);
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
