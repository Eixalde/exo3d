# This small python Script allows to make local HTTPS servers. It became crucial
# the moment we got into WebXR development, and you shall always launch servers
# with the just command "server", otherwise the WebXR version will not be
# allowed to run.

# Taken from the StackOverflow thread : https://stackoverflow.com/a/19706670

import http.server
import ssl

# '0.0.0.0' can be replaced by 'localhost' for PC-exclusive tests (if you do,
# replace the port by 4443), but if you are VR-testing, '0.0.0.0' may be
# mandatory (for Oculus Quest or any mobile headset).
server_address = ('0.0.0.0', 443)
print("Started server on https://0.0.0.0/www/select_system.html")
httpd = http.server.HTTPServer(
    server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               certfile='localhost.pem',
                               ssl_version=ssl.PROTOCOL_TLS)
httpd.serve_forever()

