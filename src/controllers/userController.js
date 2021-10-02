import fetch from "node-fetch";
import dotdev from "dotenv";
dotdev.config();

// 추후 진짜 db로 바꿔야 함
import { fakeUser } from "./fakeDB";
import { fakeTotPlan } from "./fakeDB";



// Main Page 
export const main = async (req, res) => {
    try{
    return res.render("main.ejs");
    }
    catch(error){
        return res.render("<h1>SERVER ERROR🛑</h1>");
    }
};

//Main -> Profile 로 가는 process function 
//login -> callback -> profile
export const login = (req, res)  => 
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
        // 사용자 정보 console에 출력
        console.log(userRequest);

        //res.send("end of login!");

        //if the user is new => create user


        //if the user is exist => select user


        res.redirect("/users/profile");

    }
    else {
        console.log("error 알림 해줘야 함");
        res.redirect("/");
    }
}

//goes to user router
export const getEditProfile = (req, res) => {
    res.send("get User profile")
};

export const postEditProfile = (req, res) => {
    res.send("post User profile")
};

export const seeProfile = (req, res) => {
    //const {} =req.params;

    //user 정보 넘겨줘야 함
    return res.render("see-profile", {user : fakeUser});
    
};
export const logout = (req, res) => res.send("Log out");
export const invitations = (req, res) => res.send("Invitations");





