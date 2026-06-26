import { getDB } from "./getData";

const URL = import.meta.env.VITE_JSONBIN_URL
const MASTERKEY = import.meta.env.VITE_JSONBIN_MASTER_KEY

export default async function updateUserData(data) {
  async function pushJSONBin(newData) {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        "X-Master-Key": MASTERKEY
      },
      body: JSON.stringify(newData)
    });

    if (!response.ok) {
      throw new Error("Failed to update user data");
    }

    return { ok: true, message: "User data updated successfully" };
  }

  if (!URL || !MASTERKEY) {
    return { ok: false, message: "Missing environment variables" };
  }

  if(!data?.first_name ||
    !data?.last_name ||
    !data?.username ||
    !data?.email ||
    !data?.phone
  ) {
    return {
      ok: false,
      message: "Incomplete required data. Make sure it contains first name, last name, userame, email, and phone."
    }
  }

  try {
    const getJSONDB = await getDB(); // Get all data
    if (!getJSONDB.ok) {
      throw new Error(getJSONDB.message);
    }

    const usersFromDB = getJSONDB.data.record.users // Point to specific key-value (users)

    // Check if user exists
    const findUser = usersFromDB.find(user => user.username.toLowerCase() === data.username.toLowerCase());
    if (!findUser) {
      throw new Error("User not found");
    }

    // Filter out the old user
    const updatedUserData = usersFromDB.filter(user => user.username.toLowerCase() !== data.username.toLowerCase());
    // Process Password
    if(data?.password_hashed) {
      data.password_hashed = data.password_hashed;
    } else {
      data.password_hashed = findUser.password_hashed;
    }
    // Add the updated user
    updatedUserData.push(data);

    // Update the JSON data
    const updatedJSONDB = {
      ...getJSONDB.data.record,
      users: updatedUserData
    }

    // Push to database
    const updateJSONDB = await pushJSONBin(updatedJSONDB);

    if (!updateJSONDB.ok) {
      throw new Error(updateJSONDB.message);
    }

    return {
      ok: true,
      message: "User data updated successfully",
      data
    };

  } catch (err) {
    return {
      ok: false,
      message: err.message || err
    };
  }
}