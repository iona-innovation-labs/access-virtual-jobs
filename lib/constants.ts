export const MAX_SKILL_COUNT = 10;

export const JOB_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "freelance",
] as const;

export const JOB_CATEGORIES = [
  "executive_assistant_administrative_assistant",
  "project_manager",
  "customer_support_assistant",
  "data_entry_and_research",
  "operations_coordinator",
  "social_media_manager",
  "content_writer_copywriter",
  "seo_specialist",
  "email_marketing_specialist",
  "marketing_automation_assistant",
  "paid_ads_specialist",
  "community_manager",
  "ecommerce_store_manager",
  "product_listing_optimization_specialist",
  "inventory_supply_chain_assistant",
  "bookkeeping_finance_assistant",
  "virtual_accountant",
  "payroll_hr_assistant",
  "real_estate_assistant",
  "healthcare_assistant",
  "legal_assistant",
  "graphic_designer",
  "video_editor",
  "presentation_designer",
  "motion_graphics_animator",
  "podcast_editor",
  "web_developer",
  "wordpress_webflow_specialist",
  "software_qa_tester",
  "technical_support_specialist",
  "data_analyst_bi_assistant",
  "no_code_developer",
  "ai_automation_specialist",
  "lead_generation_appointment_setter",
  "sales_development_representative",
  "account_manager",
] as const;

export const JOB_SEARCH_STATUS = [
  "ready_for_interview",
  "open_to_offers",
  "closed_to_offers",
] as const;

export const EDUCATION_STATUS = [
  "did_not_graduate_high_school",
  "high_school",
  "associate",
  "bachelor",
  "master",
  "phd",
  "other",
] as const;

export const SALARY_UNIT = ["PHP", "USD"] as const;

export const ALLOWED_PROFILE_FIELDS = [
  "jobTitle",
  "whyFit",
  "whatStrengths",
  "whatNeedImprovement",
  "address",
  "whatsappId",
  "dateOfBirth",
  "hasPaypal",
  "numberOfChildren",
  "internetProvider",
  "numberOfMonitors",
  "numberOfExperience",
  "salaryUnit",
  "desiredSalary",
  "isPublicSalary",
  "howHear",
  "referrer",
  "jobType",
  "jobCategory",
  "availability",
  "jobSearchStatus",
  "educationStatus",
  "linkedInLink",
  "instagramLink",
  "xLink",
  "profileDescription",
] as const;

export const PUBLIC_CURRENCY = ["USD", "PHP"] as const;

export const PUBLIC_SALARY_TYPES = ["hourly", "monthly", "yearly"] as const;

export const PUBLIC_JOB_TYPES = [
  { label: "Freelance", key: "freelance" },
  { label: "Full-time", key: "full-time" },
  { label: "Part-time", key: "part-time" },
  { label: "Contract", key: "contract" },
] as const;

export const PUBLIC_JOB_MAIN_CATEGORIES = [
  {
    parent: "Admin & Ops",
    categories: [
      "Executive Assistant / Administrative Assistant",
      "Project Manager",
      "Customer Support Assistant",
      "Data Entry & Research",
      "Operations Coordinator",
    ],
  },
  {
    parent: "Marketing & Growth",
    categories: [
      "Social Media Manager",
      "Content Writer / Copywriter",
      "SEO Specialist",
      "Email Marketing Specialist",
      "Marketing Automation Assistant",
      "Paid Ads Specialist (Meta/Google Ads Manager)",
      "Community Manager (Discord, Slack, Facebook Groups)",
    ],
  },
  {
    parent: "E-Commerce",
    categories: [
      "E-Commerce Store Manager (Amazon, Shopify, Walmart)",
      "Product Listing & Optimization Specialist",
      "Inventory & Supply Chain Virtual Assistant",
    ],
  },
  {
    parent: "Finance & Business",
    categories: [
      "Bookkeeping / Finance Assistant",
      "Virtual Accountant",
      "Payroll & HR Virtual Assistant",
    ],
  },
  {
    parent: "Industry-Specific Assistants",
    categories: [
      "Real Estate Assistant",
      "Healthcare Virtual Assistant (Medical Biller / Telehealth Support)",
      "Legal Virtual Assistant (Case File / Documentation Support)",
    ],
  },
  {
    parent: "Creative & Media",
    categories: [
      "Graphic Designer",
      "Video Editor",
      "Presentation Designer",
      "Motion Graphics / Animator",
      "Podcast Editor",
    ],
  },
  {
    parent: "Tech & Development",
    categories: [
      "Web Developer (Frontend / Backend / Full-stack)",
      "WordPress / Webflow Specialist",
      "Software QA Tester",
      "Technical Support Specialist",
      "Data Analyst / BI Virtual Assistant",
      "No-Code Developer (Bubble, Airtable, Zapier, Make)",
      "AI / Automation Specialist",
    ],
  },
  {
    parent: "Sales & Growth",
    categories: [
      "Lead Generation & Appointment Setter",
      "Sales Development Representative (SDR)",
      "Account Manager",
    ],
  },
];

