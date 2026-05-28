export const authorIds = ["tobi-ogundiyan"] as const;

export type EngineeringAuthorId = (typeof authorIds)[number];

type EngineeringAuthor = {
    name: string;
    url?: string;
};

export const engineeringAuthors = {
    "tobi-ogundiyan": {
        name: "Tobi Ogundiyan",
        url: "https://www.linkedin.com/in/tobilobaogundiyan/",
    },
} satisfies Record<EngineeringAuthorId, EngineeringAuthor>;
