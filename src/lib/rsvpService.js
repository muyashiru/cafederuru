import { supabase } from "./supabase";

/**
 * Save RSVP response to database
 * @param {Object} data - RSVP data
 * @param {string} data.username - Selected username from dropdown
 * @param {Date} data.loginDate - Date when they last met
 * @param {string} data.signatureImage - Base64 signature image
 * @param {string} data.dressCode - Selected dress code color
 * @param {Array} data.customRundown - Customized rundown array
 * @returns {Object} Result with success status and data/error
 */
export const saveRSVP = async (data) => {
  try {
    const { username, loginDate, signatureImage, dressCode, customRundown } =
      data;

    // Validate required fields
    if (!username || !loginDate) {
      throw new Error("Username and login date are required");
    }

    // Prepare data for insert
    const rsvpData = {
      username,
      login_date: loginDate,
      response: "yes", // Always 'yes' because they reached this point
      signature_image: signatureImage || null,
      dress_code: dressCode || null,
      custom_rundown: customRundown || null,
    };

    // Insert to Supabase
    const { data: insertedData, error } = await supabase
      .from("rsvp_responses")
      .insert([rsvpData])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return {
      success: true,
      data: insertedData,
    };
  } catch (error) {
    console.error("Error saving RSVP:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all RSVP responses (optional - for admin view)
 * @returns {Array} List of all responses
 */
export const getAllRSVPs = async () => {
  try {
    const { data, error } = await supabase
      .from("rsvp_responses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if response already exists for a username
 * @param {string} username - Username to check
 * @returns {boolean} True if exists
 */
export const checkExistingRSVP = async (username) => {
  try {
    const { data, error } = await supabase
      .from("rsvp_responses")
      .select("id")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned (expected)
      throw error;
    }

    return {
      success: true,
      exists: !!data,
    };
  } catch (error) {
    console.error("Error checking existing RSVP:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update dress code for a specific RSVP
 * @param {string} username - Username to update
 * @param {string} dressCode - Selected dress code color
 * @returns {Object} Result with success status
 */
export const updateDressCode = async (username, dressCode) => {
  try {
    const { data, error } = await supabase
      .from("rsvp_responses")
      .update({ dress_code: dressCode })
      .eq("username", username)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error updating dress code:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update custom rundown for a specific RSVP
 * @param {string} username - Username to update
 * @param {Array} customRundown - Customized rundown array
 * @returns {Object} Result with success status
 */
export const updateCustomRundown = async (username, customRundown) => {
  try {
    const { data, error } = await supabase
      .from("rsvp_responses")
      .update({ custom_rundown: customRundown })
      .eq("username", username)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error updating custom rundown:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get RSVP details by username
 * @param {string} username - Username to fetch
 * @returns {Object} Result with RSVP data
 */
export const getRSVPByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from("rsvp_responses")
      .select("*")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching RSVP:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update event date for countdown
 * @param {string} username - Username to update
 * @param {string} eventDate - Event date in ISO string format
 * @returns {Object} Result with success status
 */
export const updateEventDate = async (username, eventDate) => {
  try {
    const { data, error } = await supabase
      .from("rsvp_responses")
      .update({ event_date: eventDate })
      .eq("username", username)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error updating event date:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};
