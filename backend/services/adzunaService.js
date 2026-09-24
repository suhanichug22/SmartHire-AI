const COMMON_SKILLS = [
    "React", "Node.js", "JavaScript", "TypeScript", "Python", "Java", "C++",
    "HTML", "CSS", "Tailwind", "Next.js", "Express", "MongoDB", "SQL",
    "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git", "Redux", "REST API",
    "GraphQL", "DevOps", "AI", "Machine Learning", "Figma", "UI/UX"
];

function cleanHtml(text) {
    if (!text) return "";
    return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSkills(text, categoryLabel) {
    const skills = new Set();
    if (categoryLabel) {
        skills.add(categoryLabel.replace(" Jobs", ""));
    }
    const lowerText = text.toLowerCase();
    for (const skill of COMMON_SKILLS) {
        const escaped = escapeRegex(skill.toLowerCase());
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9+])${escaped}(?:$|[^a-zA-Z0-9+])`, "i");
        if (regex.test(lowerText)) {
            skills.add(skill);
        }
    }
    return Array.from(skills).slice(0, 6);
}

function formatSalary(job) {
    const min = job.salary_min;
    const max = job.salary_max;
    if (min && max && min > 0 && max > 0) {
        return `₹${Math.round(min).toLocaleString("en-IN")} - ₹${Math.round(max).toLocaleString("en-IN")}/yr`;
    }
    if (min && min > 0) {
        return `₹${Math.round(min).toLocaleString("en-IN")}+ /yr`;
    }
    if (max && max > 0) {
        return `Up to ₹${Math.round(max).toLocaleString("en-IN")}/yr`;
    }
    return "Competitive / Best in Industry";
}

function formatJobType(job) {
    if (job.contract_time === "part_time") return "Part Time";
    if (job.contract_type === "contract") return "Contract";
    return "Full Time";
}

async function fetchAdzunaJobs({ what = "", where = "", resultsPerPage = 20, page = 1, country = "in" } = {}) {
    const appId = process.env.ADZUNA_APP_ID || "f9715d58";
    const appKey = process.env.ADZUNA_APP_KEY || "3996a9b7b3988ea8bc2eb507c70b4a70";

    try {
        let url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}`;
        if (what && what.trim()) {
            url += `&what=${encodeURIComponent(what.trim())}`;
        }
        if (where && where.trim()) {
            url += `&where=${encodeURIComponent(where.trim())}`;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!response.ok) {
            console.warn(`Adzuna API returned status: ${response.status}`);
            return [];
        }

        const data = await response.json();
        const results = data.results || [];

        return results.map((job) => {
            const rawTitle = job.title || "Software Opportunity";
            const cleanTitle = cleanHtml(rawTitle);
            const rawDesc = job.description || "";
            const cleanDesc = cleanHtml(rawDesc);
            const categoryLabel = job.category?.label || "";
            const skills = extractSkills(`${cleanTitle} ${cleanDesc}`, categoryLabel);

            return {
                _id: `adzuna_${job.id}`,
                title: cleanTitle,
                company: job.company?.display_name || "Confidential",
                location: job.location?.display_name || (job.location?.area || []).join(", ") || "India",
                salary: formatSalary(job),
                description: cleanDesc,
                skills: skills.length > 0 ? skills : ["IT", "Technology"],
                jobType: formatJobType(job),
                status: "Open",
                isExternal: true,
                source: "Adzuna",
                redirect_url: job.redirect_url,
                applicants: 0,
                createdAt: job.created || new Date().toISOString()
            };
        });
    } catch (error) {
        console.warn("⚠️ Failed to fetch Adzuna jobs:", error.message);
        return [];
    }
}

module.exports = {
    fetchAdzunaJobs
};
