// Reference: https://github.com/denoland/fresh-blog-example

import {Head} from "$fresh/runtime.ts";
import {Handlers, PageProps} from "$fresh/server.ts";
import {getPage, Page, PAGE_CSS} from "../utils/pages.ts";

const HTTP_PREFIX = "http://";
const HTTPS_PREFIX = "https://";
const LOCALHOST = "localhost:8000";

// App entrypoint
export const handler: Handlers<Page> = {
    async GET(_req, ctx) {
        // // redirect HTTP requests to HTTPS
        // if (_req.url.startsWith(HTTP_PREFIX + LOCALHOST)) {
        //     console.log('Skipping redirect to HTTP since running locally');
        // } else if (_req.url.startsWith(HTTP_PREFIX)) {
        //     const uri = _req.url.slice(HTTP_PREFIX.length);
        //     return new Response(undefined, {
        //         status: 301,
        //         headers: {location: `${HTTPS_PREFIX}${uri}`}
        //     });
        // }

        // render desired page
        const page = await getPage(ctx.params.name);
        return ctx.render(page);
    }
}

export default function MarkdownPage(props: PageProps<Page>) {
    const page = props.data;

    return (
        <>
            <Head>
                <title>{page.title}</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#2b5797"/>
                <meta name="theme-color" content="#ffffff"/>
                <style dangerouslySetInnerHTML={{__html: PAGE_CSS}}/>
            </Head>

            <main className="max-w-screen-md px-4 py-16 mx-auto">
                <h1 className="text-4xl font-bold pb-4">{page.title}</h1>

                <div
                    className="mt-8 markdown-body"
                    dangerouslySetInnerHTML={{__html: page.content}}
                />
            </main>
        </>
    )
}

