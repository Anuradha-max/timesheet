const express = require("express");
const mysql = require("mysql");
const cors =require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const db = require('./config/db')

db.connect((err) => {

if (err) {
throw err;
}
console.log("MySql Connected");
});

/*
var sql="SELECT *FROM INFORMATION_SCHEMA.TABLESWHERE TABLE_SCHEMA = 'employee'AND TABLE_NAME = 'user;"
db.query(sql,(err,result)=>{
if(result)
{
}
else
{
var sql = "CREATE TABLE `employee`.`user` (`uid` INT NOT NULL,`cid` VARCHAR(255) NULL,`fname` VARCHAR(255) NULL,`lname` VARCHAR(255) NULL,`Email` VARCHAR(255) NULL,`pass` VARCHAR(255) NULL,`gender` VARCHAR(255) NULL,`monile` VARCHAR(255) NULL,`Role` VARCHAR(255) NULL,`Status` VARCHAR(255) NULL,PRIMARY KEY (`uid`));"
db.query(sql,(err,res)=>
{
if(res)
{
  console.log("Table Created")
}
})}})
var sql1="SELECT *FROM INFORMATION_SCHEMA.TABLESWHERE TABLE_SCHEMA = 'employee'AND TABLE_NAME = edittimesheet;"
db.query(sql1,(err,result)=>{
if(result)
{
}
else
{
 var sql1 = "CREATE TABLE `employee`.`edittimesheet` (`UserId` VARCHAR(255) NOT NULL,`Date` VARCHAR(255) NOT NULL,`Client` VARCHAR(255) NOT NULL,`Project` VARCHAR(255) NOT NULL,`Sunday` VARCHAR(255) NULL,`Cmt1` VARCHAR(255) NULL,`Monday` VARCHAR(255) NULL,`Cmt2` VARCHAR(255) NULL,`Tuesday` VARCHAR(255) NULL,`Cmt3` VARCHAR(255) NULL,`Wednesday` VARCHAR(255) NULL,`Cmt4` VARCHAR(255) NULL,`Thursday` VARCHAR(255) NULL,`Cmt5` VARCHAR(255) NULL,`Friday` VARCHAR(255) NULL,`Cmt6` VARCHAR(255) NULL,`Saturday` VARCHAR(255) NULL,`Cmt7` VARCHAR(255) NULL,`Submit` VARCHAR(255) NULL,PRIMARY KEY (`UserId`, `Date`, `Client`,`Project`))";
db.query(sql1,(err,res)=>
{
if(res)
{
  console.log("Table Created")
}
})}})
var sql2="SELECT *FROM INFORMATION_SCHEMA.TABLESWHERE TABLE_SCHEMA = 'employee'AND TABLE_NAME = project;"
db.query(sql2,(err,result)=>{
if(result)
{
}
else
{
 var sql2 = "CREATE TABLE `employee`.`project` (`UserId` VARCHAR(255) NOT NULL,`Client` VARCHAR(255) NOT NULL,`Project` VARCHAR(255) NOT NULL,`NoOfHours` VARCHAR(255) NULL,`PStartDate` VARCHAR(255) NULL,`PEndDate` VARCHAR(255) NULL,`Resources` VARCHAR(255) NULL,PRIMARY KEY (`Project`,`Client`))";
			
db.query(sql2,(err,res)=>
{
if(res)
{
  console.log("Table Created")
}
})}})*/



/*Login Node Details*/
app.post("/login", (req, res) => {

    const username=req.body.username;
    const password=req.body.password;
console.log(username,"username",password,"pass");

    var sql="SELECT * FROM user WHERE uid =? AND pass =?;SELECT * FROM admin WHERE uid=? AND pass=?"
    db.query(sql,
    [username,password,username,password],
    
    ( err,result)=>{
    if(result[0].length>0)
    {
   
      if(result[0][0].uid===username&&result[0][0].pass===password){
     
    res.send(result[0])
      }
      else{
        res.send({message:"Invalid username"});
        console.log("invalid password")
      }
    
    
  }

  else if(result[1].length>0){
  if(result[1][0].uid===username&&result[1][0].pass===password){
   
      res.send(result[1])
      
      
    }
    else{
      res.send({message:"Invalid username"});
      console.log("invalid password")
    }
  }
    else{
     
    res.send({message:"Invalid userid/password"});
    }
    
    });
    
    });
