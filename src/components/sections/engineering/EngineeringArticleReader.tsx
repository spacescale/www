import { onCleanup, onMount } from "solid-js";

type ReaderDirection = "previous" | "next" | "pop";

const articleSelector = ".engineering-article";
const heroSelector = ".engineering-article__hero";
const readerContentSelector = ".engineering-article__reader-content";
const readerLinkSelector = "[data-engineering-reader-link]";
const readerHistoryKey = "spacescaleEngineeringReader";
const exitMs = 380;
const enterMs = 520;

const wait = (ms: number) =>
    new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms);
    });

const waitForPaint = () =>
    new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => resolve());
        });
    });

const getHistoryState = () =>
    typeof history.state === "object" && history.state !== null ? history.state : {};

const resetScrollForPushedArticle = () => {
    if (window.scrollX === 0 && window.scrollY === 0) {
        return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

const isEngineeringArticleUrl = (url: URL) =>
    url.origin === window.location.origin && /^\/engineering\/[^/]+\/?$/.test(url.pathname);

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const getArticleRoot = () => document.querySelector<HTMLElement>(articleSelector);

const setReaderState = (direction: ReaderDirection, phase: "exit" | "enter-from" | "enter") => {
    const root = getArticleRoot();

    if (!root) {
        return;
    }

    root.dataset.readerActive = "true";
    root.dataset.readerDirection = direction;
    root.dataset.readerPhase = phase;
};

const clearReaderState = () => {
    const root = getArticleRoot();

    if (!root) {
        return;
    }

    delete root.dataset.readerActive;
    delete root.dataset.readerDirection;
    delete root.dataset.readerPhase;
};

const updateMetaContent = (nextDocument: Document, selector: string) => {
    const current = document.head.querySelector<HTMLMetaElement>(selector);
    const next = nextDocument.head.querySelector<HTMLMetaElement>(selector);

    if (current && next?.content) {
        current.content = next.content;
    }
};

const updateHead = (nextDocument: Document) => {
    document.title = nextDocument.title;

    [
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:url"]',
        'meta[property="og:image"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
        'meta[name="twitter:image"]',
    ].forEach((selector) => updateMetaContent(nextDocument, selector));
};

const replaceArticleDom = (nextDocument: Document) => {
    const currentHero = document.querySelector<HTMLElement>(heroSelector);
    const currentReaderContent = document.querySelector<HTMLElement>(readerContentSelector);
    const nextHero = nextDocument.querySelector<HTMLElement>(heroSelector);
    const nextReaderContent = nextDocument.querySelector<HTMLElement>(readerContentSelector);

    if (!currentHero || !currentReaderContent || !nextHero || !nextReaderContent) {
        return false;
    }

    // Astro still renders each article as a real page; the island only swaps reader chrome.
    currentHero.innerHTML = nextHero.innerHTML;
    currentReaderContent.innerHTML = nextReaderContent.innerHTML;
    return true;
};

export default function EngineeringArticleReader() {
    onMount(() => {
        let isTransitioning = false;

        history.replaceState(
            { ...getHistoryState(), [readerHistoryKey]: true },
            "",
            window.location.href,
        );

        const navigateWithReader = async (
            href: string,
            direction: ReaderDirection,
            shouldPushHistory: boolean,
        ) => {
            if (isTransitioning) {
                return;
            }

            const targetUrl = new URL(href, window.location.href);

            if (!isEngineeringArticleUrl(targetUrl) || prefersReducedMotion()) {
                window.location.assign(targetUrl.href);
                return;
            }

            isTransitioning = true;

            try {
                setReaderState(direction, "exit");
                await wait(exitMs);

                const response = await fetch(targetUrl.href, {
                    credentials: "same-origin",
                    headers: { "X-SpaceScale-Reader": "1" },
                });

                if (!response.ok) {
                    throw new Error(`Unable to load article: ${response.status}`);
                }

                const nextDocument = new DOMParser().parseFromString(
                    await response.text(),
                    "text/html",
                );

                setReaderState(direction, "enter-from");

                if (!replaceArticleDom(nextDocument)) {
                    throw new Error("Article shell was missing in the fetched page.");
                }

                updateHead(nextDocument);

                if (shouldPushHistory) {
                    history.pushState({ [readerHistoryKey]: true }, "", targetUrl.href);
                    // Previous/next swaps should behave like document navigation.
                    // Browser back/forward keeps its own restored scroll position.
                    resetScrollForPushedArticle();
                }

                window.dispatchEvent(new CustomEvent("spacescale:engineering-article-swapped"));

                await waitForPaint();
                setReaderState(direction, "enter");
                await wait(enterMs);
                clearReaderState();
            } catch {
                window.location.assign(targetUrl.href);
            } finally {
                isTransitioning = false;
            }
        };

        const onClick = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target;
            const link =
                target instanceof Element
                    ? target.closest<HTMLAnchorElement>(readerLinkSelector)
                    : null;

            if (!link || link.target) {
                return;
            }

            event.preventDefault();

            const direction =
                link.dataset.engineeringReaderLink === "previous" ? "previous" : "next";

            void navigateWithReader(link.href, direction, true);
        };

        const onPopState = () => {
            const targetUrl = new URL(window.location.href);

            if (!isEngineeringArticleUrl(targetUrl)) {
                return;
            }

            void navigateWithReader(targetUrl.href, "pop", false);
        };

        document.addEventListener("click", onClick);
        window.addEventListener("popstate", onPopState);

        onCleanup(() => {
            document.removeEventListener("click", onClick);
            window.removeEventListener("popstate", onPopState);
        });
    });

    return null;
}
