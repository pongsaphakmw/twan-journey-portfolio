import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await streamText({
  model: google('gemini-3-flash-preview'),
  prompt: await convertToModelMessages(messages),
  providerOptions: {
    google: {
      thinkingConfig: {
        thinkingLevel: 'low',
        includeThoughts: true,
      },
    } satisfies GoogleGenerativeAIProviderOptions,
  },
});

console.log(result);

  return result.toUIMessageStreamResponse();
}