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

//console.log(sqlAllUser);

let sqlIndexUser = "SELECT depart.id_dp,depart.namedp,personal.`name`, "
sqlIndexUser += "personal.surname,`user`.id_user,`user`.username_user "
sqlIndexUser += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlIndexUser += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlIndexUser += "WHERE active = 1 "
sqlIndexUser += "and id_user = ?"

//console.log(sqlIndexUser);


let sqlIndexUserStar = "SELECT *,personal.name as fistname,tambon_table.name as nametambon,ampur_table.`name` As nameAmpur,province_table.name_provi As nameProvi "
sqlIndexUserStar += "FROM depart "
sqlIndexUserStar += "INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlIndexUserStar += "INNER JOIN personal ON `user`.idper = personal.id_pro "
sqlIndexUserStar += "INNER JOIN ampur_table ON personal.ampher = ampur_table.record_id "
sqlIndexUserStar += "INNER JOIN tambon_table ON tambon_table.record_id = personal.tambon "
sqlIndexUserStar += "INNER JOIN province_table ON personal.province_id = province_table.province_id "

sqlIndexUserStar += "WHERE active = 1 and id_user = ?"



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

//let sqlListIndex = "SELECT * FROM leavedata WHERE myId = ? ORDER BY date_end"  bg_16_11_62
let sqlListIndex = "SELECT * FROM leavedata WHERE myId = ? ORDER BY date_create"

let sqlFindMyId = "SELECT * FROM leaveorder WHERE order_1 = ?"

// หาชื่อจาก id_user
let sqlFindUserForId_user = "SELECT depart.id_dp,depart.namedp,personal.`name`,personal.surname,"
sqlFindUserForId_user += "`user`.id_user,`user`.username_user "
sqlFindUserForId_user += "FROM depart INNER JOIN `user` ON `user`.depart = depart.id_dp "
sqlFindUserForId_user += "INNER JOIN personal ON `user`.idper = personal.id_pro"
sqlFindUserForId_user += " WHERE active = 1 and id_user = ?"
// 

// หา ID ผู้ขอลา
let sqlListUserLeave = "SELECT leaveorder.id,leaveorder.myId,leaveorder.order_1,"
sqlListUserLeave += "leaveorder.order_2,leaveorder.order_3,leaveorder.status,leavedata.type_l,leavedata.unit_date,"
sqlListUserLeave += "leavedata.myId AS userId,leavedata.status As statusLeave "
sqlListUserLeave += "FROM leaveorder "
sqlListUserLeave += "INNER JOIN leavedata ON leaveorder.myId = leavedata.myId "
sqlListUserLeave += "WHERE leaveorder.order_1 = ? "
sqlListUserLeave += "AND leavedata.status = 0 "
sqlListUserLeave += "GROUP BY myId "
// end หา ID ผู้ขอลา
//console.log(sqlListUserLeave);




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
    let sql = sqlShowOrder
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
  let sql = sqlShowOrder


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
  console.log("user " + user + " pass " + pass);
  let sql = sqlLogin
  // console.log(sql);

  connp.query(sql, [pass, user], (err, result) => {
    if (err) throw console.log(err)
    //console.log(result[0].idper);
    if (result != "") {
      //let val = result[0].idper
      let val = result[0].id_user
      res.cookie('idUser', val, {
        expires: new Date(Date.now() + 2000000),
        httpOnly: true
      })
      res.redirect('userleave')
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
    //console.log(result);

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


  })

})


router.get('/testc', (req, res) => {
  let val = req.cookies["idUser"]
  console.log("val =" + val);
  res.end()

})

