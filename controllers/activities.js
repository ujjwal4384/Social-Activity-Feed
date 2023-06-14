const Activity = require("../models/Activities");
const User = require("../models/Users");
const { ACTIVITY_TYPE, ACTIVITY_WALL_MESSAGE, MAX_ACTIVITY_WALL_LENGTH, PRONOUNS } = require("../constants");

class ActivityController {
  getActivityWall = async (req, res) => {
    const userId = req.body.userId;
    try {
      //get User
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json("User not found");
      }
       let activityWall = [];

      //get his own activity
      const ownActivity = await Activity.find({ userId: userId });
      activityWall = activityWall.concat(ownActivity);
      
      //get friends activity whom user follows
      for (const friendId of user.followings) {
        try{
          const activity = await Activity.find({ userId: friendId });
          activityWall = activityWall.concat(activity);

        }catch(error){
          console.log("Error in get activity wall function ====", error.message);
          continue;
        }
      }

      //get friends activity who follow user but the user doesn't follow him back
      for (const friendId of user.followers) {
        if(user.followings.includes(friendId)) continue;      
        try{
          const activity = await Activity.find({ userId: friendId });
          activityWall = activityWall.concat(activity);

        }catch(error){
          continue;
        }
      }

      //sort by descending order of time of activity
      activityWall.sort((a, b) => b.createdAt - a.createdAt);
          
      let activityMessage = [];
      try{
        await this.convertActivityToMessage(activityWall, user,activityMessage);

      }catch(error){
        return res.status(400).json(error.message);
      }

      return res.status(200).json(activityMessage);
   
    } catch (error) {
      console.log("Error in get activity wall function ====", error);

      res.status(400).json(error.message);
    }
  };

  convertActivityToMessage = async (activityWall, user,activityMessage) => {
    
       for(const activity of activityWall){
           if(activityMessage.length>=MAX_ACTIVITY_WALL_LENGTH) break; 
               
           if(!activity)continue;

           const userId= activity?.userId;
             
           const targetUserId= activity?.targetUserId;
           
              let userInfo= await User.findOne({_id: userId}).select("username");
              let username=userInfo?.username;
              let targetUserInfo= await User.findOne({_id: targetUserId}).select("username");
              let target_username=targetUserInfo?.username;
              let message="";
            
           if(activity.type===ACTIVITY_TYPE.LIKE){

              if(!username || username===user.username) username= PRONOUNS.YOU;
              if(!target_username || target_username===user.username) target_username=PRONOUNS.YOUR;
              message = ACTIVITY_WALL_MESSAGE.LIKE(username, target_username);
            }

            else if(activity.type===ACTIVITY_TYPE.FOLLOW){

              if(!username || username===user.username) username= PRONOUNS.YOU;
              else if(!target_username || target_username===user.username) target_username= PRONOUNS.YOU;
              message = ACTIVITY_WALL_MESSAGE.FOLLOW(username, target_username);
            }

            else if(activity.type===ACTIVITY_TYPE.POST){
        
              if(!username || username===user.username){ username= PRONOUNS.YOU ;}
              message = ACTIVITY_WALL_MESSAGE.POST(username);
            }

            activityMessage.push(message);
         }

  }

};

module.exports = new ActivityController();