/*Forget Node */
app.post("/forget", (req, res) => {

  const username=req.body.username;
  const password=req.body.password;
  const cpassword=req.body.cpassword;
   let userarr=[];
  db.query( "SELECT count(*) as length FROM user", function (err, result) {
    if (err) throw err;
    count=result[0].length
	 var sql="SELECT * FROM user;SELECT * FROM admin"
  db.query(sql,function (err, result) {
    if (err) throw err;
    for(var i=0;i<count;i++)
    {
userarr.push(result[0][i].uid);
    }
	for(var i=0;i<1;i++)
	{
	userarr.push(result[1][0].uid)
	}
  console.log("userarr",userarr)
  if(userarr.includes(username))
  {
  if(password===cpassword){
      db.query("UPDATE employee.user SET pass= ? WHERE uid =?",
  [password,username],
  ( err,result)=>{
      if(result.affectedRows!=0){
      
          res.send({message:"updated password successfully..! please login"});
      }
     })
}
 else{
   res.send({message:"password and confirm password not matched"});  
  }
}
else{
 res.send({message:"invalid username"}); 
}
  });
  })
})
  

/*Register Node Id generation*/
app.get("/register", (req, res) => {
  db.query("SELECT count(*) as length FROM user",function(err,result){
   if(result){ id ="CH"+(result[0].length+1);

     res.send({id});
 
  }
   else{ console.log(err);
      }
      
   })
})


/*Register new employee details*/
app.post("/register", (req, res) => {
  
const email=req.body.emailid;
const userid=req.body.userid.toUpperCase();
const companyid=req.body.companyid.toUpperCase();
const firstname=req.body.firstname.toUpperCase();
const lastname=req.body.lastname.toUpperCase();
const gender=req.body.gender;
const mobile=req.body.mobileno;
const password=req.body.password;
const role=req.body.role;



db.query("INSERT INTO user (Email,uid,cid,fname,lname,gender,mobile,pass,Role,Status) VALUES (?,?,?,?,?,?,?,?,?,?)",
[email,userid,companyid,firstname,lastname,gender,mobile,password,role,"A"],

( err,result)=>{
if(err)

console.log(err);

if(result){

res.send({message:"Registration is success"});
} else{
res.send({message:"Already Registered"});
}
}

);

});


/*Id Dropdown will get the userid's from database*/
app.get("/idsdropdown",(req,res)=>{
  db.query("SELECT uid,fname FROM user  ",( err,result)=>{  
if(result){
   res.send(result);
   
}
else{
   console.log(err);
}
  })

})

/*selectprofile will get the profile details of given userid*/
app.get("/selectprofile", (req, res) => {
  let userid=req.query.a;

 db.query("SELECT * FROM user WHERE uid=?",[userid],function(err,result){
     if(result){
 res.send(result);
     }
     else{
         res.send({message:"nothing"});
     }
  })
})

