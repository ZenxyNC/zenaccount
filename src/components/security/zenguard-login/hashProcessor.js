import { _hash } from './hashMap.js';

class hashProcessor {
  #hashedString = "";

  constructor(string, minimumLength = 5) {
    this.string = string;
    this.minimumLength = minimumLength;
  }

  response(ok, object) {
    return { ok, object };
  }

  startengine() {
    // It should be engine verification process, but i haven't finished the system yet.

    // ======== Check String Requirements ========
    const validString = this.checkString()

    // Catch validation response
    if (!validString.ok) {
      return this.response(false, validString.object) // Return response (NOT OK)
    }

    // ======== Hash String ========
    const hashProcess = this.hashString()

    // Catch hash response
    if (!hashProcess.ok) {
      return this.response(false, hashProcess.object) // Return response (NOT OK)
    }

    return this.response(true, this.#hashedString) // Return response (OK)
  }

  checkString() {
    // Check empty string or whitespace
    if (this.string == "") {
      return this.response(false, "String is empty or whitespace.") // Return response (NOT OK)
    }

    // Check string length
    if (this.string.length < this.minimumLength) {
      return this.response(false, "String length must be at least 5 characters.") // Return response (NOT OK)
    }

    return this.response(true, "String is valid.") // Return response (OK)
  }

  hashString() {
    const splitString = this.string.split("") // Split string into individual characters in a list.

    // Loop through each character in the list
    for (let i = 0; i < splitString.length; i++) {
      // Check if character is in the hash map
      if (splitString[i] in _hash) {
        // Replace character with its hash code
        splitString[i] = _hash[splitString[i]]
      }
    }

    // Join the list into a string, then put it in the hashedString variable
    this.#hashedString = splitString.join("")
    return this.response(true, "String is hashed.") // Return response (OK)
  }
}

export default hashProcessor