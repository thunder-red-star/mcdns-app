const jwt = require("jsonwebtoken");
module.exports = {
  name: "login",
  path: "/login/",
  enabled: true,
  method: "post",
  ratelimit: {
    // The maximum number of requests that can be made in the time window
    max: 100,
    // The time window in milliseconds
    window: 1,
  },
  handler: async (req, res) => {
    // Get form password from body
    const formPassword = req.body.password;
    // Check if the password is correct
    if (formPassword === global.config.login.password) {
      // Create
      const token = jwt.sign(
        {
          // The user's ID
          id: 1,
          // The user's username
          username: "admin",
        },
        global.config.jwt.secret,
        {
          expiresIn: global.config.jwt.expiresIn,
        }
      );
      // Set the cookie
      res.cookie("token", token, {
        // The cookie expires in 1 day
        expires: new Date(Date.now() + 86400000),
        // The cookie is only accessible by the web server
        httpOnly: true,
      });
      // Redirect to the dashboard
      return res.redirect("/");
    } else {
      // Render login page with error
      return res.render("login", {
        error: "Incorrect password",
      });
    }
  },
};
