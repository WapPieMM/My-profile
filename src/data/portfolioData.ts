export type ProjectCategory = 'all' | 'product' | 'brand' | 'mobile';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'all'>;
  categoryLabel: string;
  year: string;
  duration: string;
  client: string;
  role: string;
  featuredWide?: boolean;
  image: string;
  fallbackGradient: string;
  summary: string;
  challenge: string;
  solution: string;
  impactMetric: string;
  impactDetail: string;
  deliverables: string[];
  techAndTools: string[];
  liveUrl: string;
}

export interface ExperienceItem {
  index: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  description: string;
  keyAchievement: string;
}

export interface CraftCapability {
  index: string;
  title: string;
  englishTitle: string;
  description: string;
  deliverables: string[];
  tools: string[];
  typicalTimeline: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  beforeOutcome: string;
  author: string;
  role: string;
  organization: string;
  projectRef: string;
}

export const PROFILE_DATA = {
  brandWordmark: 'Napat.Studio',
  fullNameThai: 'ณภัทร วรโชติเมธี',
  fullNameEn: 'Napat Worachotmethee',
  roleTitle: 'Lead Product Designer & Full-Stack Creative Developer',
  location: 'กรุงเทพมหานคร · รับงานอิสระและที่ปรึกษาโปรเจกต์ · พร้อมเริ่มงานทันที',
  headline: 'ออกแบบและพัฒนาดิจิทัลโปรดักต์ที่เรียบง่าย ชัดเจน และสร้างผลลัพธ์ทางธุรกิจที่วัดผลได้จริง',
  leadBio:
    'นักออกแบบผลิตภัณฑ์ดิจิทัลและนักพัฒนา Full-Stack ประสบการณ์กว่า 7 ปี เชี่ยวชาญการเปลี่ยนโจทย์ธุรกิจที่ซับซ้อนให้กลายเป็นเว็บไซต์ แพลตฟอร์ม SaaS และแอปพลิเคชันที่ใช้งานลื่นไหลบนทุกหน้าจอ พร้อมส่งมอบงานมาตรฐานสากลสำหรับองค์กร สตาร์ทอัพ และผู้ว่าจ้างบน LinkedIn และแพลตฟอร์มฟรีแลนซ์',
  philosophyQuote:
    'ความมินิมอลไม่ใช่การตัดทอนจนว่างเปล่า แต่คือการจัดลำดับความสำคัญให้ผู้ใช้งานเข้าถึงคุณค่าหลักของผลิตภัณฑ์ได้โดยไร้แรงเสียดทาน',
  biographyParagraphs: [
    'เริ่มต้นสายงานจากการเป็นสถาปนิกออกแบบพื้นที่ ก่อนผันตัวเข้าสู่วงการ Digital Product Design และ Frontend Engineering เต็มตัว ทำให้ทุกโปรเจกต์ที่รับผิดชอบมีการวางโครงสร้างสารสนเทศ (Information Architecture) ที่แข็งแรง ผสานกับความประณีตในระดับพิกเซล',
    'ตลอด 7 ปีที่ผ่านมา ได้ร่วมงานกับทีมโปรดักต์ทั้งในไทย สิงคโปร์ และยุโรป ตั้งแต่การทำ UX Research, วางระบบ Design System ใน Figma ไปจนถึงการเขียนโค้ด React, TypeScript และ Next.js ที่ปรับแต่งประสิทธิภาพให้โหลดเร็วและรองรับการใช้งานบนมือถืออย่างสมบูรณ์แบบ',
  ],
  heroImage: '/src/assets/images/hero_freelance_portrait_1794909444521.jpg',
  email: 'napat.work@studio-napat.com',
  linkedinHandle: 'linkedin.com/in/napat-worachot',
  fastworkHandle: 'fastwork.co/user/napatstudio',
  githubHandle: 'github.com/napat-studio',
  lineId: '@napat.studio',
  phone: '089-452-9180',
  responseSla: 'ตอบกลับภายใน 3 ชั่วโมงทำการ (จันทร์–เสาร์)',
};

