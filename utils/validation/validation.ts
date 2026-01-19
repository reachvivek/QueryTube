// Input validation utilities for API routes
// Prevents resource exhaustion, DoS attacks, and invalid data processing

/**
 * Validates and sanitizes a number within a specified range
 */
export function validateNumber(
  value: any,
  min: number,
  max: number,
  defaultValue: number
): number {
  const num = Number(value);

  if (isNaN(num)) {
    return defaultValue;
  }

  return Math.min(Math.max(num, min), max);
}

/**
 * Validates an array and ensures it's within size limits
 */
export function validateArray<T>(
  value: any,
  maxLength: number,
  errorMessage?: string
): { valid: boolean; array?: T[]; error?: string } {
  if (!Array.isArray(value)) {
    return {
      valid: false,
      error: errorMessage || "Invalid array"
    };
  }

  if (value.length === 0) {
    return {
      valid: false,
      error: errorMessage || "Array cannot be empty"
    };
  }

  if (value.length > maxLength) {
    return {
      valid: false,
      error: errorMessage || `Array exceeds maximum length of ${maxLength}`
    };
  }

  return {
    valid: true,
    array: value
  };
}

/**
 * Validates a string and ensures it's not empty and within length limits
 */
export function validateString(
  value: any,
  maxLength: number,
  required = true
): { valid: boolean; value?: string; error?: string } {
  if (typeof value !== "string") {
    return {
      valid: false,
      error: "Invalid string"
    };
  }

  const trimmed = value.trim();

  if (required && trimmed.length === 0) {
    return {
      valid: false,
      error: "String cannot be empty"
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `String exceeds maximum length of ${maxLength}`
    };
  }

  return {
    valid: true,
    value: trimmed
  };
}

/**
 * Validates a YouTube URL format
 */
export function validateYouTubeUrl(url: string): {
  valid: boolean;
  videoId?: string;
  error?: string;
} {
  try {
    const urlObj = new URL(url);

    // Support youtube.com and youtu.be domains
    if (!["www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"].includes(urlObj.hostname)) {
      return {
        valid: false,
        error: "Invalid YouTube URL domain"
      };
    }

    // Extract video ID
    let videoId: string | null = null;

    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else {
      videoId = urlObj.searchParams.get("v");
    }

    if (!videoId || videoId.length !== 11) {
      return {
        valid: false,
        error: "Invalid YouTube video ID"
      };
    }

    // Validate video ID format (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        valid: false,
        error: "Invalid YouTube video ID format"
      };
    }

    return {
      valid: true,
      videoId
    };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid URL format"
    };
  }
}

/**
 * Validates pagination parameters
 */
export function validatePagination(
  limit?: any,
  offset?: any
): { limit: number; offset: number } {
  const validatedLimit = validateNumber(limit, 1, 100, 10);
  const validatedOffset = validateNumber(offset, 0, 10000, 0);

  return {
    limit: validatedLimit,
    offset: validatedOffset
  };
}

/**
 * Validates language code
 */
export function validateLanguage(lang?: string): string {
  const supportedLanguages = ["en", "fr", "hi", "es", "de", "auto"];

  if (!lang || typeof lang !== "string") {
    return "auto";
  }

  const normalized = lang.toLowerCase().trim();

  return supportedLanguages.includes(normalized) ? normalized : "auto";
}

/**
 * Validates provider name
 */
export function validateProvider(provider?: string, allowedProviders?: string[]): string {
  const defaultProviders = ["openai", "groq", "claude", "mistral"];
  const allowed = allowedProviders || defaultProviders;

  if (!provider || typeof provider !== "string") {
    return allowed[0];
  }

  const normalized = provider.toLowerCase().trim();

  return allowed.includes(normalized) ? normalized : allowed[0];
}

/**
 * Validates temperature parameter for AI models
 */
export function validateTemperature(temp?: any): number {
  return validateNumber(temp, 0, 2, 0.3);
}

/**
 * Validates topK parameter for vector search
 */
export function validateTopK(topK?: any): number {
  return validateNumber(topK, 1, 100, 20);
}

/**
 * Sanitizes user input to prevent XSS (basic sanitization)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates UUID format
 */
export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
