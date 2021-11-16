import dotdev from "dotenv";
dotdev.config();
//goes to plan router
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import {TotPlan} from '../models/TotPlan'
import {User} from '../models/User'
import fetch from "node-fetch";



async function findtitle(title){
    const totplans = await TotPlan.findOne({title:title}).lean();
    return totplans;    
}

async function finduserPlan(id){
    const usertotplan = await TotPlan.findOne({ _id : id}).lean();
    return usertotplan;
}

async function finduser(gmail){
    const userinfo = await User.findOne({gmail : gmail}).lean();
    return userinfo;
}

async function findCallList(delete_CallList){
    const CallList_par = await User.find({}).where('call_list').in(delete_CallList).lean();
    return CallList_par;
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

async function deletePlan(id){
    const user_DelPlan = await TotPlan.deleteOne({_id : id}).lean();
    return user_DelPlan;
}

export const seePlan = async (req, res) => 
{   
    const {id} = req.params;
    let statusCode = -1;
    if(req.query.status != undefined){
        statusCode = req.query.status;
    }
    // 접근한 여행계획 데이터 조회
    const usertotplan = await finduserPlan(id);
    if(usertotplan!=null)
    {
        let parti = usertotplan.participants;
        console.log("접근 권한 테스트")
        if(checkath(parti,req.session.user._id)){
            console.log("권한허용")
            
            // 접속허용
            res.render(`see-plan`, {
                user : req.session.user,
                totPlanTitles : req.session.user.totPlan_list,
                totPlan : usertotplan,
                map_cl : process.env.MAP_CLIENT,
                statuscode : statusCode
            });
        }
        else{            
            console.log("접근 권한이 없습니다")
            res.send(`<script>alert('접근 권한이 없습니다'); window.location.href="/users/${req.session.user._id}"</script>`);
            //res.redirect(`/users/${req.session.user._id}`);
        }
    }
    else{
        console.log("계획이 존재하지 않습니다")
        res.send(`<script>alert('계획이 존재하지 않습니다'); window.location.href="/users/${req.session.user._id}"</script>`);
        //res.redirect(`/users/${req.session.user._id}`);
    }
}

export const sendInvitation = async (req, res) => {
    // Database 작업(초대장 전송)
    const {id} = req.params; //plan id
    const {gmail} = req.body; //초대장을 보낼 이메일

    // 초대장을 전송
    const usertotplan = await finduserPlan(id);
    console.log("초대한 계획", usertotplan)
    const totplan_title = usertotplan.title;
    const totplan_id = usertotplan._id;
    const hostname = usertotplan.admin.name;
    const insert_host = {host: hostname, plan_title: totplan_title , plan_id : totplan_id};

    let parti = usertotplan.participants;
    console.log(parti)
    
    // 초대장을 받음
    const par_userinfo = await finduser(gmail);
    console.log("초대한 유저", par_userinfo);

    let statusCode;
    if(par_userinfo!=null)
    {
        const par_id = par_userinfo._id;
        let hostarr = par_userinfo.call_list;
        let par_tot = par_userinfo.totPlan_list;
        
        if(req.session.user._id == par_id){
            console.log("본인에게 초대장을 보낼 수 없습니다")
            statusCode = 1;
        }
        else if(checkcall(hostarr,totplan_title) || checktitle(par_tot , totplan_title) ){ // checkath 수정필요
            console.log("이미 초대된 회원입니다")
            statusCode = 2;
        }
        else{
            User.findOne({gmail: gmail}).exec(function(err, res){
                if(res){
                    res.call_list.push(insert_host);
                    res.save();
                }
            });
            statusCode = 0;
        }
        res.redirect(`/plans/${id}?status=${statusCode}`);
    }
    else{
        console.log("해당 이메일이 회원이 아닙니다.");
        statusCode = 3;
        res.redirect(`/plans/${id}?status=${statusCode}`);
    }
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

}

export const getCreatePlan = (req, res) => {
    res.render("create-plan", {user : req.session.user, totPlanTitles : req.session.user.totPlan_list});
}

export const postCreatePlan = async (req, res) => {

    const {title, start, end} = req.body;

    const startDate = new Date(start);
    const endDate = new Date(end);

    console.log("startDate : ", startDate, "endDate : ",endDate);

    const pC_id = req.session.user._id;
    const pC_user = req.session.user.name;
    const pC_gmail = req.session.user.gmail;
    const pC_image_url = req.session.user.image_url;
    let tempDate = new Date(startDate);
    const dayArray = [];

    let check_plan = await findtitle(title);

    if(check_plan==null){
        await new TotPlan({
            title:title , 
            admin : {_id: pC_id, name: pC_user},
            participants : [{_id: pC_id, name: pC_user, image_url : pC_image_url}],
        }).save().then(()=>{
            console.log("totplan saved",title);
        }).catch((err) => {
            console.error(err);

        });

        let totplanidcall = await findtitle(title);
        let totplanid = totplanidcall._id;
        console.log(totplanid)
        let count=0
        for(tempDate; tempDate <= endDate; tempDate.setDate(tempDate.getDate() + 1)){
            console.log("temp date : ", tempDate);
            dayArray.push(new Date(tempDate));
            await TotPlan.findByIdAndUpdate(totplanid, {$push : { 
                day_plan: [{date : dayArray[count]}] }  } , {upsert : true}).exec(); 
            count=count+1   
        }
        
        const totplan = await findtitle(title);
        
        await User.findByIdAndUpdate(pC_id , {$push : { totPlan_list: {_id : totplan._id , title : totplan.title} } } , { upsert:true } ).exec()
        // req.session.user.totPlan_list.push({_id : totplan._id , title : totplan.title});
        req.session.user = await finduser(pC_gmail);
        
        // res.redirect(`/users/${pC_id}`);
        res.redirect(`/plans/${totplan._id}`); 
    }
    else{
        res.redirect(`/users/${pC_id}`);
    }
    
}

export const accept = async (req, res) => {

    
    const {id} = req.params;

    console.log(id)

    const accept_id = req.session.user._id;

    const par_userinfo = await finduser(req.session.user.gmail);

    const usertotplan = await finduserPlan(id);

    console.log("초대받은 계획", usertotplan)

    const totplan_title = usertotplan.title;
    const totplan_id = usertotplan._id;
    const insert_plan = {_id : totplan_id, title: totplan_title};
    const hostname = usertotplan.admin.name;

    const insert_host = { host: hostname, plan_title: totplan_title , plan_id : totplan_id};

    const par_info = {_id: par_userinfo._id, name: par_userinfo.name, image_url: par_userinfo.image_url};
    
    TotPlan.findOne({_id:id}).exec(function(err, res){
        if(res){
            res.participants.push(par_info);
            res.save();
        }
    });

    User.findOne({_id: accept_id}).exec(function(err, res){
        if(res){
            res.totPlan_list.push(insert_plan);
            res.call_list.pull(insert_host);
            res.save();
        }
    });
    
    res.redirect(`/plans/${id}`);
}

export const refuse = async (req, res) => {
    //***DB
    const {id} = req.params;

    console.log(id)

    const refuse_id = req.session.user._id

    const usertotplan = await finduserPlan(id);

    console.log("초대받은 계획",usertotplan)

    const totplan_title = usertotplan.title;
    const totplan_id = usertotplan._id;
    const hostname = usertotplan.admin.name;
    const insert_host = {host: hostname, plan_title: totplan_title , plan_id : totplan_id};

    
    User.findOne({_id: refuse_id}).exec(function(err, res){
        if(res){
            res.call_list.pull(insert_host);
            res.save();
        }
    });

    res.redirect(`/plans/${id}`);
}





export const del = async(req, res) => {
    //삭제할 totPlan id
    const {id} = req.params;

    const usertotplan = await finduserPlan(id);
    let hostid = usertotplan.admin._id;
    let hostname = usertotplan.admin.name;
    let totplan_title = usertotplan.title;
    let gmail = req.session.user.gmail;
    
    let userinfo = await finduser(gmail);
    let usertotList = userinfo.totPlan_list;
    // participants call_list 찾기
    let adminUser = {_id: hostid, name: hostname}

    //삭제할 planList
    const delete_planList = usertotList.find(element => element._id == id);

    //삭제할 CallList
    let delete_CallList = {host: hostname, plan_title: totplan_title, plan_id: id};

    const par_CallList = await findCallList(delete_CallList);

    if(par_CallList){
        for(let i=0; i < par_CallList.length; i++)
        {
            let parArr_IDList = par_CallList[i]._id;
            console.log(parArr_IDList);
            User.findOne({_id: parArr_IDList}).exec(function(err, res){
                if(res){
                    res.call_list.pull(delete_CallList);
                    res.save();
                }
            });
        }

    }

    for(let k=0; k < usertotplan.participants.length; k++){
        let parID = usertotplan.participants[k]._id;
        console.log(parID);
        User.findOne({_id: parID}).exec(function(err, res){
            if(res){
                res.totPlan_list.pull(delete_planList);
                res.save();
            }
        });
    }
    
    User.findOne({_id: req.session.user._id}).exec(function(err, res){
        if(res){
            res.totPlan_list.pull(delete_planList);
            res.save();
        }
    });

    // Total Plan 삭제
    let delete_plan = await deletePlan(id);
    console.log(delete_plan);


    res.redirect(`/users/${req.session.user._id}`);
}