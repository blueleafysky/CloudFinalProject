from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask import make_response
from rules.rl import calculate_rl_bitrate
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Hello World"

@app.route('/testABR', methods=['POST'])
def testABR():
    val = calculate_rl_bitrate(300,0,0, 5,[1,2,4,5,6,7], 10)
    # val = calculate_rl_bitrate(prev_quality, buffer_size, rebuffering_time, video_chunk_size, next_video_chunk_sizes, chunks_remaining)
    return str(val)

if __name__ == "__main__":
    app.run(debug = True)