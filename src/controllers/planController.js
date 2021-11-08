import dotdev from "dotenv";
dotdev.config();
//goes to plan router
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import {TotPlan} from '../models/TotPlan'
import {User} from '../models/User'


async function findtitle(title){
    const totplans = await TotPlan.findOne({title:title}).lean();
    return totplans;    
}

async function finduserPlan(id){
    const usertotplan = await TotPlan.findOne({ _id : id}).lean();
    return usertotplan;
}

async function finduser(gmail){
    const usertotplan = await User.findOne({ gmail : gmail}).lean();
    return usertotplan;
}

function checkath(parti,check){
    let x = false;
    parti.forEach(function(part){
        if(part['_id']==check){
            x=true;
        }
        else{
            return false;
        }
    })
    return x;
}
function checkcall(call,check){
    let x = false;
    call.forEach(function(i){
        if(i['plan_title']==check){
            x=true;
        }
        else{
            return false;
        }
    })
    return x;
}

function checktitle(tot,check){
    let x = false;
    tot.forEach(function(i){
        if(i['title']==check){
            x=true;
        }
        else{
            return false;
        }
    })
    return x;
}

async function deletePlan(adminUser){
    const user_DelPlan = await TotPlan.deleteOne({admin : adminUser}).lean();
    return user_DelPlan;
}

//사용자 마다 완성된 plan 보여주기 위한 것
export const seePlan = async (req, res) => 
{
    const {id} = req.params;
    // 접근한 여행계획 데이터 조회
    const usertotplan = await finduserPlan(id);
    let parti = usertotplan.participants;
    
    console.log("접근 권한 테스트")
    
    if(checkath(parti,req.session.user._id)){
        console.log("권한허용")
        res.render(`see-plan`, {
            user : req.session.user,
            totPlanTitles : req.session.user.totPlan_list,
            totPlan : usertotplan,
            map_cl : process.env.MAP_CLIENT
        });
    }
    else{
        res.redirect(`/users/${req.session.user._id}`);
    }
    //**DB** : => // 같은 id 값을 가지고 있는 plan 가지고 오기, user, user가 가지고 있는 plan목록, 페이지에서 보여주고 있는 total plan
    
}

export const sendInvitation = async (req, res) => {
    // Database 작업(초대장 전송)
    const {id} = req.params; //plan id
    const {gmail} = req.body; //초대장을 보낼 이메일

    // 초대장을 전송
    const usertotplan = await finduserPlan(id);
    console.log("초대한 계획",usertotplan)
    const totplan_title = usertotplan.title;
    const totplan_id = usertotplan._id;
    const hostname = usertotplan.admin.name;
    const insert_host = {host: hostname, plan_title: totplan_title , plan_id : totplan_id};

    let parti = usertotplan.participants;
    console.log(parti)
    
    // 초대장을 받음
    const par_userinfo = await finduser(gmail);
    console.log("초대한 유저",par_userinfo);
    const par_id = par_userinfo._id;
    let hostarr = par_userinfo.call_list;
    let par_tot = par_userinfo.totPlan_list;

    if(checkcall(hostarr,totplan_title) || req.session.user._id == par_id || checktitle(par_tot , totplan_title) ){ // checkath 수정필요
        console.log("이미 초대됨")
    }
    else{
        User.findOne({gmail: gmail}).exec(function(err, res){
            if(res){
                res.call_list.push(insert_host);
                res.save();
            }
        });
    }
    
    // DB 수락 거절 판별
    
    res.redirect(`/plans/${id}`);
}

export const editPlan = async (req, res) => 
{
    
    const {id} = req.params;
    const usertotplan = await finduserPlan(id);

    console.log("!! userplans(editplan) check !!")
    console.log(usertotplan)

    let parti = usertotplan.participants;
    
    console.log("접근 권한 테스트")
    console.log(req.session.user);


    if(checkath(parti, req.session.user._id)){
        console.log("권한허용")
        res.render("edit-plan", {
            user : req.session.user,
            totPlan : usertotplan,
            map_cl : process.env.MAP_CLIENT
        });
    }
    else{
        res.redirect(`/users/${res.session.user._id}`);
    }

    // 진행중
}

export const getCreatePlan = (req, res) => {
    res.render("create-plan", {user : req.session.user, totPlanTitles : req.session.user.totPlan_list});
}

