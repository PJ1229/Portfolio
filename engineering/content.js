// Server-only content. Do not move this file into public/.
// Public copy must be customer-free. Customer identities belong in client only.
// Unknown facts stay empty; pending records are not claims of completed work.
module.exports = {
  headline: "Engineering",
  summary: "I’m an electrical engineering student building imaging and camera systems, with automotive software co-op work as my professional track.",
  capabilities: [
    { name: "Embedded & robotics", summary: "Building the hardware and control foundations of camera systems." },
    { name: "Vision & OCR pipelines", summary: "Reading jersey numbers from footage with on-device OCR and human review." },
    { name: "Automation & internal tooling", summary: "Building tools for harness documentation, validation, and footage logging." },
  ],
  blueprint: {
    name: "Camera platform",
    drawing: { src: "", alt: "Camera platform chassis technical drawing — drawing pending", caption: "Chassis / technical drawing pending" },
    milestones: Array.from({ length: 4 }, () => ({ label: "Milestone pending", period: "Target period pending" })),
    statement: "Build sequence and target periods to be confirmed.",
    signature: "PJ Kim",
    year: "",
  },
  projects: [
    {
      slug: "camera-platform", name: "Camera platform", status: "in development", year: "", context: "", role: "",
      summary: "Imaging and camera systems project. Build details are pending.",
      stack: [], specs: [], repo: null,
      media: [{ src: "", alt: "Camera platform prototype — photograph pending", caption: "Prototype / media pending" }],
      cleared: true, client: null, redactedNote: "Project specifications pending.", pending: true,
    },
    {
      slug: "yazaki", name: "Yazaki", status: "in development", year: "2026", context: "Yazaki North America", role: "Software engineering co-op",
      summary: "Built internal engineering tools during my co-op at Yazaki, working on harness documentation and validation workflows.",
      stack: ["Python", "React", "Express", "Tkinter", "PaddleOCR", "Excel VBA"], specs: [], repo: null, media: [],
      cleared: false, client: null, redactedNote: "Performance figures available on request.", pending: false,
    },
    {
      slug: "um-autolog", name: "um-autolog", status: "shipped", year: "2026", context: "Personal tool for Michigan Athletics video work", role: "Developer / creative video intern",
      summary: "Built a local footage-logging MVP that proposes jersey numbers from game footage using Apple Vision OCR. A review interface lets me confirm or correct candidates before applying file renames.",
      stack: ["Python", "Apple Vision", "PyObjC", "FFmpeg", "Streamlit"],
      specs: [
        { label: "Platform", value: "macOS / on-device processing" },
        { label: "Recognition", value: "Person detection and jersey-number OCR" },
        { label: "Review", value: "Human confirmation and correction" },
        { label: "Output", value: "CSV log and dry-run rename script" },
      ],
      repo: null, media: [],
      cleared: true, client: null, redactedNote: "Specifications pending publication review.", pending: false,
    },
    {
      slug: "project-pending-b", name: "Project details pending", status: "in development", year: "", context: "", role: "",
      summary: "An additional engineering project will be documented here once its details are available.",
      stack: [], specs: [], repo: null, media: [],
      cleared: true, client: null, redactedNote: "Project specifications pending.", pending: true,
    },
  ],
};
