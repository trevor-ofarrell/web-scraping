const csvFilePath = 'SFSP_and_SSO_meals.csv'
const csv = require('csvtojson')
const fs = require('fs');
const scraper = require('./scraper.js')
const time = require('./getDateTime.js')

// reads the CSV download of the google doc: 
// SFSP and SSO Meal Service Sites during COVID19 School Closures, IN
// https://docs.google.com/spreadsheets/d/1rG9WrIGhDkriNxL7sZFYM9VZ945IXyyNEKx_WV8UWV8/edit#gid=0
// and converts it to JSON complient to the V1 schema
// Author -  Trevor O'Farrell

let site_data = []
const formated_data = []
const dateNow = time.getDateTimeNow()

try {
  scraper.scrape()
} catch(e) {
  console.error(e)
}

fs.readFile('./data.csv', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  var linesExceptFirst = String(data).split('\n').slice(1).join('\n');
  fs.writeFileSync('./data.csv', linesExceptFirst);
})

csv('./data.csv')
.fromFile(csvFilePath)
.then((jsonObj)=>{
    site_data = jsonObj
    try {
      for (let i = 0; i <= site_data.length; i++) {
          
          let days = site_data[i]['Days']
          
          if (String(site_data[i]['Days']).length < 10) {
            days = site_data[i]['Days'].split("").join(", ").replace('R', 'Th')
          }
          
          let date = site_data[i]['Street'] + ', ' + site_data[i]['City'] + ', Indiana ' + site_data[i]['Zip Code']

          let item = {
            sponsorName: site_data[i]['Sponsor Name'],
            siteName: site_data[i]['Site Name'],
            siteAddress: date,
            siteState: 'Indiana',
            contactPhone: String(site_data[i]['ContactPhone']).replace(/\D+/g, ""),
            contactEmail: site_data[i]['Email'],
            startDate: site_data[i]['Start Date'],
            endDate: site_data[i]['End Date'],
            daysofOperation: days,
            meals: site_data[i]['Meals'],
            lunchTime: site_data[i]['Time'],
            uploadNotes: site_data[i]['Notes'],
            _createdOn: dateNow,
            _updatedOn: dateNow
          }
          
          formated_data.push(item)

      }
    } catch(e) {}

    console.log(formated_data)
   
    fs.writeFile('indiana_data.json', JSON.stringify(formated_data, null, 4), function (err) {
        if (err) return console.log(err);
    })
  })
 