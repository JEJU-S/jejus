import dotdev from "dotenv";
dotdev.config();
//goes to plan router
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import {TotPlan} from '../models/TotPlan'
import {User} from '../models/User'

async function findID(id,name){

    const totplan = await TotPlan.findOne({ admin : {_id:id, name:name}}).lean();
    console.log(totplan);
    return totplan;
    
}

async function findtitle(title){

    const totplans = await TotPlan.findOne({title:title}).lean();
    return totplans;
    
}


async function finduserPlan(id){
    const usertotplan = await TotPlan.findOne({ _id : id}).lean();
    return usertotplan;
}

async function finduserGmail(gmail){
    const userGmail = await User.findOne({gmail : gmail}).lean();
    return userGmail;
}


//사용자 마다 완성된 plan 보여주기 위한 것
export const seePlan = async (req, res) => 
{
    const {id} = req.params;
    // 접근한 여행계획 데이터 조회
    const usertotplan = await finduserPlan(id);

    console.log("kkkk")
    console.log(usertotplan)

    //**DB** : => // 같은 id 값을 가지고 있는 plan 가지고 오기, user, user가 가지고 있는 plan목록, 페이지에서 보여주고 있는 total plan
    res.render(`see-plan`, {
        user : req.session.user,
        totPlanTitles : req.session.user.totPlan_list,
        totPlan : usertotplan,
        map_cl : process.env.MAP_CLIENT
    });
}

export const sendInvitation = (req, res) => {
    //Database 작업(초대장 전송)
    const {id} = req.params; //plan id
    const {gmail} = req.body; //초대장을 보낼 이메일

    // 초대장을 전송
    const usertotplan = await finduserPlan(id);
    console.log(usertotplan)
    const totplan_title = usertotplan.title;
    const totplan_id = usertotplan._id;
    const hostname = usertotplan.admin.name;
    const insert_plan = {_id : totplan_id, title: totplan_title};
    const insert_host = {host: hostname, plan_title: totplan_title};

    // 초대장을 받음
    const par_userinfo = await finduserGmail(gmail);
    console.log(par_userinfo);
    const par_id = par_userinfo._id;
    const par_name = par_userinfo.name;
    const par_info = {_id: par_id, name: par_name};

    // DB 수락 취소 판별
    
    // DB 수정
    // 1. tot_plan participant추가
    TotPlan.findOne({_id: totplan_id}).exec(function(err, res){
        if(res){
            res.participants.push(par_info);
            res.save(function(err, res){
                console.log("save sucess");
            });
        }
    });

    

    // 2. user(참가자)의 totplan_list추가(totplan_id, totplan.name)
    // 3. user(참가자)의 calllist 추가(host, plantitle)
    const hostarr = par_userinfo.call_list;

    function includehost(insert_host){
        return hostarr = insert_host;
    }
    
    const findhostarr = hostarr.some(includehost);
    if(findhostarr = false){
        User.findOne({gmail: gmail}).exec(function(err, res){
            if(res){
                res.totPlan_list.push(insert_plan);
                res.call_list.push(insert_host);
                res.save(function(err, res){
                    console.log("save sucess");
                });
            }
        });
        console.log("invite particpants successfully");
    } else {
        console.log("you can't invite same particpants");
    }

    // //**DB
    
    // res.redirect(`/plans/${id}`);
}

export const editPlan = async (req, res) => 
{
    
    const {id} = req.params;
    const usertotplan = await finduserPlan(id);

    console.log("!! userplans(editplan) check !!")
    console.log(usertotplan)

    const usercheckArray = {_id : req.session.user._id , name: req.session.user.name};
    
    // database => 접근하고자 하는 plan id를 통해 user가 plan 사용자에 포함되어있는지 확인
    // 포함되어있으면 들어가게, 아니면 접근 x 하게 만들어야 함 
    // 다른계정으로 로그인해 해당 주소로 접근해보기 (test)
    // 진행중
    if(usertotplan.participants.includes({_id:req.session.user._id , name: req.session.user.name})){
        console.log("#@#@")
        console.log(usertotplan.participants)
    }

    // 진행중

    res.render("socket", {
        user : req.session.user,
        totPlan : usertotplan,
        map_cl : process.env.MAP_CLIENT
    });
    
    /*
    res.render("edit-plan", {
        user : req.session.user,
        totPlan : fakeTotPlan1,
        map_cl : process.env.MAP_CLIENT
    });
    */
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
  

    let tempDate = new Date(startDate);
    const dayArray = [];
    
    for(tempDate; tempDate <= endDate; tempDate.setDate(tempDate.getDate() + 1)){
        console.log("temp date : ", tempDate);
        dayArray.push(new Date(tempDate));
    }
    
    await new TotPlan({
        title:title , 
        admin : {_id: pC_id, name: pC_user},
        participants : [{_id: pC_id, name: pC_user}],
        day_plan: [{
            date: dayArray[0],
            place: [{
                name: '아직1',
                road_adr: '안정함1',
                // img 추가할건지 판단
                x : 33.4724, 
                y : 126.3095,
                map_link: '이것도'
        }]}]
    }).save().then(()=>{
        console.log("totplan saved",title);
    }).catch((err) => {
        console.error(err)
    });
   
    const totplan = await findtitle(title);


    User.findByIdAndUpdate(pC_id , {$push : { totPlan_list: {_id : totplan._id , title : totplan.title} } } ).exec()
    req.session.user.totPlan_list.push({_id : totplan._id , title : totplan.title});
   
    // let userp = await findtitle(title).then(()=>{
    //     console.log("!! check !!")
    //     console.log(userp)
    // })
    
    // let totplan = await findID(pC_id,pC_user);

    // console.log(totplan)
    // console.log("ttttt")

    // User.findByIdAndUpdate(pC_id , {$push : { totPlan_list: {_id : userp._id , title : title} } } ).exec();
    

    // User.findById(pC_id).exec(async function(err, user){
    //     // User({name : pC_user , gmail: pC_gmail , image_url : pC_img , totplan_id:totplan_info_id}).save()
    //     User({totPlan_id:totplantitleid}).updateOne()
    //     .then(() => {
    //         console.log('totplan Saved successfully');
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
    // });
    
    res.redirect(`/users/${pC_id}`); 
}

// admin만 삭제 가능하게 만들어야 함 아직 작업 x
export const del = (req, res) => res.send("delete plans");