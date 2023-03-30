import {join} from "$std/path/mod.ts";
import {CSS, render} from "$gfm/mod.ts";

const HOMEPAGE_TITLE = "The Peoples' Platform";
const DIRECTORY = "./pages";
const FILE_EXT_MD = ".md"
const README = "README"
const HTTP404 = "HTTP404"

export class Page {
    name = ""
    title = HOMEPAGE_TITLE;
    content = "";

    constructor(name: string) {
        this.name = name;
    }
}

export async function getPage(name: string = README): Promise<Page> {
    let text;

    try {
        text = await Deno.readTextFile(join(DIRECTORY, name + FILE_EXT_MD));
    } catch (ex) {
        name = HTTP404;
        text = await Deno.readTextFile(join(DIRECTORY, HTTP404 + FILE_EXT_MD));
    }

    const page = new Page(name);
    page.content = render(text);

    return page;
}

export const PAGE_CSS = CSS + "\nol,ul{list-style:disc}";

