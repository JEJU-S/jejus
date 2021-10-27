import fetch from "node-fetch";
import dotdev from "dotenv";
dotdev.config();
const mongoose = require('mongoose');

// 추후 진짜 db로 바꿔야 함
import { fakeUser } from "./fakeDB";
import { fakeTotPlan1, fakeTotPlan2} from "./fakeDB";
import { Mongoose } from "mongoose";
import { app } from "cli";
import { Db } from "mongoose/node_modules/mongodb";

const userSchema = new mongoose.Schema({
    name: String,
    gmail: {type: String, required: true, unique: true},
    image_url: String,
    totPlan_id: Array,
})

const User = mongoose.model('User', userSchema);

// Main Page 
export const main = async (req, res) => {
    try{
        /*
        //loggedIn => true or undefined
        // 로그인했으면 profile페이지로 다시 넘어가도록 한다(session loggedIn 변수로 확인)
        if(Boolean(req.session.loggedIn) == true)
        {   
            return res.redirect("/users/profile");
        }
        */
        return res.render("main");
        
    }
    catch(error){
        return res.render("<h1>SERVER ERROR🛑</h1>");
    }
};

// --로그인 작업--

//Main -> Profile 로 가는 process function 
//login -> callback -> profile
export const login = (req, res) => 
{
     //구글 로그인 전달 url 파라미터들
    const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
    const config = {
        response_type : "code",
        client_id : process.env.GL_CLIENT,
        scope : "email profile",
        redirect_uri : "http://localhost:4000/users/callback",
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;
    
    return res.redirect(finalURL);
}

export const callback = async(req, res) => {

    console.log("call back function!");
    const baseURL = "https://oauth2.googleapis.com/token";

    const config = {
        client_id : process.env.GL_CLIENT,
        client_secret : process.env.GL_SECRET,
        code : req.query.code,
        grant_type : "authorization_code",
        redirect_uri : "http://localhost:4000/users/callback"
    }

    const params  = new URLSearchParams(config).toString();
    const finalURL = `${baseURL}?${params}`;

    //token 받기
    const tokenRequest = await (
        await fetch (finalURL, {
        method : "POST",
        headers : {
            Accept : "application/json",
        }, 
        })
    ).json();

    //access token을 받아 왔다면,
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;

        const baseURL = "https://people.googleapis.com/v1/people/me";
        const config = {
            personFields : "emailAddresses,names,photos",
            access_token : access_token
        }
        const params = new URLSearchParams(config).toString();
        const finalURL = `${baseURL}?${params}`;
        
        // 사용자 정보 받아옴(json 형식)
        const userRequest = await (
            await fetch( finalURL, {
            method : "GET"
        })
        ).json();
        
        // 사용자 정보 console에 출력 -> db로 받아서 
        console.log(userRequest);
        const user_name = userRequest['names'][0]['displayName'];
        const user_gmail = userRequest['emailAddresses'][0]['value'];
        const user_image_url = userRequest['photos'][0]['url'];
        
        console.log("-----------user info-------------");
        console.log(user_name);
        console.log(user_gmail);
        console.log(user_image_url);

        console.log("---------------------------------");
   

        // 유저 유무 파악(없다면 저장, 있으면 login successfully)
        User.findOne({gmail: user_gmail}).exec(async function(err, user){
            if(!user){
                console.log("!no user!");
                new User({name: user_name, gmail: user_gmail, image_url: user_image_url}).save()
                .then(() => {
                    console.log('Saved successfully');
                 })
                .catch((err) => {
                    console.error(err);
                 });
                }
            else{
                console.log("login successfully!")
            }
        });
     

        
        const user_info = await User.findOne({gmail: user_gmail}).lean();
        if(!user_info){
            const user_info_N = await User.findOne({gmail: user_gmail}).lean();
            var login_id = await user_info_N._id;
            var login_name = await user_info_N.name;
            var login_gmail = await user_info_N.gmail;
            var login_image = await user_info_N.image_url;
            var login_totPlan_id = await user_info_N.totPlan_id;
        }
        else{
            const user_info = await User.findOne({gmail: user_gmail}).lean();
            var login_id = await user_info._id
            var login_name = await user_info.name;
            var login_gmail = await user_info.gmail;
            var login_image = await user_info.image_url;
            var login_totPlan_id = await user_info.totPlan_id;
        }

       console.log('---------------------------')
       console.log('UserInfo from MongoDB')
       console.log(login_id);
       console.log(login_name);
       console.log(login_gmail);
       console.log(login_image);
       console.log(login_totPlan_id);
       console.log('---------------------------')


          // 배열 추가 부분 따로 구현해서 붙여넣기, 추후 await 처리해서 함수 안으로 넣어주기
          const fake_plan = '시청' 

          // 
          User.findOne({gmail: user_gmail}).exec(async function(err, res){
              if(res){
                  res.totPlan_id.push(fake_plan);
                  res.save(async function(err, plan){
                      console.log("save sucess");
                  });
              }
          });
  
        // // db에서 사용자 찾을 수 있다면
        // //올바른 이름, 형식인지 체크
        // // => select
           
        //session 초기화(만든다)
        req.session.loggedIn = true;
        
        // //session User 저장(DB에서 user찾아서) // 받아온 세션을 여기다가 넣을 것
        req.session.user = {
            _id : login_id, 
            name : login_name,
            image_url : login_image,
            gmail : login_gmail,
            totPlan_id : login_totPlan_id
        };

        // // user가 가지고 있는 plan 뽑아서 id, title을 저장
        // // fake db에서는 2개 만든걸로 있는 걸로 넣음
        req.session.totPlanTitleList = [
            { title : fakeTotPlan1.title, _id : fakeTotPlan1._id},
            { title : fakeTotPlan2.title, _id : fakeTotPlan2._id},
        ]

        console.log(req.session.totPlanTitleList);
        
        // //profile 페이지로 redirect(seeProfile 함수)
        res.redirect(`/users/${req.session.user._id}`);
    }

    else {
        console.log("error 알림 해줘야 함");
        
        //main 페이지로 redirect(main 함수)
        res.redirect("/");
    }
}

//goes to user router

// 아직 시작 xx
export const getEditProfile = (req, res) => {
    console.log("get func");

    

    //**DB** : => user 불러오기(session에 저장된거) // session으로 옮기자
    
    
    res.render("edit-profile", {user : req.session.user, totPlanTitles : req.session.totPlanTitleList});
};


export const postEditProfile = (req, res) => {
    console.log("post func");

    
    //**DB** : => user 저장
    //session에서 user 다시 저장

    
    res.redirect("/users/profile", {user : req.session.user, totPlanTitles : req.session.totPlanTitleList});
};



export const seeProfile = (req, res) => {
   
    // login 한 유저가 아니라면 돌려보내야함

    /*
    //loggedIn => true or undefined
        // 로그인했으면 profile페이지로 다시 넘어가도록 한다(session loggedIn 변수로 확인)
        if(Boolean(req.session.loggedIn) != true)
        {   
            return res.render("main");
        }
    */  
    
    //**DB** : => 특정 user, user가 가지고 있는 plan목록, user가 받은 초대

    return res.render("see-profile", {user : req.session.user, totPlanTitles : req.session.totPlanTitleList});
};


//로그아웃 -> main 페이지로 간다
export const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};