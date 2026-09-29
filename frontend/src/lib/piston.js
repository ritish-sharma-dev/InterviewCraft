const JUDGE0_API = import.meta.env.VITE_JUDGE0_API_URL || "https://ce.judge0.com";

const LANGUAGE_IDS = {
  javascript: 93,
  python: 100,
  java: 91,
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageId = LANGUAGE_IDS[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || `Code runner returned HTTP ${response.status}`,
      };
    }

    if (result.status?.id !== 3) {
      return {
        success: false,
        output: result.stdout || "",
        error:
          result.compile_output ||
          result.stderr ||
          result.message ||
          result.status?.description ||
          "Code execution failed",
      };
    }

    return {
      success: true,
      output: result.stdout || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}
