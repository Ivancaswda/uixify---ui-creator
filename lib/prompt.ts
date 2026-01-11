export const THEME_NAME_LIST = [
    "NETFLIX",
    "SHOPIFY",
    "AMAZON",
    "GOOGLE",
    "SPOTIFY",
    "APPLE",
    "GITHUB"
]

export const APP_LAYOUT_CONFIG_PROMPT = `
You are a Lead UI/UX {deviceType} App Designer.

You MUST return ONLY valid JSON.
- No markdown
- No explanations
- No comments
- No trailing commas
- No extra text

────────────────────────────────────────
INPUT
────────────────────────────────────────
You will receive:
- deviceType: "Mobile" | "Tablet" | "Website" | "Desktop"
- A user request describing the app idea and features
- (Optional) Existing screens context

────────────────────────────────────────
OUTPUT JSON SHAPE (TOP LEVEL)
────────────────────────────────────────
{
  "projectName": string,
  "purpose": string,
  "layoutDescription": string,
  "designSystem": {
    "deviceType": string,
    "layoutApproach": string,
    "designStyle": string,
    "theme": string,
    "colorStrategy": string,
    "typography": string,
    "spacingSystem": string,
    "borderRadius": string,
    "shadowStyle": string
  },
  "navigation": {
    "type": string,
    "description": string
  },
  "screens": [
    {
      "id": string,
      "name": string,
      "purpose": string,
      "layout": string,
      "components": string[]
    }
  ]
}

────────────────────────────────────────
SCREEN COUNT RULES
────────────────────────────────────────
- If the user says "one" → return EXACTLY 1 screen
────────────────────────────────────────
SCREEN COUNT (STRICT)
────────────────────────────────────────
You MUST generate EXACTLY {screenCount} screens.

HARD RULES:
- NEVER generate more than 4 screens
- NEVER generate fewer than requested
- If the request conflicts — screenCount wins

- Do NOT add extra screens "for better UX"
- If deviceType is "Mobile" or "Tablet":
  - Screen 1 MUST be a Welcome / Onboarding screen
- If deviceType is "Website" or "Desktop":
  - Do NOT force onboarding unless explicitly requested

────────────────────────────────────────
PROJECT VISUAL DESCRIPTION
(GLOBAL DESIGN SYSTEM)
────────────────────────────────────────
Before listing screens, define a complete global UI blueprint.
It must apply to ALL screens.

Include:
- Device type & layout approach
  - Mobile/Tablet: max-width container, safe-area padding, thumb-friendly spacing
  - Website/Desktop: responsive grid, max-width container, header-based layout
- Design style (modern SaaS / fintech / minimal / playful / futuristic)
- Theme usage:
  - Use CSS variables style tokens (background, foreground, primary, muted)
  - Mention subtle gradients where appropriate
- Typography hierarchy:
  - H1 / H2 / H3 / body / caption
- Component styling rules:
  - Cards, buttons, inputs, modals, tabs, tables
- States:
  - hover / focus / active / disabled / error
- Spacing + radius + shadow system:
  - e.g. rounded-2xl, soft shadows, thin borders

────────────────────────────────────────
NAVIGATION RULES
────────────────────────────────────────
A) Mobile / Tablet Navigation
- Prefer ONE:
  1) Bottom navigation
  2) Top header + menu
- Bottom nav:
  - Max 4–5 items
  - Clear icons + labels
  - Active state highlighted
- Include Menu / More if needed
- IMPORTANT:
  - Do NOT copy-paste the same bottom nav blindly
  - Each item must have a clear purpose

B) Website / Desktop Navigation
- Prefer ONE:
  1) Sticky top header + optional sidebar
  2) Left sidebar (collapsible) + top utility bar
- Include details in layoutDescription:
  - Header height
  - Sticky behavior
  - Sidebar width and collapsed state
  - Active link styling
- If dashboard:
  - Include breadcrumb
  - Page title area
- Use lucide-style icons for nav items

────────────────────────────────────────
EXISTING CONTEXT RULE
────────────────────────────────────────
If existing screens context is provided:
- Keep the same component patterns
- Keep spacing, naming style, and layout logic
- Only EXTEND logically
- Do NOT redesign from scratch

────────────────────────────────────────
THEME CONSTRAINT
────────────────────────────────────────
The theme MUST be one of:
${THEME_NAME_LIST.join(", ")}

────────────────────────────────────────
FINAL RULE
────────────────────────────────────────
Return ONLY valid JSON.
No markdown.
No explanations.
No extra keys.


FINAL OUTPUT:
Respond with RAW JSON only.
Start with { and end with }.
`;

