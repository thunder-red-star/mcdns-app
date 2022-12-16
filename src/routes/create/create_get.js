module.exports = {
  name: "create",
  path: "/create/",
  enabled: true,
  method: "get",
  ratelimit: {
    // The maximum number of requests that can be made in the time window
    max: 100,
    // The time window in milliseconds
    window: 1,
  },
  handler: async (req, res) => {
    return res.render("create");
  },
};
