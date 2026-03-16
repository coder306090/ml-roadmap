import { useState, useEffect } from "react";

// Google Apps Script URL for syncing links
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxyc06DOBtkRAi4VdJ6d1j_vDa1UrQlQd5udthPTgTeI9XSplG5QBTAOM-IDiglUi7xzQ/exec";

// Secret key for API authorization (must match Google Apps Script)
//const AUTHORIZED_KEY = "xyzzvb";

const profile = {
  strengths: [
    {
      label: "Math scores 90+",
      note: "Critical for research — ML theory is math-heavy, you're already there",
    },
    {
      label: "1.5 yrs Software Engineering",
      note: "Can implement ideas fast — research groups value this highly",
    },
    {
      label: "Linear Algebra done",
      note: "Ahead of schedule — SVD, eigenvalues directly used in CV research",
    },
    {
      label: "Hands-On ML book done",
      note: "Practical ML foundation — rare among pure math candidates",
    },
  ],
  gaps: [
    {
      label: "CGPA 7.5",
      note: "Borderline for Saarland (75% minimum) — compensate with math scores + projects + SOP",
      risk: "high",
    },
    {
      label: "ECE ≠ CS background",
      note: "Algorithms & DSA must be demonstrated explicitly via LeetCode + GATE DA prep",
      risk: "high",
    },
    {
      label: "🚨 APS Certificate",
      note: "Mandatory for Indian applicants — 6–8 week processing, apply September Week 1",
      risk: "high",
    },
    {
      label: "GRE required (not GATE)",
      note: "GATE 2027 results come March 2027 — after Saarland's Nov 15 deadline. Take GRE in August 2026 instead",
      risk: "high",
    },
    {
      label: "No published research",
      note: "Paper replication + blog posts + Kaggle substitute here",
      risk: "med",
    },
    {
      label: "Non-CS degree",
      note: "Check each program's module requirements — some need CS prerequisite proof",
      risk: "med",
    },
    {
      label: "TUM removed",
      note: "Charges €4,000–6,000/semester for non-EU students — not viable given financial constraints",
      risk: "med",
    },
    {
      label: "German language",
      note: "Not required for English programs — optional A1/A2 helps daily life",
      risk: "low",
    },
  ],
  universities: [
    {
      name: "Saarland — MSc Visual Computing",
      tier: "Target",
      note: "ECE explicitly accepted, best CV research in DE via MPI-INF, apply Nov 15",
      color: "#47e8a0",
    },
    {
      name: "Saarland — MSc DSAI",
      tier: "Target",
      note: "Apply to both Saarland programs simultaneously — same portal, double your chance",
      color: "#47e8a0",
    },
    {
      name: "KIT",
      tier: "Target",
      note: "Engineering background welcomed, strong applied ML + CV, Dec deadline",
      color: "#47e8a0",
    },
    {
      name: "TU Berlin",
      tier: "Safe",
      note: "No hard CGPA cutoff, most accessible, Berlin tech job market is best in DE",
      color: "#47b8e8",
    },
    {
      name: "RWTH Aachen",
      tier: "Safe",
      note: "Strong CV research, Jan deadline gives you time — CGPA below typical threshold",
      color: "#47b8e8",
    },
  ],
};

