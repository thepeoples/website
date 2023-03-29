import {Handlers} from "$fresh/server.ts";
import {getPage, Page} from "../utils/pages.ts";
import MarkdownPage from "./index.tsx";

export const handler: Handlers<Page> = {
    async GET(_req, ctx) {
        const page = await getPage(ctx.params.name);
        if (page === null) return ctx.renderNotFound();
        return ctx.render(page);
    }
}

export default MarkdownPage;
