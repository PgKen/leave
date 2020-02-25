/*
AMD005 Sana1818
*/

var express = require('express');
var router = express.Router();

var moment = require('moment');

var mysql = require('mysql');

let now = moment().format('YYYY-MM-DD');
//console.log("now = " + now);


let db_config_per = {
  host: 'localhost',
  user: 'root',
  password: 'comp@113',
  database: 'dbpersonal'
}

let db_config_leave = {
  host: 'localhost',
  user: 'root',
  password: 'comp@113',
  database: 'db_leave'
}

let db_config_person = {
  host: 'localhost',
  user: 'root',
  password: 'comp@113',
  database: 'dbpersonal'
}

var conn;
var connl;
var connp;


// start Mysql Connect
function handleDisconnect() {
  conn = mysql.createConnection(db_config_per); // Recreate the connection, since
  // the old one cannot be reused.
  conn.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  conn.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnect();
/**** End Data Service */
// start Mysql Connect
function handleDisconnectL() {
  connl = mysql.createConnection(db_config_leave); // Recreate the connection, since
  // the old one cannot be reused.
  connl.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connl.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnectL(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnectL();
/**** End Data Service */

// start Mysql Connect
function handleDisconnectP() {
  connp = mysql.createConnection(db_config_person); // Recreate the connection, since
  // the old one cannot be reused.
  connp.connect(function (err) { // The server is either down
    if (err) { // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connp.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnectP(); // lost due to either server restart, or a
    } else { // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this) 
    }
  });
}
handleDisconnectP();
/**** End Data Service */
// ชื่อแผนกทั้งหมด
var sqlDpCommand = "SELECT depart.id_dp,depart.namedp FROM depart "

let sqlTypeLeave = "SELECT * FROM leave_type"
let sqlTypeLeaveIndex = "SELECT * FROM leave_type WHERE id = ?"

let sqlPersonal = "SELECT depart.id_dp,depart.namedp,personal.`name`, "
sqlPersonal += "personal.surname,`user`.id_user,`user`.username_user "
sqlPersonal += "FROM depart "
sqlPersonal += "INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlPersonal += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlPersonal += "WHERE active = 1"

let sqlListName = "SELECT depart.id_dp,depart.namedp,personal.`name`, "
sqlListName += "personal.surname,`user`.id_user,`user`.username_user "
sqlListName += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlListName += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlListName += "WHERE active = 1 and id_dp = ? "

let sqlAllUser = "SELECT depart.id_dp,depart.namedp,personal.`name`, "
sqlAllUser += "personal.surname,`user`.id_user,`user`.username_user "
sqlAllUser += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlAllUser += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlAllUser += "WHERE active = 1"

// console.log(sqlAllUser);

let sqlIndexUser = "SELECT depart.id_dp,depart.namedp,personal.`name`, "
sqlIndexUser += "personal.surname,`user`.id_user,`user`.username_user "
sqlIndexUser += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlIndexUser += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlIndexUser += "WHERE active = 1 "
sqlIndexUser += "and id_user = ?"

//console.log(sqlIndexUser);

// รายชื่อบุคคล รวมแผนก
let sqlIndexUser2 = "SELECT depart.id_dp,depart.namedp,personal.`name`, "
sqlIndexUser2 += "personal.surname,`user`.id_user,`user`.username_user "
sqlIndexUser2 += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlIndexUser2 += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlIndexUser2 += "WHERE active = 1 "
sqlIndexUser2 += "and id_user = ?"
//console.log(sqlIndexUser2);



let sqlIndexUserStar = "SELECT *,personal.name as fistname,tambon_table.name as nametambon,ampur_table.`name` As nameAmpur,province_table.name_provi As nameProvi "
sqlIndexUserStar += "FROM depart "
sqlIndexUserStar += "INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlIndexUserStar += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlIndexUserStar += "INNER JOIN ampur_table ON personal.ampher = ampur_table.record_id "
sqlIndexUserStar += "INNER JOIN tambon_table ON tambon_table.record_id = personal.tambon "
sqlIndexUserStar += "INNER JOIN province_table ON personal.province_id = province_table.province_id "

sqlIndexUserStar += "WHERE active = 1 and id_user = ?"

// console.log(sqlIndexUserStar);




let sqlSearchName = "SELECT depart.id_dp,depart.namedp,personal.`name`,personal.surname,"
sqlSearchName += "`user`.id_user,`user`.username_user,`user`.active "
sqlSearchName += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlSearchName += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlSearchName += "WHERE`user`.active = 1 "

/*let sqlAllUser = "SELECT depart.id_dp,depart.namedp,personal.`name`,personal.surname,`user`.id_user "
sqlAllUser = "FROM depart INNER JOIN`user` ON`user`.depart = depart.id_dp "
sqlAllUser = "INNER JOIN personal ON`user`.id_user = personal.id_pro WHERE active = 1"*/

//console.log(sqlPersonal);

let sqlInsOder = "INSERT INTO leaveorder "
sqlInsOder += "(myId,order_1,order_2,order_3,order_4,order_5,order_6,order_7,status) "
sqlInsOder += "VALUES(?,?,?,?,?,?,?,?,?);"

let sqlUpdateOrder = "UPDATE leaveorder "
sqlUpdateOrder += "SET order_1 = ?,"
sqlUpdateOrder += "order_2 = ?,"
sqlUpdateOrder += "order_3 = ?,"
sqlUpdateOrder += "order_4 = ?,"
sqlUpdateOrder += "order_5 = ?,"
sqlUpdateOrder += "order_6 = ?,"
sqlUpdateOrder += "order_7 = ? "
sqlUpdateOrder += "WHERE myId = ?"

let sqlShowOrder = "SELECT * FROM leaveorder WHERE myId = ?"

let sqlDelOrder = "DELETE FROM leaveorder WHERE myId = ?"

//let valUser = "agro" + data.user
let sqlLogin = "SELECT personal.`name`,personal.surname,`user`.username_user,"
sqlLogin += "depart.namedp,`user`.password_user,md5login.passmd5,`user`.idper,"
sqlLogin += "personal.id_pro,personal.images_personal,"
sqlLogin += "`user`.id_user"
sqlLogin += " FROM depart"
sqlLogin += " INNER JOIN`user` ON`user`.depart = depart.id_dp"
sqlLogin += " INNER JOIN personal ON`user`.idper = personal.id_pro"
sqlLogin += " INNER JOIN md5login ON`user`.id_user = md5login.iduser"
sqlLogin += " WHERE md5login.passmd5 = ?"
sqlLogin += " AND username_user = ?"

//console.log(sqlLogin);

let sqlAddLeave = "INSERT INTO leavedata (myId,date_create, date_start,unit_date,date_end,type_l,cause,status) VALUES (?,?,?,?,?,?,?,?)"

let sqlAddLeave2 = "INSERT INTO leavedata (myId,date_create, date_start,unit_date,date_end,type_l,cause,status,workerId) VALUES (?,?,?,?,?,?,?,?,?)"


// ใช้สำหรับ หัวหน้า ใบเขียว
let sqlListIndex = "SELECT * FROM leavedata WHERE myId = ? AND (`status`= 3 OR status = 1 OR status = 0) ORDER BY date_create"

let sqlListIndex1 = "SELECT * FROM leavedata WHERE myId = ? ORDER BY date_create"
let sqlListIndexForUser = "SELECT * FROM leavedata WHERE myId = ? AND (status = 3 OR status = 0)  ORDER BY date_create"

let sqlFindMyId = "SELECT * FROM leaveorder WHERE order_1 = ?"

// หาชื่อจาก id_user
let sqlFindUserForId_user = "SELECT depart.id_dp,depart.namedp,personal.`name`,personal.surname,"
sqlFindUserForId_user += "`user`.id_user,`user`.username_user "
sqlFindUserForId_user += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlFindUserForId_user += "INNER JOIN personal ON `user`.idper = personal.id_pro"
sqlFindUserForId_user += " WHERE active = 1 and id_user = ?"

// console.log(sqlFindUserForId_user);

// หา ID ผู้ขอลา
let sqlListUserLeave = "SELECT leaveorder.id,leaveorder.myId,leaveorder.order_1,"
sqlListUserLeave += "leaveorder.order_2,leaveorder.order_3,leaveorder.status,leavedata.type_l,leavedata.unit_date,"
sqlListUserLeave += "leavedata.myId AS userId,leavedata.status As statusLeave,leavedata.id As idData "
sqlListUserLeave += "FROM leaveorder "
sqlListUserLeave += "INNER JOIN leavedata ON leaveorder.myId = leavedata.myId "
sqlListUserLeave += "WHERE leaveorder.order_1 = ? "
sqlListUserLeave += "AND leavedata.status = 1 "
//sqlListUserLeave += "GROUP BY myId "

// console.log(sqlListUserLeave);

// หา ID ผู้ขอลา
let sqlListUserLeaveForUser = "SELECT leaveorder.id,leaveorder.myId,leaveorder.order_1,"
sqlListUserLeaveForUser += "leaveorder.order_2,leaveorder.order_3,leaveorder.status,leavedata.type_l,leavedata.unit_date,"
sqlListUserLeaveForUser += "leavedata.myId AS userId,leavedata.status As statusLeave,leavedata.id As idData "
sqlListUserLeaveForUser += "FROM leaveorder "
sqlListUserLeaveForUser += "INNER JOIN leavedata ON leaveorder.myId = leavedata.myId "
sqlListUserLeaveForUser += "WHERE leaveorder.order_1 = ? "
sqlListUserLeaveForUser += "AND leavedata.status = 0 "
//sqlListUserLeave += "GROUP BY myId "



// Update status อนุมัต All
let sqlApproveAll = "UPDATE leavedata SET `status` = 1 WHERE id = ?"
let sqlApprove_1 = "UPDATE leavedata SET `status` = 1 WHERE id = ?" // อนุมัติ สำหรับ หัวหน้า
// let sqlNotApproveAll = "UPDATE leavedata SET `status` = 8 WHERE id = ?"
let sqlNotApproveAll = "UPDATE leavedata SET type_l = 20 ,status = 1 WHERE id = ?"
let sqlDelApprove = "DELETE FROM leavedata WHERE id = ?"
// End Update status อนุมัต All

let allUser = []

conn.query(sqlAllUser, (err, resAllUser) => {
  // console.log(resAllUser);

  allUser.push(resAllUser)
})





/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/admin', (req, res) => {
  let sql = sqlDpCommand
  //console.log(sql);

  async function main() {
    await sqlDp()
    //await sendData()
  }

  function sqlDp() {
    conn.query(sql, (err, result) => {
      //console.log(result);
      allUser(result)
    })
  }

  function allUser(dataDp) {
    let sqlAllUserquert = sqlAllUser
    conn.query(sqlAllUserquert, (err, result) => {
      sendData(dataDp, result)
    })
  }

  function sendData(dataDp, dataUser) {
    // console.log(dataDp);
    //console.log(dataUser);
    res.render('admin', {
      dataDp,
      dataUser
    })
  }
  main();

})

router.get('/test', (req, res) => {
  conn.query(sqlPersonal, (err, result) => {
    res.send(result)
  })
})


router.get('/nameList/:id', (req, res) => {
  let valId = req.params.id
  let sql = sqlListName
  conn.query(sql, [valId], (err, result) => {
    res.send(result)
  })
})

router.get('/allNameUser/:getChar', (req, res) => {
  let valChar = req.params.getChar
  console.log(valChar);
  let sql = sqlSearchName + "AND personal.`name` LIKE '%" + valChar + "%'"
  //sqlSearchName += "AND personal.`name` LIKE '%" + valChar + "%'"
  //let sql = sqlSearchName
  //console.log(sql);

  conn.query(sql, (err, result) => {
    //res.send(result)
    //console.log(result)
  })
})


// router.get('/editGrade', (req, res) => {
//   res.render('editGrade', {
//     title: 'แก้ไขลำดับขั้น'
//   })
// })

router.get('/editGrade', (req, res) => {
  let sql = sqlDpCommand
  //console.log(sql);

  async function main() {
    await sqlDp()
    //await sendData()
  }

  function sqlDp() {
    conn.query(sql, (err, result) => {
      //console.log(result);
      allUser(result)
    })
  }

  function allUser(dataDp) {
    let sqlAllUserquert = sqlAllUser
    conn.query(sqlAllUserquert, (err, result) => {
      sendData(dataDp, result)
    })
  }



  function sendData(dataDp, dataUser) {
    // console.log(dataDp);
    //console.log(dataUser);
    res.render('editGrade', {
      title: 'แก้ไขลำดับขั้น',
      dataDp,
      dataUser
    })
  }
  main();
})

router.get('/indexOderById/:id', (req, res) => {
  let getId = req.params.id

  let objName = []

  async function main() {
    await findOrder()
  }

  function findOrder() {
    let sql = "SELECT * FROM leaveorder WHERE myId = ?"
    connl.query(sql, [getId], (err, result) => {
      if (err) throw console.log(err)
      console.log(result);
      if (result == "") {
        let valNull = "noData"
        console.log("test null");

        objName.push(valNull)
        sendData(result, objName)
      } else {
        findNameOrder(result)
      }
    })
  }

  function findNameOrder(dataOrder) {
    let data = dataOrder[0]
    let sql2 = sqlIndexUser
    conn.query(sql2, [data.myId], (err, result) => {
      //console.log(result);
      objName.push(result)
      //sendData(dataOrder, objName)
      conn.query(sql2, [data.order_1], (err, result) => {
        objName.push(result)
        //sendData(dataOrder, objName)
        conn.query(sql2, [data.order_2], (err, result) => {
          objName.push(result)
          //sendData(dataOrder, objName)
          conn.query(sql2, [data.order_3], (err, result) => {
            objName.push(result)
            //sendData(dataOrder, objName)
            conn.query(sql2, [data.order_4], (err, result) => {
              objName.push(result)
              //sendData(dataOrder, objName)
              conn.query(sql2, [data.order_5], (err, result) => {
                objName.push(result)
                //sendData(dataOrder, objName)
                conn.query(sql2, [data.order_6], (err, result) => {
                  objName.push(result)
                  //sendData(dataOrder, objName)
                  conn.query(sql2, [data.order_7], (err, result) => {
                    objName.push(result)
                    sendData(dataOrder, objName)
                  })
                })
              })
            })
          })
        })
      })
    })
  }

  function sendData(dataOrder, dataName) {
    //console.log(dataName);

    res.send({
      dataOrder,
      dataName
    })
  }

  main()

})

router.post('/addOrder', (req, res) => {

  let getData = req.body.valNameList
  //console.log(getData);
  let sql = sqlInsOder
  //console.log(sql);

  //connl.query(sql, [getData[0], getData[1], getData[2]], (err, result) => {
  connl.query(sql, [getData[0], getData[1], getData[2], getData[3], getData[4], getData[5], getData[6], getData[7], 1], (err, result) => {
    if (err) throw console.log(err)
  })
  setTimeout(() => {
    console.log('delay');
    res.redirect('admin')
  }, 2000);

})

router.get('/showOrder/:id', (req, res) => {
  let valId = req.params.id
  let sql = "SELECT * FROM leaveorder WHERE myId = ?"


  async function main() {
    await allDp()
  }

  function allDp() {
    let sql = sqlDpCommand
    conn.query(sql, (err, result) => {
      if (err) throw console.log(err)
      allUser(result)
    })
  }

  function allUser(dataDp) {
    let sql = sqlAllUser
    conn.query(sql, (err, result) => {
      if (err) throw console.log(err)
      userIndex(dataDp, result)
    })
  }


  function userIndex(dataDp, dataUser) {


    connl.query(sql, [valId], (err, result) => {
      if (err) throw console.log(err)

      //console.log(result)
      res.send({
        dataDp,
        dataUser,
        dataOrder: result
      })
    })
  }
  main()
})

router.post('/editOrder', (req, res) => {
  //console.log("editOrder");
  let data = req.body.valNameList
  //console.log(data[0]);

  let sql = sqlUpdateOrder
  //console.log(sql);

  connl.query(sql, [data[1],
    data[2],
    data[3],
    data[4],
    data[5],
    data[6],
    data[7],
    data[0]
  ], (err, result) => {
    if (err) throw console.log(err)
  })
  // console.log(data);

  res.end()
})

router.get('/showOrder', (req, res) => {

  async function main() {
    await allDp()
  }

  function allDp() {
    let sql = sqlDpCommand
    conn.query(sql, (err, result) => {
      if (err) throw console.log(err)
      allUser(result)
    })
  }

  function allUser(dataDp) {
    let sql = sqlAllUser
    conn.query(sql, (err, result) => {
      if (err) throw console.log(err)
      sendData(dataDp, result)
    })
  }

  function sendData(dataDp, dataUser) {
    res.render('showOrder', {
      title: "แสดงลำดับขั้น",
      dataDp,
      dataUser
    })
  }



  main()
})


router.get('/delPerOrder/:id', (req, res) => {
  let idUser = req.params.id
  let sql = sqlDelOrder
  connl.query(sql, [idUser], (err, result) => {
    if (err) throw console.log(err)
    res.redirect('../showOrder')
  })

})

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'login',
    artTitle: 'login'
  })
})

