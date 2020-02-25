function logout() {
    window.location = "/logout"
}

// start เบิด-ปิด form การลา
function fnSick() {
    $('#boxInpLeave2').hide(); // box ลากิจ hide
    $('#boxInpLeave').slideToggle(500);

    $.ajax({
        type: "GET",
        url: "/typeLeave",
        //data: "data",
        dataType: "json",
        success: function (resp) {
            //console.log(resp);
            let txt = ''
            txt += "<li onclick='typeLeave(1)'><img src='/images/headE.png' alt=''></li>"
            txt += "<li onclick='typeLeave(2)'><img src='/images/cold.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(3)'><img src='/images/diar.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(4)'><img src='/images/stomuch.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(5)'><img src='/images/sore.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(6)'>อื่นๆ</li>"
            document.getElementById('imgSick').innerHTML = txt
        }
    });
}
// end เปิด-ปิด form การลา

// function ลากิจ
function fnLeave() {
    //$('#boxInpLeave').show(500);
    $('#boxInpLeave').hide(); // box ลาป่วย hide
    $('#boxInpLeave2').slideToggle(500);
    $.ajax({
        type: "GET",
        url: "/typeLeave",
        //data: "data",
        dataType: "json",
        success: function (resp) {
            //console.log(resp);
            let txt = ''
            txt += "<li onclick='typeLeave(1)'><img src='/images/headE.png' alt=''></li>"
            txt += "<li onclick='typeLeave(2)'><img src='/images/cold.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(3)'><img src='/images/diar.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(4)'><img src='/images/stomuch.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(5)'><img src='/images/sore.jpg' alt=''></li>"
            txt += "<li onclick='typeLeave(6)'>อื่นๆ</li>"
            document.getElementById('imgSick').innerHTML = txt
        }

    });
}
// end function ลากิจ

// start validateform ลาป่วย
function validateForm() {
    let xStartDate = document.forms["formAddLeave"]["dateStart"].value;
    if (xStartDate == "") {
        alert("โปรดเลือกวันที่เริ่มลา");
        return false;
    }
    var x = document.forms["formAddLeave"]["dateUnit"].value;
    if (x == "") {
        alert("โปรดเลือกจำนวนวันที่ต้องการลา");
        return false;
    }
    //var xComment = document.forms["formAddLeave"]["valComment"].value;
    var xComment = document.forms["formAddLeave"]["valNameType"].value;
    if (xComment == "") {
        alert("โปรดกรอกเหตุผลในการขอลา");
        return false;
    }
}
// end validateform ลาป่วย
// start validateform ลากิจ
function validateForm2() {
    let xStartDate = document.forms["formAddLeave2"]["dateStart2"].value;
    if (xStartDate == "") {
        alert("โปรดเลือกวันที่เริ่มลา");
        return false;
    }
    var x = document.forms["formAddLeave2"]["dateUnit2"].value;
    if (x == "") {
        alert("โปรดเลือกจำนวนวันที่ต้องการลา");
        return false;
    }
    var xComment = document.forms["formAddLeave2"]["valComment2"].value;
    if (xComment == "") {
        alert("โปรดกรอกเหตุผลในการขอลา");
        return false;
    }
    var xWorkerId = document.forms["formAddLeave2"]["wokerId"].value;
    if (xWorkerId == "") {
        alert("โปรดกรอกรหัสพนักงาน สำหรับผู้ปฎิบัติงานแทน")
        return false;
    }
    var xWorkerPass = document.forms["formAddLeave2"]["wokerPass"].value;
    if (xWorkerPass == "") {
        alert("โปรดกรอกรหัสผ่าน สำหรับผู้ปฎิบัติงานแทน")
        return false;
    }
    var xWorkerUserId = document.forms["formAddLeave2"]["workerUserId"].value;
    if (xWorkerUserId == "") {
        alert("โปรดกำหนด ผู้ปฎิบัติงานแทน")
        return false;
    }

}
// end validateform ลากิจ
// start ลบรายการลา ก่อนเสนอ 
function deleteLeave(i, idUser) {
    //console.log('I = ' + i)
    var r = confirm("ต้องการลบข้อมูล !!");
    if (r == true) {
        location.href = "/deleteLeave/" + i + "/" + idUser
    } else {
        return false
    }
}
// end ลบรายการลา ก่อนเสนอ
// show Detail id
function showDetailUser(id) {
    location.href = "/userOrder1/" + id
}
// end show Detail id
// start เลือก เหตุผลการลา
function typeLeave(i) {
    //console.log("i = " + i)
    if (i == 6) {
        document.getElementById('valNameType').disabled = false
        document.getElementById('valNameType').value = ""
        document.getElementsByName('valType')[0].value = i
    } else {
        document.getElementById('valNameType').disabled = true
        $.ajax({
            type: "GET",
            url: "/typeLeave/" + i,
            dataType: "json",
            success: function (resp) {
                //console.log(resp[0].name_type)
                document.getElementById('valNameType').value = resp[0].name_type // dataShow
                document.getElementById('valComment').value = resp[0].name_type // dataSend
                //document.getElementById('valIdType').value = resp[0].id
                document.getElementsByName('valType')[0].value = resp[0].id

            }
        });
    }
}
// end เลือกเหตุผลการลา
// start Update Approve
function approve(id) {
    let getIdUser = document.getElementsByName('leaveId')[0].value
    //console.log(id);
    //console.log(getIdUser);
    location.href = "../updateUserOrder1/" + getIdUser + "/" + id
}
// end Update Approve

// start เช็คผู้ปฎิบัติงานแทน
function chkWorker() {
    //console.log("chk Worker");
    let workerId = document.getElementsByName('wokerId')[0].value
    let workerPass = document.getElementsByName('wokerPass')[0].value
    //console.log(workerId);
    if (workerId == "" || workerPass == "") {
        alert('โปรดกรอก Username หรือ Password ผู้ปฎิบัติงานแทน')
    } else {
        $.ajax({
            type: "GET",
            url: "/chkWorker/" + workerId + "/" + workerPass,
            //data: "data",
            dataType: "json",
            success: function (resp) {
                //console.log(resp);
                if (resp == "" || resp == undefined) {
                    //alert('username หรือ รหัสผ่าน ผู้ปฎิบัติงานแทน ไม่ถูกต้อง')
                    document.getElementById('workerName').innerHTML = "<span style='color:#FFC107;'>USERNAME หรือ รหัสผ่าน ผู้ปฎิบัติงานแทน ไม่ถูกต้อง<spna>"
                    document.getElementById('workerUserId').value = ""
                } else {
                    document.getElementById('workerName').innerHTML = resp[0].name
                    document.getElementById('workerUserId').value = resp[0].workerUserId
                }
            }
        });
    }

}
// end เช็คผู้ปฎิบัติงานแทน




function approveAllForManager() {
    if (!confirm("ต้องการอนุมัติทั้งหมด !!")) {
        return false;
    }
    this.form.submit();
    //console.log("approveAll");
}