const months = [
  {
    id: 1,
    month: "March 2026",
    label: "MAR",
    phase: "Math + CS Foundations",
    phaseColor: "#e8c547",
    focus: "Probability & CS Fundamentals",
    hours: "~65 hrs",
    daily: "2–3 hrs/day",
    intensity: 3,
    icon: "∑",
    profileNote:
      "⚠ ECE gap: German CS programs expect algorithms & DSA — cover these in parallel with math this month.",
    topics: [
      "Probability axioms, conditional probability, Bayes' theorem — derive everything",
      "Distributions: Gaussian, Bernoulli, Poisson, Beta, Dirichlet — know when to use each",
      "MLE & MAP estimation — derive for linear regression",
      "Expectation, variance, covariance matrices — matrix form",
      "Information theory: entropy, KL divergence, mutual information",
      "🆕 CS Fundamentals (ECE gap): Big-O, sorting, trees, graphs, hash maps — LeetCode easy/medium",
      "🆕 Python fluency: move from Java mindset — list comprehensions, generators, numpy idioms",
    ],
    resources: [
      { name: "3Blue1Brown – Probability series (YouTube)", type: "video" },
      {
        name: "Blitzstein & Hwang – Intro to Probability (free PDF)",
        type: "book",
      },
      { name: "NeetCode 150 – DSA problems (neetcode.io)", type: "project" },
      {
        name: "StatQuest – Bayes, MLE, distributions (YouTube)",
        type: "video",
      },
    ],
    weekplan: [
      "Week 1: Probability axioms, Bayes + 5 LeetCode easy problems",
      "Week 2: Distributions, MLE derivation + 5 LeetCode easy/medium",
      "Week 3: Covariance matrices, info theory + trees & graphs in Python",
      "Week 4: Review all + 10 LeetCode problems total done this month",
    ],
    milestone:
      "Derive MLE for linear regression + solve 15 LeetCode problems (easy/medium)",
  },
  {
    id: 2,
    month: "April 2026",
    label: "APR",
    phase: "Math + CS Foundations",
    phaseColor: "#e8c547",
    focus: "Optimization + Algorithms (lighter month)",
    hours: "~60 hrs",
    daily: "2–3 hrs/day",
    intensity: 3,
    icon: "∇",
    profileNote:
      "✅ Linear Algebra already done — this month is deliberately lighter. Use saved time to build your first ML project from scratch.",
    topics: [
      "✅ Linear Algebra done — skip, apply it via PCA implementation instead",
      "Jacobians, Hessians — full matrix calculus, builds on your linear algebra",
      "Convex functions, gradient descent variants — derive SGD, Momentum, Adam from scratch",
      "Lagrange multipliers & constrained optimization",
      "Build micrograd — tiny autograd engine with backprop (Karpathy)",
      "🆕 Implement PCA from SVD in NumPy — bridges your Lin Alg to ML",
      "Head start: Bishop PRML Ch 1–2 (probability review + decision theory)",
    ],
    resources: [
      { name: "Karpathy – micrograd walkthrough (YouTube)", type: "project" },
      {
        name: "Boyd & Vandenberghe – Convex Optimization Ch 1–3 (free PDF)",
        type: "book",
      },
      { name: "Bishop – PRML Ch 1–2 (begin early)", type: "book" },
    ],
    weekplan: [
      "Week 1: Matrix calculus — Jacobians, Hessians",
      "Week 2: Gradient descent variants — derive and implement Adam",
      "Week 3: Build micrograd + implement PCA from SVD in NumPy",
      "Week 4: Head start — PRML Ch 1–2 + constrained optimization exercises",
    ],
    milestone:
      "Build micrograd with backprop + PCA from SVD — both in pure NumPy, pushed to GitHub",
  },
  {
    id: 3,
    month: "May 2026",
    label: "MAY",
    phase: "ML Theory",
    phaseColor: "#47b8e8",
    focus: "Bishop's PRML — Full Pass",
    hours: "~75 hrs",
    daily: "2–3 hrs/day",
    intensity: 5,
    icon: "θ",
    profileNote:
      "🔑 Most important month for admissions. PRML is your theory base. Add 1 CV paper/week alongside it — research groups expect you to know the historical arc of the field.",
    topics: [
      "Ch 1–2: Decision theory, curse of dimensionality (head start from Apr)",
      "Ch 3–4: Linear regression + classification — full Bayesian perspective",
      "Ch 6: Kernel methods, SVM — derive margin maximization + kernel trick",
      "Ch 8–9: Graphical models, EM algorithm — implement GMM from scratch",
      "Bias-variance tradeoff — formal derivation, not just intuition",
      "🆕 CV Paper Track (1/week): AlexNet (2012) → VGG (2014) → ResNet (2015) → read & summarise each",
      "🆕 Start CV paper notes repo on GitHub — 1 paragraph summary per paper, running log",
    ],
    resources: [
      { name: "Bishop – PRML (free PDF, all chapters)", type: "book" },
      {
        name: "Shalev-Shwartz & Ben-David – Understanding ML (free PDF)",
        type: "book",
      },
      { name: "Papers With Code – CV milestone papers list", type: "project" },
      { name: "Caltech CS156 – Learning from Data (YouTube)", type: "video" },
    ],
    weekplan: [
      "Week 1: PRML Ch 1–2 + read & summarise AlexNet paper",
      "Week 2: PRML Ch 3–4 + read & summarise VGG paper",
      "Week 3: SVMs + kernel methods + read & summarise ResNet paper",
      "Week 4: EM + GMM from scratch + read & summarise one more CV milestone paper",
    ],
    milestone:
      "GMM with EM from scratch + 4 CV papers read and summarised in GitHub notes repo",
  },
  {
    id: 4,
    month: "June 2026",
    label: "JUN",
    phase: "Deep Learning Theory",
    phaseColor: "#e8476f",
    focus: "Transformers & Modern Deep Learning",
    hours: "~75 hrs",
    daily: "2–3 hrs/day",
    intensity: 5,
    icon: "⚡",
    profileNote:
      "💡 Transformers are the backbone of modern CV research. This month you build both the DL theory AND start the CV architecture track — they overlap heavily (ViT is just Transformers applied to images).",
    topics: [
      "Backpropagation — full matrix calculus derivation (not just chain rule)",
      "Attention mechanism — derive scaled dot-product self-attention from scratch",
      "Transformer architecture — implement encoder + decoder in PyTorch",
      "Build character-level language model (nanoGPT style) — core portfolio project",
      "🆕 CV Architecture track: CNN fundamentals → BatchNorm → ResNet skip connections",
      "🆕 Vision Transformer (ViT) — read paper + implement in PyTorch (Transformers → images)",
      "🆕 CV Papers (1/week): GAN (2014) → DCGAN → read & understand generative CV foundations",
    ],
    resources: [
      { name: "Karpathy – nanoGPT & makemore (YouTube series)", type: "video" },
      { name: "Prince – Understanding Deep Learning (free PDF)", type: "book" },
      {
        name: "ViT paper: 'An Image is Worth 16x16 Words' (Dosovitskiy 2020)",
        type: "book",
      },
      { name: "The Annotated Transformer – Harvard NLP blog", type: "project" },
    ],
    weekplan: [
      "Week 1: Backprop derivation + implement ResNet from scratch in PyTorch",
      "Week 2: Attention mechanism from scratch + read ViT paper",
      "Week 3: Implement ViT in PyTorch — connects Transformer directly to CV",
      "Week 4: Train mini character-level GPT + push all code to GitHub with READMEs",
    ],
    milestone:
      "ViT implemented in PyTorch + mini-GPT working — two flagship projects live on GitHub",
  },
  {
    id: 5,
    month: "July 2026",
    label: "JUL",
    phase: "Specialization",
    phaseColor: "#47e8a0",
    focus: "Dual Track — CV Frontier + Broader AI",
    hours: "~75 hrs",
    daily: "2–3 hrs/day",
    intensity: 4,
    icon: "🎯",
    profileNote:
      "🔑 Split month: Weeks 1–2 go deep on CV frontier (for Visual Computing applications), Weeks 3–4 cover broader AI (for DSAI applications). Also take IELTS/TOEFL this month — finish it before August GRE prep begins.",
    topics: [
      "🚨 IELTS / TOEFL — take exam this month (IELTS 7.0+ or TOEFL 95+, MOI letter NOT accepted at Saarland)",
      "── CV TRACK (Weeks 1–2) ──",
      "Object Detection: YOLO → DETR (end-to-end detection with Transformers)",
      "Segmentation: SAM (Segment Anything Model) — read paper + run inference",
      "3D Vision intro: NeRF — read paper, understand volumetric rendering concept",
      "CV Project: Build image classifier or object detector with ViT — push to GitHub",
      "── AI TRACK (Weeks 3–4) ──",
      "Generative Models: VAE theory + diffusion models overview (connects to DSAI curriculum)",
      "Reinforcement Learning: Sutton & Barto Ch 1–3, Q-learning — conceptual depth",
      "Read 2 papers per track (4 total) — write 1-paragraph structured summaries",
      "Identify 3 MPI-INF research groups — map their recent papers to your projects",
    ],
    resources: [
      {
        name: "IELTS Official Practice Tests / TOEFL Official Guide (ets.org)",
        type: "course",
      },
      {
        name: "DETR paper: 'End-to-End Object Detection with Transformers' (Carion 2020)",
        type: "book",
      },
      {
        name: "NeRF paper: 'Representing Scenes as Neural Radiance Fields' (Mildenhall 2020)",
        type: "book",
      },
      {
        name: "Sutton & Barto – RL: An Introduction Ch 1–3 (free PDF)",
        type: "book",
      },
      {
        name: "HuggingFace Diffusers library — diffusion models in practice",
        type: "project",
      },
      {
        name: "Papers With Code – CV + AI state-of-the-art tracker",
        type: "project",
      },
    ],
    weekplan: [
      "Week 1: IELTS/TOEFL exam + DETR + YOLO — implement object detection pipeline in PyTorch",
      "Week 2: SAM + NeRF papers — run open-source NeRF, build CV GitHub project",
      "Week 3: VAE theory + diffusion model overview + 2 AI papers summarised",
      "Week 4: RL basics (Q-learning) + identify MPI-INF groups + all 4 papers summarised",
    ],
    milestone:
      "IELTS/TOEFL done + CV project on GitHub + 4 papers summarised (2 CV, 2 AI) + MPI-INF groups mapped",
  },
  {
    id: 6,
    month: "August 2026",
    label: "AUG",
    phase: "Portfolio & Research",
    phaseColor: "#a047e8",
    focus: "Portfolio Polish + GRE + Professor Outreach",
    hours: "~70 hrs",
    daily: "2–3 hrs/day",
    intensity: 4,
    icon: "🔬",
    profileNote:
      "📌 Two critical things happen this month: GRE exam (must be done before Nov 15 Saarland deadline) and professor outreach. GRE quant will be easy given your math level — verbal needs 3–4 weeks of focused prep. Don't skip it.",
    topics: [
      "🚨 GRE EXAM — book and take in August (ets.org/gre, ₹22,000 fee)",
      "GRE Verbal prep: 3–4 weeks of vocabulary + reading comprehension practice",
      "GRE Quant: 1 week of practice only — your math level already covers this",
      "Target: Quant 165+/170, Verbal 150+/170, AWA 4.0+",
      "Polish GitHub: ViT, mini-GPT, GMM, CV project — clean READMEs + demo GIFs",
      "Add W&B (Weights & Biases) experiment tracking to your best project",
      "Enter one Kaggle CV competition — top 40% finish is worth mentioning",
      "Research emails: read last 3 papers of 3 MPI-INF professors → write tailored emails",
      "Draft SOP — two versions: one for Visual Computing, one for DSAI",
    ],
    resources: [
      {
        name: "ETS GRE Official Guide (ets.org/gre) — only official prep counts",
        type: "book",
      },
      { name: "Magoosh GRE Vocabulary Flashcards (free app)", type: "course" },
      {
        name: "MPI-INF research groups: gvv.mpi-inf.mpg.de, d2.mpi-inf.mpg.de",
        type: "project",
      },
      {
        name: "Weights & Biases quickstart (wandb.ai/quickstart)",
        type: "project",
      },
      { name: "r/GRE — score reports from Indian CS applicants", type: "book" },
    ],
    weekplan: [
      "Week 1: GRE verbal prep intensive + polish GitHub projects + add W&B tracking",
      "Week 2: GRE verbal + quant practice + Kaggle competition submission",
      "Week 3: Take GRE exam + deep-read 3 papers per target professor",
      "Week 4: Send professor emails + write both SOP drafts (Visual Computing + DSAI)",
    ],
    milestone:
      "GRE taken (score in 8–10 days) + professor emails sent + two SOP drafts done",
  },
  {
    id: 7,
    month: "September 2026",
    label: "SEP",
    phase: "Application Prep",
    phaseColor: "#e88047",
    focus: "Applications, IELTS & Documents",
    hours: "~50 hrs",
    daily: "2 hrs/day",
    intensity: 2,
    icon: "📝",
    profileNote:
      "⚠ Key deadlines: Saarland Nov 15 (earliest — submit first), KIT + TU Berlin Dec, RWTH Jan. TUM removed — tuition fees too high. GRE score arrives 8–10 days after exam so August GRE feeds directly into this month's submissions.",
    topics: [
      "🚨 APS CERTIFICATE — apply immediately (mandatory for Indian applicants, 6–8 week wait)",
      "🚨 GRE score received — attach to degree certificate PDF exactly as Saarland requires",
      "Finalize TWO SOPs — Visual Computing version + DSAI version for Saarland",
      "✅ IELTS/TOEFL — already taken in July, attach score to all applications",
      "Request Letters of Recommendation — professor + SE manager, give 4–6 weeks notice",
      "Grade conversion: use anabin.kmk.org — 7.5/10 CGPA → German scale carefully",
      "Apply DAAD scholarship (deadline Oct–Nov, apply simultaneously with admissions)",
      "Submit: Saarland Visual Computing + DSAI both (~Nov 15), KIT + TU Berlin (~Dec), RWTH (~Jan)",
    ],
    resources: [
      {
        name: "🚨 APS India portal — aps-india.de (apply Week 1 of September)",
        type: "project",
      },
      {
        name: "Saarland application portal — both Visual Computing + DSAI",
        type: "project",
      },
      { name: "DAAD Scholarship portal (daad.de)", type: "project" },
      { name: "anabin.kmk.org – grade equivalency tool", type: "project" },
      { name: "IELTS Official Practice Tests", type: "course" },
    ],
    weekplan: [
      "Week 1: APS application submitted + GRE score received + SOP Visual Computing finalised",
      "Week 2: Compile all documents + request all LORs formally + SOP DSAI finalised",
      "Week 3: Grade conversion + compile all documents per university checklist",
      "Week 4: DAAD application + submit Saarland (Nov 15 deadline — do not miss)",
    ],
    milestone:
      "🎉 APS applied + GRE submitted + Saarland applied to (both programs) by Nov 15",
  },
];