router.post('/loginUser', (req, res) => {
  let user = req.body.username
  let pass = req.body.password
  console.log("user = " + user + " pass = " + pass);
  let sql = sqlLogin
  // console.log(sql);

  connp.query(sql, [pass, user], (err, result) => {
    if (err) throw console.log(err)
    //console.log(result[0].idper);
    if (result != "") { // มีชื่อพนักงานใน DATABASE
      //let val = result[0].idper
      let val = result[0].id_user

      // ตรวจสอบผู้บริหาร
      let sql = "SELECT * FROM id_ceo WHERE id_ceo = ? AND ceo_status = 1"
      // console.log(sql);
      console.log("val = " + val);


      connl.query(sql, [val], (err, resIdCeo) => {
        console.log(resIdCeo);

        if (resIdCeo != "") {
          // res.send("ceo")
          res.cookie('idUser', val, {
            expires: new Date(Date.now() + 2000000),
            httpOnly: true
          })
          res.redirect('ceo')
        } else {


          // End ตรวจสอบผู้บริหาร

          // idUser บันทึก Cookie
          res.cookie('idUser', val, {
            expires: new Date(Date.now() + 2000000),
            httpOnly: true
          })
          res.redirect('userleave')
        }
      })

    } else {
      res.redirect('login')
    }

  })
})


router.get('/chkWorker/:wuser/:wpass', (req, res) => {
  let user = req.params.wuser
  let pass = req.params.wpass
  let ckIduser = req.cookies['idUser']
  console.log(user);
  console.log(pass);
  let sql = sqlLogin
  conn.query(sql, [pass, user], (err, result) => {
    if (err) throw console.log(err)
    console.log(result);

    if (result == "") {
      let mWorker = [{
        name: "มั่วแระ เราอ่ะ !!!",
        workerUserId: ""
      }]
      res.send(mWorker)

    } else {

      if (result[0].id_user == ckIduser) {
        let mWorker = result.map((result) => {
          return {
            name: "มั่วแระ เราอ่ะ !!!",
            workerUserId: ""
          }
        })

        res.send(mWorker)
      } else {
        let mWorker = result.map((result) => {
          return {
            name: result.name + "  " + result.surname,
            workerUserId: result.id_user
          }
        })
        res.send(mWorker)
      }
    }
  })
})


router.get('/testc', (req, res) => {
  let val = req.cookies["idUser"]
  console.log("val =" + val);
  res.end()

})

router.get('/userleave', (req, res) => {
  let ckIduser = req.cookies['idUser'] // บันทึก Cookie
  if (ckIduser == undefined) {
    res.redirect('login')
  } else {
    console.log("userleave cookies =" + ckIduser);

    //console.log("start One");
    let sqlChkIdUser = "SELECT * FROM leaveorder WHERE order_1 = ?" // ตรวจสอบ สถานะว่าเป็นผู้อนุมัติ หรือไม่
    connl.query(sqlChkIdUser, [ckIduser], (err, result) => {
      if (err) throw console.log(err)
      if (result != "") {
        // กำหนด Session Lavel 1
        res.cookie('lavel', 1, {
          expires: new Date(Date.now() + 2000000),
          httpOnly: true
        })
        // end กำหลด Sessin Lavel 1
        //res.send("เป็นผู้อนุมัติ 1")
        res.redirect('userOrder1')
      } else {
        main() // ให้เริ่มต้นทำงานใน router นี้
      }
    })

    // res.end()
    async function main() {
      await userIndex()
    }

    function userIndex() {
      // ขอเช็ค IdUser ก่อน ว่าเป็นผู้อนุมัติหรือไม่
      // END ขอเช็ค IdUser ก่อน ว่าเป็นผู้อนุมัติหรือไม่      
      let sql = sqlIndexUserStar
      conn.query(sql, [ckIduser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result)
        let mapDataUser = result.map((result) => {
          let dataResult = result
          let dataAddno = ""
          let dataMoo = ""
          let dataVellage = ""
          let dataRoad = ""
          let dataNametambon = ""
          let dataNameAmpur = ""
          let dataNameProvi = ""
          /* address */
          if (dataResult.addno == '-') {
            dataAddno = ""
          } else {
            dataAddno = dataResult.addno
          }
          // -------
          if (dataResult.moo == '-') {
            dataMoo = ""
          } else {
            dataMoo = dataResult.moo
          }
          // -------
          if (dataResult.vellage == '-') {
            dataVellage = ""
          } else {
            dataMoo = dataResult.vellage
          }
          // --------
          if (dataResult.road == '-') {
            dataRoad = ""
          } else {
            dataRoad = dataResult.road
          }
          if (dataResult.nametambon == "-") {
            dataNametambon = ""
          } else {
            dataNametambon = dataResult.nametambon
          }
          //  ---------
          if (dataResult.nameAmpur == "-") {
            dataNameAmpur = ""
          } else {
            dataNameAmpur = dataResult.nameAmpur
          }
          //  ---------
          if (dataResult.nameProvi == "-") {
            dataNameProvi = ""
          } else {
            dataNameProvi = dataResult.nameProvi
          }

          // --------
          /* end address */

          return {
            nickname: dataResult.fistname,
            fistname: dataResult.fistname + " " + dataResult.surname,
            address: dataAddno + " " + dataMoo + " " + dataVellage + " " + dataRoad + " " + dataNametambon + " " + dataNameAmpur + " " + dataNameProvi,
            username: dataResult.username_user,
            namedp: dataResult.namedp,
            tel: dataResult.tel,
            idUser: dataResult.id_user

          }
        })
        orderDep(mapDataUser)
      })
    }

    function orderDep(mapDataUser) {
      //console.log(mapDataUser);
      let validUser = mapDataUser[0].idUser
      console.log("validUser = " + validUser);
      // หา MyId ก่อน
      let sql = sqlShowOrder
      console.log("test");
      console.log(sql);

      connl.query(sql, [validUser], (err, result) => {
        if (err) throw console.log(err)
        if (result == "") { // ถ้าไม่มี อาจเป็นผู้บริหาร ให้เรียก function 
          console.log(result);
          let sql3 = "SELECT * FROM leaveorder WHERE order_1 = ? "
          // console.log("TEST-GO");
          console.log("tesrt");
          let validUser = mapDataUser[0].idUser
          // console.log(typeof (validUser));
          console.log("validUser = " + validUser);

          connl.query(sql3, ['validUser'], (err, result3) => {
            if (err) throw console.log(err);

            console.log(result3);

            if (result3 != "") {
              res.send("No Config")
            } else {
              res.send("No data โปรดติดต่อ Admin 001")
            }
          })
          managerFind()

        } else {

          console.log(result);
          let sql2 = sqlIndexUser
          let valOrder1 = result[0].order_1
          console.log("valOrder1 = " + valOrder1);

          conn.query(sql2, [valOrder1], (err, result) => {
            if (err) throw console.log(err)
            //console.log(result)
            //orderDep2(mapDataUser, result)
            let mapDataOrder1 = result.map((result) => {
              return {
                name: result.name + "  " + result.surname
              }
            })
            orderDep2(mapDataUser, mapDataOrder1)

          })
        }
      })
    }


    function managerFind() { // หาผู้บริหาร
      // let
    } // end หาผู้บริหาร


    function orderDep2(mapDataUser, mapDataOrder1) {
      //console.log(mapDataUser);
      let validUser = mapDataUser[0].idUser
      console.log("validUser = " + validUser);

      let sql = sqlShowOrder
      connl.query(sql, [validUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let sql2 = sqlIndexUser
        let valOrder2 = result[0].order_2
        console.log("valOrder1 = " + valOrder2);

        conn.query(sql2, [valOrder2], (err, result) => {
          if (err) throw console.log(err)
          //console.log(result)
          //orderDep2(mapDataUser, result)
          let mapDataOrder2 = result.map((result) => {
            return {
              name: result.name + "  " + result.surname
            }
          })

          listLeave(mapDataUser, mapDataOrder1, mapDataOrder2)

        })
      })
    }

    // data วันลา

    function listLeave(mapDataUser, mapDataOrder1, mapDataOrder2) {
      // let sql = sqlListIndex
      let sql = sqlListIndexForUser // สำหรับ User
      let idUser = req.cookies["idUser"]
      connl.query(sql, [idUser], (err, result) => {

        if (err) throw console.log(err)
        //console.log(result);
        let totalSick = 0
        let totalLeave = 0
        let totalCut = 0
        let dataListLeave = result.map((result) => {
          let = mDateCreate = result.date_create
          let = mDateStart = result.date_start
          let = mDateEnd = result.date_end
          let = mType = result.type_l

          if (mType == 10) {
            mUnitDate = '-'
            mUnitDate2 = result.unit_date
            mUnitDate3 = '-'
            totalLeave += result.unit_date
          } else if (mType < 10) {
            mUnitDate = result.unit_date
            mUnitDate2 = '-'
            mUnitDate3 = '-'
            totalSick += result.unit_date
            // }
          } else if (mType == 20) {
            mUnitDate = '-'
            mUnitDate2 = "-"
            mUnitDate3 = result.unit_date
            totalCut += result.unit_date
          }

          return {
            leaveId: result.id,
            myId: result.myId,
            dateCreate: moment(mDateCreate).format('YYYY-MM-DD'),
            dateStart: moment(mDateStart).format('YYYY-MM-DD'),
            dateEnd: moment(mDateEnd).format('YYYY-MM-DD'),
            unitDate: mUnitDate,
            unitDate2: mUnitDate2,
            unitDate3: mUnitDate3,
            cause: result.cause,
            status: result.status,
            totalSick,
            totalLeave,
            totalCut, // 
            workerId: result.workerId
          }
        })
        // console.log("TEST DATA");

        // console.log(dataListLeave);

        workerUser(mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave)
      })
    }

    // หาผู้ปฎิบัติงานแทน ในส่วนพนักงานทั่วไป
    function workerUser(mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave) {
      console.log("workerUser for person");

      // console.log(dataListLeave);
      let mDataWorkUser = dataListLeave.map((item) => {
        return {
          name: item.workerId
        }
      })
      //console.log("tttttt");
      //console.log(mDataWorkUser[4].name);
      let numRow = 0
      Object.keys(dataListLeave).forEach(function (key) {
        numRow += 1
      });

      let sql = sqlFindUserForId_user
      // console.log("nonononono");

      // console.log(numRow);
      let arrWorker = []
      if (numRow == 0) {
        sendData(mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, arrWorker)

      } else {
        //
        for (let i = 0; i < numRow; i++) {
          conn.query(sql, [dataListLeave[i].workerId], (err, result) => {

            //console.log(dataListLeave[i].workerId);
            // console.log(result);

            arrWorker.push(result)
            //console.log(arrWorker);
            if (i == (numRow - 1)) {
              // sendData(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave, arrWorker)
              sendData(mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, arrWorker)

            }
          })
        }
        //
      }


    }
    // End หาผู้ปฎิบัติงานแทน ในส่วนพนักงานทั่วไป


    // end data วันลา

    function sendData(dataUser, dataOrder1, dataOrder2, dataListLeave, detailWorker) {
      // console.log(detailWorker);

      // map ผู้ปฎิบัติงานแทน
      let mDetailWorker = ""
      if (detailWorker == undefined) {
        console.log("sssssss");
      } else {
        console.log("ssssshhhhhss");
        mDetailWorker = detailWorker.map((item) => {
          if (item == "") {
            wName = ""
          } else {
            wName = item[0].name
          }
          return {
            name: wName
          }
        })
      }
      // End map ผู้ปฎิบัติงานแทน

      //console.log(dataListLeave);
      //console.log(dataOrder1);
      //console.log("dataOrder2 = " + dataOrder2);
      if (dataOrder2 == "") {
        dataOrder2 = [{
          name: "-"
        }]
      }


      res.render('userleave', {
        title: "system",
        dataUser,
        dataOrder1,
        dataOrder2,
        dataListLeave,
        mDetailWorker
      })
    }

    /*if (ckIduser == 321) {
      res.end()
    } else {*/
    //}
    // END ตรวจสอบ สถานะว่าเป็นผู้อนุมัติ หรือไม่     
  } // end check cookies
})

