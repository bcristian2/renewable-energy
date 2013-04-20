import json
from itertools import izip

def createJSONfile():
	solarDataFile=open("global_radiation.txt", "r")

	for _ in range(0,14):
		solarDataFile.readline()

	windDataFile=open("wind_data.txt", "r")

	for _ in range(0,8):
		windDataFile.readline()

	jsonList=[]
	for windLine, solarLine in izip(windDataFile, solarDataFile):
		windList=windLine.split(" ")
		solarList=solarLine.split(" ")
		currDict=generateJSON(windList, solarList)
		jsonList.append(currDict)

	outFile=open("data.json","w")
	outFile.write(json.dumps(jsonList).replace(" ",""))


def generateJSON(windList, solarList):
	if windList[0]!=solarList[0]:
		raise Exception("Latitude does not match!")	

	if windList[1]!=solarList[1]:
		raise Exception("Longitude does not match!")

	id=str(windList[0]+windList[1])

	windMonths=[]
	solarMonths=[]
	for x in range(2,15):
		windMonths.append(windList[x])
		solarMonths.append(solarList[x])

	coordinates=[[int(windList[0]),int(windList[1])],[int(windList[0])+1,int(windList[1])],
				 [int(windList[0])+1,int(windList[1])+1],[int(windList[0]),int(windList[1])+1]]

	windDict={"value":windList,"units":"m/s"}
	solarDict={"value":solarList,"units":"kWh/m^2/day"}
	geoDict={"type":"Polygon","coordinates":coordinates}

	propertiesDict={"lat":windList[0],"long":windList[1],
					"wind":windDict,"solar":solarDict,"geometry":geoDict}

	jsonDict={"type":"Feature",
			   "id":id,
			   "properties":propertiesDict}

	return jsonDict

createJSONfile()