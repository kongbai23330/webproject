var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/register/", (req, res) => {
    var rusername=req.body.email;
    var ruserpassword=req.body.password;
    if (ruserpassword.length < 8 ||!/[a-z]/.test(ruserpassword) ||!/[A-Z]/.test(ruserpassword) ||!/[0-9]/.test(ruserpassword) ||!/[~`!@#\$%\^&\*\(\)-_\+=\{\}\[\]|\\;:"<>,\.\/\?]/.test(ruserpassword)){
       return res.status(400).json("Password is not strong enough")}
    var j=0;
    Users.findOne({email:rusername},function(err,food){
      if(!food||err){
        
        var password = bcrypt.hashSync(ruserpassword, salt);
        var id=guid();
        new  Users({
  
          email: rusername, 
          password: password
        }).save(function(err){
            if (err) return handleError(err);
        });
        res.send({
          success: true,
        });
      }
      else{
        return res.status(403).json("Email already in use");
      }
      
    })
})

  router.post("/login", (req, res) => {
    var name=req.body.email;
    var pass=req.body.password;
    
    Users.findOne({email:name},function(err,food){
      if(!food||err){
        
        res.status(401).send({
          "success": false,
          "msg": "Invalid credentials",
        });
      }else{
        
        item=food;
        console.log(item)
        let password1=item.password
        let correctpass= bcrypt.compareSync(pass,password1)
        if(correctpass){
          const jwtPayload = {
            name:name,
            email: name,
            id:item.id
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: "4m"
            },
            (err, token) => {
              return res.json({success: true, token});
            });
  
        }else{
            return res.status(401).send({
              "success": false,
              "msg": "Invalid credentials",
            });
        }   
      }
      
    })
  })
module.exports = router;
