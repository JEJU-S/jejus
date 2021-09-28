//goes to global router

import Plan from "../models/Plan";
import fetch from "node-fetch";
import User from "../models/User";

export const main = async (req, res) => {
    try{
    const plans = await Plan.find({});
    return res.render("main.html");
    }
    catch(error){
        return res.render("<h1>SERVER ERROR🛑</h1>");
    }
};
export const login = (req, res)  => 
{
     //구글 로그인 전달 url 파라미터들
    const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
    const config = {
        response_type : "code",
        client_id : "946523600907-mp8mjhgr93qg1ibls9e3g9l3h7ukr1es.apps.googleusercontent.com",
        scope : "email profile",
        redirect_uri : "http://localhost:4000/users/callback",
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = baseURL + "?" + params;
    return res.redirect(finalURL);
}

export const callback = async(req, res) => {

    console.log("call back function!");
    const baseURL = "https://oauth2.googleapis.com/token";

    const config = {
        client_id : "946523600907-mp8mjhgr93qg1ibls9e3g9l3h7ukr1es.apps.googleusercontent.com",
        client_secret : "fMUzAbKidgJ6-wPp6OxEmp1c",
        code : req.query.code,
        grant_type : "authorization_code",
        redirect_uri : "http://localhost:4000/users/callback"
    }
    
    const params  = new URLSearchParams(config).toString();
    const finalURL = baseURL + "?" + params;

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
        //access api
        const {access_token} = tokenRequest;
        const url = "https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,photos&access_token=" + access_token;
        
        const userRequest = await (
            await fetch( url, {
            method : "GET"
        })
        ).json(); 
        console.log(userRequest);

        //db에 저장 or 부르기

        




        

        res.redirect("/:id", {});
    }
    else {
        console.log("error 알림 해줘야 함");
        res.redirect("/");
    }
    
}







//goes to user router
export const profile = (req, res) => {
    res.send("User profile")
};



export const edit = (req, res) => res.send("Edit User Profile");
export const logout = (req, res) => res.send("Log out");
export const invitations = (req, res) => res.send("Invitations");





