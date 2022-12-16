module.exports = function (socket, routes) {
  // We're going to handle websocket connections here after socket declares intent by path.
  // Get the declared path
  let declared = socket.declared;
  // Get the route
  let route = routes.find((route) => route.name === declared);
  // If the route exists
  if (route) {
    // If the route has a socketAction
    if (route.socketAction) {
      // Execute the socketAction
      route.socketAction(socket, route);
    }
  } else {
    // Log error
    logger.error(`Socket declared path ${declared} but no route exists.`);
  }
};