export const HERO_METRICS = [
  {
    value: '7+ ปี',
    label: 'ประสบการณ์สายตรงด้าน UX/UI และการพัฒนาเว็บแอปพลิเคชัน',
    context: '2019 — ปัจจุบัน',
  },
  {
    value: '42 โปรเจกต์',
    label: 'ส่งมอบสำเร็จให้สตาร์ทอัพและองค์กรใน 5 ประเทศ',
    context: 'อัตราการส่งมอบตรงเวลา 100%',
  },
  {
    value: '+138%',
    label: 'ค่าเฉลี่ยการเพิ่มขึ้นของ Conversion Rate หลังปรับปรุง UX',
    context: 'วัดผลภายใน 6 เดือนหลังเปิดตัว',
  },
  {
    value: '4.98 / 5.0',
    label: 'คะแนนความพึงพอใจจากผู้ว่าจ้างจริงและรีวิวบน LinkedIn',
    context: 'อัตราการจ้างซ้ำ 76%',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'vela-wealth-analytics',
    title: 'Vela Wealth & Portfolio Analytics',
    subtitle: 'แพลตฟอร์มบริหารพอร์ตการลงทุนและวิเคราะห์ข้อมูลการเงินแบบเรียลไทม์',
    category: 'product',
    categoryLabel: 'UX/UI & Web Application',
    year: '2026',
    duration: '10 สัปดาห์',
    client: 'Vela Capital (Singapore)',
    role: 'Lead Product Designer & Frontend Architect',
    featuredWide: true,
    image: '/src/assets/images/project_fintech_platform_1794909443952.jpg',
    fallbackGradient: 'from-zinc-900 via-zinc-800 to-stone-900',
    summary:
      'ออกแบบและพัฒนาแดชบอร์ดบริหารสินทรัพย์สำหรับนักลงทุนรายใหญ่และที่ปรึกษาทางการเงิน โดยเน้นการแสดงผลกราฟและตัวเลขจำนวนมากให้อ่านง่าย สบายตา และใช้งานผ่านสมาร์ทโฟนได้ครบทุกฟังก์ชัน',
    challenge:
      'ระบบเดิมมีตารางข้อมูลซับซ้อนกว่า 40 คอลัมน์ ทำให้ผู้ใช้งานบนมือถือไม่สามารถตรวจสอบสัดส่วนพอร์ตได้สะดวก ส่งผลให้อัตราการใช้งานรายวันบนสมาร์ทโฟนต่ำกว่า 18%',
    solution:
      'จัดระเบียบลำดับชั้นข้อมูลใหม่ทั้งหมดด้วยหลักการ Progressive Disclosure สร้างระบบ Typographic Scale ที่ใช้ตัวเลขแบบ Tabular Numerals และพัฒนา Responsive Component Library ด้วย React และ Tailwind CSS',
    impactMetric: '+164% การใช้งานผ่านมือถือใน 90 วัน',
    impactDetail: 'ลดเวลาเฉลี่ยในการค้นหารายงานสรุปพอร์ตจาก 4.2 นาที เหลือเพียง 45 วินาที',
    deliverables: [
      'UX Research & Information Architecture',
      'Design System (120+ Components บน Figma)',
      'Responsive React & TypeScript Frontend',
      'Interactive Data Visualization Modules',
    ],
    techAndTools: ['Figma', 'React 19', 'TypeScript', 'Tailwind CSS', 'Data Visualization'],
    liveUrl: 'https://vela-analytics-demo.studio-napat.com',
  },
  {
    id: 'aethel-roasters-identity',
    title: 'Aethel Specialty Coffee & Monograph',
    subtitle: 'อัตลักษณ์แบรนด์ ระบบบรรจุภัณฑ์ และเว็บไซต์เล่าเรื่องราวโรงคั่วกาแฟเฉพาะทาง',
    category: 'brand',
    categoryLabel: 'Brand Identity & Editorial Web',
    year: '2025',
    duration: '6 สัปดาห์',
    client: 'Aethel Roasters (Bangkok & London)',
    role: 'Art Director & Digital Designer',
    featuredWide: false,
    image: '/src/assets/images/project_brand_identity_1794909444929.jpg',
    fallbackGradient: 'from-stone-800 via-stone-700 to-zinc-900',
    summary:
      'สร้างสรรค์ระบบอัตลักษณ์แบรนด์และแพลตฟอร์ม D2C สำหรับโรงคั่วกาแฟพิเศษที่ต้องการสะท้อนความประณีตระดับห้องเสื้อ ผ่านการจัดวางตัวอักษรแบบ Editorial Monograph และโทนสีธรรมชาติ',
    challenge:
      'แบรนด์ต้องการขยายตลาดสู่กลุ่มโรงแรมบูทีคและลูกค้าออนไลน์ระดับพรีเมียม แต่ขาดภาษาภาพที่เป็นเอกลักษณ์และเว็บไซต์เดิมไม่รองรับระบบสมัครสมาชิกเมล็ดกาแฟรายเดือน',
    solution:
      'ออกแบบระบบ Typography คู่ขนานระหว่าง Serif และ Grotesque Sans พร้อมพัฒนาหน้าเว็บ Storytelling ที่เล่าแหล่งปลูกกาแฟควบคู่กับการสั่งซื้อแบบไร้รอยต่อใน 3 ขั้นตอน',
    impactMetric: '+210% ยอดสั่งซื้อออนไลน์แบบ Subscription',
    impactDetail: 'ได้รับคัดเลือกวางจำหน่ายในคาเฟ่และโรงแรมบูทีค 14 แห่งภายในไตรมาสแรก',
    deliverables: [
      'Brand Strategy & Visual Identity Guideline',
      'Packaging & Print Monograph System',
      'Editorial E-Commerce Website Design',
    ],
    techAndTools: ['Editorial Typography', 'Art Direction', 'Figma', 'Webflow / React'],
    liveUrl: 'https://aethel-roasters.studio-napat.com',
  },
  {
    id: 'nordic-spaces-commerce',
    title: 'Nordic Spaces Architectural Living',
    subtitle: 'แพลตฟอร์มอีคอมเมิร์ซเฟอร์นิเจอร์มินิมอลพร้อมระบบจำลองการจัดวางในพื้นที่จริง',
    category: 'product',
    categoryLabel: 'UX/UI & Web Application',
    year: '2025',
    duration: '8 สัปดาห์',
    client: 'Nordic Spaces Co., Ltd.',
    role: 'UX/UI Designer & Frontend Developer',
    featuredWide: false,
    image: '/src/assets/images/project_ecommerce_design_1794909446446.jpg',
    fallbackGradient: 'from-stone-200 via-zinc-200 to-stone-300',
    summary:
      'ยกระดับประสบการณ์การเลือกซื้อเฟอร์นิเจอร์ดีไซน์สแกนดิเนเวียบนเว็บไซต์ให้เหมือนการเดินชมแกลเลอรีสถาปัตยกรรม พร้อมระบบเปรียบเทียบขนาดและวัสดุแบบละเอียด',
    challenge:
      'ลูกค้าลังเลในการสั่งซื้อเฟอร์นิเจอร์ชิ้นใหญ่ผ่านทางออนไลน์เนื่องจากไม่เห็นรายละเอียดพื้นผิววัสดุและสัดส่วนเมื่อเทียบกับห้องจริง ทำให้มีอัตราการละทิ้งตะกร้าสินค้าสูงถึง 78%',
    solution:
      'ออกแบบหน้ารายละเอียดสินค้าใหม่ให้เน้นภาพถ่ายความละเอียดสูงแบบเต็มพื้นที่ ผสานตารางเปรียบเทียบมิติสินค้าและตัวเลือกวัสดุที่สลับดูได้ทันทีโดยไม่ต้องโหลดหน้าใหม่',
    impactMetric: '-34% อัตราการละทิ้งตะกร้าสินค้าใน 4 เดือน',
    impactDetail: 'เพิ่มมูลค่าการสั่งซื้อเฉลี่ยต่อบิล (AOV) สูงขึ้น 42% จากฟีเจอร์จับคู่เซ็ตเฟอร์นิเจอร์',
    deliverables: [
      'E-Commerce UX Audit & Checkout Flow Redesign',
      'Interactive Material & Dimension Inspector',
      'High-Performance Frontend Implementation',
    ],
    techAndTools: ['React', 'TypeScript', 'Tailwind CSS', 'Shopify Headless API'],
    liveUrl: 'https://nordic-spaces.studio-napat.com',
  },
  {
    id: 'mindful-rituals-mobile',
    title: 'Mindful Rituals — Daily Focus & Habit iOS',
    subtitle: 'แอปพลิเคชันจัดระเบียบวินัยและสมาธิรายวันด้วยดีไซน์แบบ Quiet Typography',
    category: 'mobile',
    categoryLabel: 'Mobile Product Design',
    year: '2026',
    duration: '7 สัปดาห์',
    client: 'Serene Labs (Melbourne)',
    role: 'Product Designer',
    featuredWide: false,
    image: '/src/assets/images/project_mobile_wellness_1794909446935.jpg',
    fallbackGradient: 'from-zinc-900 via-stone-800 to-zinc-800',
    summary:
      'ออกแบบแอปพลิเคชันติดตามกิจวัตรประจำวันและฝึกสมาธิบนระบบ iOS ที่ตัดสิ่งรบกวนสายตาออกทั้งหมด ใช้การจัดวางตัวอักษรและพื้นผิวโทนอุ่นเพื่อให้ผู้ใช้รู้สึกสงบตั้งแต่เปิดแอป',
    challenge:
      'แอปติดตามนิสัยส่วนใหญ่ในตลาดเต็มไปด้วยกราฟสีฉูดฉาดและป้ายแจ้งเตือนแบบเกม (Gamification) ซึ่งสร้างความเครียดให้ผู้ใช้แทนที่จะช่วยให้เกิดสมาธิ',
    solution:
      'สร้างอินเทอร์เฟซแบบ Calm Technology ที่เน้นข้อความสั้นกระชับ การโต้ตอบด้วยท่าทางสัมผัส (Gesture-first) ที่ลื่นไหลด้วยมือเดียว และการสรุปผลรายสัปดาห์ที่อ่านง่ายเหมือนสมุดบันทึกส่วนตัว',
    impactMetric: '4.9 ดาว บน App Store (จากรีวิวกว่า 2,400 รายการ)',
    impactDetail: 'อัตราผู้ใช้งานต่อเนื่องครบ 30 วัน (Day-30 Retention) สูงถึง 61% สูงกว่าค่าเฉลี่ยอุตสาหกรรม 2.4 เท่า',
    deliverables: [
      'End-to-End iOS App UX/UI Design',
      'Micro-interaction & Haptic Feedback Spec',
      'Dark & Warm-Light Adaptive Theme System',
    ],
    techAndTools: ['Figma', 'iOS Human Interface Guidelines', 'Prototyping', 'Design Tokens'],
    liveUrl: 'https://mindful-rituals.studio-napat.com',
  },
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    index: '01.',
    period: '2023 — ปัจจุบัน',
    role: 'Independent Product Designer & Full-Stack Consultant',
    organization: 'Napat Studio (ฟรีแลนซ์เต็มเวลาและที่ปรึกษาอิสระ)',
    location: 'กรุงเทพฯ · ทำงานร่วมกับทีมทั่วโลกแบบ Remote',
    description:
      'ดูแลโปรเจกต์ออกแบบ UX/UI และพัฒนาเว็บไซต์/เว็บแอปพลิเคชันแบบครบวงจรให้กับสตาร์ทอัพและองค์กรชั้นนำ ตั้งแต่การตีโจทย์ธุรกิจ วางระบบ Design System ไปจนถึงการเขียนโค้ด Production',
    keyAchievement: 'ส่งมอบโปรเจกต์สำเร็จกว่า 25 โปรเจกต์ พร้อมคะแนนรีวิว 4.98/5.0 และอัตราการกลับมาจ้างซ้ำ 76%',
  },
  {
    index: '02.',
    period: '2021 — 2023',
    role: 'Senior Product Designer (Design Systems & Web Platform)',
    organization: 'Krono Digital Ventures',
    location: 'สิงคโปร์ / กรุงเทพฯ (Hybrid)',
    description:
      'เป็นผู้นำทีมออกแบบผลิตภัณฑ์การเงินและ B2B SaaS ดูแลการสร้างระบบ Design System กลางที่เชื่อมโยงนักออกแบบ 8 คน และทีมวิศวกรซอฟต์แวร์กว่า 30 คนให้ทำงานบนมาตรฐานเดียวกัน',
    keyAchievement: 'ลดระยะเวลาในการพัฒนาฟีเจอร์หน้าบ้าน (Frontend Delivery Time) ลง 40% และเพิ่ม Conversion ของหน้าสมัครใช้งาน 115%',
  },
  {
    index: '03.',
    period: '2019 — 2021',
    role: 'UI/UX Designer & Creative Frontend Developer',
    organization: 'Atelier Nord Interactive Agency',
    location: 'กรุงเทพมหานคร',
    description:
      'ออกแบบและพัฒนาเว็บไซต์แคมเปญ อีคอมเมิร์ซ และพอร์ตโฟลิโอระดับพรีเมียมสำหรับแบรนด์ไลฟ์สไตล์ อสังหาริมทรัพย์ และสตูดิโอสถาปัตยกรรม โดยเน้นความลื่นไหลบนสมาร์ทโฟน',
    keyAchievement: 'ผลงานได้รับรางวัลด้านการออกแบบเว็บไซต์ระดับภูมิภาค 3 รางวัล และทำคะแนน Google Core Web Vitals เฉลี่ย 98/100',
  },
];