export const PUBLIC_JOB_CATEGORIES = [
  {
    label: "Executive Assistant / Administrative Assistant",
    key: "executive_assistant_administrative_assistant",
  },
  { label: "Project Manager", key: "project_manager" },
  { label: "Customer Support Assistant", key: "customer_support_assistant" },
  { label: "Data Entry & Research", key: "data_entry_and_research" },
  { label: "Operations Coordinator", key: "operations_coordinator" },
  { label: "Social Media Manager", key: "social_media_manager" },
  { label: "Content Writer / Copywriter", key: "content_writer_copywriter" },
  { label: "SEO Specialist", key: "seo_specialist" },
  { label: "Email Marketing Specialist", key: "email_marketing_specialist" },
  {
    label: "Marketing Automation Assistant",
    key: "marketing_automation_assistant",
  },
  {
    label: "Paid Ads Specialist (Meta/Google Ads Manager)",
    key: "paid_ads_specialist",
  },
  {
    label: "Community Manager (Discord, Slack, Facebook Groups)",
    key: "community_manager",
  },
  {
    label: "E-Commerce Store Manager (Amazon, Shopify, Walmart)",
    key: "ecommerce_store_manager",
  },
  {
    label: "Product Listing & Optimization Specialist",
    key: "product_listing_optimization_specialist",
  },
  {
    label: "Inventory & Supply Chain Virtual Assistant",
    key: "inventory_supply_chain_assistant",
  },
  {
    label: "Bookkeeping / Finance Assistant",
    key: "bookkeeping_finance_assistant",
  },
  { label: "Virtual Accountant", key: "virtual_accountant" },
  { label: "Payroll & HR Virtual Assistant", key: "payroll_hr_assistant" },
  { label: "Real Estate Assistant", key: "real_estate_assistant" },
  {
    label: "Healthcare Virtual Assistant (Medical Biller / Telehealth Support)",
    key: "healthcare_assistant",
  },
  {
    label: "Legal Virtual Assistant (Case File / Documentation Support)",
    key: "legal_assistant",
  },
  { label: "Graphic Designer", key: "graphic_designer" },
  { label: "Video Editor", key: "video_editor" },
  { label: "Presentation Designer", key: "presentation_designer" },
  { label: "Motion Graphics / Animator", key: "motion_graphics_animator" },
  { label: "Podcast Editor", key: "podcast_editor" },
  {
    label: "Web Developer (Frontend / Backend / Full-stack)",
    key: "web_developer",
  },
  {
    label: "WordPress / Webflow Specialist",
    key: "wordpress_webflow_specialist",
  },
  { label: "Software QA Tester", key: "software_qa_tester" },
  {
    label: "Technical Support Specialist",
    key: "technical_support_specialist",
  },
  {
    label: "Data Analyst / BI Virtual Assistant",
    key: "data_analyst_bi_assistant",
  },
  {
    label: "No-Code Developer (Bubble, Airtable, Zapier, Make)",
    key: "no_code_developer",
  },
  { label: "AI / Automation Specialist", key: "ai_automation_specialist" },
  {
    label: "Lead Generation & Appointment Setter",
    key: "lead_generation_appointment_setter",
  },
  {
    label: "Sales Development Representative (SDR)",
    key: "sales_development_representative",
  },
  { label: "Account Manager", key: "account_manager" },
] as const;
