declare global{
    namespace NodeJS{
        interface ProcessEnv{
            OPENAI_API_KEY:string;
            PINECONE_API_KEY:string;
            PINECONE_INDEX_NAME:string;
            INDEX_INIT_TIMEOUT:number;
            SECRET:string;
            DB_URL:string;
        }
    }
}

export{}