export const CRAFT_CAPABILITIES: CraftCapability[] = [
  {
    index: '01.',
    title: 'การออกแบบประสบการณ์และส่วนติดต่อผู้ใช้ (UX/UI & Product Design)',
    englishTitle: 'Product Strategy, UX Architecture & Design Systems',
    description:
      'วิเคราะห์พฤติกรรมผู้ใช้ จัดโครงสร้างเนื้อหาให้เข้าใจง่าย และออกแบบหน้าจอที่สวยงามเหนือกาลเวลา พร้อมระบบคอมโพเนนต์ที่ทีมนักพัฒนาสามารถนำไปต่อยอดได้ทันที',
    deliverables: [
      'User Journey, Wireframe & Interactive Prototype',
      'Responsive Web & Mobile App UI (iOS / Android)',
      'Scalable Figma Design System & Token Documentation',
      'UX Audit & Conversion Rate Optimization (CRO)',
    ],
    tools: ['Figma', 'FigJam', 'Maze', 'Design Tokens', 'WCAG AA Accessibility'],
    typicalTimeline: '2 – 6 สัปดาห์',
  },
  {
    index: '02.',
    title: 'การพัฒนาเว็บไซต์และเว็บแอปพลิเคชัน (Full-Stack & Frontend Engineering)',
    englishTitle: 'Modern Web Engineering & Responsive Architecture',
    description:
      'เปลี่ยนไฟล์ดีไซน์ให้กลายเป็นเว็บไซต์จริงที่โหลดเร็ว รองรับ SEO แสดงผลแม่นยำทุกขนาดหน้าจอตั้งแต่สมาร์ทโฟนจนถึงจอมอนิเตอร์ขนาดใหญ่ พร้อมโค้ดที่สะอาดและดูแลรักษาง่าย',
    deliverables: [
      'React, TypeScript & Next.js Web Applications',
      'High-Conversion Landing Pages & Corporate Websites',
      'Micro-interactions & Smooth Motion Architecture',
      'API Integration & Performance Optimization',
    ],
    tools: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js / Express', 'Vite / Next.js'],
    typicalTimeline: '3 – 8 สัปดาห์',
  },
  {
    index: '03.',
    title: 'อัตลักษณ์แบรนด์และทิศทางศิลป์ดิจิทัล (Brand & Digital Direction)',
    englishTitle: 'Minimalist Brand Identity & Editorial Storytelling',
    description:
      'วางบุคลิกภาพของแบรนด์ให้โดดเด่นและน่าเชื่อถือผ่านระบบตัวอักษร โทนสี และการจัดวางองค์ประกอบศิลป์แบบมินิมอล เหมาะสำหรับธุรกิจที่ต้องการยกระดับภาพลักษณ์สู่สากล',
    deliverables: [
      'Visual Identity, Logo & Typography System',
      'Brand Guidelines & Digital Asset Kit',
      'Art Direction สำหรับภาพถ่ายสินค้าและพอร์ตโฟลิโอ',
      'Pitch Deck & Executive Presentation Design',
    ],
    tools: ['Typography Curation', 'Editorial Layout', 'Brand Systems', 'Print & Digital Specs'],
    typicalTimeline: '3 – 5 สัปดาห์',
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'test-1',
    quote:
      'คุณณภัทรไม่ได้แค่ทำเว็บให้สวย แต่ช่วยเราจัดโครงสร้างการนำเสนอข้อมูลการเงินที่ซับซ้อนให้เข้าใจง่ายขึ้นมาก ทีมวิศวกรของเราประทับใจไฟล์ส่งมอบและโค้ด React ที่เป็นระเบียบสุดๆ',
    beforeOutcome:
      'จากเดิมที่ลูกค้าใช้เวลาทำความเข้าใจหน้าแดชบอร์ดนานเกิน 4 นาที หลังปรับโฉมใหม่ ยอดผู้ใช้งานประจำผ่านมือถือเพิ่มขึ้น +164% ภายใน 90 วันแรก',
    author: 'Daniel Lim',
    role: 'Head of Product',
    organization: 'Vela Capital (Singapore)',
    projectRef: 'Vela Wealth & Portfolio Analytics',
  },
  {
    id: 'test-2',
    quote:
      'การทำงานร่วมกันราบรื่นและเป็นมืออาชีพมาก มีการอัปเดตความคืบหน้าชัดเจนทุกสัปดาห์ เว็บไซต์ใหม่สะท้อนตัวตนความมินิมอลของแบรนด์ได้ดีเยี่ยมและลื่นไหลมากเวลาลูกค้าเปิดดูผ่านมือถือ',
    beforeOutcome:
      'เปลี่ยนจากเว็บไซต์แคตตาล็อกแบบเดิมที่ลูกค้ามักปิดออกกลางคัน ให้กลายเป็นหน้าร้านออนไลน์ที่ลดอัตราละทิ้งตะกร้าลง -34% และเพิ่มยอดสั่งซื้อต่อบิลขึ้น 42%',
    author: 'ปาลิตา อัศวเมธี',
    role: 'Co-Founder & Managing Director',
    organization: 'Nordic Spaces Co., Ltd.',
    projectRef: 'Nordic Spaces Architectural Living',
  },
];

