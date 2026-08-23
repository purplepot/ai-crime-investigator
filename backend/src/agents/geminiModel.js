import { ChatGoogle as BaseChatGoogle } from '@langchain/google';

const isQuotaError = (error) => /quota|rate limit|resource exhausted|429/i.test(error?.message || '');

// Drop-in wrapper used by every agent. The primary key is always attempted first;
// fallback keys are tried only for a quota/rate-limit failure.
export class ChatGoogle {
  constructor(params) {
    this.params = params;
    this.keys = [
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_API_KEY_FALLBACK_1,
      process.env.GOOGLE_API_KEY_FALLBACK_2,
    ].filter(Boolean);
  }

  async invoke(input) {
    let lastError;
    for (const apiKey of this.keys) {
      try {
        return await new BaseChatGoogle({ ...this.params, apiKey }).invoke(input);
      } catch (error) {
        lastError = error;
        if (!isQuotaError(error)) throw error;
      }
    }
    throw lastError || new Error('No Gemini API key is configured.');
  }
}
