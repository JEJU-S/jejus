import Plan from "../models/Plan";
import fetch from "node-fetch";
import dotdev from "dotenv";
dotdev.config();

//import User from "../models/User";

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
const fakeUser = {
    id : 1,
    image_url : "https://cdn.pixabay.com/photo/2021/07/20/03/39/fisherman-6479663__340.jpg",
    gmail : "fake123@gmail.com",
    name : "kimfake",
    plan_id : []
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
    //url = "https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,photos&access_token=" + access_token;
         
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;

        const baseURL = "https://people.googleapis.com/v1/people/me";
        const config = {
            personFields : "emailAddresses,names,photos",
            access_token : access_token
        }
        const params = new URLSearchParams(config).toString();
        const finalURL = `${baseURL}?${params}`;

        const userRequest = await (
            await fetch( finalURL, {
            method : "GET"
        })
        ).json(); 
        console.log(userRequest);
        //res.send("end of login!");

        //if the user is new => create user


        //if the user is exist => select user

        res.redirect(`/users/${fakeUser.id}`);

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
    //req.params;

    return res.render("see-profile.ejs", {user : fakeUser});
    
};
export const logout = (req, res) => res.send("Log out");
export const invitations = (req, res) => res.send("Invitations");





