const PORT = process.env.PORT || 8000 //this is for deploying on heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'The Times',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'The Guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'Telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'NY Times',
        address: 'https://www.nytimes.com/section/climate',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'Latimes',
        address: 'https://www.latimes.com/environment',
        base: ''
    },
    {
        name: 'UN',
        address: 'https://www.un.org/climatechange',
        base: ''
    },
   {
        name: 'BBC',
        address: 'https://www.bbc.com/future',
        base: 'https://www.bbc.com/'
    },
    {
        name: 'Standard',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'The Sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'NY Post',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    },
      {
        name: 'Daily Mail',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    }
]

const articles = []
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                const img = $(this, 'img').attr('src')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name,
                    img: img
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Climate Change News API')
})

app.get('/news', (req, res) => {
   res.json(articles)
})

app.get('/news/:newspaperId', /*async*/ (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
    }).catch( err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));