var express = require("express");
var app =express();

var bodyParser = require("body-parser");

// require API_helper.js
const api_helper = require('./API_helper')

app.use(express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res,next){
  res.sendFile(__dirname + '/index.html');
});

// TO Get list of Country names to auto complete object
app.get('/get_codes',function(req,res){
    api_helper.make_API_call('https://restcountries.eu/rest/v2/all?fields=name')
        .then(response => {
            res.json(response);

        })
        .catch(error => {
            res.send(error)
        })
});


// To Get the neighbour country of selected one

app.post('/get_neighbours',function(req,res){

    var neighborcountries=req.body.data;

    var neighborcountrieslist =neighborcountries.join([separator = ';']);
    if(neighborcountrieslist!='') {

        api_helper.make_API_call('https://restcountries.eu/rest/v2/alpha?codes=' + neighborcountrieslist + '&fields=name;')
            .then(response => {
                res.json(response);
            })
            .catch(error => {
                res.send(error)
            })
    }
});

// to get complete information data selected country

app.post('/get_meta',function(req,res){

    var countryname=req.body.data;
    if(countryname.length!=3 && countryname.length!=2){
        api_helper.make_API_call('https://restcountries.eu/rest/v2/name/' + req.body.data+'?fullText=true')
            .then(response => {
                if((response.length==1 ||typeof(response.length)=='undefined') && response.status){
                   api_helper.make_API_call('https://restcountries.eu/rest/v2/name/' + req.body.data)
                        .then(response => {
                            var result=response[0];
                            res.json(result);
                        })
                        .catch(error => {
                            res.send(error)
                        })
                }else {
                    var result = response[0];
                    res.json(result);
                }
            })
            .catch(error => {
                res.send(error)
            })

    }else {
        api_helper.make_API_call('https://restcountries.eu/rest/v2/alpha/' + req.body.data)
            .then(response => {
                res.json(response);
            })
            .catch(error => {
                res.send(error)
            })
    }
});

app.listen(3000,function(){
  console.log("We are listening at 3000");
});