/*Here we are able to update the employee details*/
app.post("/updateprofile", (req, res) => {
   
  const email=req.body.emailid;
  const userid=req.body.userid.toUpperCase();
  const companyid=req.body.companyid.toUpperCase();
  const firstname=req.body.firstname.toUpperCase();
  const lastname=req.body.lastname.toUpperCase();
  const gender=req.body.gender;
  const mobile=req.body.mobileno;
  const password=req.body.password;
  const role=req.body.role;
 const status=req.body.status;
 
  
  db.query("UPDATE user SET Email=?,uid=?,cid=?,fname=?,lname=?,gender=?,mobile=?,pass=?,Role=?,Status=? WHERE uid=?",
  [email,userid,companyid,firstname,lastname,gender,mobile,password,role,status,userid],
  
  ( err,result)=>{
  if(err)
  
  console.log("update Register Error: ",err);
  
  if(result){
  
  res.send({message:"Updated  successfully.."});
  
  }
  }
  );
  });




  /*insert project details Node*/
     app.post("/CreateProject", (req, res) => {
      var Projectarr=[];
      var ProjectCount='';
	   db.query( "SELECT count(*) as length FROM project", function (err, result) {
     if (err) throw err;
     ProjectCount=result[0].length
     //console.log(ProjectCount);
	  db.query("select * from project", function (err, result) {
   Projectarr=[];
      if (err) throw err;
      for(var i=0;i<ProjectCount;i++)
      {
      Projectarr[i]=result[i].Project+"^"+result[i].Client;
    
   
      }
    
      const taskList=req.body.taskList;
      const id=req.body.id;
      //console.log(taskList)
      //console.log("Projectarr",Projectarr)
      
    let ProjectValue=[];
    var k=0;
      for(var i=0;i<taskList.length;i++)
      {
     //console.log("taskList"+taskList[i].Project);
    
    
         if(Projectarr.includes(taskList[i].Project.toUpperCase()+"^"+taskList[i].Client.toUpperCase()))
         {
     
          //console.log("there");
      }
      else{
          //console.log("hii");
         // Projectarr[ProjectCount]=taskList[i].Project+"^"+taskList[i].Client;
       //   ProjectCount++;
          k++;
          ProjectValue.push(new Array(id,taskList[i].Client.toUpperCase(),taskList[i].Project.toUpperCase(),taskList[i].NoOfHours,taskList[i].PStartDate,taskList[i].PEndDate,taskList[i].Resources))
      }}
      //console.log("ProjectValues:",ProjectValue);
      var sql="insert into Project(UserId,Client,Project,NoOfHours,PStartDate,PEndDate,Resources) VALUES?";
    
   if(k>0)
   {
     //console.log("Hello");
      db.query(sql,[ProjectValue],
      // db.query("insert into project(UserId,Client,Project,NoOfHours,PStartDate,PEndDate,Resources) VALUES (?,?,?,?,?,?,?)",
      // [id,taskList[i].Client,taskList[i].projectName,taskList[i].Hours,taskList[i].PStartDate,taskList[i].PEndDate,taskList[i].Resources],
      // );
      
  
      (err,result)=>{
      
        if(result){
          res.send({message:"Data Inserted Successfully"});
        //  res.send(result);
              }
              else{
                 // res.send({message:"Already Project Exited"});
              }
  }
  );
      
      }
      else{
        //console.log("else block")
        db.query("select * from project",
        (err,result)=>{
      
          if(result){
            res.send({message:"Already Project Exited"});
                }
                // else{
                //     res.send({message:"Already Project Exited"});
                // }
    }
    );
      }
  
      
      
      
      
      
  }
  );
     });
	    });

 /*edit project request node*/
 app.post("/EditProjectRequest",(req,res)=>{
  db.query("SELECT Client,Project FROM project",( err,result)=>{  
if(result){
   res.send(result);


}
else{
   console.log(err);
}
  })

})

/*Project Select Node*/
app.get("/ProjectSelect", (req, res) => {
  let ProjectClient=req.query.a;
//console.log(ProjectClient);

var projectclient=[];
projectclient=ProjectClient.split(",");
 db.query("SELECT * FROM project WHERE Client=? AND Project=?",[projectclient[0],projectclient[1]],function(err,result){
     if(result){
 res.send(result);
 //res.render(result);
     }
     else{
         res.send({message:"nothing"});
     }
  })
})

