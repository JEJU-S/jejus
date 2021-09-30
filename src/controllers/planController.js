//goes to plan router
export const see = (req, res) => 
{
    const {id} = req.params;
    res.render("/users/see-plan");
}


export const edit = (req, res) => res.send("Edit plans");


export const del = (req, res) => res.send("delete plans");
export const chatting = (req,res) => res.send("chatting pop up");