router.get('/userOrder1', (req, res) => {
  let idChkUser = req.cookies["idUser"]
  // console.log(idChkUser);

  res.redirect('userOrder1/' + idChkUser)
  //res.redirect('userOrder1TEST')
});


router.get('/userOrder1TEST', (req, res) => {
  // console.log("test00001");

  let idChkUser = req.cookies["idUser"]
  if (idChkUser == undefined) {
    res.redirect('login')
  } else {
    console.log("cookies = " + idChkUser);


    async function main() {
      await fnFindCount()
    }

    function fnFindCount() {
      let sql = "SELECT COUNT( * ) AS numCount FROM leaveorder WHERE order_1 = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        fnListMyIdAll(result[0].numCount)
        //res.send()
      })
    }

    function fnListMyIdAll(numCount) {
      var dataObj = []
      console.log("numCount = " + numCount);
      let sql = sqlFindMyId
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let sql = sqlFindUserForId_user

        for (let i = 0; i < numCount; i++) {
          conn.query(sql, [result[i].myId], (err, result2) => {
            //console.log(result2);
            async function main() {
              await dataPush()
            }

            function dataPush() {
              //console.log(result2);
              dataObj.push(result2)
              //console.log(dataObj);
              chkEnd()
            }

            function chkEnd() {
              //console.log(numCount);

              if (i == (numCount - 1)) {
                fnTotalUnitDateSick(numCount, dataObj)
              }
            }
            main()
          })
        }
      })
    }

    function fnTotalUnitDateSick(numCount, dataObj) {
      //console.log("dataObj = " + dataObj[1][0].id_user);
      let objTotalSick = []

      for (let i = 0; i < numCount; i++) {
        let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND status = 3 AND myId = ?"
        connl.query(sql, [dataObj[i][0].id_user], (err, result) => {
          objTotalSick.push(result)
          //console.log(result[i].totalUnitDate);

          if (i == (numCount - 1)) {
            fnTotalUnitDataLeave(numCount, dataObj, objTotalSick)
          }
        })
      }
    }

    function fnTotalUnitDataLeave(numCount, dataObj, objTotalSick) {
      let objTotalLeave = []
      for (let i = 0; i < numCount; i++) {
        let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l = 10 AND myId = ?"
        connl.query(sql, [dataObj[i][0].id_user], (err, result) => {
          objTotalLeave.push(result)
          if (i == (numCount - 1)) {
            meData(numCount, dataObj, objTotalSick, objTotalLeave)
          }
        })
      }
    }
    // หาชื่อ-นามสกุล / id
    function meData(numCount, dataObj, objTotalSick, objTotalLeave) {
      let sql = sqlFindUserForId_user
      let idChkUser = req.cookies["idUser"]

      let chkLavel = req.cookies['lavel']
      //console.log("chkLavel = " + chkLavel);

      conn.query(sql, [idChkUser], (err, result) => {
        //console.log(result);

        if (chkLavel == 1) {
          findSickMe(numCount, dataObj, objTotalSick, objTotalLeave, result)
        } else {
          meLeaveData = null
          sendData(numCount, dataObj, objTotalSick, objTotalLeave, result, meLeaveData)
        }

        // meLeaveData = null
        // sendData(numCount, dataObj, objTotalSick, objTotalLeave, result, meLeaveData)
      })
    }

    // หาวันลาของตนเอง
    function findSickMe(numCount, dataObj, objTotalSick, objTotalLeave, meData) {


      // let objTotalLeaveMe = []
      let idChkUser = req.cookies['idUser']
      //console.log("idChkUser = " + idChkUser);

      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND STATUS = 3 AND myId = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        //res.send(result)
        if (result[0].totalUnitDate == null) {
          result[0].totalUnitDate = 0
        }
        findLeaveMe(numCount, dataObj, objTotalSick, objTotalLeave, meData, result)
      })
    }

    function findLeaveMe(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData) { // ลากิจ
      let idChkUser = req.cookies['idUser']
      //console.log("idChkUser = " + idChkUser);


      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l = 10 AND status = 3 AND myId = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        if (result[0].totalUnitDate == null) {
          result[0].totalUnitDate = 0
        }
        findLeaveMeCut(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, result) // หาวันขาดงาน ของตนเอง
        //listLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, result)
      })

    }

    function findLeaveMeCut(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData) {
      let sql = "SELECT SUM(unit_date) AS totalUnitDate FROM leavedata WHERE type_l = 20 AND status = 3 AND myId = ? "
      let idChkUser = req.cookies['idUser']
      connl.query(sql, [idChkUser], (err, result) => {
        listLeave(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData)
      })
    }


    // end วันลาของตนเอง

    // data วันลา

    function listLeave(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData) {
      let sql = sqlListIndex
      let idUser = req.cookies["idUser"]
      connl.query(sql, [idUser], (err, result) => {
        if (err) throw console.log(err)
        // console.log(result);
        let totalSick = 0
        let totalLeave = 0
        let totalCut = 0
        let dataListLeave = result.map((result) => {
          let = mDateCreate = result.date_create
          let = mDateStart = result.date_start
          let = mDateEnd = result.date_end
          let = mType = result.type_l
          if (mType == 10) {
            mUnitDate = '-'
            mUnitDate2 = result.unit_date
            mUnitDate3 = '-'
            totalLeave += result.unit_date
          } else if (mType != 99) {
            mUnitDate = result.unit_date
            mUnitDate2 = '-'
            mUnitDate3 = '-'
            totalSick += result.unit_date
          }

          return {
            leaveId: result.id,
            myId: result.myId,
            dateCreate: moment(mDateCreate).format('YYYY-MM-DD'),
            dateStart: moment(mDateStart).format('YYYY-MM-DD'),
            dateEnd: moment(mDateEnd).format('YYYY-MM-DD'),
            unitDate: mUnitDate,
            unitDate2: mUnitDate2,
            unitDate3: mUnitDate3,
            cause: result.cause,
            status: result.status,
            totalSick,
            totalLeave
          }
        })
        userIndex(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave)
      })
    }
    // end data วันลา

    // user Data Index
    function userIndex(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave) {
      // ขอเช็ค IdUser ก่อน ว่าเป็นผู้อนุมัติหรือไม่

      // END ขอเช็ค IdUser ก่อน ว่าเป็นผู้อนุมัติหรือไม่      
      let sql = sqlIndexUserStar
      let idUser = req.cookies["idUser"]
      conn.query(sql, [idUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result)
        let mapDataUser = result.map((result) => {
          let dataResult = result
          let dataAddno = ""
          let dataMoo = ""
          let dataVellage = ""
          let dataRoad = ""
          let dataNametambon = ""
          let dataNameAmpur = ""
          let dataNameProvi = ""
          /* address */
          if (dataResult.addno == '-') {
            dataAddno = ""
          } else {
            dataAddno = dataResult.addno
          }
          // -------
          if (dataResult.moo == '-') {
            dataMoo = ""
          } else {
            dataMoo = dataResult.moo
          }
          // -------
          if (dataResult.vellage == '-') {
            dataVellage = ""
          } else {
            dataMoo = dataResult.vellage
          }
          // --------
          if (dataResult.road == '-') {
            dataRoad = ""
          } else {
            dataRoad = dataResult.road
          }
          if (dataResult.nametambon == "-") {
            dataNametambon = ""
          } else {
            dataNametambon = dataResult.nametambon
          }
          //  ---------
          if (dataResult.nameAmpur == "-") {
            dataNameAmpur = ""
          } else {
            dataNameAmpur = dataResult.nameAmpur
          }
          //  ---------
          if (dataResult.nameProvi == "-") {
            dataNameProvi = ""
          } else {
            dataNameProvi = dataResult.nameProvi
          }

          // --------
          /* end address */

          return {
            nickname: dataResult.fistname,
            fistname: dataResult.fistname + " " + dataResult.surname,
            address: dataAddno + " " + dataMoo + " " + dataVellage + " " + dataRoad + " " + dataNametambon + " " + dataNameAmpur + " " + dataNameProvi,
            username: dataResult.username_user,
            namedp: dataResult.namedp,
            tel: dataResult.tel,
            idUser: dataResult.id_user

          }
        })
        orderDep(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave, mapDataUser)
      })
    }
    // end user Data Index

    // หาผู้อนุมัติ 1
    function orderDep(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave, mapDataUser) {
      //console.log(mapDataUser);
      let validUser = mapDataUser[0].idUser
      // console.log("validUser = " + validUser);
      let sql = sqlShowOrder
      connl.query(sql, [validUser], (err, result) => {
        if (result == "") {
          res.send("No data โปรดติดต่อ Admin 002")
        } else {
          if (err) throw console.log(err)
          //console.log(result);
          let sql2 = sqlIndexUser
          let valOrder1 = result[0].order_1
          // console.log("valOrder1 = " + valOrder1);

          conn.query(sql2, [valOrder1], (err, result) => {
            if (err) throw console.log(err)
            //console.log(result)
            //orderDep2(mapDataUser, result)
            let mapDataOrder1 = []
            if (result == "") {
              //console.log("nulllllll");
              mapDataOrder1.push({
                name: "-"
              })
            } else {
              //console.log("nulllllllXXXXXXX");
              mapDataOrder1 = result.map((result) => {
                return {
                  name: result.name + "  " + result.surname
                }
              })
            }
            orderDep2(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave, mapDataUser, mapDataOrder1)

          })
        }
      })
    }
    // end หาผู้อนุมัติ 1
    // หาผู้อนุมัติ์ 2
    function orderDep2(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave, mapDataUser, mapDataOrder1) {
      //console.log(mapDataUser);


      let validUser = mapDataUser[0].idUser
      // console.log("validUser = " + validUser);
      let sql = sqlShowOrder
      connl.query(sql, [validUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let sql2 = sqlIndexUser
        let valOrder2 = result[0].order_2
        // console.log("valOrder1 = " + valOrder2);

        conn.query(sql2, [valOrder2], (err, result) => {
          if (err) throw console.log(err)
          //console.log(result)
          //orderDep2(mapDataUser, result)
          let mapDataOrder2 = []
          if (result == "") {
            mapDataOrder2.push({
              name: "-"
            })
          } else {
            mapDataOrder2 = result.map((result) => {
              return {
                //name: result.name + "  " + result.surname
                name: result.name
              }
            })
          }

          //listLeave(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2)
          sendData(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave, mapDataUser, mapDataOrder1, mapDataOrder2)

        })
      })
    }
    // end หาผู้อนุมัต 2

    function sendData(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData, dataListLeave, dataUser, dataOrder1, dataOrder2) {
      // console.log("TEST");

      // console.log(objTotalLeave);
      //console.log(meSickData);
      //res.end()

      //console.log("funtion Sendata");
      //console.log("totalUnitDateSick = " + totalUnitDateSick[0].totalUnitDate);
      //console.log(totalUnitDateSick);
      //console.log(meData);

      // วันป่วยรวม
      let mDataTotalSick = totalUnitDateSick.map((totalUnitDateSick) => {
        let dataSick = totalUnitDateSick[0].totalUnitDate
        if (dataSick == null) {
          dataSick = 0
        }
        return {
          totalUnitDateSick: dataSick
        }
      })
      // จบวันป่วยรวม
      // รวมวันลากิจ
      let mDataTotalLeave = objTotalLeave.map((objTotalLeave) => {
        let dataLeave = objTotalLeave[0].totalUnitDate
        if (dataLeave == null) {
          dataLeave = 0
        }
        return {
          totalUnitDateLeave: dataLeave
        }
      })
      // จบรวมวันลากิจ


      let mDataAllUser = dataAllUser.map((dataAllUser) => {
        return {
          name: dataAllUser[0].name + " " + dataAllUser[0].surname,
          id_user: dataAllUser[0].id_user
        }
      })

      //console.log(meData);

      res.render('userOreder1', {
        htmlTitle: "ใบลาออนไลน์",
        mDataAllUser, // รามชื่อทั้งหมด - ใต้บังคับบัญชา 1
        mDataTotalSick, // รวมวันป่วย
        mDataTotalLeave, // รวมวันลากิจ
        meData, // ข้อมูลตัวเอง 
        meSickData, // วันลากิจของตัวเอง
        meLeaveData, // วันลากิจของตัวเอง
        dataListLeave,
        dataUser,
        dataOrder1,
        dataOrder2
      })
    }
    main()
  }

})


