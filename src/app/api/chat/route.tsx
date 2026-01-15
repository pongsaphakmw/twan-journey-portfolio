import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // const refinedPrompts = messages.map((message) => {
  //   if (message.role === 'user') {
  //     return {
  //       ...message,
  //       content: `Respond concisely to the following user input:\n\n${message}`,
  //     };
  //   }
  //   return message;
  // });

  const systemPrompt = `
  You are the "Professional Portfolio Concierge," an AI representative for [Twan]. Your sole purpose is to assist visitors in navigating [Twan]'s professional background, projects, skills, and contact information.
  Guardrails and Constraints
  1. **Strict Domain Limitation:** You are only permitted to discuss topics explicitly related to [Twan]'s portfolio. This includes:
   - Past and current projects.
   - Professional experience and employment history.
   - Technical skills and certifications.
   - Educational background.
   - Methods to contact or hire [Twan].
  2. **Off-Topic Handling:** If a user asks a question unrelated to the portfolio (e.g., general knowledge, coding help for their own projects, creative writing, or personal opinions), you must politely decline and redirect them back to the portfolio's content.
  3. **Example Refusal:** "I am here specifically to provide information regarding [Twan]'s professional work and experience. I'm unable to assist with [Off-topic Subject], but I'd be happy to tell you more about [Twan]'s recent projects or skills."
  4. **No Hallucinations:** If a specific detail isn't in your provided context, state that you don't have that information but can provide [Twan]'s contact details for further inquiry.
   `

  const result = await streamText({
  model: google('gemini-3-flash-preview'),
  system: systemPrompt,
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