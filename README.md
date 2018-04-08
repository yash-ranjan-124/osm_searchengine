<H1>Mapzen Pelias based osm auto Search </H1>
This is location search engine for open street map . It is uses Pelias search engine on top of which Justdial Business data are added for searching Jdbusiness on osm map.

<h2>Installation</h2>
1) clone the project<br>

2)cd api npm install<br>

3)cd schema npm install<br>

4) cd importers cd into each importers and run npm install<br>

5) cd services and install all dependencies<br>

6)cd schema npm run create_index<br>

7)goto each importers and run npm download to download osm , openaddress ,geonames data etc<br>

8) run npm start for each importer to import data to elastic search<br>

9) after downloading data run npm start for each services<br>

10) finally cd api & do npm start to run the search engine.<br>
