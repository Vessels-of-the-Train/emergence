export const ai = {
    defineFlow: (config: any, fn: any) => fn,
    defineSchema: (name: string, schema: any) => schema,
    generate: async () => ({ text: 'Mock response' }),
} as any;
