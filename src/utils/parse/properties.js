// Server.properties parser for Java Edition

module.exports = {
  parse: (properties) => {
    /*
     * Parse server.properties
     *
     * @param {string} properties - The contents of server.properties
     * @returns {object} - The parsed properties (key-value pairs)
     */
    // Split the properties into lines
    const lines = properties.split("\n");
    // The properties object
    const props = {};
    // Loop through the lines
    for (let i = 0; i < lines.length; i++) {
      // Get the line
      let line = lines[i];
      // Remove comments
      line = line.split("#")[0];
      // Remove whitespace
      line = line.trim();
      // Check if the line is empty
      if (line.length === 0) {
        continue;
      }
      // Get the key and value
      const key = line.split("=")[0];
      const value = line.split("=")[1].trim();
      // Add the key and value to the properties object
      props[key] = value;
    }
    // Return the properties object
    return props;
  },

  dump: (properties) => {
    /*
     * Dump the properties object to a string
     *
     * @param {object} properties - The properties object
     * @returns {string} - The properties as a string
     */
    // The properties string
    let props = "";
    // Loop through the properties
    for (const key in properties) {
      // Get the value
      const value = properties[key];
      // Add the key and value to the properties string
      props += `${key}=${value}`;
      if (key !== Object.keys(properties).pop()) {
        props += "\n";
      }
    }
    // Return the properties string
    return props;
  },
};