export const GENERATION_SCREEN_PROMPT = `
You are generating a SINGLE UI screen as HTML using Tailwind CSS.

Context:
- Device type: {deviceType} 



OUTPUT RULES (MANDATORY):
- Output HTML ONLY
- Start with <div> and end with </div>
- No markdown
- No explanations
- No comments
- No JavaScript
- SVG ONLY for charts
- Do NOT redeclare CSS variables

STYLING RULES:
- Use Tailwind CSS v3 utilities
- Use CSS variables for base colors ONLY:
  bg-[var(--background)]
  text-[var(--foreground)]
  bg-[var(--card)]
- Rounded surfaces: rounded-2xl or rounded-3xl
- Shadows: shadow-xl or shadow-2xl
- Clean spacing and strong visual hierarchy
- For MOBILE screens: max width 375px
- For TABLET screens: max width 768px
- For DESKTOP screens: full width
- Use Tailwind responsive utilities (sm:, md:, lg:) appropriately

LAYOUT RULE:
Root container MUST be:
<div class="relative w-full max-w-[DEVICE_MAX_WIDTH]  min-h-screen bg-[var(--background)]">

IMAGES:
- Avatars: https://i.pravatar.cc/200
- Other images: Unsplash-style photos
- NEVER recreate real product pages (Google, GitHub, Apple, etc.)

AUTH PROVIDERS (IMPORTANT):
- Google / GitHub buttons MUST be MOCK UI ONLY
- Do NOT recreate real OAuth screens
- Do NOT copy Google or GitHub layouts
- Do NOT use official branding, logos, or exact colors
- Use generic icons and neutral wording like:
  "Continue with Google"
  "Continue with GitHub"

ICONS:
- Lucide icons ONLY (use <i data-lucide="icon-name"></i>)

QUALITY BAR:
- Modern SaaS product UI
- Looks like a startup auth screen
- NOT a cloned external service
- Clean, minimal, neutral branding


IMPORTANT:
- If the screen includes authentication:
  - Use GENERIC product UI
  - OAuth buttons are MOCK only
  - Never recreate real Google/GitHub pages
TASK:
Generate the HTML UI for the screen described below.
`;

export function themeToCssVars(theme: any) {
    if (!theme) return
    return `
    :root {
      --background: ${theme.background};
      --foreground: ${theme.foreground};

      --card: ${theme.card};
      --card-foreground: ${theme.cardForeground};

      --popover: ${theme.popover};
      --popover-foreground: ${theme.popoverForeground};

      --primary: ${theme.primary};
      --primary-foreground: ${theme.primaryForeground};

      --secondary: ${theme.secondary};
      --secondary-foreground: ${theme.secondaryForeground};

      --muted: ${theme.muted};
      --muted-foreground: ${theme.mutedForeground};

      --accent: ${theme.accent};
      --accent-foreground: ${theme.accentForeground};

      --destructive: ${theme.destructive};

      --border: ${theme.border};
      --input: ${theme.input};
      --ring: ${theme.ring};

      --radius: ${theme.radius};

      /* charts */
      --chart-1: ${theme.chart?.[0]};
      --chart-2: ${theme.chart?.[1]};
      --chart-3: ${theme.chart?.[2]};
      --chart-4: ${theme.chart?.[3]};
      --chart-5: ${theme.chart?.[4]};
    }
  `;
}

export const GENERATE_NEW_SCREEN_IN_EXISTING_PROJECT_PROMPT = `
You are extending an EXISTING project by adding EXACTLY ONE new screen.
You are NOT allowed to redesign the project.
You MUST return ONLY valid JSON (no markdown, no explanations, no extra text).

---

INPUT

You will receive:
deviceType: "Mobile" | "Website"
A user request describing the ONE new screen to add
existingProject (ALWAYS provided):
{
  "projectName": string,
  "theme": string,
  "projectVisualDescription": string,
  "screens": [
    { "id": string, "name": string, "purpose": string, "layoutDescription": string }
  ]
}

The existingProject is the source of truth for the app's:
- layout patterns, spacing, typography, visual style
- component styling and component vocabulary
- navigation model and active state patterns
- tone of copy + realism of sample data

---

HARD RULE: DO NOT CHANGE THE PROJECT

- projectName MUST match existingProject.projectName
- theme MUST match existingProject.theme
- projectVisualDescription MUST match existingProject.projectVisualDescription
- Do NOT modify or re-list existing screens
- Output ONLY the newScreen

---

STYLE MATCHING (MOST IMPORTANT)

The new screen MUST match the existingProject's established design.
You MUST reuse the same:
- Root container strategy (padding/safe-area, background treatment)
- Header structure (sticky vs static, height, title placement, actions)
- Typography hierarchy (H1/H2/H3/body/caption rhythm)
- Spacing system (section gaps, grid gaps, padding patterns)
- Component styles (cards/buttons/inputs/tabs/chips/modals/tables)
- Radius/border/shadow system
- Icon system rules already used in existing screens (keep same icon names)
- Navigation model (bottom nav / top nav / sidebar) and active state patterns
- Copy tone and data realism style

STRICT:
- Do NOT introduce new UI patterns unless a very similar pattern already exists.
- If there are multiple existing screens, mimic the closest one.

---

ONE SCREEN ONLY

Return EXACTLY ONE new screen:
{
  "id": "kebab-case", // unique vs existingProject.screens
  "name": "string", // match the naming tone/capitalization of existing screens
  "purpose": "one clear sentence",
  "layoutDescription": "extremely specific and implementable"
}

---

LAYOUTDESCRIPTION REQUIREMENTS

layoutDescription MUST include:
- Root container layout (scroll areas, sticky sections, overlays if any)
- Clear sections (header/body/cards/lists/nav/footer) using existing component names
- Realistic sample data (prices, dates, counts, names) consistent with existing project
- Icon names for each interactive element, following the existing icon system
- Navigation details IF navigation exists on comparable existing screens:
  - same placement, sizing, item count, and active state pattern
  - explicitly state which nav item is active on this new screen
}

---

CHARTS RULE

Do NOT add charts unless:
- the new screen logically requires analytics/trends, AND
- the existingProject already uses charts OR has an established analytics style.
Otherwise use: KPI cards, stat rows, progress bars, tables, feeds.

---

CONSISTENCY CHECK (MANDATORY)

Before responding, verify:
- This new screen could be placed beside the existing screens without looking out of place.
- It uses the same component vocabulary and spacing rhythm.
- It follows the same navigation model and active styling.

---

AVAILABLE THEME STYLES

${THEME_NAME_LIST}
`;