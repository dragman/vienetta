import os, os.path
import random
import string

import cherrypy
from ws4py.server.cherrypyserver import WebSocketPlugin, WebSocketTool
from ws4py.websocket import EchoWebSocket

WebSocketPlugin(cherrypy.engine).subscribe()
cherrypy.tools.websocket = WebSocketTool()

class HelloWorld(object):
    @cherrypy.expose
    def index(self):
        return open('public/html/file.html')

    @cherrypy.expose
    def generate(self, length=8):
        some_string = ''.join(random.sample(string.hexdigits, int(length)))
        cherrypy.session['mystring'] = some_string

    @cherrypy.expose
    def display(self):
        return cherrypy.session['mystring']

    @cherrypy.expose
    def ws(self):
        handler = cherrypy.request.ws_handler
    
if __name__ == '__main__':
    conf = {
        'global': {
            'server.socket_host': '0.0.0.0'
        },
        '/': {
            'tools.sessions.on': True,
            'tools.staticdir.root': os.path.abspath(os.getcwd())
        },
        '/static': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './public'
        },
        '/ws': {
            'tools.websocket.on': True,
            'tools.websocket.handler_cls': EchoWebSocket
        }
    }
    cherrypy.quickstart(HelloWorld(), '/', conf)