router.get('/userleave', (req, res) => {
  let ckIduser = req.cookies['idUser']
  if (ckIduser == undefined) {
    res.redirect('login')
  } else {

    console.log("userleave cookies =" + ckIduser);


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
      let sql = sqlShowOrder
      connl.query(sql, [validUser], (err, result) => {
        if (result == "") {
          res.send("No data โปรดติดต่อ Admin")
        } else {
          if (err) throw console.log(err)
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
      let sql = sqlListIndex
      let idUser = req.cookies["idUser"]
      connl.query(sql, [idUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let totalSick = 0
        let totalLeave = 0
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
        sendData(mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave)
      })
    }
    // end data วันลา

    function sendData(dataUser, dataOrder1, dataOrder2, dataListLeave) {
      //console.log(dataListLeave);
      //console.log(dataOrder1);
      console.log("dataOrder2 = " + dataOrder2);
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
        dataListLeave
      })
    }
    // ตรวจสอบ สถานะว่าเป็นผู้อนุมัติ หรือไม่
    let sqlChkIdUser = "SELECT * FROM leaveorder WHERE order_1 = ?"
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
        main()
      }
    })
    /*if (ckIduser == 321) {
      res.end()
    } else {*/
    //}
    // END ตรวจสอบ สถานะว่าเป็นผู้อนุมัติ หรือไม่     
  } // end check cookies
})




