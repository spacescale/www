import { Resvg } from "@resvg/resvg-js";
import { getCollection, type CollectionEntry } from "astro:content";
import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import {
    blueGreenGlowCover,
    type EngineeringCoverTemplate,
} from "./blue-green-glow";

const rootDir = process.cwd();
const engineeringCoverTemplates: Record<string, EngineeringCoverTemplate> = {
    [blueGreenGlowCover.id]: blueGreenGlowCover,
};

const readDataUrl = async (filePath: string, mimeType: string) => {
    const data = await readFile(path.join(rootDir, filePath));
    return `data:${mimeType};base64,${data.toString("base64")}`;
};

export const getEngineeringCoverStaticPaths = async () => {
    const posts = await getCollection("engineering");

    return posts.map((post) => ({
        params: { slug: post.id.replace(/\.mdx$/, "") },
        props: { post },
    }));
};

export const renderEngineeringCover = async ({
    props,
}: {
    props: { post: CollectionEntry<"engineering"> };
}) => {
    const { post } = props;
    const template = engineeringCoverTemplates[post.data.cardVisual];
    if (!template) {
        throw new Error(
            `No engineering cover template found for cardVisual "${post.data.cardVisual}" in ${post.id}`,
        );
    }

    const [backgroundSrc, fontData] = await Promise.all([
        readDataUrl(template.backgroundFile, "image/png"),
        readFile(path.join(rootDir, template.font.file)),
    ]);
    const text = post.data.cardText || post.data.title;
    const svg = await satori(template.render({ backgroundSrc, text }), {
        width: template.output.width,
        height: template.output.height,
        fonts: [
            {
                name: template.font.family,
                data: fontData,
                weight: template.font.weight,
                style: template.font.style,
            },
        ],
    });
    const png = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: template.output.width,
        },
    })
        .render()
        .asPng();
    const body = Uint8Array.from(png).buffer as ArrayBuffer;

    return new Response(body, {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
