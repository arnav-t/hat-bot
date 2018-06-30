from flask import Flask, render_template, url_for, request, Response, redirect, jsonify
import json

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/ajax', methods = ['POST'])
def read():
	data = request.get_json()
	return jsonify(data)

if __name__ == '__main__':
	app.run(debug = True)