import type { FontStyle, FontWeight } from "satori";

export interface EngineeringCoverTemplate {
    id: string;
    backgroundFile: string;
    output: {
        width: number;
        height: number;
    };
    font: {
        family: string;
        file: string;
        weight: FontWeight;
        style: FontStyle;
    };
    textLayer: {
        x: number;
        y: number;
        width: number;
        height: number;
        fontSize: number;
        lineHeight: number;
        letterSpacing: number;
        color: string;
    };
    render(input: { backgroundSrc: string; text: string }): any;
}

export const blueGreenGlowCover: EngineeringCoverTemplate = {
    id: "blue-green-glow",
    backgroundFile:
        "src/components/sections/engineering/covers/backgrounds/blue-green-glow.png",
    output: {
        width: 1200,
        height: 630,
    },
    font: {
        family: "Articulat CF",
        file: "public/fonts/articulat-cf/ArticulatCF-Normal.otf",
        weight: 400,
        style: "normal",
    },
    // Text layer copied from Figma node 516:40956.
    // Keep exact design numbers here so MDX copy can change without losing placement.
    textLayer: {
        x: 268,
        y: 217,
        width: 665,
        height: 185,
        fontSize: 64,
        lineHeight: 92.432,
        letterSpacing: -1.28,
        color: "#f5f7fa",
    },
    render({ backgroundSrc, text }) {
        const { output, textLayer, font } = this;

        return {
            type: "div",
            props: {
                style: {
                    position: "relative",
                    display: "flex",
                    width: output.width,
                    height: output.height,
                    overflow: "hidden",
                    backgroundColor: "#040406",
                },
                children: [
                    {
                        type: "img",
                        props: {
                            src: backgroundSrc,
                            style: {
                                position: "absolute",
                                inset: 0,
                                width: output.width,
                                height: output.height,
                            },
                        },
                    },
                    {
                        type: "div",
                        props: {
                            style: {
                                position: "absolute",
                                left: textLayer.x,
                                top: textLayer.y,
                                width: textLayer.width,
                                height: textLayer.height,
                                color: textLayer.color,
                                fontFamily: font.family,
                                fontSize: textLayer.fontSize,
                                fontWeight: font.weight,
                                letterSpacing: textLayer.letterSpacing,
                                lineHeight: `${textLayer.lineHeight}px`,
                                whiteSpace: "pre-wrap",
                            },
                            children: text,
                        },
                    },
                ],
            },
        };
    },
};