router.get('/userOrder1/:id', (req, res) => { // ผ่านมาจาก Order_1

  let arrLeaveMeCut = []
  let arrLeaveListCut = [] // วันขาดงาน
  // console.log("func userOrder1");

  let idChkUser = req.cookies["idUser"]

  if (idChkUser == undefined) {
    res.redirect('../login')
  } else {
    //console.log("cookies = " + idChkUser);
    async function main() {
      await fnFindCount()
    }

    function fnFindCount() {
      let sql = "SELECT COUNT( * ) AS numCount FROM leaveorder WHERE order_1 = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        fnListMyIdAll(result[0].numCount)
        //res.send()
      })
    }

    function fnListMyIdAll(numCount) {
      var dataObj = []
      let idChkUser = req.cookies["idUser"]
      //console.log("numCount = " + numCount);
      let sql = sqlFindMyId
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let sql = sqlFindUserForId_user

        for (let i = 0; i < numCount; i++) {
          conn.query(sql, [result[i].myId], (err2, result2) => {
            if (err2) throw console.log(err2)
            async function main() {
              await dataPush()
            }

            function dataPush() {
              dataObj.push(result2)
              chkEnd()
            }

            function chkEnd() {
              //console.log(numCount);

              if (i == (numCount - 1)) {
                fnTotalUnitDateSick(numCount, dataObj)
              }
            }
            main()
          })
        }

      })
    }

    function fnTotalUnitDateSick(numCount, dataObj) {
      //console.log("dataObj = " + dataObj[1][0].id_user);
      let objTotalSick = []

      for (let i = 0; i < numCount; i++) {
        let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND status = 3 AND myId = ?"
        connl.query(sql, [dataObj[i][0].id_user], (err, result) => {
          objTotalSick.push(result)
          //console.log(result[i].totalUnitDate);

          if (i == (numCount - 1)) {
            fnTotalUnitDataLeave(numCount, dataObj, objTotalSick)
          }
        })
      }
    }

    function fnTotalUnitDataLeave(numCount, dataObj, objTotalSick) { // รวมวันลากิจ อนุมัติแล้ว
      let objTotalLeave = []
      for (let i = 0; i < numCount; i++) {
        let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l = 10 AND status = 3 AND myId = ?"
        connl.query(sql, [dataObj[i][0].id_user], (err, result) => {
          objTotalLeave.push(result)
          if (i == (numCount - 1)) {
            fnTotalUnitDataLeaveCut(numCount, dataObj, objTotalSick, objTotalLeave)
          }
        })
      }
    }

    function fnTotalUnitDataLeaveCut(numCount, dataObj, objTotalSick, objTotalLeave) { // รวมขาดงาน อนุมัติแล้ว
      let sql = "SELECT SUM(unit_date) AS totalUnitDate FROM leavedata WHERE type_l = 20 AND status = 3 AND myId = ? "
      for (let i = 0; i < numCount; i++) {
        connl.query(sql, [dataObj[i][0].id_user], (err, result) => {
          arrLeaveListCut.push(result)
          if (i == (numCount - 1)) {
            fnMeData(numCount, dataObj, objTotalSick, objTotalLeave)
          }
        })
      }
    }

    // หาชื่อ-นามสกุล / id
    function fnMeData(numCount, dataObj, objTotalSick, objTotalLeave) {
      //console.log("444444");
      //res.end()

      let sql = sqlFindUserForId_user
      let idChkUser = req.cookies["idUser"]

      let chkLavel = req.cookies['lavel']
      // console.log("chkLavel = " + chkLavel);

      conn.query(sql, [idChkUser], (err, result) => {
        //console.log(result);

        if (chkLavel == 1) {
          findSickMe(numCount, dataObj, objTotalSick, objTotalLeave, result)
        } else {
          meLeaveData = null
          sendData(numCount, dataObj, objTotalSick, objTotalLeave, result, meLeaveData)
        }

        // meLeaveData = null
        // sendData(numCount, dataObj, objTotalSick, objTotalLeave, result, meLeaveData)
      })
    }

    // หาวันลาของตนเอง
    function findSickMe(numCount, dataObj, objTotalSick, objTotalLeave, meData) {
      // console.log("findSicMe()");
      //console.log(meData);
      //res.end()
      // let objTotalLeaveMe = []
      let idChkUser = req.cookies['idUser']
      // console.log("idChkUser = " + idChkUser); //yes1

      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND status = 3 AND myId = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        //res.send(result)
        if (result[0].totalUnitDate == null) {
          result[0].totalUnitDate = 0
        }
        findLeaveMe(numCount, dataObj, objTotalSick, objTotalLeave, meData, result)
      })
    }

    function findLeaveMe(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData) { // ของตนเอง


      let idChkUser = req.cookies['idUser']
      // console.log("idChkUser = " + idChkUser); //yes2

      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l = 10 AND status = 3 AND myId = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        if (result[0].totalUnitDate == null) {
          result[0].totalUnitDate = 0
        }
        // userIndex(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, result)
        findLeaveMeCut(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, result)
      })
    }
    // end วันลาของตนเอง

    function findLeaveMeCut(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData) {
      let sql = "SELECT SUM(unit_date) AS totalUnitDate FROM leavedata WHERE type_l = 20 AND myId = ? "
      let idChkUser = req.cookies['idUser']
      connl.query(sql, [idChkUser], (err, result) => {
        // console.log("DATA");

        // console.log(result);

        arrLeaveMeCut = result

        userIndex(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData)
      })
    }


    // Start Detail User
    function userIndex(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData) {
      // ขอเช็ค IdUser ก่อน ว่าเป็นผู้อนุมัติหรือไม่


      // END ขอเช็ค IdUser ก่อน ว่าเป็นผู้อนุมัติหรือไม่  
      let idIndexUser = req.params.id
      let sql = sqlIndexUserStar
      conn.query(sql, [idIndexUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result)
        let mapDataUser = result.map((result) => {
          let dataResult = result
          let dataAddno = ""
          let dataMoo = ""
          let dataVellage = ""
          let dataRoad = ""
          let dataNametambon = ""
          let dataNameAmpur = ""
          let dataNameProvi = ""
          /* address */
          if (dataResult.addno == '-') {
            dataAddno = ""
          } else {
            dataAddno = dataResult.addno
          }
          // -------
          if (dataResult.moo == '-') {
            dataMoo = ""
          } else {
            dataMoo = dataResult.moo
          }
          // -------
          if (dataResult.vellage == '-') {
            dataVellage = ""
          } else {
            dataMoo = dataResult.vellage
          }
          // --------
          if (dataResult.road == '-') {
            dataRoad = ""
          } else {
            dataRoad = dataResult.road
          }
          if (dataResult.nametambon == "-") {
            dataNametambon = ""
          } else {
            dataNametambon = dataResult.nametambon
          }
          //  ---------
          if (dataResult.nameAmpur == "-") {
            dataNameAmpur = ""
          } else {
            dataNameAmpur = dataResult.nameAmpur
          }
          //  ---------
          if (dataResult.nameProvi == "-") {
            dataNameProvi = ""
          } else {
            dataNameProvi = dataResult.nameProvi
          }
          // --------
          /* end address */

          return {
            nickname: dataResult.fistname,
            fistname: dataResult.fistname + " " + dataResult.surname,
            address: dataAddno + " " + dataMoo + " " + dataVellage + " " + dataRoad + " " + dataNametambon + " " + dataNameAmpur + " " + dataNameProvi,
            username: dataResult.username_user,
            namedp: dataResult.namedp,
            tel: dataResult.tel,
            idUser: dataResult.id_user

          }
        })
        //orderDep(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser)
        orderDep(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser)
      })
    }

    //function orderDep(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser) {
    function orderDep(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser) {

      let validUser = mapDataUser[0].idUser

      // console.log("YES3validUser = " + validUser);
      let sql = sqlShowOrder // เดิม

      connl.query(sql, [validUser], (err, result) => {
        // console.log(result);
        if (result == "") {
          //res.send("No data โปรดติดต่อ Admin 003")
          let sql = sqlFindMyId // ตรวจสอบ Order_1
          // console.log(sql);

          connl.query(sql, [validUser], (err, result) => {
            if (err) throw console.log(err);
            if (result != "") { // เจอข้อมูลใน order_1
              // console.log(result);
              //res.end()
              res.redirect('../manager') // เจอข้อมูลใน order_1 แต่ไม่เจอ myId
            } else {
              res.send("No data โปรดติดต่อ Admin 003")
            }
          })


        } else {
          if (err) throw console.log(err)
          //console.log(result);
          let sql2 = sqlIndexUser
          let valOrder1 = result[0].order_1
          // console.log("valOrder1 = " + valOrder1);

          conn.query(sql2, [valOrder1], (err, result) => {
            if (err) throw console.log(err)
            //console.log(result)
            //orderDep2(mapDataUser, result)
            let mapDataOrder1 = result.map((result) => {
              return {
                name: result.name
                //name: result.name + "  " + result.surname
              }
            })
            //orderDep2(mapDataUser, mapDataOrder1)
            //orderDep2(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1)
            orderDep2(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1)

          })
        }
      })
    }

    //function orderDep2(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1) {
    function orderDep2(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1) {
      //console.log(mapDataUser);


      let validUser = mapDataUser[0].idUser
      // console.log("validUser = " + validUser);
      let sql = sqlShowOrder
      connl.query(sql, [validUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let sql2 = sqlIndexUser
        let valOrder2 = result[0].order_2
        // console.log("valOrder1 = " + valOrder2);

        conn.query(sql2, [valOrder2], (err, result) => {
          if (err) throw console.log(err)
          // console.log(result)
          //orderDep2(mapDataUser, result)

          let mapDataOrder2 = result.map((result) => {
            return {
              id: result.id_user,
              // name: result.name + "  " + result.surname
              name: result.name
            }
          })

          //listLeave(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2)
          listLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2)

        })
      })
    }

    //function listLeave(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2) {
    function listLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2) {

      // let sql = sqlListIndex1
      let sql = sqlListIndex // หัวหน้า ใบเขียว
      //console.log(sql);

      // let sql = sqlListIndex เก่า
      //let idUser = req.cookies["idUser"]
      let idUser = req.params.id
      connl.query(sql, [idUser], (err, result) => {
        if (err) throw console.log(err)
        // console.log(result);
        let totalSick = 0
        let totalLeave = 0
        let totalCut = 0
        let dataListLeave = result.map((result) => {
          let mDateCreate = result.date_create
          let mDateStart = result.date_start
          let mDateEnd = result.date_end
          let mType = result.type_l
          let mStatus = result.status
          if (mType == 10) {
            mUnitDate = '-'
            mUnitDate2 = result.unit_date
            mUnitDate3 = '-'
            totalLeave += result.unit_date
          } else if (mType < 10) { // ป่วย

            mUnitDate = result.unit_date
            mUnitDate2 = "-"
            mUnitDate3 = '-'
            totalSick += result.unit_date
            // totalSick += 1
          } else if (mType == 20) {
            mUnitDate = '-'
            mUnitDate2 = "-"
            mUnitDate3 = result.unit_date
            totalCut += result.unit_date
          }

          return {
            leaveId: result.id,
            myId: result.myId,
            dateCreate: moment(mDateCreate).format('YYYY-MM-DD'),
            dateStart: moment(mDateStart).format('YYYY-MM-DD'),
            dateEnd: moment(mDateEnd).format('YYYY-MM-DD'),
            unitDate: mUnitDate,
            unitDate2: mUnitDate2,
            unitDate3: mUnitDate3,
            cause: result.cause,
            status: result.status,
            totalSick,
            totalLeave,
            totalCut,
            workerId: result.workerId
          }
        })
        fnMeData2(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave)
      })
    }
    // End Detail User


    //function meData(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave) {
    function fnMeData2(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave) {
      // console.log(dataListLeave);
      let sql = sqlFindUserForId_user
      let idChkUser = req.cookies["idUser"]
      conn.query(sql, [idChkUser], (err, result) => {
        //sendData(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, result)
        findListIdUserLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, result)
      })
    }


    function findListIdUserLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData) {
      let idChkUser = req.cookies["idUser"]
      // let sql = sqlListUserLeave // เก่า
      let sql = sqlListUserLeaveForUser
      // console.log(sql);
      // console.log("findListIdUserLeave");
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        // console.log(result);
        let detailLeave = result

        if (result == "") {
          console.log("ค่าว่าง");

          let arrUserLeave = []
          //sendData(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave)
          workerUser(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave)

        } else {
          // start have
          let dataLenght = 0
          Object.keys(result).forEach(function (key) {
            dataLenght += 1
          });

          let arrUserLeave = []
          for (let i = 0; i < dataLenght; i++) {
            let sqlUser = sqlIndexUser
            conn.query(sqlUser, [result[i].myId], (err, result2) => {
              if (err) throw console.log(err)
              arrUserLeave.push(result2)
              if (i == (dataLenght - 1)) {
                //console.log(arrUserLeave);
                workerUser(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave)
              }
            })
            //arrUserLeave.push(result)
          }
          // end have
        }
      })

      //
      // res.end()
    }

    // หาผู้ปฎิบัติงานแทน
    function workerUser(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave) {
      // console.log("workUser");
      //console.log(dataListLeave);
      let mDataWorkUser = dataListLeave.map((item) => {
        return {
          name: item.workerId
        }
      })
      //console.log("tttttt");
      //console.log(mDataWorkUser[4].name);
      let numRow = 0
      Object.keys(dataListLeave).forEach(function (key) {
        numRow += 1
      });

      let sql = sqlFindUserForId_user
      // console.log("nonononono");

      // console.log(numRow);
      let arrWorker = []
      if (numRow == 0) {
        sendData(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave, arrWorker)
      } else {
        //
        for (let i = 0; i < numRow; i++) {
          conn.query(sql, [dataListLeave[i].workerId], (err, result) => {

            //console.log(dataListLeave[i].workerId);
            // console.log(result);

            arrWorker.push(result)
            //console.log(arrWorker);
            if (i == (numRow - 1)) {
              sendData(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave, arrWorker)
            }
          })
        }
        //
      }

    }
    // end หาผู้ปฎิบัติงานแทน

    function sendData(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meDataNew, meSickData, meLeaveData, dataUser, dataOrder1, dataOrder2, dataListLeave, meData, dataUserLeave, detailLeave, detailWorker) {
      // console.log("12 12 12");
      // console.log(arrLeaveMeCut);


      // map ผู้ปฎิบัติงานแทน
      //console.log(detailWorker);
      let mDetailWorker = ""
      if (detailWorker == undefined) {
        // console.log("sssssss");
      } else {
        // console.log("ssssshhhhhss");
        mDetailWorker = detailWorker.map((item) => {
          if (item == "") {
            wName = ""
          } else {
            wName = item[0].name
          }
          return {
            name: wName
          }
        })
      }
      // End map ผู้ปฎิบัติงานแทน



      //console.log(mapDataOrder2);
      //res.end()
      //console.log("funtion Sendata");
      //console.log(dataUser);
      //console.log(dataUser);
      //console.log("totalUnitDateSick = " + totalUnitDateSick[0].totalUnitDate);
      //console.log(totalUnitDateSick);

      // รายละเอียดการลา
      // console.log(detailLeave);
      let mDetailLeave = detailLeave.map((item) => {
        return {
          id: item.idData,
          indexType: item.type_l,
          unitDate: item.unit_date
        }
      })
      // end รายละเอียดการลา

      // ผู้ขอลาป่วย
      // console.log(dataUserLeave);
      let mDataUserLeave = dataUserLeave.map((item) => {
        return {
          idUser: item[0].id_user,
          name: item[0].name + "  " + item[0].surname
        }
      })
      //console.log(mDataUserLeave);

      // end ผู้ขอลาป่วย

      // วันป่วยรวม
      let mDataTotalSick = totalUnitDateSick.map((totalUnitDateSick) => {
        let dataSick = totalUnitDateSick[0].totalUnitDate
        if (dataSick == null) {
          dataSick = 0
        }
        return {
          totalUnitDateSick: dataSick
        }
      })
      // จบวันป่วยรวม
      // รวมวันลากิจ
      let mDataTotalLeave = objTotalLeave.map((objTotalLeave) => {
        let dataLeave = objTotalLeave[0].totalUnitDate
        if (dataLeave == null) {
          dataLeave = 0
        }
        return {
          totalUnitDateLeave: dataLeave
        }
      })
      // จบรวมวันลากิจ


      let mDataAllUser = dataAllUser.map((dataAllUser) => {
        return {
          name: dataAllUser[0].name + " " + dataAllUser[0].surname,
          id_user: dataAllUser[0].id_user
        }
      })

      //console.log(dataAllUser);

      //console.log("DataOrder2.*******");

      //console.log(dataOrder2);
      if (dataOrder2 == "") {
        dataOrder2[0] = {
          name: "-"
        }
      }
      if (dataOrder1 == "") {
        dataOrder1[0] = {
          name: "-"
        }
      }
      // console.log(dataOrder1);
      // console.log("test");
      // console.log(arrLeaveListCut);
      // map
      let totalDate = 0
      let mLeaveLeaveListCut = arrLeaveListCut.map(item => {
        // console.log(item[0].totalUnitDate);
        if (item[0].totalUnitDate == null) {
          totalDate = 0
        } else {
          totalDate = item[0].totalUnitDate
        }
        return {
          totalUnitDate: totalDate
        }
      })
      // console.log(mLeaveLeaveListCut[0]);
      // end map
      // console.log(dataListLeave);
      res.render('userOrederDetail', {
        htmlTitle: "ใบลาออนไลน์",
        title: "Test Deatail",
        mDataAllUser, // รามชื่อทั้งหมด
        mDataTotalSick, // รวมวันป่วย
        mDataTotalLeave, // รวมวันลากิจ
        // start
        dataUser, // รายละเอียดการลาของพนักงาน Index ในใบลา
        dataOrder1, // ผู้อนุญาติ อันดับ 1
        dataOrder2, // ผู้อนุญาติ อันดับ 2
        dataListLeave,
        meData, // ข้อมูลตัวเอง
        //meData2, // ข้อมูลตัวเอง
        // 
        meSickData, // วันลากิจของตัวเอง
        meLeaveData, // วันลากิจของตัวเอง
        //dataUserLeave, // รายชื่อผู้ขอลา
        mDataUserLeave, // รายชื่อผู้ขอลา
        mDetailLeave, // รายละเอียด-ชนิดการลา
        mDetailWorker,
        arrLeaveMeCut, // วันขาดงานของตนเอง
        mLeaveLeaveListCut // วันขาดงานของผู้ใต้บังคับบัญชา
        //
      })
    }

    main()

  }

})


