import {Head} from "$fresh/runtime.ts";
import Counter from "../islands/Counter.tsx";

export default function Home() {
    return (
        <>
            <Head>
                <title>The Peoples</title>
            </Head>
            <div class="p-4 mx-auto max-w-screen-md">
                <img
                    src="/i-am-the-cloud.jpg"
                    class="center"
                    alt="meme placeholder"
                />
                <p class="my-6">
                    <strong>The Peoples' Infrastructure and Service Platform</strong>
                </p>
                <p class="my-6">
                    Reference architecture for self-sovereign infrastructure.
                </p>
                <p class="my-6">
                    <strong>Status:</strong> Under construction: Phase 1 (last update: 2023-03-27)
                </p>
                {/*<Counter start={3} />*/}
            </div>
        </>
    );
}
