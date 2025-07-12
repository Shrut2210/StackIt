const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function uploadImage(file) {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .upload(filePath, fs.createReadStream(file.path), {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error("Image upload failed: " + error.message);

  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

module.exports = uploadImage;