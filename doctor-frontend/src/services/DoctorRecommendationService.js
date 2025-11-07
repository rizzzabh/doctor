/**
 * DoctorRecommendationService
 * This class provides the logic for your "Doctor Dashboard". It reads the
 * `Riders_12_March_2025.json` rules file and creates an optimized,
 * high-speed lookup map to find the correct medication recommendation.
 */
class DoctorRecommendationService {
  constructor() {
    // This Map will store our pre-processed rules for O(1) lookup.
    // Key: "Gr I|true|false|false|false|false|false|false"
    // Value: "Amlodipine 5 or Telmisartan 40 or Ramipril 5"
    this.rulesMap = new Map();
    this.isRulesLoaded = false;

    // Define the exact order of keys for generating the map key.
    // This MUST match the order of properties in the input object.
    this.categoryKeyOrder = [
      "ccb",
      "rasi",
      "diuretics",
      "bb",
      "mra",
      "ab",
      "ca",
    ];
  }

  /**
   * Loads and processes the recommendation rules from your JSON file.
   * Call this ONCE when your application loads.
   * @param {string} rulesFilePath - The public URL path to your Riders_12_March_2025.json file.
   * @returns {Promise<boolean>} - True if successful, false if not.
   */
  async loadRules(rulesFilePath) {
    if (this.isRulesLoaded) {
      console.warn("DoctorRecommendationService: Rules are already loaded.");
      return true;
    }

    try {
      const response = await fetch(rulesFilePath);
      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} - Could not fetch ${rulesFilePath}`
        );
      }
      const rawRules = await response.json();

      // Process the rules and build the lookup map
      this.rulesMap = this._buildRulesMap(rawRules);
      this.isRulesLoaded = true;

      console.log(
        `DoctorRecommendationService: Rules loaded. ${this.rulesMap.size} unique rules processed.`
      );

      return true;
    } catch (error) {
      console.error(
        "DoctorRecommendationService: Failed to load or process rules:",
        error
      );
      this.isRulesLoaded = false;
      return false;
    }
  }

  /**
   * Gets the molecule recommendation based on patient's BP grade and current meds.
   * This is the main function you will call from your dashboard.
   * @param {string} htnGrade - The patient's hypertension grade (e.g., "Gr I", "Gr II-III").
   * @param {object} categories - The patient's current medication categories.
   * @returns {string} - The recommended molecule string, or a "No match" message.
   */
  getRecommendation(htnGrade, categories) {
    if (!this.isRulesLoaded) {
      console.error(
        "DoctorRecommendationService Error: Rules are not loaded. Call loadRules() first."
      );
      return "Error: Recommendation service is not ready.";
    }

    // 1. Generate the unique key from the inputs.
    const cleanHTNGrade = htnGrade ? htnGrade.trim() : null;
    if (!cleanHTNGrade) {
      console.error(
        "DoctorRecommendationService Error: HTN Grade is null or empty."
      );
      return "Error: Invalid HTN Grade.";
    }

    const lookupKey = this._generateKey(cleanHTNGrade, categories);

    // 2. Perform the O(1) lookup.
    const recommendation = this.rulesMap.get(lookupKey);

    // 3. Return the result.
    if (recommendation) {
      return recommendation;
    } else {
      console.warn(
        `DoctorRecommendationService: No matching rule found for key: ${lookupKey}`
      );
      return "No specific recommendation found for this combination.";
    }
  }

  /**
   * Private helper to build the high-speed lookup map from the raw JSON.
   */
  _buildRulesMap(rawRules) {
    const rulesMap = new Map();

    for (const entry of rawRules) {
      if (!entry || typeof entry.data !== "object" || entry.data === null) {
        continue;
      }
      const ruleData = entry.data;

      if (
        typeof ruleData["RIDER No"] !== "number" ||
        ruleData["RIDER No"] === null
      ) {
        continue;
      }

      const htnGrade = ruleData["HTN Gr"] ? ruleData["HTN Gr"].trim() : null;
      const output = ruleData["Output "] ? ruleData["Output "].trim() : null;

      if (!htnGrade || !output) {
        continue;
      }

      const categories = {
        ccb: this._normalizeBoolean(ruleData.CCB),
        rasi: this._normalizeBoolean(ruleData.RASI),
        diuretics: this._normalizeBoolean(ruleData.Diuretics),
        bb: this._normalizeBoolean(ruleData.BB),
        mra: this._normalizeBoolean(ruleData.MRA),
        ab: this._normalizeBoolean(ruleData.AB),
        ca: this._normalizeBoolean(ruleData.CA),
      };

      const key = this._generateKey(htnGrade, categories);

      if (rulesMap.has(key)) {
        console.warn(
          `DoctorRecommendationService: Duplicate rule key found: ${key}. Overwriting previous entry.`
        );
      }

      rulesMap.set(key, output);
    }

    return rulesMap;
  }

  /**
   * Private helper to create the consistent key.
   */
  _generateKey(htnGrade, categories) {
    const categoryValues = this.categoryKeyOrder.map((key) => {
      return this._normalizeBoolean(categories ? categories[key] : false);
    });

    return [htnGrade.trim(), ...categoryValues].join("|");
  }

  /**
   * Private helper to consistently convert 'y', true, etc., to a boolean.
   */
  _normalizeBoolean(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const valLower = value.toLowerCase().trim();
      return valLower === "y" || valLower === "true";
    }
    return !!value;
  }
}

// Export the class so you can 'import' it
export default DoctorRecommendationService;