router.get('/logout', (req, res) => {
  res.clearCookie("idUser");
  res.redirect('login')
  //res.send('test')
})


router.get('/typeLeave', (req, res) => {
  let sql = sqlTypeLeave
  connl.query(sql, (err, result) => {
    //console.log();
    res.send(result)
  })
})

router.get('/typeLeave/:id', (req, res) => {
  let id = req.params.id
  let sql = sqlTypeLeaveIndex
  connl.query(sql, [id], (err, result) => {
    //console.log();
    res.send(result)
  })
})


router.post('/addLeave', (req, res) => {
  let dateNow = moment().format('YYYY-MM-DD');
  let valMyId = req.cookies["idUser"]
  if (valMyId == undefined) {
    res.redirect('login')
  } else {
    let valData = req.body
    //console.log(valData);
    let valStartDate = req.body.dateStart
    let valDateUnit = req.body.dateUnit
    let ceilValDateUnit = Math.ceil(valDateUnit)
    let valComment = req.body.valComment
    if (valComment == "") {
      valComment = req.body.valNameType
    }
    let valType = req.body.valType
    console.log("valType = " + valType);

    if (valType == 6) {
      console.log("อื่นๆ");
      valComment = req.body.valNameType
    }
    //valType = 6
    //}
    console.log("dataUnit = " + valDateUnit);

    let valDateUnitForDel = ceilValDateUnit - 1

    console.log("cookies =" + valMyId);
    //var today = moment();
    var valEndDate = moment(valStartDate).add(valDateUnitForDel, 'days');
    var valEndDate = moment(valEndDate).format('YYYY-MM-DD')
    // console.log(valEndDate);
    console.log(valMyId);
    let sqlChk = "SELECT * FROM leaveorder WHERE myId = ?"
    connl.query(sqlChk, [valMyId], (err, resultChk) => {


      if (resultChk[0].order_2 == 0) {
        let sql = sqlAddLeave
        connl.query(sql, [valMyId, dateNow, valStartDate, valDateUnit, valEndDate, valType, valComment, 1], (err, result) => {
          if (err) throw console.log(err)
          res.redirect('userleave')
        })
      } else {
        let sql = sqlAddLeave
        //
        connl.query(sql, [valMyId, dateNow, valStartDate, valDateUnit, valEndDate, valType, valComment, 0], (err, result) => {
          if (err) throw console.log(err)
          res.redirect('userleave')
        })
        //
      }
    })
    //
  }
})

router.post('/addLeave2', (req, res) => {
  let data = req.body
  let workerId = req.body.workerUserId
  let dateNow = moment().format('YYYY-MM-DD');
  let valMyId = req.cookies["idUser"]
  if (valMyId == undefined) {
    res.redirect('login')
  } else {
    let valStartDate = req.body.dateStart2
    let valDateUnit = req.body.dateUnit2
    let ceilValDateUnit = Math.ceil(valDateUnit)
    let valComment = req.body.valComment2

    // หา End Date
    let valDateUnitForDel = ceilValDateUnit - 1
    var valEndDate = moment(valStartDate).add(valDateUnitForDel, 'days');
    var valEndDate = moment(valEndDate).format('YYYY-MM-DD')
    // end หา End Date
    // default Type = 10
    var valType = 10

    //console.log(data);
    // let sql = sqlAddLeave2
    // connl.query(sql, [valMyId, dateNow, valStartDate, valDateUnit, valEndDate, valType, valComment, 0, workerId], (err, result) => {
    //   if (err) throw console.log(err)
    //   res.redirect('userleave')
    // })

    let sqlChk = "SELECT * FROM leaveorder WHERE myId = ?"
    connl.query(sqlChk, [valMyId], (err, resultChk) => {


      if (resultChk[0].order_2 == 0) {
        let sql = sqlAddLeave2
        connl.query(sql, [valMyId, dateNow, valStartDate, valDateUnit, valEndDate, valType, valComment, 1, workerId], (err, result) => {
          if (err) throw console.log(err)
          res.redirect('userleave')
        })
      } else {
        let sql = sqlAddLeave2
        //
        connl.query(sql, [valMyId, dateNow, valStartDate, valDateUnit, valEndDate, valType, valComment, 0, workerId], (err, result) => {
          if (err) throw console.log(err)
          res.redirect('userleave')
        })
        //
      }
    })


  }
})


router.get('/deleteLeave/:id/:idUser', (req, res) => {
  let id = req.params.id
  let idUser = req.params.idUser
  console.log(id);

  let ckIduser = req.cookies['idUser']
  console.log("ckIduser = " + ckIduser);
  // res.end()


  if (idUser == ckIduser) {
    let sql = "DELETE FROM leavedata WHERE id = ?"
    connl.query(sql, [id], (err, result) => {
      if (err) throw console.log(err)
      res.redirect('../../userleave')
    })
  } else {
    res.redirect('../../userleave')
  }



})


router.get('/updateUserOrder1/:userId/:idLeave', (req, res) => {
  let idLeave = req.params.idLeave
  let idUser = req.params.userId
  let sql = "UPDATE leavedata SET status = 1 WHERE id = ?"
  connl.query(sql, [idLeave], (err, result) => {
    if (err) throw console.log(err)
    res.redirect('../../../userOrder1/' + idUser)
  })
})

router.post('/approveAll', (req, res) => {
  let data = req.body.getIdLeave
  let data2 = req.body.getIdUser
  let typeData = typeof (data)
  console.log(typeData);
  // console.log(data);
  // console.log(data2);
  let arrIdUser = []
  let dataLenght = 0
  if (typeData == "object") {
    // console.log("ifObj");
    Object.keys(data).forEach(function (key) {
      arrIdUser.push(data[dataLenght])
      dataLenght += 1

      //console.log(arrIdUser);
    });
  } else if (typeData == "string") {
    //console.log(data);
    // console.log("ifString");
    // arrIdUser.push(data) // bg
    arrIdUser.push(data)
    dataLenght = 1
    //console.log(arrIdUser);
  }

  // console.log("arr =");
  // console.log(dataLenght);
  // console.log(arrIdUser);

  for (let i = 0; i < dataLenght; i++) {
    let sql = sqlApproveAll
    console.log(sql);
    connl.query(sql, [arrIdUser[i]], (err, result) => {
      // console.log(arrIdUser[i]);
      if (err) throw console.log(err)
      console.log("update ok");
    })
    if (i == (dataLenght - 1)) {
      //res.end()
      res.redirect('userOrder1')
    }
  }
})

// อนุมัติรายบุคคล
router.get('/approveIndex/:id/:idUser', (req, res) => {
  let id = req.params.id
  let idUser = req.params.idUser
  console.log(idUser);
  let sql = sqlApprove_1
  console.log(sql);

  connl.query(sql, [id], (err, result) => {
    if (err) throw console.log(err);
    res.redirect('../../userOrder1/' + idUser)
  })
})
// END อนุมัติรายบุคคล
// ไม่อนุมัติ รายบุคคล
router.get('/notApproveIndex/:id/:idUser', (req, res) => {
  async function main() {
    let id = req.params.id
    let idUser = req.params.idUser
    // console.log("id = " + id);
    // console.log("idUser = " + idUser);

    // ตรวจสอบประเภทการลากิจ

    let sql = ""

    let chkSql = "SELECT type_l FROM leavedata WHERE id = ?"
    connl.query(chkSql, [id], (err, resChk) => {
      if (err) throw console.log(err);
      // console.log("DATA = " + resChk[0].type_l);
      if (resChk[0].type_l == 10) {
        sql = sqlDelApprove
        connl.query(sql, [id], (err, result) => {
          if (err) throw console.log(err);
          res.redirect('../../userOrder1/' + idUser)
        })
      } else {
        sql = sqlNotApproveAll
        connl.query(sql, [id], (err, result) => {
          if (err) throw console.log(err);
          res.redirect('../../userOrder1/' + idUser)
        })
      }
    })

    // END ตรวจสอบประเภทการลากิจ


  }
  let cookieId = req.cookies["idUser"]
  if (cookieId == undefined) {
    res.redirect('../../login')
  } else {
    main()
  }
})
// END ไม่อนุมัติ รายบุคคล



/*
let eSqlFindChar = "SELECT depart.id_dp,depart.namedp,"
eSqlFindChar += "personal.`name`,personal.surname,`user`.id_user,`user`.username_user"
eSqlFindChar += "FROM depart "
eSqlFindChar += "INNER JOIN`user` ON`user`.depart = depart.id_dp "
eSqlFindChar += "INNER JOIN personal ON`user`.idper = personal.id_pro "
eSqlFindChar += "WHERE active = 1 and personal.`name` LIKE '%ก'"
*/

let eSqlFindChar = "SELECT depart.id_dp,depart.namedp,personal.`name`,"
eSqlFindChar += "personal.surname,`user`.id_user,`user`.username_user "
eSqlFindChar += "FROM depart "
eSqlFindChar += "INNER JOIN`user` ON`user`.depart = depart.id_dp "
eSqlFindChar += "INNER JOIN personal ON`user`.idper = personal.id_pro "
eSqlFindChar += "WHERE active = 1 and personal.name LIKE ?"

router.get('/testlike/:name', (req, res) => {
  let gName = req.params.name
  gName = "%" + gName + "%"
  console.log(gName);
  console.log(eSqlFindChar);




  let sql = eSqlFindChar
  conn.query(sql, [gName], (err, result) => {
    if (err) throw console.log(err)
    // console.log(result);
    res.send(result)
  })
})