export const postCreatePlan = async (req, res) => {

    // database => 새 plan 생성 뒤 user에 추가
    const {title, start, end} = req.body;

    const startDate = new Date(start);
    const endDate = new Date(end);

    console.log("startDate : ", startDate, "endDate : ",endDate);


    const pC_id = req.session.user._id;
    const pC_user = req.session.user.name;
    const pC_image_url = req.session.user.image_url;

    let tempDate = new Date(startDate);
    const dayArray = [];
    
    await new TotPlan({
        title:title , 
        admin : {_id: pC_id, name: pC_user},
        participants : [{_id: pC_id, name: pC_user, image_url : pC_image_url}],
        // day_plan: [{
        //     date: dayArray,
        //     place: [{
        //         name: '아직1',
        //         road_adr: '안정함1',
        //         // img 추가할건지 판단
        //         x : 33.4724, 
        //         y : 126.3095,
        //         map_link: '이것도'
        // }]}]
    }).save().then(()=>{
        console.log("totplan saved",title);
    }).catch((err) => {
        console.error(err)
    });

    let totplanidcall = await findtitle(title);
    let totplanid = totplanidcall._id;
    console.log(totplanid)
    for(tempDate; tempDate <= endDate; tempDate.setDate(tempDate.getDate() + 1)){
        console.log("temp date : ", tempDate);
        dayArray.push(new Date(tempDate));
        TotPlan.findByIdAndUpdate(totplanid, {$push : { 
            day_plan: [{date : tempDate }] } } ).exec();

    }
   
    const totplan = await findtitle(title);


    User.findByIdAndUpdate(pC_id , {$push : { totPlan_list: {_id : totplan._id , title : totplan.title} } } ).exec()
    req.session.user.totPlan_list.push({_id : totplan._id , title : totplan.title});
    
    res.redirect(`/users/${pC_id}`); 
}

export const accept = async (req, res) => {

    
    const {id, tid} = req.params;

    console.log(id)
    console.log(tid)

    const accept_id = req.session.user._id;

    const par_userinfo = await finduser(req.session.user.gmail);

    const usertotplan = await finduserPlan(id);

    console.log("초대받은 계획",usertotplan)

    const totplan_title = usertotplan.title;
    const totplan_id = usertotplan._id;
    const insert_plan = {_id : totplan_id, title: totplan_title};
    const hostname = usertotplan.admin.name;

    const insert_host = { host: hostname, plan_title: totplan_title , plan_id : totplan_id, _id: tid };

    console.log("insert host --- ")
    const par_info = {_id: par_userinfo._id, name: par_userinfo.name, image_url: par_userinfo.image_url};
    console.log("par in fo  --- ")
    
    TotPlan.findOne({_id:id}).exec(function(err, res){
        if(res){
            res.participants.push(par_info);
            res.save();
        }
    });
    console.log("////_@_ 3-- ")

    User.findOne({_id: accept_id}).exec(function(err, res){
        if(res){
            res.totPlan_list.push(insert_plan);
            res.call_list.pull(insert_host);
            res.save();
        }
    });
    console.log("////_@_ --- ")
    
    // // 초대 수락시
    // tot_plan participant추가
    

    res.redirect(`/users/${req.session.user._id}`);
}

export const refuse = async (req, res) => {
    //***DB
    const {id,tid} = req.params;

    console.log(id)
    console.log(tid)

    const refuse_id = req.session.user._id
    const par_userinfo = await finduser(req.session.user.gmail);

    const usertotplan = await finduserPlan(id);

    console.log("초대받은 계획",usertotplan)

    const totplan_title = usertotplan.title;
    const totplan_id = usertotplan._id;
    const hostname = usertotplan.admin.name;
    const insert_host = {host: hostname, plan_title: totplan_title , plan_id : totplan_id, _id: tid};

    
    User.findOne({_id: refuse_id}).exec(function(err, res){
        if(res){
            res.call_list.pull(insert_host);
            res.save();
        }
    });

    res.redirect(`/users/${req.session.user._id}`);
}

// admin만 삭제 가능하게 만들어야 함 아직 작업 x
export const del = async(req, res) => {
    //삭제할 totPlan id
    const {id} = req.params;
    
    const usertotplan = await finduserPlan(id);
    let hostid = usertotplan.admin._id;
    let hostname = usertotplan.admin.name;
    let totplan_id = usertotplan._id;
    let totplan_title = usertotplan.title;

    let adminUser = {_id: hostid, name: hostname};
    let delete_callList = {host: hostname, plan_title: totplan_title , plan_id : totplan_id};

    if(hostid = req.session.user._id){

        console.log('delete Test');
        let delete_plan = await deletePlan(adminUser)
        console.log(delete_plan);
        console.log('delete Test');

        User.findOne({_id: req.session.user._id}).exec(function(err, res){
            if(res){
                res.call_list.pull(delete_callList);
                res.save();
            }
        });
    
    }else{
        console.log(' You are not host :( ')
    }
   

    res.redirect(`/users/${req.session.user._id}`);
}

