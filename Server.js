const express= require('express')
const app=express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Covid_Dashboard',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('Covid_Dashboard')
    app.listen(5000,()=>{
        console.log('Listening at port number 5000')
    })
})
/*app.listen(5000,()=>{
    console.log('Listening at port number 5000')
})*/
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    var tb1;
    var tb2;
    var tb3;
    var tb4;
    var tb5;
    db.collection('Hospitals').find().toArray((err,result)=>{
        if(err) return console.log(err)
        else{
            tb1=result;
            console.log(tb1);
            db.collection('Plasma_Sources').find().toArray((err,result1)=>{
                if(err) return console.log(err)
                else{
                    tb2=result1;
                    console.log(tb2);
                    db.collection('O2Suppliers').find().toArray((err,result)=>{
                        if(err) return console.log(err)
                        else{
                            tb3=result;
                            console.log(tb3);
                            db.collection('HomeCookedMeals').find().toArray((err,result)=>{
                                if(err) return console.log(err)
                                else{
                                    tb4=result
                                    console.log(tb4)
                                    db.collection('Remdesivir_Leads').find().toArray((err,result)=>{
                                        if(err) return console.log(err)
                                        else{
                                            tb5=result;
                                            res.render('homepage.ejs',{data: {data1: tb1,data2: tb2, data3: tb3, data4: tb4, data5: tb5}})   
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        
    })
})

app.get('/adminhomepage',(req,res)=>{
    var tb1;
    var tb2;
    var tb3;
    var tb4;
    var tb5;
    db.collection('Hospitals').find().toArray((err,result)=>{
        if(err) return console.log(err)
        else{
            tb1=result;
            console.log(tb1);
            db.collection('Plasma_Sources').find().toArray((err,result1)=>{
                if(err) return console.log(err)
                else{
                    tb2=result1;
                    console.log(tb2);
                    db.collection('O2Suppliers').find().toArray((err,result)=>{
                        if(err) return console.log(err)
                        else{
                            tb3=result;
                            console.log(tb3);
                            db.collection('HomeCookedMeals').find().toArray((err,result)=>{
                                if(err) return console.log(err)
                                else{
                                    tb4=result
                                    console.log(tb4)
                                    db.collection('Remdesivir_Leads').find().toArray((err,result)=>{
                                        if(err) return console.log(err)
                                        else{
                                            tb5=result;
                                            res.render('adminpage.ejs',{data: {data1: tb1,data2: tb2, data3: tb3, data4: tb4, data5: tb5}})   
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        
    })
})

app.get('/deleteHospital',(req,res)=>{
    db.collection('Hospitals').deleteOne({'hname':req.query.hname},(err,result)=>{
        if(err) console.log(err)
        res.redirect('/adminhomepage')
    })
    
})

app.get('/addHospital',(req,res)=>{
    res.render('add.ejs')
})
app.post('/AddHospData',(req,res)=>{
    db.collection('Hospitals').insertOne(req.body,(err,result)=>{
        if(err) return console.log(err);
        res.redirect('/adminhomepage')
    })
})

app.get('/updateHospital',(req,res)=>{
    var x=req.query.hname;
    console.log(x)
    res.render('update.ejs',{data: {"hname":x}})
})
app.post('/UpdateHospData',(req,res)=>{
    db.collection('Hospitals').findOneAndUpdate({hname: req.body.hname},{
        $set: {lastUpdated: req.body.lastUpdated,totalBeds: req.body.totalBeds,vacant: req.body.vacant}},
        (err,result)=>{
            if(err) return console.log(err)
            console.log('hospital updated')
            res.redirect('/adminhomepage')
        })

})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})

app.get('/logout',(req,res)=>{
    res.render('homepage.ejs')
})

app.post('/update',(req,res)=>{

    db.collection('Users').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].pid == req.body.pid){
                s=result[i].stock
                break
            }
        }
        db.collection('Users').findOneAndUpdate({pid: req.body.id},{
            $set: {stock: parseInt(s)+parseInt(req.body.stock)}},{sort: {_id: -1}},
            (err,result)=>{
             if(err) return res.send(err)
             console.log(req.body.id+'stock updated')
             res.redirect('/')   
            })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('Users').findOneAndDelete({pid: req.body.id},(err,result)=>{
        if(err) return console.logt(err)
        res.redirect('/')
    })
})