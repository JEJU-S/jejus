import fetch from "node-fetch";
import dotdev from "dotenv";
dotdev.config();

// 추후 진짜 db로 바꿔야 함
import { fakeUser } from "./fakeDB";
import { fakeTotPlan } from "./fakeDB";



// Main Page 
export const main = async (req, res) => {
    try{
        //loggedIn => true or undefined
        // 로그인했으면 profile페이지로 다시 넘어가도록 한다(session loggedIn 변수로 확인)
        if(Boolean(req.session.loggedIn) == true)
        {   
            return res.redirect("/users/profile");
        }
        return res.render("main.ejs");
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




        //db에서 사용자를 찾을 수 없다면 => 추가 


        // db에서 사용자 찾을 수 있다면 => select



        //session 초기화(만든다)
        req.session.loggedIn = true;
        

        //profile 페이지로 redirect(seeProfile 함수)
        res.redirect("/users/profile");
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

    //**DB** : => user
    res.send("get User profile")
};

// 아직 시작 xx
export const postEditProfile = (req, res) => {

    //**DB** : => user
    res.send("post User profile")
};



export const seeProfile = (req, res) => {
    //const {} =req.params;

    // login 한 유저가 아니라면 돌려보내야함
    
    

    //**DB** : => 특정 user, user가 가지고 있는 plan목록, user가 받은 초대
    return res.render("see-profile", {user : fakeUser});
};


export const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};