/*Edit Project Node*/
app.post("/editProject", (req, res) => {
  const taskList=req.body.taskList;
  const id=req.body.id;
  const ProjectClient=req.body.ProjectClient;
  //console.log(ProjectClient)
 let projectclient=[];
 projectclient=ProjectClient.split(",");


if(taskList.length>0)
{
 
 //console.log("taskList"+taskList[0].Project);
  db.query("UPDATE project SET UserId=?,Client=?,Project=?,NoOfHours=?,PStartDate=?,PEndDate=?,Resources=? WHERE Project=? AND Client=?",
[id,taskList[0].Client,taskList[0].Project,taskList[0].NoOfHours, taskList[0].PStartDate,taskList[0].PEndDate,taskList[0].Resources,taskList[0].Project,taskList[0].Client],
  

  (err,result)=>{
  
    if(result){
     // res.send(result);
      res.send({message:"Data Successfully Updated"});
      //console.log("Data Successfully Updated")
          }
          else{
              res.send({message:"Already Project Exited"});
          }
}
);
  
  }
  else{
    //console.log("Hello")
    db.query("Delete from project WHERE Client=? AND Project=?",[projectclient[0],projectclient[1]],
    (err,result)=>{
  
      if(result){
       // res.send(result);
        res.send({message:"Data Successfully Deleted"});
      //  console.log("Data Successfully Deleted")
            }
            else{
                res.send({message:"Already Project Exited"});
            }
  }
  );
  }
}
)
  
  


