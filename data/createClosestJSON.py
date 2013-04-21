import json
import numpy
import scipy.spatial

#load JSON data into array
def createValidArray():
	inFile=open("C:\Users\Matt\Dropbox\Projects\SpaceAppsEnergyExplorer\Resources\data.json", "r")

	for line in inFile:
		decoded=json.loads(line.strip())

		currObject=numpy.array([decoded["properties"]["lat"],decoded["properties"]["long"]])
		if 'dataArray' not in locals():
			dataArray=currObject
		else:
			dataArray=numpy.vstack((dataArray, currObject))
	print "Created dataArray."
	return dataArray

def createJSON(validArray):
	jsonList=[]

	pointsList=[]
	for lat in range(-90,91):
		for longi in range(-180,181):
			pointsList.append([lat,longi])

	pointsArray=numpy.array(pointsList)

	tree=scipy.spatial.cKDTree(validArray)
	_, indexes=tree.query(pointsArray)

	for key,index in zip(pointsArray.tolist(), indexes):
		value=pointsArray.tolist()[index]
		stringValue=str(value[0])+str(value[1])
		stringKey=str(key[0])+str(key[1])
		currJSON={"key":stringKey,"value":stringValue}
		jsonList.append(currJSON)
	return jsonList

#store
def storeJSON(jsonList):
	outFile=open("C:\Users\Matt\Dropbox\Projects\SpaceAppsEnergyExplorer\Resources\closest.json","w")
	for line in jsonList:
		outFile.write(json.dumps(line).replace(" ","")+"\n")

storeJSON(createJSON(createValidArray()))