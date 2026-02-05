import http.server
import socketserver

PORT = 5555

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<h1>Python Server Funcionando!</h1><p>Se ves isto, o problema NAO e Windows.</p>')

with socketserver.TCPServer(("127.0.0.1", PORT), MyHandler) as httpd:
    print(f"Servidor Python rodando em http://127.0.0.1:{PORT}")
    print("Ctrl+C para parar")
    httpd.serve_forever()
