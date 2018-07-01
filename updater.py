import sqlite3, multiprocessing, sys
from cost import getPrice, string2scrap

sql_command_update = "update items set price = ?, list_time = julianday('now') where item_name = ?;"
updatesList = []

def commitDB():
	connection = sqlite3.connect("hats.db")
	crsr = connection.cursor()
	for update in updatesList:
		crsr.execute(sql_command_update, (update['Price'], update['Name']))
	connection.commit()
	connection.close()

def updateNth(recordNum, totalUpdated):
	connection = sqlite3.connect("hats.db")
	crsr = connection.cursor()
	crsr.execute("select item_name from items order by item_name limit 1 offset ?;", (int(recordNum),))
	keyName = crsr.fetchall()[0][0]
	quality = 'Unique'
	itemName = keyName
	if keyName[0] == 'S':
		quality = 'Strange'
		itemName = keyName[7:]
	elif keyName[0] == 'G':
		quality = 'Genuine'
		itemName = keyName[7:]
	else:
		itemName = keyName[6:]
	connection.close()
	updatesList.append({'Name':keyName, 'Price':string2scrap(getPrice(quality, itemName))})
	totalUpdated.value += 1
	print(totalUpdated.value)



def updateRecords(fromNum, forNum, pid, totalUpdated):
	i = 0
	while i < forNum:
		updateNth(fromNum + i, totalUpdated)
		i += 1
	commitDB()
	print("Process {} completed.".format(str(pid)))

if __name__ == '__main__':
	processes = 63
	if len(sys.argv) > 1:
		processes = int(sys.argv[1])
	connection = sqlite3.connect("hats.db")
	crsr = connection.cursor()
	crsr.execute("select count(*) from items;")
	totalItems = int(crsr.fetchall()[0][0])
	connection.close()
	progress = multiprocessing.Value('i',0)
	for i in range(processes):
		itemNum = int(totalItems/processes)
		if i == processes - 1:
			itemNum += totalItems%processes
		procs = multiprocessing.Process(target=updateRecords, args=(i*int(totalItems/processes), itemNum, i+1, progress))
		procs.start()

