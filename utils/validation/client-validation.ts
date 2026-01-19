// Client-side validation utilities for React components
// Used for real-time validation feedback in forms

/**
 * Validates YouTube URL format on client-side
 */
export function validateYouTubeUrl(url: string): {
  valid: boolean;
  error?: string;
  videoId?: string;
} {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: "Please enter a YouTube URL" };
  }

  try {
    const urlObj = new URL(url);

    // Support youtube.com and youtu.be domains
    if (!["www.youtube.com", "youtube.com", "youtu.be", "m.youtube.com"].includes(urlObj.hostname)) {
      return { valid: false, error: "Please enter a valid YouTube URL" };
    }

    // Extract video ID
    let videoId: string | null = null;

    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else {
      videoId = urlObj.searchParams.get("v");
    }

    if (!videoId || videoId.length !== 11) {
      return { valid: false, error: "Invalid YouTube video ID" };
    }

    // Validate video ID format (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return { valid: false, error: "Invalid YouTube video ID format" };
    }

    return { valid: true, videoId };
  } catch (error) {
    return { valid: false, error: "Please enter a valid URL" };
  }
}

/**
 * Validates question length
 */
export function validateQuestion(question: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = question.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Please enter a question" };
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: "Question is too long (max 1000 characters)" };
  }

  return { valid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Please enter your email" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

/**
 * Validates required field
 */
export function validateRequired(value: string, fieldName: string): {
  valid: boolean;
  error?: string;
} {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }

  return { valid: true };
}

/**
 * Validates string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): {
  valid: boolean;
  error?: string;
} {
  const trimmed = value.trim();

  if (trimmed.length < min) {
    return { valid: false, error: `${fieldName} must be at least ${min} characters` };
  }

  if (trimmed.length > max) {
    return { valid: false, error: `${fieldName} must be less than ${max} characters` };
  }

  return { valid: true };
}
