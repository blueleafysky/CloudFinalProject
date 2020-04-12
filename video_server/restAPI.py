from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask import make_response
from rules.testRule import output
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Hello World"

@app.route('/testABR', methods=['POST'])
def testABR():
    val = output()
    return str(val)

if __name__ == "__main__":
    app.run(debug = True)