const phaseColors = {
  "Math + CS Foundations": { border: "#e8c547" },
  "ML Theory": { border: "#47b8e8" },
  "Deep Learning Theory": { border: "#e8476f" },
  Specialization: { border: "#47e8a0" },
  "Portfolio & Research": { border: "#a047e8" },
  "Application Prep": { border: "#e88047" },
};

const typeIcons = { video: "▶", book: "📖", course: "🎓", project: "⚙" };

function IntensityBar({ level }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 6,
            borderRadius: 3,
            background: i <= level ? "#e8c547" : "#2a2a2a",
          }}
        />
      ))}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: "#555",
          marginLeft: 4,
        }}
      >
        {["", "Easy", "Moderate", "Solid", "Intense", "Max"][level]}
      </span>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(1);
  const [authorizedKey, setAuthorizedKey] = useState("");
  const [tab, setTab] = useState("topics");
  const [view, setView] = useState("roadmap");
  const [gdriveLinkInput, setGdriveLinkInput] = useState("");
  const [gdriveLinks, setGdriveLinks] = useState(() => {
    // Load links from localStorage (fallback)
    const saved = localStorage.getItem("gdriveLinks");
    return saved ? JSON.parse(saved) : [];
  });
  const [isFilesAuthenticated, setIsFilesAuthenticated] = useState(false);
  const [filesKeyInput, setFilesKeyInput] = useState("");
  const current = months[active - 1];
  const phase = phaseColors[current.phase] || { border: "#888" };

  // Handle files authentication
  const handleFilesAuth = async () => {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getKey`);
      const data = await response.json();

      console.log("Key from sheet:", data.key); // see what sheet returned
      console.log("Match?", filesKeyInput === data.key);

      if (filesKeyInput === data.key) {
        setAuthorizedKey(data.key);
        setIsFilesAuthenticated(true);
        setFilesKeyInput("");
        fetchLinksFromSheet(data.key);
      } else {
        alert("Invalid key. Please try again.");
        setFilesKeyInput("");
      }
    } catch (error) {
      alert("Could not verify key. Check your internet connection.");
      setFilesKeyInput("");
    }
  };

  // Save links to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("gdriveLinks", JSON.stringify(gdriveLinks));
  }, [gdriveLinks]);

  // Load links from Google Sheet on component mount
  useEffect(() => {
    fetchLinksFromSheet();
  }, []);

  // Fetch links from Google Sheet
  const fetchLinksFromSheet = async (key) => {
    const k = key || authorizedKey;
    try {
      const response = await fetch(
        `${GOOGLE_SCRIPT_URL}?action=getAll&key=${k}`,
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setGdriveLinks(data);
      }
    } catch (error) {
      console.log("Using local storage (Google Sheet sync failed)");
    }
  };

  // Save link to Google Sheet
  const saveToSheet = async (link) => {
    try {
      const params = new URLSearchParams({
        action: "add",
        key: authorizedKey,
        id: link.id,
        url: link.url,
        name: link.name || "",
        addedAt: link.addedAt,
      });
      await fetch(`${GOOGLE_SCRIPT_URL}?${params}`);
    } catch (error) {
      console.log("Link saved locally (Sheet sync failed)");
    }
  };

  // Delete link from Google Sheet
  const deleteFromSheet = async (id) => {
    try {
      const params = new URLSearchParams({
        action: "delete",
        key: authorizedKey,
        id: id,
      });
      await fetch(`${GOOGLE_SCRIPT_URL}?${params}`);
    } catch (error) {
      console.log("Link deleted locally (Sheet sync failed)");
    }
  };

  // Add Google Drive link
  const handleAddLink = () => {
    const link = gdriveLinkInput.trim();
    if (!link) {
      alert("Please enter a link");
      return;
    }

    // Validate it's a valid URL
    try {
      new URL(link);
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const name = prompt("Enter a name for this file:", "Google Drive File");
    if (!name) return; // cancel if user dismisses prompt

    const newLink = {
      id: String(Date.now()),
      url: link,
      name: name,
      addedAt: new Date().toLocaleString(),
    };

    setGdriveLinks((prev) => [newLink, ...prev]);
    saveToSheet(newLink);
    setGdriveLinkInput("");
  };

  // Delete link
  const deleteLink = (id) => {
    setGdriveLinks((prev) => prev.filter((l) => l.id !== id));
    deleteFromSheet(id);
  };

  const updateNameInSheet = async (id, name) => {
    try {
      const params = new URLSearchParams({
        action: "rename",
        key: authorizedKey,
        id: id,
        name: name,
      });
      await fetch(`${GOOGLE_SCRIPT_URL}?${params}`);
    } catch (error) {
      console.log("Rename saved locally (Sheet sync failed)");
    }
  };

  // Rename link (for easier identification)
  const renameLink = (id) => {
    const link = gdriveLinks.find((l) => l.id === id);
    const newName = prompt(
      "Enter a name for this file:",
      link.name || "Google Drive File",
    );
    if (newName) {
      setGdriveLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, name: newName } : l)),
      );
      updateNameInSheet(id, newName); // ← add this line
    }
  };

  return (
    <div
      style={{
        fontFamily: "Georgia, serif",
        background: "#0f0f0f",
        minHeight: "100vh",
        color: "#e8e2d9",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .btn { transition: all 0.2s ease; cursor: pointer; border: none; outline: none; }
        .btn:hover { transform: translateY(-2px); }
        .tab-btn { transition: all 0.15s ease; cursor: pointer; border: none; outline: none; }
        .row-item { transition: padding-left 0.15s ease; }
        .row-item:hover { padding-left: 10px !important; }
      `}</style>

      <div
        style={{
          background: "#141414",
          borderBottom: "1px solid #222",
          padding: "24px 36px 18px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: "#e8c547",
              letterSpacing: 4,
              marginBottom: 5,
              textTransform: "uppercase",
            }}
          >
            ML Roadmap → KIT / Saarland / TU Berlin / RWTH
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#f5f0e8",
                  lineHeight: 1.1,
                  marginBottom: 10,
                }}
              >
                March → September 2026
              </div>
              <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
                {[
                  { label: "Duration", val: "7 months" },
                  { label: "Daily load", val: "2–3 hrs/day" },
                  { label: "Total hrs", val: "~465 hrs" },
                  { label: "Apply by", val: "Oct–Jan 2027" },
                  { label: "Target intake", val: "Summer 2027" },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "#555",
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#b0a898",
                        fontFamily: "monospace",
                      }}
                    >
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {["roadmap", "profile", "files"].map((v) => (
                <button
                  key={v}
                  className="btn"
                  onClick={() => setView(v)}
                  style={{
                    background: view === v ? "#e8c547" : "#1e1e1e",
                    color: view === v ? "#0f0f0f" : "#666",
                    border: `1px solid ${view === v ? "#e8c547" : "#2e2e2e"}`,
                    borderRadius: 6,
                    padding: "7px 14px",
                    fontFamily: "monospace",
                    fontSize: 10,
                    fontWeight: view === v ? 700 : 400,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ maxWidth: 880, margin: "0 auto", padding: "24px 36px 40px" }}
      >
        {view === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #47e8a040",
                  borderRadius: 12,
                  padding: "20px 22px",
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "#47e8a0",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  ✓ Your Strengths
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {profile.strengths.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        borderLeft: "2px solid #47e8a040",
                        paddingLeft: 12,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: "#47e8a0",
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#7a7060",
                          lineHeight: 1.4,
                        }}
                      >
                        {s.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                style={{
                  background: "#161616",
                  border: "1px solid #e8476f30",
                  borderRadius: 12,
                  padding: "20px 22px",
                }}
              >
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "#e8476f",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  ⚠ Gaps to Address
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {profile.gaps.map((g, i) => (
                    <div
                      key={i}
                      style={{
                        borderLeft: `2px solid ${g.risk === "high" ? "#e8476f60" : g.risk === "med" ? "#e8c54750" : "#47b8e840"}`,
                        paddingLeft: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color:
                              g.risk === "high"
                                ? "#e8476f"
                                : g.risk === "med"
                                  ? "#e8c547"
                                  : "#47b8e8",
                            fontWeight: 600,
                          }}
                        >
                          {g.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: 8,
                            background:
                              g.risk === "high"
                                ? "#e8476f20"
                                : g.risk === "med"
                                  ? "#e8c54720"
                                  : "#47b8e820",
                            color:
                              g.risk === "high"
                                ? "#e8476f"
                                : g.risk === "med"
                                  ? "#e8c547"
                                  : "#47b8e8",
                            border: `1px solid ${g.risk === "high" ? "#e8476f40" : g.risk === "med" ? "#e8c54740" : "#47b8e840"}`,
                            borderRadius: 3,
                            padding: "1px 5px",
                            letterSpacing: 1,
                          }}
                        >
                          {g.risk.toUpperCase()}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#7a7060",
                          lineHeight: 1.4,
                        }}
                      >
                        {g.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: 12,
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "#555",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                University Strategy — Optimised for Your Profile
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {profile.universities.map((u, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      background: "#1a1a1a",
                      border: `1px solid ${u.color}25`,
                      borderRadius: 8,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          background: `${u.color}20`,
                          border: `1px solid ${u.color}50`,
                          borderRadius: 4,
                          padding: "2px 7px",
                          fontFamily: "monospace",
                          fontSize: 8,
                          color: u.color,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {u.tier}
                      </div>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: 9,
                          color: "#444",
                        }}
                      >
                        #{i + 1}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#d8d0c0",
                          fontWeight: 600,
                          marginBottom: 3,
                        }}
                      >
                        {u.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#7a7060",
                          lineHeight: 1.45,
                        }}
                      >
                        {u.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#161616",
                border: "1px solid #e8c54730",
                borderRadius: 12,
                padding: "20px 22px",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "#e8c547",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                🎯 CGPA 7.5 Mitigation Strategy
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "List math subject scores (90+) explicitly on your CV — German reviewers respect this",
                  "Mention upward GPA trend in SOP if your later semesters were stronger",
                  "2 strong from-scratch ML projects outweigh a borderline GPA in applied programs",
                  "A mini-GPT + GMM implementation on GitHub is concrete evidence of capability",
                  "Saarland & KIT are more holistic reviewers than TUM — lead with those applications",
                  "A professor reply email before you apply is the strongest CGPA override possible",
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="row-item"
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      paddingLeft: 0,
                    }}
                  >
                    <span
                      style={{
                        color: "#e8c547",
                        fontFamily: "monospace",
                        fontSize: 10,
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#b0a890",
                        lineHeight: 1.55,
                      }}
                    >
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "roadmap" && (
          <>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 22,
                flexWrap: "wrap",
              }}
            >
              {months.map((m) => {
                const isActive = m.id === active;
                const isDone = m.id < active;
                const p = phaseColors[m.phase] || { border: "#888" };
                return (
                  <button
                    key={m.id}
                    className="btn"
                    onClick={() => {
                      setActive(m.id);
                      setTab("topics");
                    }}
                    style={{
                      background: isActive
                        ? p.border
                        : isDone
                          ? `${p.border}22`
                          : "#1a1a1a",
                      color: isActive ? "#0f0f0f" : isDone ? p.border : "#666",
                      border: `1px solid ${isActive ? p.border : isDone ? `${p.border}50` : "#2a2a2a"}`,
                      borderRadius: 6,
                      padding: "8px 14px",
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: isActive ? 700 : 400,
                      letterSpacing: 1,
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div
              style={{
                background: "#161616",
                border: `1px solid ${phase.border}30`,
                borderLeft: `3px solid ${phase.border}`,
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontFamily: "monospace",
                fontSize: 11,
                color: "#888",
                lineHeight: 1.6,
              }}
            >
              {current.profileNote}
            </div>

            <div
              style={{
                background: "#161616",
                border: `1px solid ${phase.border}35`,
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${phase.border}15 0%, transparent 70%)`,
                  borderBottom: `1px solid ${phase.border}25`,
                  padding: "20px 24px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        background: `${phase.border}20`,
                        border: `1px solid ${phase.border}50`,
                        borderRadius: 4,
                        padding: "2px 9px",
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: phase.border,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {current.phase}
                    </div>
                    <div
                      style={{
                        background: "#1e1e1e",
                        border: "1px solid #2e2e2e",
                        borderRadius: 4,
                        padding: "2px 9px",
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "#666",
                        letterSpacing: 1,
                      }}
                    >
                      {current.hours} · {current.daily}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#f5f0e8",
                      marginBottom: 6,
                    }}
                  >
                    {current.focus}
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "#555",
                        letterSpacing: 2,
                      }}
                    >
                      INTENSITY
                    </span>
                    <IntensityBar level={current.intensity} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 44,
                    lineHeight: 1,
                    color: `${phase.border}50`,
                  }}
                >
                  {current.icon}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #222",
                  padding: "0 24px",
                }}
              >
                {["topics", "week plan", "resources"].map((t) => (
                  <button
                    key={t}
                    className="tab-btn"
                    onClick={() => setTab(t)}
                    style={{
                      background: "transparent",
                      color: tab === t ? phase.border : "#444",
                      borderBottom: `2px solid ${tab === t ? phase.border : "transparent"}`,
                      padding: "10px 14px",
                      fontFamily: "monospace",
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: -1,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div style={{ padding: "20px 24px" }}>
                {tab === "topics" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {current.topics.map((t, i) => (
                      <div
                        key={i}
                        className="row-item"
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                          paddingLeft: 0,
                        }}
                      >
                        <span
                          style={{
                            color: phase.border,
                            fontFamily: "monospace",
                            fontSize: 11,
                            marginTop: 3,
                            flexShrink: 0,
                          }}
                        >
                          →
                        </span>
                        <span
                          style={{
                            fontSize: 13.5,
                            color: "#c0b8a8",
                            lineHeight: 1.55,
                          }}
                        >
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {tab === "week plan" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {current.weekplan.map((w, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 14,
                          alignItems: "flex-start",
                          background: "#1a1a1a",
                          border: "1px solid #252525",
                          borderRadius: 8,
                          padding: "12px 14px",
                        }}
                      >
                        <div
                          style={{
                            background: `${phase.border}25`,
                            border: `1px solid ${phase.border}50`,
                            borderRadius: 4,
                            padding: "3px 8px",
                            fontFamily: "monospace",
                            fontSize: 9,
                            color: phase.border,
                            letterSpacing: 1,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          W{i + 1}
                        </div>
                        <span
                          style={{
                            fontSize: 13.5,
                            color: "#c0b8a8",
                            lineHeight: 1.5,
                          }}
                        >
                          {w.replace(/^Week \d+: /, "")}
                        </span>
                      </div>
                    ))}
                    <div
                      style={{
                        marginTop: 6,
                        background: `${phase.border}10`,
                        border: `1px solid ${phase.border}35`,
                        borderRadius: 8,
                        padding: "12px 14px",
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 10,
                          color: phase.border,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        ✓
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#d0c8b8",
                          lineHeight: 1.5,
                          fontStyle: "italic",
                        }}
                      >
                        {current.milestone}
                      </span>
                    </div>
                  </div>
                )}
                {tab === "resources" && (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {current.resources.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          background: "#1a1a1a",
                          border: "1px solid #2a2a2a",
                          borderRadius: 7,
                          padding: "10px 14px",
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            background: `${phase.border}18`,
                            border: `1px solid ${phase.border}35`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          {typeIcons[r.type]}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              color: "#c0b0a0",
                              lineHeight: 1.4,
                            }}
                          >
                            {r.name}
                          </div>
                          <div
                            style={{
                              fontFamily: "monospace",
                              fontSize: 9,
                              color: "#555",
                              marginTop: 2,
                              letterSpacing: 1,
                              textTransform: "uppercase",
                            }}
                          >
                            {r.type}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                background: "#141414",
                border: "1px solid #222",
                borderRadius: 12,
                padding: "18px 22px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "#444",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                7-Month Overview
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {months.map((m, i) => {
                  const p = phaseColors[m.phase] || { border: "#888" };
                  const isActive = m.id === active;
                  const isDone = m.id < active;
                  return (
                    <div
                      key={m.id}
                      style={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <div
                        onClick={() => {
                          setActive(m.id);
                          setTab("topics");
                        }}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: isActive
                            ? p.border
                            : isDone
                              ? `${p.border}40`
                              : "#1e1e1e",
                          border: `2px solid ${isActive ? p.border : isDone ? `${p.border}60` : "#2e2e2e"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "monospace",
                          fontSize: 8,
                          color: isActive
                            ? "#0f0f0f"
                            : isDone
                              ? p.border
                              : "#444",
                          fontWeight: isActive ? 700 : 400,
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      >
                        {m.label}
                      </div>
                      {i < months.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            height: 1,
                            background:
                              m.id < active ? `${p.border}40` : "#222",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  marginTop: 14,
                  flexWrap: "wrap",
                }}
              >
                {Object.entries(phaseColors).map(([name, c]) => (
                  <div
                    key={name}
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: c.border,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "#555",
                      }}
                    >
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: "12px 15px",
                background: "#141414",
                border: "1px solid #1e1e1e",
                borderRadius: 8,
                fontFamily: "monospace",
                fontSize: 11,
                color: "#555",
                lineHeight: 1.7,
              }}
            >
              💡{" "}
              <span style={{ color: "#666" }}>
                Weekdays: theory + reading. Weekends: coding + building. Never
                skip 2 days in a row. Switch to the Profile tab to see your
                university strategy and CGPA mitigation plan.
              </span>
            </div>
          </>
        )}

        {view === "files" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {!isFilesAuthenticated ? (
              <div
                style={{
                  background: "#161616",
                  border: "2px solid #e8c547",
                  borderRadius: 12,
                  padding: "40px 24px",
                  textAlign: "center",
                  maxWidth: 500,
                  margin: "40px auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 36,
                      color: "#e8c547",
                    }}
                  >
                    🔐
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#e8e2d9",
                        marginBottom: 8,
                      }}
                    >
                      Access Protected
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#7a7060",
                      }}
                    >
                      Enter your secret key to access your files
                    </div>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter secret key..."
                    value={filesKeyInput}
                    onChange={(e) => setFilesKeyInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleFilesAuth()}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 6,
                      border: "1px solid #2a2a2a",
                      background: "#1a1a1a",
                      color: "#e8e2d9",
                      fontFamily: "monospace",
                      fontSize: 13,
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleFilesAuth}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      borderRadius: 6,
                      border: "1px solid #e8c547",
                      background: "#e8c547",
                      color: "#0f0f0f",
                      fontFamily: "monospace",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    background: "#161616",
                    border: "2px dashed #e8c547",
                    borderRadius: 12,
                    padding: "40px 24px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        color: "#e8c547",
                      }}
                    >
                      🔗
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#e8e2d9",
                          marginBottom: 4,
                        }}
                      >
                        Add Google Drive Files
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#7a7060",
                        }}
                      >
                        Paste your publicly shared Google Drive link
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        width: "100%",
                        maxWidth: 500,
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Paste Google Drive share link..."
                        value={gdriveLinkInput}
                        onChange={(e) => setGdriveLinkInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddLink()}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: 6,
                          border: "1px solid #2a2a2a",
                          background: "#1a1a1a",
                          color: "#e8e2d9",
                          fontFamily: "monospace",
                          fontSize: 12,
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={handleAddLink}
                        style={{
                          padding: "10px 20px",
                          borderRadius: 6,
                          border: "1px solid #e8c547",
                          background: "#e8c547",
                          color: "#0f0f0f",
                          fontFamily: "monospace",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>

                {gdriveLinks.length > 0 ? (
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #2a2a2a",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "#1a1a1a",
                        borderBottom: "1px solid #2a2a2a",
                        padding: "16px 24px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: "#e8c547",
                          letterSpacing: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        🔗 Your Files ({gdriveLinks.length})
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                      }}
                    >
                      {gdriveLinks.map((link) => (
                        <div
                          key={link.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 20px",
                            borderBottom: "1px solid #222",
                            background: "#1a1a1a",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#c0b8a8",
                                fontWeight: 500,
                                marginBottom: 4,
                              }}
                            >
                              {link.name || "Google Drive File"}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#555",
                                fontFamily: "monospace",
                              }}
                            >
                              Added {link.addedAt}
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(link.url, "_blank")}
                            style={{
                              background: "#47b8e830",
                              color: "#47b8e8",
                              border: "1px solid #47b8e850",
                              borderRadius: 4,
                              padding: "6px 12px",
                              fontSize: 11,
                              cursor: "pointer",
                              fontFamily: "monospace",
                              fontWeight: 600,
                              transition: "all 0.2s ease",
                              whiteSpace: "nowrap",
                            }}
                          >
                            OPEN
                          </button>
                          <button
                            onClick={() => renameLink(link.id)}
                            style={{
                              background: "#e8c54730",
                              color: "#e8c547",
                              border: "1px solid #e8c54750",
                              borderRadius: 4,
                              padding: "6px 12px",
                              fontSize: 11,
                              cursor: "pointer",
                              fontFamily: "monospace",
                              fontWeight: 600,
                              transition: "all 0.2s ease",
                              whiteSpace: "nowrap",
                            }}
                          >
                            RENAME
                          </button>
                          <button
                            onClick={() => deleteLink(link.id)}
                            style={{
                              background: "#e8476f30",
                              color: "#e8476f",
                              border: "1px solid #e8476f50",
                              borderRadius: 4,
                              padding: "6px 12px",
                              fontSize: 11,
                              cursor: "pointer",
                              fontFamily: "monospace",
                              fontWeight: 600,
                              transition: "all 0.2s ease",
                              whiteSpace: "nowrap",
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: "#161616",
                      border: "1px solid #2a2a2a",
                      borderRadius: 12,
                      padding: "40px 24px",
                      textAlign: "center",
                      color: "#555",
                    }}
                  >
                    <div style={{ fontSize: 14 }}>No links added yet</div>
                    <div style={{ fontSize: 12, marginTop: 8 }}>
                      Paste a Google Drive sharing link above
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