// ผู้บริหาร order_1
router.get('/manager', (req, res) => {


  let cookieId = req.cookies["idUser"]
  if (cookieId == undefined) {
    res.redirect('../login')
  } else {
    console.log("test001");
    main()
  }

  console.log("cookieId = " + cookieId); // บันทึก Cookie
  let arrStarf = []
  let nameStarf = [] // พนักงานทั้งหมดในใตับังคับ
  let dpStarf = [] // แผนกทั้งหมดภายใต้บังคับ
  let dataLeave2 = [] // รวมการลา แยกเป็นบุคคล หลังจากเรียงแล้ว
  let mapDataLeave = [] // รวมการลา แยกเป็นบุคคล หลังจากเรียงแล้ว
  let mapStarf2 = [] // พนักงานทั้งหมดในใตับังคับ map แล้ว
  let mapStarfLeave = [] // พนักงานผู้ขอลา
  let mapStarfLeaveName = [] // ชื่อพนักงานผู้ขอลา
  let dataAllLeave = [] // การขอลา
  let dataArrAllLeave = [] // Arr การขอลาทั้งหมด ของบุคคล รับการ push จาก Database
  let mapTotalLeave = [] // map Total Leave ก่อนส่ง
  async function main() {

    await fnCountStart()
  }

  function fnCountStart() {


    let sqlCountStarf = "SELECT COUNT(*) AS countS FROM leaveorder WHERE order_1 = ? OR order_2 = ?"
    // console.log(sqlCountStarf);

    connl.query(sqlCountStarf, [cookieId, cookieId], (err, dataConutStarf) => {
      // console.log(dataConutStarf);
      let conutStarf = dataConutStarf[0].countS
      fnDataStarf(conutStarf)
    })

  }

  function fnDataStarf(conutStarf) {


    let sql = "SELECT * FROM leaveorder WHERE order_1 = ? OR order_2 = ?"
    // console.log(sql);

    connl.query(sql, [cookieId, cookieId], (err, dataIdStarf) => {
      // console.log(conutStarf);
      // console.log(dataIdStarf);
      fnListNameStart(conutStarf, dataIdStarf)

    })
  }

  function fnListNameStart(conutStarf, dataIdStarf) { // หาพนักงานภายใต้บังคับ

    let sql = sqlFindUserForId_user
    // console.log(sql);

    // console.log(sql);
    // console.log(dataIdStarf.length);
    // console.log(dataIdStarf[0].myId);
    // res.end()
    for (let i = 0; i < dataIdStarf.length; i++) {

      // sid = dataIdStarf[i].myId
      conn.query(sql, [dataIdStarf[i].myId], (err, result) => {
        // console.log(result);
        pushData = {
          idUser: result[0].id_user,
          name: result[0].name,
          id_dp: result[0].id_dp,
          namedp: result[0].namedp,
          surname: result[0].surname
        }
        nameStarf.push(pushData)
        if (i == (dataIdStarf.length - 1)) {

          fnDetailStarfLeaveTotal()
        }
      })
    }
  }



  function fnDetailStarfLeaveTotal() { // data การลาทั้งหมด
    let sql = "SELECT * FROM leavedata WHERE myId = ?"

    for (let i = 0; i < nameStarf.length; i++) {
      connl.query(sql, [nameStarf[i].idUser], (err, result) => {
        // console.log(result);
        if (i == (nameStarf.length - 1)) {
          fnDp()
        }
      })
    }
  }

  function fnDp() {

    function groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    }
    let grouped = groupBy(nameStarf, item => item.id_dp);
    // console.log(grouped);
    sendData()

  }

  function sendData() {
    async function main() {
      await subfn()
      //await lastData()
    }

    function subfn() {

      let snameStarf = nameStarf.slice(0); // จัดเรียง
      snameStarf.sort(function (a, b) {
        // return ((a.idUser - b.idUser), (a.id_dp - b.id_dp))
        return ((a.id_dp - b.id_dp))
      });
      sendSubData(snameStarf)
    }

    function sendSubData(snameStarf) {
      let mapStarf = snameStarf.map(item => {
        return {
          idUser: item.idUser,
          name: item.name + "  " + item.surname,
          id_dp: item.id_dp,
          namedp: item.namedp
        }
      })
      mapStarf2 = mapStarf
      chkTotalLeave(mapStarf)

      // lastData(mapStarf)
      //console.log(mapStarf); // ใช้อันนี้ เพื่อไปต่อ
    }

    // check ค่ารวม การลาทั้งหมด // manager/
    function chkTotalLeave(mapStarf) {
      // let sql = "SELECT * FROM leavedata WHERE myId = ? and `status` <> 0"
      let sql = "SELECT * FROM leavedata WHERE myId = ? and status = 3"


      // console.log(mapStarf[4].idUser);

      for (let i = 0; i < mapStarf.length; i++) {
        connl.query(sql, [mapStarf[i].idUser], (err, dataDetailLeave) => {
          // console.log(dataDetailLeave);
          dataLeave2.push(dataDetailLeave)
          if (i == (mapStarf.length - 1)) {
            // lastData(mapStarf)
            // console.log(dataLeave2);
            chkTotalLeave2()
          }
        })
      }
      // lastData(mapStarf)
    }
    // end
    function chkTotalLeave2() {


      let d_idUser = ""
      let d_unitSick = 0 // ลาป่วย
      let d_unitLeave = 0 // ลากิจ
      let d_unitAbs = 0 // ขาดงาน
      for (let i = 0; i < mapStarf2.length; i++) {
        d_idUser = ""
        d_unitSick = 0
        d_unitLeave = 0
        d_unitAbs = 0
        for (let ii = 0; ii < dataLeave2[i].length; ii++) {
          // console.log(dataLeave2[i][ii].myId);
          if (dataLeave2[i][ii].myId == mapStarf2[i].idUser) {
            d_idUser = dataLeave2[i][ii].myId

            // พนักงานทั้งหมด
            if (dataLeave2[i][ii].type_l < 10) {
              // console.log(parseFloat(dataLeave2[i][ii].unit_date));
              d_unitSick += parseFloat(dataLeave2[i][ii].unit_date)
            } else if (dataLeave2[i][ii].type_l == 10) {
              d_unitLeave += parseFloat(dataLeave2[i][ii].unit_date)
            } else if (dataLeave2[i][ii].type_l == 20) {
              d_unitAbs += parseFloat(dataLeave2[i][ii].unit_date)
            }

          }

        }
        let demonData = {
          idUser: d_idUser,
          unitSick: d_unitSick,
          unitLeave: d_unitLeave,
          unitAbs: d_unitAbs
        }
        mapDataLeave.push(demonData)

        if (i == (mapStarf2.length - 1)) {
          // console.log(mapDataLeave);
          lastData()

        }
        //   lastData()
      }
    }
    // console.log(snameStarf);
    function lastData() {

      // console.log(dataLeave2);
      // console.log(mapStarf2);

      // หาคนขอลา

      main()
      async function main() {

        await findIdPer()
      }
      // end หาคนขอลา

      function findIdPer() {
        let sql = "SELECT * FROM leavedata "
        sql += "INNER JOIN leave_type ON leavedata.type_l = leave_type.id "
        sql += "INNER JOIN leaveorder ON leavedata.myId = leaveorder.myId "
        sql += "WHERE (leaveorder.order_1 = ? OR leaveorder.order_2 = ?) AND leavedata.`status` = 1 "
        //sql += "ORDER BY date_create "
        sql += "GROUP BY leavedata.myId"
        console.log(sql);

        //console.log(sql);


        connl.query(sql, [cookieId, cookieId], (err, resIdPer) => {
          // console.log(resIdPer);
          mapStarfLeave = resIdPer
          // res.send(sql)
          // res.send(mapStarfLeave)
          if (resIdPer == "") {
            // res.end()
            noDataArr()
          } else {
            findNameLeave()
          }

        })

      }

      // หาชื่อคนลา
      function findNameLeave() {
        let sql = sqlIndexUser
        for (let i = 0; i < mapStarfLeave.length; i++) {
          conn.query(sql, [mapStarfLeave[i].myId], (err, resNammStarf) => {
            // res.send(resNammStarf)
            mapStarfLeaveName.push(resNammStarf)
            if (i == (mapStarfLeave.length - 1)) {
              fnMapTotalLeave()
            }
          })
        }
      }

      // mapTotalLeave
      // หาการลาทั้งหมด
      function fnMapTotalLeave() {
        let sql = "SELECT *,leavedata.status As dataStatus FROM leavedata "
        sql += "INNER JOIN leave_type ON leavedata.type_l = leave_type.id "
        sql += "INNER JOIN leaveorder ON leavedata.myId = leaveorder.myId "
        sql += "WHERE (leaveorder.order_1 = ? OR leaveorder.order_2 = ?) AND leavedata.`status` = 1 "

        // sql += "WHERE (leaveorder.order_1 = ? OR leaveorder.order_2 = ?) AND (leavedata.`status` = 1 OR leavedata.`status` = 8)"

        // console.log(mapStarfLeaveName[1][0]); // ใช้ได้
        // console.log(mapStarfLeaveName.length); // ใช้ได้
        // console.log(resAllLeave[0].myId); // ใช้ได้
        // console.log("cookieId = " + cookieId);
        connl.query(sql, [cookieId, cookieId], (err, resAllLeave) => {

          if (resAllLeave == "") {
            noDataArr()
          }
          // console.log(resAllLeave.length);
          // console.log(resAllLeave[0]);
          for (let i = 0; i < resAllLeave.length; i++) {
            dataArrAllLeave.push(resAllLeave[i])
            if (i == (resAllLeave.length - 1)) { // เมื่อ push ข้อมูลจนครบแล้ว

              mapDataAllLeave()
            }
          }
        })
      }


      function noDataArr() {
        mapStarfLeaveName = {
          id: 0,
          myId: 0,
          date_create: "",
          date_start: "",
          unit_date: "",
          date_end: "",
          type_l: 0,
          cause: '',
          status: "",
          workerId: '',
          name_type: '',
          order_1: 0,
          order_2: 0,
          order_3: 0,
          order_4: 0,
          order_5: 0,
          order_6: 0,
          order_7: 0
        }
        demonDataLeave = {
          idUser: 0,
          leave: 0,
          sick: 0
        }
        mapTotalLeave.push(demonDataLeave)
        fnRender()
      }

      function mapDataAllLeave() { // เอาบุคคลที่ลา มาคัดกับการลาทั้งหมด
        console.log("ขอลา");

        let l_idUser = ""
        let l_leave = 0
        let l_sick = 0
        let l_cut = 0

        for (let i = 0; i < mapStarfLeaveName.length; i++) {
          l_idUser = ""
          l_leave = 0
          l_sick = 0
          l_cut = 0

          for (let x = 0; x < dataArrAllLeave.length; x++) {
            if (mapStarfLeaveName[i][0].id_user == dataArrAllLeave[x].myId) {
              l_idUser = dataArrAllLeave[x].myId
              if (dataArrAllLeave[x].type_l < 10) {
                // console.log(dataArrAllLeave[x].type_l)
                //console.log("status = " + dataArrAllLeave[x].dataStatus);
                l_sick += dataArrAllLeave[x].unit_date
                // l_sick += dataArrAllLeave[x].unit_date
              } else if (dataArrAllLeave[x].type_l == 10) {
                console.log("ลากิจ");
                l_leave += dataArrAllLeave[x].unit_date
                console.log(l_leave);

                // l_leave += 9

              } else if (dataArrAllLeave[x].type_l == 20) {

                l_cut += dataArrAllLeave[x].unit_date

              }
            }
          }
          demonDataLeave = {
            idUser: l_idUser,
            leave: l_leave,
            sick: l_sick,
            lcut: l_cut
          }
          mapTotalLeave.push(demonDataLeave)

        }
        fnRender()

      }

      function fnRender() {
        console.log("***+++-----");
        console.log(mapTotalLeave);
        console.log("***+++-----");
        // console.log(dataAllLeave);
        res.render('managerOrderDetail', {
          htmlTitle: "manager",
          dataStarf: mapStarf2, // รายชื่อ
          dataLeaveTotal: mapDataLeave, // รวมลาป่วย
          dataStarfLeave: mapStarfLeave,
          dataStarfLeaveName: mapStarfLeaveName,
          mapTotalLeave
        })
      }
    }

    main()
  }
})

