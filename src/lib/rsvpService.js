import { supabase } from "./supabase";

/**
 * Upload signature image to Supabase Storage
 * @param {string} base64Image - Base64 encoded image
 * @param {string} username - Username for file naming
 * @returns {Object} Result with success status and image URL
 */
export const uploadSignatureImage = async (base64Image, username) => {
  try {
    console.log("🚀 Starting signature upload for:", username);

    // Convert base64 to blob
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const blob = new Blob([new Uint8Array(byteArrays)], { type: "image/png" });
    console.log("✅ Blob created, size:", blob.size, "bytes");

    // Generate unique filename
    const timestamp = new Date().getTime();
    const fileName = `${username}-${timestamp}.png`;
    const filePath = `${fileName}`; // Direct path, no subfolder

    console.log("📁 Uploading to path:", filePath);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("signatures")
      .upload(filePath, blob, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }

    console.log("✅ Upload success:", data);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(filePath);

    console.log("✅ Public URL:", publicUrlData.publicUrl);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("❌ Error uploading signature:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload face verification image to Supabase Storage (reuses 'signatures' bucket)
 */
export const uploadFaceImage = async (base64Image, username) => {
  try {
    console.log("🚀 Starting face upload for:", username);
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(byteArrays)], { type: "image/png" });
    const timestamp = new Date().getTime();
    const fileName = `face-${username}-${timestamp}.png`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("signatures")
      .upload(filePath, blob, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error("❌ Error uploading face image:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload voice record to Supabase Storage
 */
export const uploadVoiceRecord = async (blob, username) => {
  try {
    console.log("🚀 Starting voice upload for:", username);
    const timestamp = new Date().getTime();
    const fileName = `voice-${username}-${timestamp}.webm`;

    const { data, error } = await supabase.storage
      .from("signatures")
      .upload(fileName, blob, {
        contentType: blob.type || "audio/webm",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error("❌ Error uploading voice:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

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
    const { username, loginDate, signatureImage, faceImage, voiceBlob, dressCode, customRundown } =
      data;

    // Validate required fields
    if (!username || !loginDate) {
      throw new Error("Username and login date are required");
    }

    let signatureUrl = null;
    let faceUrl = null;
    let voiceUrl = null;

    // Upload signature image to storage if provided
    if (signatureImage) {
      const uploadResult = await uploadSignatureImage(signatureImage, username);
      if (uploadResult.success) {
        signatureUrl = uploadResult.url;
      } else {
        console.warn("Failed to upload signature, saving base64 instead");
        signatureUrl = signatureImage; // Fallback to base64
      }
    }

    // Upload face image to storage if provided
    if (faceImage) {
      const uploadResult = await uploadFaceImage(faceImage, username);
      if (uploadResult.success) {
        faceUrl = uploadResult.url;
      } else {
        console.warn("Failed to upload face image");
      }
    }

    // Upload voice record if provided
    if (voiceBlob) {
      const uploadResult = await uploadVoiceRecord(voiceBlob, username);
      if (uploadResult.success) {
        voiceUrl = uploadResult.url;
      } else {
        console.warn("Failed to upload voice record");
      }
    }

    // Prepare data for insert
    const rsvpData = {
      username,
      login_date: loginDate,
      response: "yes", // Always 'yes' because they reached this point
      signature_image: signatureUrl,
      dress_code: dressCode || null,
      custom_rundown: customRundown || null,
    };

    // Add face_image only if we have it (Note: Ensure the DB table has this column!)
    if (faceUrl) {
      rsvpData.face_image = faceUrl;
    }

    // Add voice_record only if we have it
    if (voiceUrl) {
      rsvpData.voice_record = voiceUrl;
    }

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

/**
 * Save rejection response to database
 * @returns {Object} Result with success status
 */
export const saveRejection = async () => {
  try {
    const rsvpData = {
      username: "Rejected",
      login_date: new Date().toISOString().split('T')[0],
      response: "no",
    };
    const { error } = await supabase.from("rsvp_responses").insert([rsvpData]);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error saving rejection:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if there is any response in the database
 * @returns {Object} Object indicating if answer exists and its type
 */
export const checkHasAnswer = async () => {
  try {
    const { data, error } = await supabase
      .from("rsvp_responses")
      .select("response")
      .limit(1);
    if (error) throw error;
    return { 
      hasAnswer: data && data.length > 0, 
      response: data && data.length > 0 ? data[0].response : null 
    };
  } catch (error) {
    console.error("Error checking answer:", error);
    return { hasAnswer: false };
  }
};