/*Create TimeSheet Node*/
app.post("/edittimesheet", (req, res) => {
 var TimeSheetarr=[];
var TimeSheetCount='';
db.query( "SELECT count(*) as length FROM edittimesheet", function (err, result) {
     if (err) throw err;
     TimeSheetCount=result[0].length
     //console.log("123",TimeSheetCount);
	  db.query("select * from edittimesheet", function (err, result) {
      if (err) throw err;
      for(var i=0;i<TimeSheetCount;i++)
      {
      TimeSheetarr[i]=result[i].UserId+"^"+result[i].Date+"^"+result[i].Client+"^"+result[i].Project;
      
    
   
      }
  
      
      const taskList=req.body.taskList;
      //console.log(taskList)
      const myDate=req.body.myDate;
      const id=req.body.id;
      const submit=req.body.Submit
      let DeleteArr=[];
      let DublicateEntry=[];
      const len = taskList.length;
    
     if(submit==undefined)
     {
       submit="1";
     }
     //console.log("submit",submit);
     //console.log(TimeSheetarr,"TimeSheet")
     for(var i=0;i<len;i++)
      {
        if(taskList[i].Sunday=="")
        {
taskList[i].Sunday=0;
        }
          if(taskList[i].Monday=="")
        {
taskList[i].Monday=0;
        }
          if(taskList[i].Tuesday=="")
        {
taskList[i].Tuesday=0;
        }
          if(taskList[i].Wednesday=="")
        {
taskList[i].Wednesday=0;
        }
          if(taskList[i].Thursday=="")
        {
taskList[i].Thursday=0;
        }
          if(taskList[i].Friday=="")
        {
taskList[i].Friday=0;
        }
        if(taskList[i].Saturday=="")
        {
taskList[i].Saturday=0;
        }
       if(!DublicateEntry.includes(id+"^"+myDate+"^"+taskList[i].Client+"^"+taskList[i].Project))
       {
         DublicateEntry.push(id+"^"+myDate+"^"+taskList[i].Client+"^"+taskList[i].Project)
        
       if(TimeSheetarr.includes(id+"^"+myDate+"^"+taskList[i].Client+"^"+taskList[i].Project))
       {
     
         DeleteArr[i]=taskList[i].UserId+"^"+taskList[i].Date+"^"+taskList[i].Client+"^"+taskList[i].Project;
      
        db.query("UPDATE edittimesheet SET UserId=?,Date=?,Client=?,Project=?,Sunday=?,Cmt1=?,Monday=?,Cmt2=?,Tuesday=?,Cmt3=?,Wednesday=?,Cmt4=?,Thursday=?,Cmt5=?,Friday=?,Cmt6=?,Saturday=?,Cmt7=?,Submit=? WHERE UserId=? AND Date=? AND Client=? AND Project=?",
      [id,myDate,taskList[i].Client,taskList[i].Project,taskList[i].Sunday,taskList[i].Cmt1,taskList[i].Monday,taskList[i].Cmt2,taskList[i].Tuesday,taskList[i].Cmt3,taskList[i].Wednesday,taskList[i].Cmt4,taskList[i].Thursday,taskList[i].Cmt5,taskList[i].Friday,taskList[i].Cmt6,taskList[i].Saturday,taskList[i].Cmt7,submit,id,myDate,taskList[i].Client,taskList[i].Project]);
       }
       else{
         //console.log("inserted")
        DeleteArr[i]=id+"^"+myDate+"^"+taskList[i].Client+"^"+taskList[i].Project;
        db.query("insert into edittimesheet(UserId,Date,Client,Project,Sunday,Cmt1,Monday,Cmt2,Tuesday,Cmt3,Wednesday,Cmt4,Thursday,Cmt5,Friday,Cmt6,Saturday,Cmt7,Submit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [id,myDate,taskList[i].Client,taskList[i].Project,taskList[i].Sunday,taskList[i].Cmt1,taskList[i].Monday,taskList[i].Cmt2,taskList[i].Tuesday,taskList[i].Cmt3,taskList[i].Wednesday,taskList[i].Cmt4,taskList[i].Thursday,taskList[i].Cmt5,taskList[i].Friday,taskList[i].Cmt6,taskList[i].Saturday,taskList[i].Cmt7,submit])
       }
      }
    }
    console.log(DublicateEntry,"Dublicate")
      //console.log(DeleteArr,"delete")
      db.query("select * from edittimesheet",function(err,result)
      {
        for(var i=0;i<TimeSheetCount;i++)
        {
          let key=result[i].UserId+"^"+result[i].Date+"^"+result[i].Client+"^"+result[i].Project;
          if(id.includes(result[i].UserId)&&myDate.includes(result[i].Date))
			{
        if(!DeleteArr.includes(key))
        {
          db.query("DELETE FROM edittimesheet WHERE UserId=? AND Date=? AND Client=? AND Project=?",[id,myDate,result[i].Client,result[i].Project])
        }
      }
        }
      })
      
      
      
      db.query("select * from edittimesheet", function (err, result) {   
        
     
         if(result){
      
           
         // res.send(result)
       res.send({message:"Data Successfully Saved"})
         
       
     
      
         
        }
        else{
           // console.log("updated else block");
         }
        
        }
     
       
       
       )
      });
	    });
  });

 
/*EditTimeSheet Node*/

  app.get("/TimeSheetSelect", (req, res) => {
    let id=req.query.a;
    let WeekDate=req.query.myDate
  //console.log(WeekDate);
  
 
  db.query("select * from edittimesheet WHERE UserId=? AND Date=?",[id,WeekDate], function (err, result) {
    if(result.length>0){
      res.send(result);
      //console.log("Hello")
          }
          else{
              res.send({message:"Already Project Exited"});
          }
   
  
  });
});

/*TimeSheet Client And Project*/
app.get("/ClientSelect", (req, res) => {
  userid=req.query.a
  //console.log("userid",userid);

db.query("select * from project WHERE UserId=? OR Resources like?",[userid,'%' + userid + '%'], function (err, result) {
  if (err) throw err;
 res.send(result)


});
});

/*Project Reports*/
app.get("/projectreports",(req,res)=>{
  db.query("SELECT * FROM project ",( err,result)=>{
  if(result){
  res.send(JSON.stringify(result));
  //console.log("project reports:"+JSON.stringify( result))
  }
  else{
  console.log(err);
  }
  })
  
  })

  /*TimeSheet Reports*/
  app.get("/TimeSheetReports",(req,res)=>{
    db.query("SELECT * FROM edittimesheet ",( err,result)=>{
    if(result){
    res.send(JSON.stringify(result));
  //  console.log("project reports:"+JSON.stringify( result))
    }
    else{
    console.log(err);
    }
    })
    
    })
    app.get("/User",(req,res)=>{
      db.query("SELECT * FROM user ",( err,result)=>{
      if(result){
      res.send(JSON.stringify(result));
    //  console.log("project reports:"+JSON.stringify( result))
      }
      else{
      console.log(err);
      }
      })
      
      })

      
app.listen("3001", () => {

    console.log("Server started on port 3000");
    
    });
    