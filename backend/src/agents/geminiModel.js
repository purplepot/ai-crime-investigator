import { ChatGoogle as BaseChatGoogle } from '@langchain/google';

const isInvalidKeyError = (error) => 
  /invalid[_\s-]?api[_\s-]?key|api[_\s-]?key[_\s-]?not[_\s-]?valid|permission[_\s-]?denied|unauthenticated|403|401/i.test(error?.message || '');

const DEFAULT_MODEL_LIST = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-pro',
  'gemini-3.5-flash',
  'gemini-3-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.1-pro',
];

export class ChatGoogle {
  constructor(params = {}) {
    this.params = params;
    
    // Resolve primary model and construct prioritized models array without duplicates
    const primaryModel = params.model || params.modelName || 'gemini-2.5-flash';
    this.models = [primaryModel, ...DEFAULT_MODEL_LIST.filter(m => m !== primaryModel)];

    // Resolve API keys (primary + fallbacks)
    this.keys = [
      process.env.GOOGLE_API_KEY,
      process.env.GEMINI_API_KEY,
      process.env.GOOGLE_API_KEY_FALLBACK_1,
      process.env.GOOGLE_API_KEY_FALLBACK_2,
      process.env.GOOGLE_API_KEY_FALLBACK_3,
      process.env.GOOGLE_API_KEY_FALLBACK_4,
      process.env.GEMINI_API_KEY_FALLBACK_1,
      process.env.GEMINI_API_KEY_FALLBACK_2,
    ].filter(Boolean);
  }

  async invoke(input) {
    if (!this.keys.length) {
      throw new Error('No Google Gemini API key configured in environment.');
    }

    let lastError;

    for (let keyIdx = 0; keyIdx < this.keys.length; keyIdx++) {
      const apiKey = this.keys[keyIdx];
      const keyLabel = `Key #${keyIdx + 1} (${apiKey.slice(0, 8)}...)`;

      for (let modelIdx = 0; modelIdx < this.models.length; modelIdx++) {
        const modelName = this.models[modelIdx];

        try {
          const llm = new BaseChatGoogle({
            maxRetries: 0,
            ...this.params,
            model: modelName,
            modelName: modelName,
            apiKey,
          });

          const response = await llm.invoke(input);
          return response;
        } catch (error) {
          lastError = error;
          const msg = error?.message || String(error);

          console.warn(`[Gemini Switcher] ${keyLabel} | Model "${modelName}" failed: ${msg.slice(0, 100)}...`);

          // If the API key itself is invalid or unauthorized, skip all models for this key
          if (isInvalidKeyError(error)) {
            console.warn(`[Gemini Switcher] ${keyLabel} is invalid/unauthorized. Switching immediately to next API key...`);
            break; // Jump to next API key
          }

          // Otherwise (rate limit, quota exceeded, model not found, overload, 429, 404, 503),
          // try next model on the same API key.
        }
      }
    }

    throw lastError || new Error('All configured Gemini models and API keys were exhausted without success.');
  }
}
