from flask import Flask, render_template, url_for, request, Response
import json

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/ajax', methods = ['POST'])
def read():
	data = request.get_json()
	result = ''
	for hat in data:
		result += str(hat['Quality']) + ' ' + str(hat['Name']) + ' : ' + str(hat['Price']) + '\n'
	print(result)
	return result

if __name__ == '__main__':
	app.run(debug = True)