export const SERVICE_SCOPES = [
  {
    id: 'ux-ui-design',
    label: 'ออกแบบ UX/UI & Prototype',
    estimatedRange: '฿35,000 – ฿75,000',
    duration: '2 – 4 สัปดาห์',
    summary: 'วิจัยผู้ใช้ วางโครงสร้าง Wireframe ออกแบบ UI ทุกหน้าจอ (Desktop & Mobile) พร้อม Design System บน Figma',
  },
  {
    id: 'web-development',
    label: 'พัฒนาเว็บไซต์ / Web App ครบวงจร',
    estimatedRange: '฿55,000 – ฿140,000',
    duration: '4 – 8 สัปดาห์',
    summary: 'ออกแบบควบคู่กับการพัฒนาด้วย React / TypeScript รองรับมือถือ 100% ปรับแต่งความเร็วและ SEO พร้อมใช้งานจริง',
  },
  {
    id: 'brand-portfolio',
    label: 'Brand Website & Digital Identity',
    estimatedRange: '฿45,000 – ฿95,000',
    duration: '3 – 5 สัปดาห์',
    summary: 'วางระบบอัตลักษณ์แบรนด์ดิจิทัล การเล่าเรื่อง (Storytelling) และพัฒนาเว็บไซต์ภาพลักษณ์องค์กรระดับพรีเมียม',
  },
  {
    id: 'retainer-consulting',
    label: 'ที่ปรึกษา / Product Team Partner',
    estimatedRange: '฿40,000 / เดือน',
    duration: 'สัญญารายเดือนยืดหยุ่น',
    summary: 'ร่วมทีมในฐานะ Lead Designer / Frontend Consultant ช่วยทำ UX Audit พัฒนาฟีเจอร์ใหม่ และดูแล Design System',
  },
];