router.get('/userOrder1', (req, res) => {
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
        let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND myId = ?"
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

      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND myId = ?"
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

    function findLeaveMe(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData) {
      let idChkUser = req.cookies['idUser']
      //console.log("idChkUser = " + idChkUser);

      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l = 10 AND myId = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        if (result[0].totalUnitDate == null) {
          result[0].totalUnitDate = 0
        }
        listLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, result)
      })
    }
    // end วันลาของตนเอง

    // data วันลา

    function listLeave(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meData, meSickData, meLeaveData) {
      let sql = sqlListIndex
      let idUser = req.cookies["idUser"]
      connl.query(sql, [idUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let totalSick = 0
        let totalLeave = 0
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
      console.log("validUser = " + validUser);
      let sql = sqlShowOrder
      connl.query(sql, [validUser], (err, result) => {
        if (result == "") {
          res.send("No data โปรดติดต่อ Admin")
        } else {
          if (err) throw console.log(err)
          //console.log(result);
          let sql2 = sqlIndexUser
          let valOrder1 = result[0].order_1
          console.log("valOrder1 = " + valOrder1);

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
          let mapDataOrder2 = []
          if (result == "") {
            mapDataOrder2.push({
              name: "-"
            })
          } else {
            mapDataOrder2 = result.map((result) => {
              return {
                name: result.name + "  " + result.surname
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
      console.log("TEST");

      console.log(objTotalLeave);
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

      //console.log(dataUser);

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

router.get('/userOrder1/:id', (req, res) => {
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
        let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND myId = ?"
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
            fnMeData(numCount, dataObj, objTotalSick, objTotalLeave)
            //console.log("333333");
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
      console.log("chkLavel = " + chkLavel);

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
      console.log("findSicMe()");
      //console.log(meData);
      //res.end()
      // let objTotalLeaveMe = []
      let idChkUser = req.cookies['idUser']
      console.log("idChkUser = " + idChkUser);

      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l < 10 AND myId = ?"
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

    function findLeaveMe(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData) {


      let idChkUser = req.cookies['idUser']
      console.log("idChkUser = " + idChkUser);

      let sql = "SELECT SUM(unit_date) as totalUnitDate FROM leavedata WHERE type_l = 10 AND myId = ?"
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        if (result[0].totalUnitDate == null) {
          result[0].totalUnitDate = 0
        }
        userIndex(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, result)
      })
    }
    // end วันลาของตนเอง


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
      console.log("validUser = " + validUser);
      let sql = sqlShowOrder
      connl.query(sql, [validUser], (err, result) => {
        if (result == "") {
          res.send("No data โปรดติดต่อ Admin")
        } else {
          if (err) throw console.log(err)
          //console.log(result);
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

          //listLeave(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2)
          listLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2)

        })
      })
    }

    //function listLeave(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2) {
    function listLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2) {


      let sql = sqlListIndex
      //let idUser = req.cookies["idUser"]
      let idUser = req.params.id
      connl.query(sql, [idUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let totalSick = 0
        let totalLeave = 0
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
            totalLeave,
            workerId: result.workerId
          }
        })
        //meData(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave)
        fnMeData2(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave)
      })
    }
    // End Detail User


    //function meData(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave) {
    function fnMeData2(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave) {

      let sql = sqlFindUserForId_user
      let idChkUser = req.cookies["idUser"]
      conn.query(sql, [idChkUser], (err, result) => {
        //sendData(numCount, dataObj, objTotalSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, result)
        findListIdUserLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, result)
      })
    }


    function findListIdUserLeave(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData) {
      let idChkUser = req.cookies["idUser"]
      let sql = sqlListUserLeave
      console.log("findListIdUserLeave");
      connl.query(sql, [idChkUser], (err, result) => {
        if (err) throw console.log(err)
        //console.log(result);
        let detailLeave = result

        if (result == "") {
          console.log("ค่าว่าง");

          let arrUserLeave = []
          sendData(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave)

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
                sendData(numCount, dataObj, objTotalSick, objTotalLeave, meData, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, meData, arrUserLeave, detailLeave)
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

    //function sendData(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave) {
    //function sendData(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, dataUser, dataOrder1, dataOrder2, dataListLeave, meData) {
    function sendData(numCount, dataAllUser, totalUnitDateSick, objTotalLeave, meDataNew, meSickData, meLeaveData, dataUser, dataOrder1, dataOrder2, dataListLeave, meData, dataUserLeave, detailLeave) {
      //function sendData(numCount, dataObj, objTotalSick, objTotalLeave, meDataNew, meSickData, meLeaveData, mapDataUser, mapDataOrder1, mapDataOrder2, dataListLeave, result) {
      console.log("12 12 12");
      console.log(objTotalLeave);

      //console.log(mapDataOrder2);
      //res.end()
      //console.log("funtion Sendata");
      //console.log(dataUser);
      //console.log(dataUser);
      //console.log("totalUnitDateSick = " + totalUnitDateSick[0].totalUnitDate);
      //console.log(totalUnitDateSick);

      // รายละเอียดการลา
      console.log(detailLeave);
      let mDetailLeave = detailLeave.map((item) => {
        return {
          indexType: item.type_l,
          unitDate: item.unit_date
        }
      })
      // end รายละเอียดการลา

      // ผู้ขอลาป่วย
      //console.log(dataUserLeave);
      let mDataUserLeave = dataUserLeave.map((item) => {
        return {
          idUser: item[0].id_user,
          name: item[0].name + "  " + item[0].surname
        }
      })
      console.log(mDataUserLeave);

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
      //console.log(dataOrder2);
      res.render('userOrederDetail', {
        htmlTitle: "ใบลาออนไลน์",
        title: "Test Deatail",
        mDataAllUser, // รามชื่อทั้งหมด
        mDataTotalSick, // รวมวันป่วย
        mDataTotalLeave, // รวมวันลากิจ
        // start
        dataUser,
        dataOrder1,
        dataOrder2,
        dataListLeave,
        meData, // ข้อมูลตัวเอง
        //meData2, // ข้อมูลตัวเอง
        //
        meSickData, // วันลากิจของตัวเอง
        meLeaveData, // วันลากิจของตัวเอง
        //dataUserLeave, // รายชื่อผู้ขอลา
        mDataUserLeave, // รายชื่อผู้ขอลา
        mDetailLeave // รายละเอียด-ชนิดการลา
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
    console.log(valEndDate);
    //
    let sql = sqlAddLeave
    //INSERT INTO leave (myId,date_start,unit_date,date_end,type,cause,status) VALUES (?,?,?,?,?,?,?)"
    connl.query(sql, [valMyId, dateNow, valStartDate, valDateUnit, valEndDate, valType, valComment, 0], (err, result) => {
      if (err) throw console.log(err)
      res.redirect('userleave')
    })
  }

  //res.end()
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
    let sql = sqlAddLeave2
    connl.query(sql, [valMyId, dateNow, valStartDate, valDateUnit, valEndDate, valType, valComment, 0, workerId], (err, result) => {
      if (err) throw console.log(err)
      res.redirect('userleave')
    })
  }
})


router.get('/deleteLeave/:id', (req, res) => {
  let id = req.params.id
  console.log(id);
  let sql = "DELETE FROM leavedata WHERE id = ?"
  connl.query(sql, [id], (err, result) => {
    if (err) throw console.log(err)
    res.redirect('../userleave')
  })

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

module.exports = router;