import {
    getEngineeringCoverStaticPaths,
    renderEngineeringCover,
} from "../../../components/sections/engineering/covers/cover-route";

// Astro file-based routing expects public endpoints to live under src/pages.
// Keep this file as a thin route shell; the engineering section owns the cover system.
export const prerender = true;
export const getStaticPaths = getEngineeringCoverStaticPaths;
export const GET = renderEngineeringCover;
