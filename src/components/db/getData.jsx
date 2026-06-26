const URL = import.meta.env.VITE_JSONBIN_URL
const MASTERKEY = import.meta.env.VITE_JSONBIN_MASTER_KEY

export async function getUserData(type, username) {
  if (!URL || !MASTERKEY) {
    return { ok: false, message: "Missing environment variables" };
  }

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "X-Master-Key": MASTERKEY
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    const users = data.record.users;

    if(type === "user") {
      // Find and return specific user
      const user = users.find(user => user.username.toLowerCase() === username.toLowerCase());

      if (user) {
        return { ok: true, user: user };
      } else {
        return { ok: false, message: "User not found" };
      }
    } else if (type === "all") {
      // Return all users
      return { ok: true, users: users };
    } else {
      // Fallback
      return { ok: false, message: "Invalid type" };
    }
  } catch(err) {
    // Error handler
    return {
      ok: false,
      message: err.message || err
    };
  }
}

export async function getDB() {
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "X-Master-Key": MASTERKEY
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return { ok: true, data: data };
  } catch(err) {
    return { ok: false, message: err.message || err };
  }
}