// ผู้บริหาร order_1 // เลื่อก Detail Starf
router.get('/manager/:id', (req, res) => {

  let cookieId = req.cookies["idUser"]
  if (cookieId == undefined) {
    res.redirect('../login')
  } else {
    main()
  }

  console.log("cookieId = " + cookieId); // บันทึก Cookie
  let arrStarf = []
  let nameStarf = [] // พนักงานทั้งหมดในใตับังคับ
  let dpStarf = [] // แผนกทั้งหมดภายใต้บังคับ
  let dataLeave2 = [] // รวมการลา แยกเป็นบุคคล หลังจากเรียงแล้ว
  let mapDataLeave = [] // รวมการลา แยกเป็นบุคคล หลังจากเรียงแล้ว
  let mapStarf2 = [] // พนักงานทั้งหมดในใตับังคับ map แล้ว
  let mapStarfLeave = [] // พนักงานผู้ขอลา
  let mapStarfLeaveName = [] // ชื่อพนักงานผู้ขอลา
  let dataAllLeave = [] // การขอลา
  let dataArrAllLeave = [] // Arr การขอลาทั้งหมด ของบุคคล รับการ push จาก Database
  let mapTotalLeave = [] // map Total Leave ก่อนส่ง
  /* เพิ่มเติม */
  let detailStarf = [] // รายละเอียด starf
  let orderId = [] // order Id
  let orderName = [] // รายชื่อผู้อนุมัติ
  let detailLeave = [] // รายละเอียดการลา
  /* เพิ่มเติม */

  async function main() {


    await fnCountStart()
  }

  function fnCountStart() {
    let sqlCountStarf = "SELECT COUNT(*) AS countS FROM leaveorder WHERE order_1 = ? OR order_2 = ?"
    connl.query(sqlCountStarf, [cookieId, cookieId], (err, dataConutStarf) => {
      // console.log(dataConutStarf);
      let conutStarf = dataConutStarf[0].countS
      fnDataStarf(conutStarf)
    })

  }

  function fnDataStarf(conutStarf) {

    let sql = "SELECT * FROM leaveorder WHERE order_1 = ? OR order_2 = ?"
    // console.log(cookieId);

    console.log("test");


    connl.query(sql, [cookieId, cookieId], (err, dataIdStarf) => {
      // console.log(conutStarf);
      // console.log(dataIdStarf);
      fnListNameStart(conutStarf, dataIdStarf)

    })
  }

  function fnListNameStart(conutStarf, dataIdStarf) { // หาพนักงานภายใต้บังคับ
    let sql = sqlFindUserForId_user
    // console.log(sql);
    // console.log(dataIdStarf.length);
    // console.log(dataIdStarf[0].myId);
    // res.end()
    for (let i = 0; i < dataIdStarf.length; i++) {

      // sid = dataIdStarf[i].myId
      conn.query(sql, [dataIdStarf[i].myId], (err, result) => {
        // console.log(result);
        pushData = {
          idUser: result[0].id_user,
          name: result[0].name,
          id_dp: result[0].id_dp,
          namedp: result[0].namedp,
          surname: result[0].surname
        }
        nameStarf.push(pushData)
        if (i == (dataIdStarf.length - 1)) {
          fnDetailStarfLeaveTotal()
        }
      })
    }
  }



  function fnDetailStarfLeaveTotal() {
    let sql = "SELECT * FROM leavedata WHERE myId = ? AND status = 3"
    console.log("nameStaf");

    // console.log(nameStarf);

    for (let i = 0; i < nameStarf.length; i++) {
      connl.query(sql, [nameStarf[i].idUser], (err, result) => {
        // console.log(result);
        if (i == (nameStarf.length - 1)) {
          fnDp()
        }
      })
    }
  }

  function fnDp() {

    // function groupBy(list, keyGetter) {
    //   const map = new Map();
    //   list.forEach((item) => {
    //     const key = keyGetter(item);
    //     const collection = map.get(key);
    //     if (!collection) {
    //       map.set(key, [item]);
    //     } else {
    //       collection.push(item);
    //     }
    //   });
    //   return map;
    // }
    // let grouped = groupBy(nameStarf, item => item.id_dp);
    // console.log(grouped);
    sendData()

  }

  function sendData() {

    async function main() {
      await subfn()

      //await lastData()
    }

    function subfn() {
      let snameStarf = nameStarf.slice(0); // จัดเรียง
      snameStarf.sort(function (a, b) {
        // return ((a.idUser - b.idUser), (a.id_dp - b.id_dp))
        return ((a.id_dp - b.id_dp))
      });
      sendSubData(snameStarf)
    }

    function sendSubData(snameStarf) {
      let mapStarf = snameStarf.map(item => {
        return {
          idUser: item.idUser,
          name: item.name + "  " + item.surname,
          id_dp: item.id_dp,
          namedp: item.namedp
        }
      })
      mapStarf2 = mapStarf
      chkTotalLeave(mapStarf)

      // lastData(mapStarf)
      //console.log(mapStarf); // ใช้อันนี้ เพื่อไปต่อ
    }

    // check ค่ารวม การลาทั้งหมด
    function chkTotalLeave(mapStarf) {
      console.log("TEST BUG2");
      // console.log(mapStarf);

      // let sql = "SELECT * FROM leavedata WHERE myId = ? and `status` <> 2"
      let sql = "SELECT * FROM leavedata WHERE myId = ? and status = 3"
      // console.log(mapStarf[4].idUser);


      for (let i = 0; i < mapStarf.length; i++) {
        connl.query(sql, [mapStarf[i].idUser], (err, dataDetailLeave) => {
          // if (dataDetailLeave == "") {
          //   skip()
          // } else {
          // console.log(dataDetailLeave);
          dataLeave2.push(dataDetailLeave)
          if (i == (mapStarf.length - 1)) {
            // lastData(mapStarf)
            // console.log(dataLeave2);
            chkTotalLeave2()
          }
          // }
        })
      }
      // lastData(mapStarf)
    }
    // end


    function skip() {
      // console.log("skip");
      let demonData = {
        idUser: "",
        unitSick: "",
        unitLeave: 0,
        unitAbs: 0
      }
      mapDataLeave.push(demonData)
      lastData()
    }

    // bug ถ้า มี ข้อมูล
    function chkTotalLeave2() {
      let d_idUser = ""
      let d_unitSick = 0 // ลาป่วย
      let d_unitLeave = 0 // ลากิจ
      let d_unitAbs = 0 // ขาดงาน
      for (let i = 0; i < mapStarf2.length; i++) {

        // เริ่มนับใหม่ในแต่ล่ะคน
        d_idUser = ""
        d_unitSick = 0
        d_unitLeave = 0
        d_unitAbs = 0

        for (let ii = 0; ii < dataLeave2[i].length; ii++) {
          // console.log(dataLeave2[i][ii].myId);
          if (dataLeave2[i][ii].myId == mapStarf2[i].idUser) {
            d_idUser = dataLeave2[i][ii].myId
            if (dataLeave2[i][ii].type_l < 10) {
              // console.log(parseFloat(dataLeave2[i][ii].unit_date));
              d_unitSick += parseFloat(dataLeave2[i][ii].unit_date)
            } else if (dataLeave2[i][ii].type_l == 10) {
              d_unitLeave += parseFloat(dataLeave2[i][ii].unit_date)

            } else if (dataLeave2[i][ii].type_l == 20) {
              d_unitAbs += parseFloat(dataLeave2[i][ii].unit_date)
            }
          }
        }
        let demonData = {
          idUser: d_idUser,
          unitSick: d_unitSick,
          unitLeave: d_unitLeave,
          unitAbs: d_unitAbs
        }
        mapDataLeave.push(demonData)

        if (i == (mapStarf2.length - 1)) {
          // console.log(mapDataLeave);
          lastData()
        }
        //   lastData()
      }
    }
    // End bug ถ้า มี ข้อมูล


    // console.log(snameStarf);
    function lastData() {

      // console.log(dataLeave2);
      // console.log(mapStarf2);

      // หาคนขอลา
      main()
      async function main() {
        await findIdPer()
      }
      // end หาคนขอลา

      function findIdPer() {
        let sql = "SELECT * FROM leavedata "
        sql += "INNER JOIN leave_type ON leavedata.type_l = leave_type.id "
        sql += "INNER JOIN leaveorder ON leavedata.myId = leaveorder.myId "
        sql += "WHERE (leaveorder.order_1 = ? OR leaveorder.order_2 = ?) AND leavedata.`status` = 1 "
        //sql += "ORDER BY date_create "
        // sql += "ORDER BY leavedata.myId "
        sql += "GROUP BY leavedata.myId"

        // console.log(sql);


        // if (resIdPer == "") {
        //   // res.end()
        //   noDataArr()
        // } else {
        //   findNameLeave()
        // }


        connl.query(sql, [cookieId, cookieId], (err, resIdPer) => {
          // console.log(resIdPer);
          mapStarfLeave = resIdPer
          //console.log(resIdPer)
          if (resIdPer == "") {

            console.log("no data");
            noDataArr()
            // findNameLeave()
          } else {
            mapStarfLeave = resIdPer
            findNameLeave()
          }

        })

      }

      function noDataArr() {
        mapStarfLeaveName = {
          id: 0,
          myId: 0,
          date_create: "",
          date_start: "",
          unit_date: "",
          date_end: "",
          type_l: 0,
          cause: '',
          status: "",
          workerId: '',
          name_type: '',
          order_1: 0,
          order_2: 0,
          order_3: 0,
          order_4: 0,
          order_5: 0,
          order_6: 0,
          order_7: 0
        }
        demonDataLeave = {
          idUser: 0,
          leave: 0,
          sick: 0
        }
        mapTotalLeave.push(demonDataLeave)
        // fnRender()
        indexStarf()
      }

      // หาชื่อคนลา
      function findNameLeave() {
        // console.log("test0002");

        let sql = sqlIndexUser
        for (let i = 0; i < mapStarfLeave.length; i++) {
          conn.query(sql, [mapStarfLeave[i].myId], (err, resNammStarf) => {
            // res.send(resNammStarf)
            mapStarfLeaveName.push(resNammStarf)
            if (i == (mapStarfLeave.length - 1)) {

              fnMapTotalLeave()
            }
          })
        }
      }

      // mapTotalLeave
      // หาการลาทั้งหมด
      function fnMapTotalLeave() {
        let sql = "SELECT * FROM leavedata "
        sql += "INNER JOIN leave_type ON leavedata.type_l = leave_type.id "
        sql += "INNER JOIN leaveorder ON leavedata.myId = leaveorder.myId "
        sql += "WHERE (leaveorder.order_1 = ? OR leaveorder.order_2 = ?) AND leavedata.`status` = 1 "


        // console.log(mapStarfLeaveName[1][0]); // ใช้ได้
        // console.log(mapStarfLeaveName.length); // ใช้ได้
        // console.log(resAllLeave[0].myId); // ใช้ได้
        // console.log("cookieId = " + cookieId);
        connl.query(sql, [cookieId, cookieId], (err, resAllLeave) => {
          // console.log(resAllLeave.length);
          // console.log(resAllLeave[0]);
          for (let i = 0; i < resAllLeave.length; i++) {
            dataArrAllLeave.push(resAllLeave[i])
            if (i == (resAllLeave.length - 1)) { // เมื่อ push ข้อมูลจนครบแล้ว
              mapDataAllLeave()
            }
          }
        })
      }

      function mapDataAllLeave() { // เอาบุคคลที่ลา มาคัดกับการลาทั้งหมด


        let l_idUser = ""
        let l_leave = 0
        let l_sick = 0
        let l_cut = 0

        // console.log(mapStarfLeaveName);
        console.log("*********");
        // console.log(dataArrAllLeave);


        for (let i = 0; i < mapStarfLeaveName.length; i++) {
          l_idUser = ""
          l_leave = 0
          l_sick = 0
          l_cut = 0

          //"maneger/id"
          for (let x = 0; x < dataArrAllLeave.length; x++) {
            // l_sick = 0
            // l_leave = 0
            if (mapStarfLeaveName[i][0].id_user == dataArrAllLeave[x].myId) {
              l_idUser = dataArrAllLeave[x].myId
              if (dataArrAllLeave[x].type_l < 10) {
                // console.log(dataArrAllLeave[x].type_l)
                // console.log("ป่วย");
                l_sick += dataArrAllLeave[x].unit_date
                // l_leave = "*"
                // l_sick += dataArrAllLeave[x].unit_date
              } else if (dataArrAllLeave[x].type_l == 10) {
                // console.log("ลากิจ");
                // l_sick = "*"
                l_leave += dataArrAllLeave[x].unit_date
                // l_leave += 8
                // l_leave = dataArrAllLeave[x].unit_date
              } else if (dataArrAllLeave[x].type_l == 20) {
                l_cut += dataArrAllLeave[x].unit_date


              }
            }
            //
            demonDataLeave = {
              idUser: l_idUser,
              leave: l_leave,
              sick: l_sick,
              lcut: l_cut

            }
          }

          mapTotalLeave.push(demonDataLeave)


        }

        indexStarf()
      }

      /* เพิ่มเติม */
      /* สำหรับ ที่อยู่ Staf */
      function indexStarf() {
        // console.log(mapTotalLeave);

        let id = req.params.id
        console.log("Starf Id = " + id);
        let sql = sqlIndexUserStar
        conn.query(sql, [id], (err, resStarf) => {
          // console.log(resStarf);
          detailStarf = resStarf
          approveStaf()
        })
      }
      /* ผู้อนุมัติ */
      function approveStaf() {
        subMain()
        async function subMain() {
          await fucnId()
        }

        function fucnId() {
          let id = req.params.id
          let sql = "SELECT * FROM `leaveorder` where myId = ?"
          connl.query(sql, [id], (err, resOrder) => {
            // console.log(resOrder);
            orderId.push(resOrder[0].order_1)
            orderId.push(resOrder[0].order_2)
            orderId.push(resOrder[0].order_3)
            fnchName()
          })
        }

        function fnchName() {
          // console.log(orderId);
          let sql = sqlFindUserForId_user
          // console.log(sql);

          for (let i = 0; i < orderId.length; i++) {
            // console.log(" ค่า i = " + i);
            // console.log(orderId[0]);
            conn.query(sql, [orderId[i]], (err, resNameOrder) => {
              // console.log("dddd");
              // console.log(typeof (resNameOrder));
              // console.log(resNameOrder.length);
              // console.log(resNameOrder[0]);
              // console.log(resNameOrder);
              arrData = resNameOrder[0]
              if (resNameOrder[0] == undefined) {
                arrData = {
                  id_dp: 0,
                  namedp: '',
                  name: '',
                  surname: '',
                  id_user: 0,
                  username_user: ''
                }
              }

              orderName.push(arrData)
              // orderName.push(resNameOrder)

              if (i == (orderId.length - 1)) {
                // fnRender()
                fnDetailStafLeave()
              }
            })

          }
        }
      }


      // Detail วันเลาทั้งหมด
      function fnDetailStafLeave() {
        let id = req.params.id
        let sql = "SELECT * FROM leavedata WHERE myId = ? AND (status = 3 OR status = 2 OR status = 1) ORDER BY date_start"
        let nameWordMan = ""
        connl.query(sql, [id], (err, resDetailLeave) => {
          // console.log(resDetailLeave);

          // console.log(typeof (resDetailLeave));

          resDetailLeave.forEach(item => {
            // console.log(typeof (item.workerId));

            subItem()

            async function subItem() {
              await chkIf()
            }

            function chkIf() {
              // console.log(allUser);
              if (item.workerId != "") {
                for (let i = 0; i < allUser[0].length; i++) {
                  // console.log(i);
                  if (allUser[0][i].id_user == item.workerId) {
                    // console.log("okd");
                    // console.log(allUser[0][i].name);
                    nameWordMan = allUser[0][i].name
                  }
                }
                pushArr()
              } else {
                nameWordMan = ""
                pushArr()

                // console.log("no");
              }
            }
            // console.log(nameWordMan);
            function pushArr() {
              arrDetailLeavt = {
                id: item.id,
                dateCreate: moment(item.date_create).format('YYYY-MM-DD'),
                dateStart: moment(item.date_start).format('DD-MM-YYYY'),
                dateEnd: moment(item.date_end).format('DD-MM-YYYY'),
                typeL: item.type_l,
                cause: item.cause,
                unitDate: item.unit_date,
                workMan: nameWordMan,
                status: item.status
              }
              detailLeave.push(arrDetailLeavt)

            }

          })

          // console.log(detailLeave);
          fnRender()
        })
      }
      // End Detail วันเลาทั้งหมด

      /* End เพิ่มเติม */

      function fnRender() {
        detailLeave.sort(function (a, b) {
          // return ((a.idUser - b.idUser), (a.id_dp - b.id_dp))
          return ((a.dateCreate - b.dateCreate), (a.id - b.id))
        });

        // console.log(detailStarf);


        let mapDetailStarf = detailStarf.map(item => { // รวม ที่อยู่
          // let addno = ""
          if (item.addno == "-") {
            item.addno = ""
          }
          if (item.moo == "-") {
            item.moo = ""
          }
          if (item.vellage == "-") {
            item.vellage = ""
          }
          if (item.road == "-") {
            item.road = ""
          }
          return {
            address: item.addno + " " + item.moo + " " + item.vellage + " " + item.road + " " + item.nametambon + " " + item.nameAmpur + " " + item.nameProvi
          }
        })

        // console.log(detailStarf);
        console.log("***+++*****");

        // console.log(mapStarfLeave);
        console.log(mapTotalLeave);
        console.log("***+++*****");

        // console.log(mapStarfLeaveName); // คนลา
        res.render('managerStarfDetail', {
          htmlTitle: "manager",
          dataStarf: mapStarf2, // รายชื่อ
          dataLeaveTotal: mapDataLeave, // รวมลาป่วย
          dataStarfLeave: mapStarfLeave,
          dataStarfLeaveName: mapStarfLeaveName,
          mapTotalLeave,
          detailStarf, // รายละเอียด Staf ในใบลา
          mapDetailStarf, // map ที่อยู่
          orderName, // รายชื่อผู้อนุมัติ
          detailLeave
        })
      }
    }
    main()
  }
})



