# Launches the minecraft server

# Read the ramsize from the config file, which contains the amount of RAM the server can use (e.g. "1024")
ramsize=$(cat ramsize)

# Don't forget to log to /logs/server.log
java -Xmx$ramsize -Xms$ramsize -jar server.jar nogui
