from flask import Flask, render_template, url_for, request, Response, redirect, jsonify
import json, sqlite3
from cost import getPrice, string2scrap

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/ajax', methods = ['POST'])
def read():
	data = request.get_json()

	connection = sqlite3.connect("hats.db")
	crsr = connection.cursor()
	sql_command_init = "CREATE TABLE IF NOT EXISTS items (item_name VARCHAR(50) PRIMARY KEY, price INTEGER, list_time REAL);"
	crsr.execute(sql_command_init)
	connection.commit()


	print('Checking ' + str(len(data)) + ' hats...')
	newData = []
	for idx, hat in enumerate(data):
		if idx%10 == 0:
			print('[' + str(idx+1) + '/' + str(len(data)) + ']')
		crsr = connection.cursor()
		crsr.execute("SELECT price FROM items WHERE item_name=?", (hat['Quality'] + hat['Name'],))
		price = 0
		res = crsr.fetchall()
		if len(res) > 0:
			price = int(res[0][0])
		else:
			price = string2scrap(getPrice(hat['Quality'], hat['Name']))
			crsr.execute("INSERT INTO items VALUES (?,?,julianday('now'));",((hat['Quality'] + hat['Name']),price))
			connection.commit()
		profit = price - int(hat['Price'])
		if profit > 0:
			print(hat['Quality'] + ' ' +  hat['Name'] + ': ' + str(profit))
			hat['Price'] = profit
			newData.append(hat)

	sortedData = sorted(newData, key=lambda k: int(k['Price']), reverse=True) 
	return jsonify(sortedData)

if __name__ == '__main__':
	app.run(debug = True)