router.get('/approveUpdateIndex/:id', (req, res) => {
  let id = req.params.id
  console.log(id);
  let cookieId = req.cookies["idUser"]

  if (cookieId == undefined) {
    res.redirect('../login')
  } else {
    main()
  }

  async function main() {
    await fnUpdateAppgro()
  }

  function fnUpdateAppgro() {
    //let id = req.params.id
    console.log("id = " + id);

    let sql = "UPDATE leavedata SET status = 2 WHERE status = 1 AND myId = ?"
    connl.query(sql, [id], (err, result) => {
      fnSendDataApp()
    })
  }

  function fnSendDataApp() {
    //let id = req.params.id
    // res.redirect('../manager/')
    res.redirect('../manager/' + id)
  }
})


router.post('/approveAllForManager', (req, res) => {
  console.log("approveAll");
  let data = req.body
  res.send(data)
  // res.end()
})


router.get('/ceo', (req, res) => {

  let meUser = [] // ผู้ใช้งาน
  let arrAllDp = [] // ชื่อ แผนกทั้งหมด
  let allStarf = []
  let dataLeave = [] // การลาทั้งหมด
  let dataMyId = [] // id ผู้ขอลา
  let allStarfLeave = [] // ผู้ขอลา
  let indexStarfLeave = [] // ผู้ขอลา รวม
  let datatotalLeave = [] // รวมยอดการลา
  let mindexStarfLeave = [] // map

  function chkLavel() { // เช็คว่าเป็น CEO
    // console.log("ceo");


    let cookieId = req.cookies["idUser"]
    let sql = "SELECT * FROM id_ceo WHERE id_ceo = ? AND ceo_status = 1"
    connl.query(sql, [cookieId], (err, resIdCeo) => {
      console.log(resIdCeo);
      if (resIdCeo != "") {
        if (cookieId == undefined) {
          res.redirect('login')
        } else {
          ceoFindDp()
        }
      } else {
        res.redirect('login')
      }
    })
  }

  async function main() {
    await chkLavel()
  }

  // เริ่มทำงาน

  // หาแผนกทั้งหมด
  function ceoFindDp() {
    console.log("ceoFindDp");
    let sql = "SELECT depart.id_dp,depart.namedp FROM depart"
    conn.query(sql, (err, resAlldp) => {
      arrAllDp = resAlldp

      ceoFindAllStarf()
    })
  }
  // end หาแผนกทั้งหมด

  // หาพนักงานทั้งหมด แยกแผนก
  function ceoFindAllStarf() {
    let sql = "SELECT depart.id_dp,depart.namedp,personal.`name`,"
    sql += "personal.surname,`user`.id_user,`user`.username_user "
    sql += "FROM depart "
    sql += "INNER JOIN`user` ON`user`.depart = depart.id_dp "
    sql += "INNER JOIN personal ON`user`.idper = personal.id_pro "
    sql += "INNER JOIN employee ON personal.id_pro = employee.id_pro "
    sql += "WHERE depart.id_dp = ? AND depart.id_dp <> 6 "
    sql += "AND active = 1 AND emp_status = 1"
    // console.log(sql);


    for (let i = 0; i < arrAllDp.length; i++) {
      conn.query(sql, [arrAllDp[i].id_dp], (err, resAllStarf) => {
        // console.log(resAllStarf);
        allStarf.push(resAllStarf)
        // console.log(allStarf.length);
        if (i == (arrAllDp.length - 1)) {
          dataLeaveDetail()
        }
      })
    }


  }
  // end หาพนักงานทั้งหมด แยกแผนก

  // หาการลาทุกคน แบ่งตามแผนก จาก allStarf[]
  function dataLeaveDetail() {
    // console.log(allStarf[0][1].name);
    // console.log("allStarf = " + allStarf.length);
    // console.log("allStarf-1 = " + (allStarf.length - 1));

    // for (let i = 0; i < allStarf.length; i++) {
    let dataDemon = {}
    let totalSick = 0
    let totalLeave = 0
    let totalCut = 0
    let li = 0
    for (let i = 0; i < allStarf.length; i++) {
      // console.log("i = " + i);
      for (let l = 0; l < allStarf[i].length; l++) {
        // console.log("l =" + l);
        // console.log("i =" + i);
        sql = "SELECT * FROM `leavedata` where myId = ? and `status` = 3"
        connl.query(sql, [allStarf[i][l].id_user], (err, resLeave) => {
          // dataLeave[i][l].push(resLeave)
          // dataLeave[i][l] = resLeave
          // dataDemon[0] = {
          //   id: 0,
          //   totalSick: 0
          // id: 0,
          // myId: 0,
          // date_create: "",
          // date_start: "",
          // unit_date: 0,
          // date_end: "",
          // type_l: 0,
          // cause: 'no data',
          // status: 0,
          // workerId: ''
          // }

          if (resLeave == "") {
            dataDemon[0] = {
              id: 0,
              totalSick: 0,
              totalLeave: 0,
              totalCut: 0
            }
            // console.log("TEST Null");
            // console.log("li = " + li);
            dataLeave.push(dataDemon[0])
          } else {
            // console.log("li = " + li);
            // console.log(resLeave);
            // console.log(resLeave.length);
            totalSick = 0
            totalLeave = 0
            totalCut = 0
            for (let x = 0; x < resLeave.length; x++) {
              // console.log(resLeave[x].type_l);
              if (resLeave[x].type_l < 10) {
                totalSick += resLeave[x].unit_date
              } else if (resLeave[x].type_l == 10) {
                //totalSick = 0
                totalLeave += resLeave[x].unit_date
              } else if (resLeave[x].type_l == 20) {
                totalCut += resLeave[x].unit_date
              }
            }
            dataDemon[0] = {
              id: 0,
              totalSick: totalSick,
              totalLeave: totalLeave,
              totalCut: totalCut

            }
            dataLeave.push(dataDemon[0])
          }
          // console.log(resLeave);

          if ((i == (allStarf.length - 2)) && (l == (allStarf[i].length - 1))) {
            // console.log("sendData");
            // console.log(resLeave);
            starfMyIdLeave()
          }

          li = li + 1
        })
      }


    }
  }
  // end หาการลาทุกคน แบ่งตามแผนก จาก allStarf[]

  // หาคนที่ลา statatus = 2
  function starfMyIdLeave() {
    let sql = "SELECT myId FROM leavedata WHERE status = 2 group by myId"
    connl.query(sql, (err, resMyId) => {
      // console.log(resMyId);
      // res.end()




      if (resMyId == "") {
        console.log("nodata");
        let nonData = {
          myId: 0
        }
        // dataMyId.push(nonData)
        sendData()
        // dataMyId = nonData
      } else {
        dataMyId = resMyId
      }
      // res.end()
      findStarfLeave()
    })
  }

  function findStarfLeave() {
    // let sql = "SELECT depart.id_dp,depart.namedp,personal.`name`,"
    // sql += "personal.surname,`user`.id_user,`user`.username_user "
    // sql += "FROM depart "
    // sql += "INNER JOIN`user` ON`user`.depart = depart.id_dp "
    // sql += "INNER JOIN personal ON`user`.idper = personal.id_pro "
    // sql += "INNER JOIN employee ON personal.id_pro = employee.id_pro "
    // sql += "WHERE depart.id_dp = ? AND depart.id_dp <> 6 "
    // sql += "AND active = 1 AND emp_status = 1"
    let sql = "SELECT depart.id_dp,depart.namedp,personal.`name`,"
    sql += "personal.surname,`user`.id_user,`user`.username_user "
    sql += "FROM depart "
    sql += "INNER JOIN`user` ON`user`.depart = depart.id_dp "
    sql += "INNER JOIN personal ON`user`.idper = personal.id_pro "
    sql += "WHERE active = 1 and id_user = ?"
    // console.log(sql);
    console.log(dataMyId);

    for (let i = 0; i < dataMyId.length; i++) {
      conn.query(sql, [dataMyId[i].myId], (err, resStarfleave) => {
        // console.log(resStarfleave);
        // allStarfLeave = resStarfleave
        // mapStarfLeave()
        allStarfLeave.push(resStarfleave)
        if (i == (dataMyId.length - 1)) {
          mapStarfLeave()
        }
      })
    }

  }

  function mapStarfLeave() {

    console.log(allStarfLeave); // คนลา
    console.log("allStarfLeave = " + allStarfLeave.length);

    for (let i = 0; i < allStarfLeave.length; i++) {
      console.log("id = " + allStarfLeave[i][0].id_user)
      let sql = "SELECT * FROM `leavedata` WHERE myId = ? AND status = 2"
      // console.log(sql);

      connl.query(sql, [allStarfLeave[i][0].id_user], (err, resLeave) => {
        // console.log(resLeave)
        indexStarfLeave.push(resLeave)
        if (i == (allStarfLeave.length - 1)) {
          mapIndexStarfLeave()
        }
      })
    }
  }


  // map indexStarfLeave เอาไปแสดงผลการขอลา
  function mapIndexStarfLeave() {
    // console.log(indexStarfLeave.length);
    // console.log(indexStarfLeave[1]);
    console.log("การลาทั้งหมดของคน = " + indexStarfLeave.length + " จำนวน Obj");


    // console.log(indexStarfLeave);
    console.log(indexStarfLeave[0]);

    for (let i = 0; i < allStarfLeave.length; i++) {
      console.log("i = " + i);

      for (let l = 0; l < allStarfLeave[i].length; l++) {
        console.log("l = " + l);
        mindexStarfLeave[i] = indexStarfLeave[i].map(item => {
          // mindexStarfLeave[i] = indexStarfLeave.map(item => {
          return {
            id: item.id,
            dateStart: moment(item.date_start).format('DD-MM-YYYY'),
            dateEnd: moment(item.date_end).format('DD-MM-YYYY'),
            unitDate: item.unit_date,
            typel: item.type_l,
            cause: item.cause
          }
        })
      }

    }
    sendData()
  }


  function sendData() {
    console.log("obj ที่ map ได้ = " + mindexStarfLeave.length);

    //console.log(indexStarfLeave[0].length);
    //console.log(mindexStarfLeave);

    console.log("***************");
    //console.log(indexStarfLeave[1].length)
    console.log("***************");

    // console.log(indexStarfLeave.length);
    // console.log(mindexStarfLeave);
    // console.log(allStarfLeave);


    // console.log(indexStarfLeave[0]);
    // console.log(indexStarfLeave[1].length);
    // console.log(indexStarfLeave);

    for (let i = 0; i < allStarfLeave.length; i++) {
      let demonData = {
        id: 0,
        myId: 0,
        leave: 0,
        sick: 0,
        cut: 0
      }
      let l_id = 0
      let l_myId = 0
      let l_leave = 0
      let l_sick = 0
      let l_cut = 0
      for (let l = 0; l < indexStarfLeave[i].length; l++) {
        // l_leave:
        // console.log("Loop");
        // console.log(indexStarfLeave[i]);

        if (indexStarfLeave[i][l].type_l < 10) {
          l_sick += indexStarfLeave[i][l].unit_date
        } else if (indexStarfLeave[i][l].type_l == 10) {
          l_leave += indexStarfLeave[i][l].unit_date
        } else if (indexStarfLeave[i][l].type_l == 20) {
          l_cut += indexStarfLeave[i][l].unit_date
        }
      }

      demonData = {
        id: l_id,
        myId: l_myId,
        leave: l_leave,
        sick: l_sick,
        cut: l_cut
      }
      datatotalLeave.push(demonData)
    }



    let mAllStarf = []
    for (let i = 0; i < allStarf.length; i++) {
      mAllStarf[i] = allStarf[i].map(item => {
        return {
          namedp: item.namedp,
          id: item.id_user,
          name: item.name + " " + item.surname
        }
      })
    }


    // end mapData
    console.log("******senddata****");
    console.log(datatotalLeave);
    console.log(datatotalLeave.length);


    res.render('ceo', {
      title: "ceoData",
      arrAllDp, // แผนกทั้งหมด
      mAllStarf,
      dataLeave,
      allStarfLeave, // ชื่อคนลา
      datatotalLeave, // รวมการลา
      indexStarfLeave,
      mindexStarfLeave
      //resLeave
    })
  }
  // จบการทำงาน

  main()

})

router.post('/approv_3', (req, res) => {
  let data = req.body

  console.log(typeof (data.getId));
  if (typeof (data.getId == 'string')) {
    console.log("string");

  } else {
    console.log("object");

  }
  console.log(data.getId[0]);
  res.end()
})

module.exports = router;