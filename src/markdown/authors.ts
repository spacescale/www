export const authorIds = ["tobi-ogundiyan"] as const;

export type BlogAuthorId = (typeof authorIds)[number];

type BlogAuthor = {
    name: string;
    url?: string;
};

export const blogAuthors = {
    "tobi-ogundiyan": {
        name: "Tobi Ogundiyan",
        url: "https://www.linkedin.com/in/tobilobaogundiyan/",
    },
} satisfies Record<BlogAuthorId, BlogAuthor>;
