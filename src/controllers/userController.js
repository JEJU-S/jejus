import fetch from "node-fetch";
import dotdev from "dotenv";
dotdev.config();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import os from "os";
import {User} from '../models/User'
// 추후 진짜 db로 바꿔야 함
import { Mongoose } from "mongoose";
import { app } from "cli";
import { Db } from "mongoose/node_modules/mongodb";


//
const hostname = os.networkInterfaces();
const PORT = process.env.PORT || 8080;

async function finduser(user_gmail){
    const user_info = await User.findOne({gmail : user_gmail}).lean();
    return user_info;
}


// Main Page 
export const main = (req, res) => {
        return res.render("main");
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
        redirect_uri : `http://localhost:${PORT}/users/callback`,
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
        redirect_uri : `http://localhost:${PORT}/users/callback`,
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

        const user_name = userRequest['names'][0]['displayName'];
        const user_gmail = userRequest['emailAddresses'][0]['value'];
        const user_image_url = userRequest['photos'][0]['url'];
 
        await new User({name: user_name, gmail: user_gmail, image_url: user_image_url}).save()
        .then(() => {
            console.log('Saved successfully');
        })
        .catch((err) => {
            console.log("already exist")
        });

        const user_info = await finduser(user_gmail);

        let login_id =  user_info._id;
        let login_name =  user_info.name;
        let login_gmail =  user_info.gmail;
        let login_image =  user_info.image_url;
        let login_totPlan_list =  user_info.totPlan_list;
        let login_call_list =  user_info.call_list;
        
        console.log('---------------------------')
        console.log('UserInfo from MongoDB')
        console.log(login_id);
        console.log(login_name);
        console.log(login_gmail);
        console.log(login_image);
        console.log(login_totPlan_list);
        console.log(login_call_list);
        console.log('---------------------------')

        req.session.loggedIn = true;
        // session User 저장(DB에서 user찾아서)
        req.session.user = {
            _id : login_id, 
            name : login_name,
            image_url : login_image,
            gmail : login_gmail,
            totPlan_list : login_totPlan_list, // user가 가지고 있는 plan 뽑아서 id, title을 저장
            call_list : login_call_list // 초대장 리스트
        };
        console.log(req.session.user)
        
        //profile 페이지로 redirect(seeProfile 함수)
        res.redirect(`/users/${req.session.user._id}`);
    }

    else {
        console.log("error");
    
        res.redirect("/");
    }
}

//goes to user router
export const getEditProfile = (req, res) => {
   
    res.render("edit-profile", {user : req.session.user, totPlanTitles : req.session.user.totPlan_list } );
};


export const postEditProfile = (req, res) => {
    //**DB** : => user 변경사항 다시 저장
    //session에서 user 다시 저장
    const {id} = req.params;
    const {name} = req.body;

    req.session.user.name = name;
    res.redirect(`/users/${id}`);
};

export const seeProfile = async (req, res) => {
    // session user 가 받은 초대를 
    let user_data = await finduser(req.session.user.gmail);
    req.session.user.call_list = user_data.call_list;
    req.sesion.user.totPlan_list = user_data.totPlan_list;
    return res.render("see-profile", {user : req.session.user, totPlanTitles : req.session.user.totPlan_list});
};


//로그아웃 -> main 페이지로 간다
export const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};







