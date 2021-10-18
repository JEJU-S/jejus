import fetch from "node-fetch";
import dotdev from "dotenv";
dotdev.config();

// 추후 진짜 db로 바꿔야 함
import { fakeUser } from "./fakeDB";
import { fakeTotPlan1, fakeTotPlan2} from "./fakeDB";

const PORT = process.env.PORT || 8080;

// Main Page 
export const main = async (req, res) => {
    try{
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
        redirect_uri : `http://localhost:${PORT}/users/callback`
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
        
        console.log(userRequest);
        console.log("-----------user info-------------");
        console.log(userRequest['names'][0]['displayName']);
        console.log(userRequest['photos'][0]['url']);
        console.log(userRequest['emailAddresses'][0]['value']);
        console.log("---------------------------------");

        //**DB**
        //db에서 사용자를 찾을 수 없다면 => 추가 
        // db에서 사용자 찾을 수 있다면
        // => select

        //session 초기화(만든다)
        
        req.session.loggedIn = true;
        
        //session User 저장(DB에서 user찾아서)
        req.session.user = {
            _id : "507f1f77bcf86cd799439011", 
            name : userRequest['names'][0]['displayName'],
            image_url : userRequest['photos'][0]['url'],
            gmail : userRequest['emailAddresses'][0]['value'],
            totPlan_id : ["507f191e810c19729de860ea", "13jbrkw3494msd3j3456e245"]
        };

        // user가 가지고 있는 plan 뽑아서 id, title을 저장
        // fake db에서는 2개 만든걸로 있는 걸로 넣음
        req.session.totPlanTitleList = [
            { title : fakeTotPlan1.title, _id : fakeTotPlan1._id},
            { title : fakeTotPlan2.title, _id : fakeTotPlan2._id},
        ]

        console.log(req.session.totPlanTitleList);
        
        //profile 페이지로 redirect(seeProfile 함수)
        res.redirect(`/users/${req.session.user._id}`);
    }

    else {
        console.log("error 알림 해줘야 함");
    
        res.redirect("/");
    }
}

//goes to user router
export const getEditProfile = (req, res) => {
   
    res.render("edit-profile", {user : req.session.user, totPlanTitles : req.session.totPlanTitleList});
};


export const postEditProfile = (req, res) => {
    console.log("post func");

    
    //**DB** : => user 변경사항 다시 저장
    //session에서 user 다시 저장

    const {id} = req.params;
    const {name} = req.body;

    req.session.user.name = name;
    res.redirect(`/users/${id}`);
};

export const seeProfile = (req, res) => {

    return res.render("see-profile", {user : req.session.user, totPlanTitles : req.session.totPlanTitleList});
};


//로그아웃 -> main 페이지로 간다
export const logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};







