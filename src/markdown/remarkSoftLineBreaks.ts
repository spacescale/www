type MarkdownNode = {
    type?: string;
    value?: string;
    children?: MarkdownNode[];
};

const splitTextNode = (node: MarkdownNode): MarkdownNode[] => {
    if (node.type !== "text" || typeof node.value !== "string" || !node.value.includes("\n")) {
        return [node];
    }

    return node.value.split("\n").flatMap((value, index, parts) => {
        const nodes: MarkdownNode[] = [];

        if (value) {
            nodes.push({ ...node, value });
        }

        if (index < parts.length - 1) {
            nodes.push({ type: "break" });
        }

        return nodes;
    });
};

const visit = (node: MarkdownNode) => {
    if (!node.children) {
        return;
    }

    node.children = node.children.flatMap(splitTextNode);
    node.children.forEach(visit);
};

// Astro supports remark plugins in `astro.config.ts`; this keeps engineering posts
// friendly to write by preserving intentional manual line breaks in Markdown/MDX.
export const remarkSoftLineBreaks = () => (tree: MarkdownNode) => {
    visit(tree);
};
