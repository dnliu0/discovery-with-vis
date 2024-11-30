/// <reference types="svelte" />
/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_OPENAI_API_KEY: string;
    readonly VITE_APP_TITLE: string; // Other environment variables
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}