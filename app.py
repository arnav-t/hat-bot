from flask import Flask, render_template, url_for, request, Response, redirect, jsonify
import json
from cost import getPrice, string2scrap

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/ajax', methods = ['POST'])
def read():
	data = request.get_json()
	print('Checking ' + str(len(data)) + ' hats...')
	newData = []
	for idx, hat in enumerate(data):
		if idx%10 == 0:
			print('[' + str(idx+1) + '/' + str(len(data)) + ']')
		price = string2scrap(getPrice(hat['Quality'], hat['Name']))
		profit = price - int(hat['Price'])
		if profit > 0:
			print(hat['Quality'] + ' ' +  hat['Name'] + ': ' + str(profit))
			newData.append(hat)

	return jsonify(newData)

if __name__ == '__main__':
	app.run(debug = True)